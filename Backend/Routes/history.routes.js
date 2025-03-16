import express from 'express';
import {
  createPatientHistory,
  getPatientHistoryByClient,
  deletePatientHistory,
  getAllPatientHistory
} from '../Controller/history.controller.js'; // Import controller functions
//import upload from '../Middlewares/upload.js'; // Middleware for file uploads (e.g., multer)

const router = express.Router();

// Create patient history record
router.post('/', createPatientHistory);

// Get all patient history records for a client
router.get('/:clientId', getPatientHistoryByClient);
router.get('/',getAllPatientHistory)

// Delete patient history record
router.delete('/:id', deletePatientHistory);

export default router;