import express, { Request, Response } from 'express';
import {endBreak, getUserBreaks, startBreak } from '../controllers/break.js';
import { verifyToken } from '../middleware/auth.js';
import { getAllTasks, getTaskById } from '../controllers/task.js';

const router = express.Router();

// Route to create a break
router.post('/start', verifyToken,  startBreak);

// Route to end break
router.post('/end/:breakId', verifyToken, endBreak);

// Route to get a single  Break
router.get('/getBreak', verifyToken, getUserBreaks);



export default router;
