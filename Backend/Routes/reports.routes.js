import express from 'express';
import {
    getAppointmentReport,
    getPaymentReport,
    getClientReport
} from '../Controller/reports.controller.js';

const router = express.Router();

// Get appointment report
router.get('/appointments', getAppointmentReport);

// Get payment report
router.get('/payments', getPaymentReport);

// Get client report
router.get('/clients', getClientReport);

export default router;