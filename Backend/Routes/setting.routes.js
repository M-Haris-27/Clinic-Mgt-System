// routes/settingRoutes.js
import express from 'express';
import { createSettings, updateSettings, getSettings } from '../Controller/setting.controller.js';

const router = express.Router();

router.post('/', createSettings);

// Update settings (Operating Hours, Appointment Types, Reminders)
router.put('/', updateSettings);

// Get all settings (Operating Hours, Appointment Types, Reminders)
router.get('/', getSettings);

export default router;
