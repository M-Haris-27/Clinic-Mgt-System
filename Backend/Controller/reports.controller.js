import Appointment from '../Models/appointment.model.js';
import Invoice from '../Models/invoice.model.js';
import Client from '../Models/client.model.js';

export const getAppointmentReport = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found." });
        }

        const totalAppointments = appointments.length;
        res.status(200).json({ totalAppointments, appointments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaymentReport = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        if (invoices.length === 0) {
            return res.status(404).json({ message: "No invoices found." });
        }

        const totalPayments = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
        res.status(200).json({ totalPayments, invoices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClientReport = async (req, res) => {
    try {
        const clients = await Client.find();
        if (clients.length === 0) {
            return res.status(404).json({ message: "No clients found." });
        }

        const totalClients = clients.length;
        res.status(200).json({ totalClients, clients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};