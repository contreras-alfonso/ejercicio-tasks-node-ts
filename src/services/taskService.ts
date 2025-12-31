import { prisma } from "../config/prisma";
import { HttpError } from "../errors/httpError";
import { Task } from "../types/task";

export class TaskService {
  async findAll(userId: number): Promise<Task[]> {
    return await prisma.task.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async findById(userId: number, taskId: number): Promise<Task | null> {
    if (isNaN(taskId)) {
      throw new HttpError("El taskId tiene un formato incorrecto.", 400);
    }

    if (!taskId) {
      throw new HttpError("El taskId es obligatorio.", 400);
    }

    const task = await prisma.task.findUnique({
      where: {
        user_id: userId,
        id: taskId,
      },
    });
    if (!task) {
      throw new HttpError("La tarea no fue encontrada.", 400);
    }
    return task;
  }

  async save(userId: number, task: Task): Promise<Task> {
    return await prisma.task.create({
      data: {
        title: task.title,
        status: task.status,
        user_id: userId,
      },
    });
  }

  async update(userId: number, task: Task, taskId: number): Promise<Task> {
    const findTask = await this.findById(userId, taskId);

    return await prisma.task.update({
      where: {
        id: findTask?.id,
        user_id: findTask?.user_id,
      },
      data: {
        title: task.title,
        status: task.status,
      },
    });
  }

  async delete(userId: number, taskId: number): Promise<void> {
    const findTask = await this.findById(userId, taskId);
    await prisma.task.delete({
      where: {
        id: findTask?.id,
      },
    });
  }
}
