import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash, Edit } from "lucide-react";

const SettingsForm = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(false); // To handle initial setup

  // Fetch settings from the database on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch settings from the API
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/settings/");
      if (response.data.data.setting) {
        setSettings(response.data.data.setting); // Set the fetched settings
        setIsInitialSetup(false); // Settings exist, no need for initial setup
      } else {
        setIsInitialSetup(true); // No settings exist, show initial setup form
      }
    } catch (err) {
      setError("Failed to fetch settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle saving settings (both initial setup and updates)
  const handleSaveSettings = async (updatedSettings) => {
    setLoading(true);
    try {
      if (isInitialSetup) {
        // If it's the initial setup, create new settings
        await axios.post("http://localhost:4000/api/settings/", updatedSettings);
        setIsInitialSetup(false); // No longer in initial setup mode
      } else {
        // If settings exist, update them
        await axios.put("http://localhost:4000/api/settings", updatedSettings);
      }
      fetchSettings(); // Refresh settings after saving
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-blue-100">Manage your application's settings efficiently</p>
              </div>
              {settings && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center space-x-2 transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  <span>Update Settings</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Settings Form */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : settings ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Operating Hours</h2>
                  {settings.operatingHours.map((hours, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span className="text-gray-600">{hours.day}</span>
                      <span className="text-gray-600">{hours.startTime} - {hours.endTime}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Appointment Types</h2>
                  {settings.appointmentTypes.map((type, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span className="text-gray-600">{type.name}</span>
                      <span className="text-gray-600">{type.duration} min</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Reminders</h2>
                  {settings.reminders.map((reminder, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span className="text-gray-600">{reminder.type}</span>
                      <span className="text-gray-600">{reminder.timeBeforeAppointment} minutes</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No settings available</div>
                <p className="text-gray-400 mt-2">Please configure your settings.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-200"
                >
                  Configure Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SettingsModal
          onClose={() => setIsModalOpen(false)}
          settings={settings}
          onSave={handleSaveSettings}
          isInitialSetup={isInitialSetup}
        />
      )}
    </div>
  );
};

const SettingsModal = ({ onClose, settings, onSave, isInitialSetup }) => {
  const [updatedSettings, setUpdatedSettings] = useState(
    settings || {
      operatingHours: [
        { day: "Monday", startTime: "09:00", endTime: "17:00", isClosed: false },
        { day: "Tuesday", startTime: "09:00", endTime: "17:00", isClosed: false },
        { day: "Wednesday", startTime: "09:00", endTime: "17:00", isClosed: false },
        { day: "Thursday", startTime: "09:00", endTime: "17:00", isClosed: false },
        { day: "Friday", startTime: "09:00", endTime: "17:00", isClosed: false },
        { day: "Saturday", startTime: "10:00", endTime: "14:00", isClosed: false },
        { day: "Sunday", startTime: "Closed", endTime: "Closed", isClosed: true },
      ],
      appointmentTypes: [
        { name: "General Consultation", duration: 30, price: 50 },
        { name: "Follow-up Appointment", duration: 15, price: 30 },
      ],
      reminders: [
        { type: "email", timeBeforeAppointment: 60, message: "Reminder: Your appointment is in 1 hour!" },
        { type: "sms", timeBeforeAppointment: 15, message: "Reminder: Your appointment is in 15 minutes!" },
      ],
    }
  );

  const handleChange = (e, section, index, field) => {
    const newSettings = { ...updatedSettings };
    newSettings[section][index][field] = e.target.value;
    setUpdatedSettings(newSettings);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedSettings);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">
            {isInitialSetup ? "Configure Settings" : "Update Settings"}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <Trash className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Operating Hours */}
          <div className="mb-4">
            <h3 className="text-lg font-medium">Operating Hours</h3>
            {updatedSettings.operatingHours.map((hours, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={hours.startTime}
                  onChange={(e) => handleChange(e, "operatingHours", index, "startTime")}
                  className="w-1/2 p-2 border rounded mr-2"
                  placeholder="Start Time"
                />
                <input
                  type="text"
                  value={hours.endTime}
                  onChange={(e) => handleChange(e, "operatingHours", index, "endTime")}
                  className="w-1/2 p-2 border rounded"
                  placeholder="End Time"
                />
              </div>
            ))}
          </div>

          {/* Appointment Types */}
          <div className="mb-4">
            <h3 className="text-lg font-medium">Appointment Types</h3>
            {updatedSettings.appointmentTypes.map((type, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={type.name}
                  onChange={(e) => handleChange(e, "appointmentTypes", index, "name")}
                  className="w-1/2 p-2 border rounded mr-2"
                  placeholder="Appointment Type"
                />
                <input
                  type="number"
                  value={type.duration}
                  onChange={(e) => handleChange(e, "appointmentTypes", index, "duration")}
                  className="w-1/2 p-2 border rounded"
                  placeholder="Duration (min)"
                />
              </div>
            ))}
          </div>

          {/* Reminders */}
          <div className="mb-4">
            <h3 className="text-lg font-medium">Reminders</h3>
            {updatedSettings.reminders.map((reminder, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={reminder.type}
                  onChange={(e) => handleChange(e, "reminders", index, "type")}
                  className="w-1/2 p-2 border rounded mr-2"
                  placeholder="Reminder Type"
                />
                <input
                  type="number"
                  value={reminder.timeBeforeAppointment}
                  onChange={(e) => handleChange(e, "reminders", index, "timeBeforeAppointment")}
                  className="w-1/2 p-2 border rounded"
                  placeholder="Time Before Appointment (min)"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg">
              {isInitialSetup ? "Save Settings" : "Update Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;