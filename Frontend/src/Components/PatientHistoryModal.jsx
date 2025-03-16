import React, { useState } from "react";

const PatientHistoryModal = ({ onClose, fetchHistories, clients }) => {
  const [clientId, setClientId] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First upload the file to get URL
      const fileUrl = await uploadFile(file);
      
      // Then create the history record
      const response = await fetch("http://localhost:4000/api/history/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          fileUrl,
          fileType,
          notes
        })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      await fetchHistories(); // Refresh the history list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating patient history:", error);
      setError("Failed to save patient history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      throw new Error("File upload failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Patient History</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Client</label>
            <select
              className="w-full p-2 border rounded"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">File</label>
            <input
              type="file"
              className="w-full p-2 border rounded"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFileType(e.target.files[0]?.type || "");
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              className="w-full p-2 border rounded"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientHistoryModal;