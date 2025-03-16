import React, { useState } from "react";

const InvoiceModal = ({ onClose, onSubmit, clients }) => {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [location, setLocation] = useState(""); // Default value is an empty string
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClientId || !location || !amount) {
      setError("All fields are required.");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    onSubmit({ clientId: selectedClientId, location, amount });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
        <form onSubmit={handleSubmit}>
          {/* Client Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Client</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a location</option>
              <option value="Netanya">Netanya</option>
              <option value="Bnei Brak-Ramat Gan">Bnei Brak-Ramat Gan</option>
              <option value="Haifa">Haifa</option>
            </select>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;