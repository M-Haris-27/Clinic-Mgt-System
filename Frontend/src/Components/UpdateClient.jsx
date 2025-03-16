import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateClient = ({ clientId, fetchClients, onClose, allClients }) => {
    const [updatedData, setUpdatedData] = useState({
        name: "",
        phoneNumber: "",
        age: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const currentClient = allClients.find(client => client._id === clientId);
        if (currentClient) {
            const { name, phoneNumber, age, email } = currentClient;
            setUpdatedData({ name, phoneNumber, age, email });
        }
    }, [clientId, allClients]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.put(`http://localhost:4000/api/clients/${clientId}`, updatedData);
            await fetchClients(); // Refresh the client list
            onClose(); // Close the modal after successful update
        } catch (err) {
            console.error(err);
            setError("Failed to update client. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Update Client</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border rounded"
                            placeholder="John Doe"
                            value={updatedData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-2 border rounded"
                            placeholder="john@example.com"
                            value={updatedData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            className="w-full p-2 border rounded"
                            placeholder="123-456-7890"
                            value={updatedData.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Age</label>
                        <input
                            type="number"
                            name="age"
                            className="w-full p-2 border rounded"
                            placeholder="30"
                            value={updatedData.age}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white p-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Client"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateClient;