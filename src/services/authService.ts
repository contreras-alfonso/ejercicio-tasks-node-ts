import { prisma } from "../config/prisma";
import { HttpError } from "../errors/httpError";
import { hash } from "../helpers/bcrypt";
import { User } from "../types/user";
import { compare } from "bcrypt";
import generateJwt from "../helpers/jwt";
import { AuthResponse } from "../types/responses/auth-response";

export class AuthService {
  async login(user: User): Promise<AuthResponse> {
    if (!user.email || !user.password) {
      throw new HttpError("Todos los campos son obligatorios.", 400);
    }

    const userByEmail = await this.findByEmail(user.email);
    if (!userByEmail) {
      throw new HttpError("Usuario o contraseña incorrecta.", 400);
    }
    const validatePassword = compare(user.password, userByEmail.password);

    if (!validatePassword) {
      throw new HttpError("Usuario o contraseña incorrecta.", 400);
    }
    const { password, ...userWithoutPassword } = userByEmail;

    const token = generateJwt(userByEmail.id, userByEmail.email);

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async register(user: User): Promise<AuthResponse> {
    if (!user.email || !user.name || !user.password) {
      throw new HttpError("Todos los campos son obligatorios.", 400);
    }

    const existsByEmail = await this.findByEmail(user.email);
    if (existsByEmail) {
      throw new HttpError(
        "El correo ingresado ya está siendo usado. Intenta con otro",
        409
      );
    }

    const hashedPassword = await hash(user.password);

    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    const token = generateJwt(newUser.id, newUser.email);

    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { email: email },
    });
  }
}
