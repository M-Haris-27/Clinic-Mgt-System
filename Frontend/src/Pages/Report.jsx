import React, { useState, useEffect } from "react";
import { BarChart, Users, DollarSign, Calendar, TrendingUp, PieChart } from "lucide-react";
import axios from "axios";

const Report = () => {
  const [metrics, setMetrics] = useState({
    totalAppointments: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const reports = [
    { 
      title: "Total Appointments", 
      value: metrics.totalAppointments,
      icon: Calendar,
      change: "+12%", // You can calculate dynamic change based on previous data
      trend: "up",
      color: "blue" 
    },
    { 
      title: "Total Income", 
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      change: "+8%", // You can calculate dynamic change
      trend: "up",
      color: "green"
    },
    { 
      title: "Total Clients", 
      value: metrics.totalClients,
      icon: Users,
      change: "+15%", // You can calculate dynamic change
      trend: "up",
      color: "purple"
    },
    { 
      title: "Average Session Value", 
      value: "$100", // You can calculate this dynamically
      icon: TrendingUp,
      change: "+5%", // You can calculate dynamic change
      trend: "up",
      color: "indigo"
    },
    { 
      title: "Monthly Revenue", 
      value: `$${metrics.totalRevenue.toFixed(2)}`, // Assuming total revenue for now
      icon: BarChart,
      change: "+20%", // You can calculate dynamic change
      trend: "up",
      color: "pink"
    },
    { 
      title: "Client Retention", 
      value: "85%", // Calculate this dynamically based on data
      icon: PieChart,
      change: "+3%", // You can calculate dynamic change
      trend: "up",
      color: "orange"
    }
  ];

  const getGradientClass = (color) => {
    const gradients = {
      blue: "from-blue-50 to-blue-100",
      green: "from-green-50 to-green-100",
      purple: "from-purple-50 to-purple-100",
      indigo: "from-indigo-50 to-indigo-100",
      pink: "from-pink-50 to-pink-100",
      orange: "from-orange-50 to-orange-100"
    };
    return gradients[color];
  };

  const getTextClass = (color) => {
    const textColors = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      indigo: "text-indigo-600",
      pink: "text-pink-600",
      orange: "text-orange-600"
    };
    return textColors[color];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
                <p className="text-blue-100">Track your business performance metrics</p>
              </div>
              <div className="flex space-x-4">
                <select className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md">
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, index) => {
                const IconComponent = report.icon;
                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${getGradientClass(report.color)} p-6 rounded-xl shadow-sm transition-transform duration-300 hover:scale-105`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${getTextClass(report.color)}`}>{report.title}</h3>
                      <IconComponent className={`h-6 w-6 ${getTextClass(report.color)}`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{report.value}</p>
                    <p className="text-sm text-gray-500">Change: <span className="font-semibold text-gray-700">{report.change}</span></p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
