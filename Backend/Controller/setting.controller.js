// controllers/settingController.js
import Setting from '../Models/setting.model.js';
import { ErrorHandler } from '../Utils/ApiErrorHandler.js';
import { asyncHandler } from '../Utils/AsyncHandler.js';
import { ApiResponseHandler } from '../Utils/ApiResponseHandler.js';



// Create settings (Operating Hours, Appointment Types, Reminders)
export const createSettings = asyncHandler(async (req, res) => {
    try {
        const existingSettings = await Setting.findOne(); // Check if settings already exist
        if (existingSettings) {
            return res.status(400).json({ message: "Settings already exist. Use update instead." });
        }

        // Validate the request body
        const { operatingHours, appointmentTypes, reminders } = req.body;

        if (!operatingHours || !appointmentTypes || !reminders) {
            return res.status(400).json({ message: "Please provide all required fields: operatingHours, appointmentTypes, and reminders." });
        }

        // Create a new settings object with the data from the request body
        const newSettings = new Setting({
            operatingHours,
            appointmentTypes,
            reminders
        });

        // Save the new settings to the database
        await newSettings.save();

        return res.status(201).json({ message: "Settings created successfully", data: newSettings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create settings. Please try again." });
    }
});


// Create or update settings (Operating Hours, Appointment Types, Reminders)
export const updateSettings = asyncHandler(async (req, res) => {
  const { operatingHours, appointmentTypes, reminders } = req.body;

  let setting = await Setting.findOne();

  if (setting) {
    setting.operatingHours = operatingHours || setting.operatingHours;
    setting.appointmentTypes = appointmentTypes || setting.appointmentTypes;
    setting.reminders = reminders || setting.reminders;
  } else {
    setting = new Setting({ operatingHours, appointmentTypes, reminders });
  }

  await setting.save();
  return res.status(200).json(new ApiResponseHandler(200, { setting }, 'Settings updated successfully'));
});

// Get all settings (Operating Hours, Appointment Types, Reminders)
export const getSettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findOne();

  if (!setting) {
    throw new ErrorHandler(404, "Settings not found");
  }

  return res.status(200).json(new ApiResponseHandler(200, { setting }, 'Settings fetched successfully'));
});
