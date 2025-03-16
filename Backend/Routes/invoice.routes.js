import express from 'express';
import {
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    getAllInvoices,
    getInvoicesByClient,
    getInvoiceById
} from '../Controller/invoice.controller.js';

const router = express.Router();

// Create a new invoice
router.post('/', createInvoice);

// Update invoice status
router.put('/:id', updateInvoiceStatus);

// Delete an invoice
router.delete('/:id', deleteInvoice);

router.get('/:id', getInvoiceById);


// Get all invoices
router.get('/', getAllInvoices);

// Get invoices by client ID
router.get('/client/:clientId', getInvoicesByClient);


export default router;