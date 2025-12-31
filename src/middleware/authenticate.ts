import { NextFunction, Request, Response } from "express";
import type { RequestHandler } from "express";

import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { JwtPayload } from "../types/jwt-payload";

const authenticate: RequestHandler  = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token requerido" });
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      if (!decoded.id) {
        return res.status(403).json({ msg: "Token inválido" });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return res.status(403).json({ msg: "Usuario no encontrado" });
      }

      const { password, ...userSinCredenciales } = user;

      req.user = userSinCredenciales;

      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ msg: "Token inválido" });
    }
  } else {
    return res.status(401).json({ msg: "Token requerido" });
  }
};

export default authenticate;
