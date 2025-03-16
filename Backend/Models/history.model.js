import mongoose, { Schema } from "mongoose";

const patientHistorySchema = new mongoose.Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "Client",  
        required: true
    },

    fileId: {
        type: String,  
        required: true,
        trim: true
    },

    fileType: {
        type: String,
        required: true,
        trim: true
    },

    notes: {
        type: String,
        trim: true
    }
}, {timestamps: true});

const PatientHistory = mongoose.model("PatientHistory", patientHistorySchema);
export default PatientHistory;