import React, { useState } from "react";

const AddAppointmentModal = ({
  onClose,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  clients,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState(selectedDate || "");
  const [startTime, setStartTime] = useState(selectedStartTime || "");
  const [endTime, setEndTime] = useState(selectedEndTime || "");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Pending");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${startTime}:00`);
  
    // Validate required fields
    if (!title) newErrors.title = "Title is required.";
    if (!clientId) newErrors.clientId = "Client is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!startTime) newErrors.startTime = "Start time is required.";
    if (!endTime) newErrors.endTime = "End time is required.";
    if (!location) newErrors.location = "Location is required.";
  
    // Validate start time is not in the past
    if (selectedDateTime < now) newErrors.date = "You cannot select a past date or time.";
  
    // Validate start time is not before 10:00 AM
    const startTimeHour = parseInt(startTime.split(":")[0], 10);
    if (startTimeHour < 10) {
      newErrors.startTime = "Start time cannot be before 10:00 AM.";
    }
  
    // Validate end time is not after 8:00 PM
    const endTimeHour = parseInt(endTime.split(":")[0], 10);
    if (endTimeHour >= 20) {
      newErrors.endTime = "End time cannot be after 8:00 PM.";
    }
  
    // Validate end time is after start time
    if (endTime <= startTime) {
      newErrors.endTime = "End time must be after start time.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newAppointment = {
      title,
      clientId,
      start: `${date}T${startTime}:00`,
      end: `${date}T${endTime}:00`,
      location,
      status,
    };

    onSave(newAppointment);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-lg">
        <h2 className="text-xl font-bold mb-4">Add Appointment</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Client</label>
            <select
              className="w-full p-2 border rounded"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-red-500 text-sm">{errors.clientId}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              step="1800" // 30-minute intervals
              disabled={!!selectedStartTime}
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm">{errors.startTime}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">End Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              step="1800" // 30-minute intervals
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm">{errors.endTime}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Location</label>
            <select
              className="w-full p-2 border rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select a location</option>
              <option value="Netanya">Netanya</option>
              <option value="Bnei Brak-Ramat Gan">Bnei Brak-Ramat Gan</option>
              <option value="Haifa">Haifa</option>
            </select>
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full p-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
