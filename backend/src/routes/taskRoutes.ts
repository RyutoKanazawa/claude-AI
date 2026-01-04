import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleComplete,
  deleteTask,
} from '../controllers/taskController';
import { validateTask } from '../middleware/validation';

const router = Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', validateTask, createTask);
router.put('/:id', validateTask, updateTask);
router.patch('/:id/complete', toggleComplete);
router.delete('/:id', deleteTask);

export default router;
