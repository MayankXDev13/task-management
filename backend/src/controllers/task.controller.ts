import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;

  const userId = (req as Request & { user?: { id?: string } }).user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      userId,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: { id?: string } }).user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId,
    },
  });

  if (!tasks) {
    throw new ApiError(404, "No tasks found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: {
      id,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, priority } = req.body;

  const updateTaks = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      priority,
      updatedAt: new Date(),
    },
  });

  if (!updateTaks) {
    throw new ApiError(404, "Task is not updated or mpt exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateTaks, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedTask = await prisma.task.delete({
    where: { id },
  });

  if (!deletedTask) {
    throw new ApiError(404, "Task not found or not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});
