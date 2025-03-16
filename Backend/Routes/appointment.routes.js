import express from 'express';
import {
    updateAppointment,
    deleteAppointment,
    getAppointmentsByClientId,
    addAppointment,
    getAppointmentsByDateRange
} from '../Controller/appointment.controller.js';

const router = express.Router();

// Create a new appointment
router.post('/', addAppointment);

// Update an appointment
router.put('/:id', updateAppointment);

// Delete an appointment
router.delete('/:id', deleteAppointment);

// Get all appointments
router.get('/', getAppointmentsByDateRange);

// Get appointments by client ID
router.get('/client/:clientId', getAppointmentsByClientId);

export default router;