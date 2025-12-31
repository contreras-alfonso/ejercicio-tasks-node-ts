import { Request, Response } from "express";
import { TaskService } from "../services/taskService";

const taskService = new TaskService();

const findAll = async (req: Request, res: Response) => {
  const tasks = await taskService.findAll(req.user!.id);
  res.status(200).json(tasks);
};

const findById = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = await taskService.findById(req.user!.id, Number(taskId));
  res.status(200).json(task);
};

const save = async (req: Request, res: Response) => {
  const body = req.body;
  const task = await taskService.save(req.user!.id, body);
  res.status(201).json(task);
};

const update = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const body = req.body;
  const task = await taskService.update(req.user!.id, body, Number(taskId));
  res.status(200).json(task);
};

const remove = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = await taskService.delete(req.user!.id, Number(taskId));
  res.status(204).send();
};

export { findAll, findById, save, update, remove };
