import mongoose, { Schema } from "mongoose";

const appointmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },
    start: {
        type: Date,
        required: true
    },

    end: {
        type: Date,
        required: true
    },

    notes: {
        type: String,
        trim: true
    },
    
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;