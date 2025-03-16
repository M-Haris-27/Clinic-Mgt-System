import express from 'express';
import cors from 'cors';
import userRoutes from './Routes/user.routes.js';
import clientRoutes from './Routes/client.routes.js';
import cookieParser from "cookie-parser";
import errorMiddleware from "./Middlewares/error.middleware.js"
import historyRoutes from './Routes/history.routes.js';
import reportRoutes from './Routes/reports.routes.js';
import invoiceRoutes from './Routes/invoice.routes.js';
import appointmentRoutes from './Routes/appointment.routes.js';
import authRoutes from './Routes/auth.routes.js';
import settingRoutes from './Routes/setting.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Configure middlewares
app.use(
    cors({
        origin: "http://localhost:5173", // Allow requests from your frontend
        credentials: true, // Allow cookies to be sent and received
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


+app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/settings', settingRoutes);

// Error handler middleware
app.use(errorMiddleware);


export default app;
