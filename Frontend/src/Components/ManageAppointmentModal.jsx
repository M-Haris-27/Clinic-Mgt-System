import { useState } from "react";

const ManageAppointmentModal = ({
  onClose,
  appointment,
  clients,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState(appointment.title);
  const [clientId, setClientId] = useState(appointment.clientId);
  const [date, setDate] = useState(appointment.date);
  const [startTime, setStartTime] = useState(appointment.start);
  const [endTime, setEndTime] = useState(appointment.end);
  const [location, setLocation] = useState(appointment.location);
  const [status, setStatus] = useState(appointment.status);
  const [errors, setErrors] = useState({});

  

  const validate = () => {
    const newErrors = {};
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${startTime}:00`);

    if (!title) newErrors.title = "Title is required.";
    if (!clientId) newErrors.clientId = "Client is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!startTime) newErrors.startTime = "Start time is required.";
    if (!endTime) newErrors.endTime = "End time is required.";
    if (!location) newErrors.location = "Location is required.";
    if (selectedDateTime < now) newErrors.date = "You cannot select a past date or time.";
    if (endTime <= startTime) newErrors.endTime = "End time must be after start time.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedAppointment = {
      ...appointment,
      title,
      date,
      start: `${date}T${startTime}:00`,
      end: `${date}T${endTime}:00`,
      clientId,
      location,
      status,
    };

    onUpdate(updatedAppointment);
  };

  const handleDelete = () => {
    onDelete(appointment.id);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-lg">
        <h2 className="text-xl font-bold mb-4">Manage Appointment</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full p-1.5 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Client</label>
            <select
              className="w-full p-1.5 border rounded"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
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
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full p-1.5 border rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              className="w-full p-1.5 border rounded"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              step="1800"
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm">{errors.startTime}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              className="w-full p-1.5 border rounded"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              step="1800"
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
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full p-1.5 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-1.5 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white p-1.5 rounded mr-2"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white p-1.5 rounded"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAppointmentModal;
