import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";
import Client from "../Models/client.model.js";

// Add a new user
export const addUser = asyncHandler(async (req, res) => {
    const { name, email, age, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !email || !age || !phoneNumber) {
        throw new ErrorHandler(400, "All fields are required");
    }

    // Check if email already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
        throw new ErrorHandler(400, "Email already exists");
    }

    // Create a new client
    const client = new Client({
        name,
        email,
        age,
        phoneNumber,
    });

    await client.save();

    return res.status(201).json(
        new ApiResponseHandler(201, { client }, "Client added successfully")
    );
});



// Delete a user
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!id) {
        throw new ErrorHandler(400, "Client ID is required");
    }

    // Find and delete the client
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
        throw new ErrorHandler(404, "Client not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, null, "Client deleted successfully")
    );
});



// Update a user
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, age, phoneNumber } = req.body;

    // Validate ID
    if (!id) {
        throw new ErrorHandler(400, "Client ID is required");
    }

    // Validate required fields
    if (!name || !email || !age || !phoneNumber) {
        throw new ErrorHandler(400, "All fields are required");
    }

    // Check if email already exists for another client
    const existingClient = await Client.findOne({ email, _id: { $ne: id } });
    if (existingClient) {
        throw new ErrorHandler(400, "Email already exists");
    }

    // Update the client
    const client = await Client.findByIdAndUpdate(
        id,
        { name, email, age, phoneNumber },
        { new: true }
    );

    if (!client) {
        throw new ErrorHandler(404, "Client not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, { client }, "Client updated successfully")
    );
});



// Search for users
export const searchUsers = asyncHandler(async (req, res) => {
    const { name, email } = req.query;

    // Build the search query
    const searchQuery = {};
    if (name) searchQuery.name = { $regex: name, $options: "i" };
    if (email) searchQuery.email = { $regex: email, $options: "i" };

    // Find clients matching the search query
    const clients = await Client.find(searchQuery);

    return res.status(200).json(
        new ApiResponseHandler(200, { clients }, "Clients fetched successfully")
    );
});



// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const clients = await Client.find();

    return res.status(200).json(
        new ApiResponseHandler(200, { clients }, "Clients fetched successfully")
    );
});


// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!id) {
        throw new ErrorHandler(400, "Client ID is required");
    }

    // Find the client
    const client = await Client.findById(id);
    if (!client) {
        throw new ErrorHandler(404, "Client not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, { client }, "Client fetched successfully")
    );
});