import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

const login = async (req: Request, res: Response) => {
  const body = req.body;
  const user = await authService.login(body);
  res.status(200).json(user);
};

const register = async (req: Request, res: Response) => {
  const body = req.body;
  const user = await authService.register(body);
  res.status(201).json(user);
};

export { login, register };
