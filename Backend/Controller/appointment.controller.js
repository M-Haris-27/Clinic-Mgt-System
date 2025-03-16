import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";
import Appointment  from "../Models/appointment.model.js";

export const addAppointment = asyncHandler(async (req, res) => {
    const { title, clientId, location, start, end, notes, status } = req.body;

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new ErrorHandler(400, "Invalid date format");
    }

    if (endDate <= startDate) {
        throw new ErrorHandler(400, "End date must be after start date");
    }

    const appointment = new Appointment({
        title,
        clientId,
        location,
        start: startDate,
        end: endDate,
        notes,
        status
    });

    await appointment.save();

    return res.status(201).json(
        new ApiResponseHandler(201, { appointment }, "Appointment added successfully")
    );
});


export const updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, clientId, location, start, end, notes, status } = req.body;

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new ErrorHandler(400, "Invalid date format");
    }

    if (endDate <= startDate) {
        throw new ErrorHandler(400, "End date must be after start date");
    }

    const appointment = await Appointment.findByIdAndUpdate(
        id,
        {
            title,
            clientId,
            location,
            start: startDate,
            end: endDate,
            notes,
            status
        },
        { new: true }
    );

    if (!appointment) {
        throw new ErrorHandler(404, "Appointment not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, { appointment }, "Appointment updated successfully")
    );
});


export const deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
        throw new ErrorHandler(404, "Appointment not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, null, "Appointment deleted successfully")
    );
});





export const getAppointmentsByDateRange = asyncHandler(async (req, res) => {
    const { days } = req.query;

    if(!days) days = 10;

    
    if (isNaN(days) || parseInt(days) <= 0) {
        throw new ErrorHandler(400, "Invalid or missing 'days' parameter. Must be a positive integer.");
    }

   
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - parseInt(days)); 

    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + parseInt(days)); 


    const appointments = await Appointment.find({
        start: { $gte: startDate, $lte: endDate },
    });

    return res.status(200).json(
        new ApiResponseHandler(200, { appointments }, "Appointments fetched successfully")
    );
});


export const getAppointmentsByClientId = asyncHandler(async (req, res) => {
    const { clientId } = req.params;

    
    if (!clientId) {
        throw new ErrorHandler(400, "Client ID is required");
    }

    
    const appointments = await Appointment.find({ clientId });

    if (!appointments || appointments.length === 0) {
        throw new ErrorHandler(404, "No appointments found for this client");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, { appointments }, "Appointments fetched successfully")
    );
});