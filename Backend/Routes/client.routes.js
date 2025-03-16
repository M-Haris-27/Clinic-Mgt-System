import express from 'express';
import { addUser, deleteUser, updateUser, searchUsers, getAllUsers, getUserById } from '../Controller/client.controller.js';

const router = express.Router();

// Add a new user
router.post('/', addUser);

// Delete a user
router.delete('/:id', deleteUser);

// Update a user
router.put('/:id', updateUser);

// Search for users
router.get('/', searchUsers);

// Get all users
router.get('/all', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

export default router;