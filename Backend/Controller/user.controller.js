import { User } from "../Models/user.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";

// Get Logged-in User Profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password -accessToken -refreshToken");
    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, { user }, "User profile retrieved successfully")
    );
});


// Update Logged-in User Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, password} = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ErrorHandler(409, "Email is already in use.");
        }
        user.email = email;
    }

    if (name) user.name = name;
    if (password) user.password = password;

    await user.save();

    return res.status(200).json(
        new ApiResponseHandler(200, { user }, "User profile updated successfully")
    );
});



// Get User Profile by ID
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, { user }, "User profile retrieved successfully")
    );
});



