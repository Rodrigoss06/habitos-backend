import express from 'express';
import {
  createUser,
  createHabit,
  linkUserToHabit,
  getUserHabits,
  getHabitSuggestions
} from '../controllers/habits.controller.js';

const router = express.Router();

router.post('/user', createUser);
router.post('/habit', createHabit);
router.post('/follow', linkUserToHabit);
router.get('/user/:userId/habits', getUserHabits);
router.get('/suggestions/:userId', getHabitSuggestions);

export default router;
