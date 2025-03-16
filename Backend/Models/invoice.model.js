import mongoose, { Schema } from "mongoose";

const invoiceSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    },
    dateIssued: {
        type: Date,
        default: Date.now
    },
    datePaid: {
        type: Date
    }
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;