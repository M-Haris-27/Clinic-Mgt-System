import React, { useState, useEffect } from "react";
import { Calendar, Users, DollarSign, FileText, Clock } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";  // Import dayjs for date manipulation

const Home = () => {
  const [metrics, setMetrics] = useState({
    totalAppointments: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the backend
        const [appointmentsResponse, clientsResponse, financeResponse] = await Promise.all([
          axios.get("http://localhost:4000/api/appointments?days=30"),
          axios.get("http://localhost:4000/api/clients/all"),
          axios.get("http://localhost:4000/api/invoices"),
        ]);

        // Calculate metrics
        const totalAppointments = appointmentsResponse.data.data.appointments.length;
        const totalClients = clientsResponse.data.data.clients.length;
        const totalRevenue = financeResponse.data.reduce((sum, invoice) => sum + invoice.amount, 0);
        const pendingInvoices = financeResponse.data.filter(invoice => invoice.status === "Pending").length;

        // Set metrics
        setMetrics({
          totalAppointments,
          totalClients,
          totalRevenue,
          pendingInvoices,
        });

        // Create a map of clients by their IDs for quick access
        const clientsMap = clientsResponse.data.data.clients.reduce((map, client) => {
          map[client._id] = client;
          return map;
        }, {});

        // Filter appointments to only show today's appointments
        const today = dayjs().startOf("day");
        const recentAppointments = appointmentsResponse.data.data.appointments
          .filter(appointment => dayjs(appointment.createdAt).isSame(today, "day"))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by most recent
          .slice(0, 3); // Get the 3 most recent appointments

        // Include client name and formatted time for the appointment time (not the current time)
        const activitiesWithClientInfo = recentAppointments.map((appointment) => {
          const client = clientsMap[appointment.clientId] || {};
          return {
            ...appointment,
            clientName: client.name || "Unknown Client",
            time: dayjs(appointment.createdAt).format('HH:mm A'), // Display the appointment's created time
          };
        });

        setRecentActivities(activitiesWithClientInfo);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    { icon: <Calendar className="w-6 h-6" />, title: "Schedule Appointment", link: "/appointments" },
    { icon: <Users className="w-6 h-6" />, title: "Add New Client", link: "/clients" },
    { icon: <DollarSign className="w-6 h-6" />, title: "Create Invoice", link: "/finance" },
    { icon: <FileText className="w-6 h-6" />, title: "View Reports", link: "/reports" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Clinic Management System
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Manage your clinic efficiently and effectively.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-600 bg-white p-3 rounded-xl shadow-sm">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{metrics.totalAppointments}</div>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-green-600 bg-white p-3 rounded-xl shadow-sm">
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{metrics.totalClients}</div>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-purple-600 bg-white p-3 rounded-xl shadow-sm">
                  <DollarSign className="w-8 h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">${metrics.totalRevenue.toFixed(2)}</div>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-yellow-600 bg-white p-3 rounded-xl shadow-sm">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{metrics.pendingInvoices}</div>
              </div>
              <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.link}
                className="group bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6 flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    {action.icon}
                  </div>
                  <p className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                    {action.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>



      </div>
    </div>
  );
};

export default Home;
