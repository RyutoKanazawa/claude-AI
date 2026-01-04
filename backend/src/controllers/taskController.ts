import { Request, Response } from 'express';
import { Task, Category } from '../models';
import { Op } from 'sequelize';
import { Priority } from '../types';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { completed, priority, categoryId, tag, sortBy = 'createdAt', order = 'desc' } = req.query;

    const where: any = {};

    if (completed !== undefined) {
      where.isCompleted = completed === 'true';
    }

    if (priority && Object.values(Priority).includes(priority as Priority)) {
      where.priority = priority;
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId as string);
    }

    if (tag) {
      where.tags = { [Op.like]: `%${tag}%` };
    }

    let orderClause: any = [];
    if (sortBy === 'dueDate') {
      orderClause = [['dueDate', order.toString().toUpperCase()]];
    } else if (sortBy === 'priority') {
      const priorityOrder = order === 'asc'
        ? ['low', 'medium', 'high']
        : ['high', 'medium', 'low'];
      orderClause = [[sequelize.literal(`CASE priority
        WHEN '${priorityOrder[0]}' THEN 1
        WHEN '${priorityOrder[1]}' THEN 2
        WHEN '${priorityOrder[2]}' THEN 3
        END`)]];
    } else {
      orderClause = [['createdAt', order.toString().toUpperCase()]];
    }

    const tasks = await Task.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: orderClause,
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, dueDate, categoryId, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      isCompleted: false,
      priority: priority || Priority.MEDIUM,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      categoryId: categoryId || null,
      tags: tags || [],
    });

    const createdTask = await Task.findByPk(task.id, {
      include: [{ model: Category, as: 'category' }],
    });

    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted, priority, dueDate, categoryId, tags } = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (tags !== undefined) updateData.tags = tags;

    await task.update(updateData);

    const updatedTask = await Task.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const toggleComplete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.update({ isCompleted: !task.isCompleted });

    const updatedTask = await Task.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

import { sequelize } from '../models';
