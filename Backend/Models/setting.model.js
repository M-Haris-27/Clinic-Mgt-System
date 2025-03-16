// models/Setting.js
import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema({
  operatingHours: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      isClosed: {
        type: Boolean,
        default: false,
      }
    }
  ],

  appointmentTypes: [
    {
      name: {
        type: String,
        required: true,
      },
      duration: {
        type: Number, // Duration in minutes
        required: true,
      },
      price: {
        type: Number, // Price for the appointment
        required: true,
      }
    }
  ],

  reminders: [
    {
      type: {
        type: String,
        enum: ['email', 'sms'],
        required: true,
      },
      timeBeforeAppointment: {
        type: Number, // Time in minutes before the appointment
        required: true,
      },
      message: {
        type: String,
        required: true,
      }
    }
  ]
});

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
