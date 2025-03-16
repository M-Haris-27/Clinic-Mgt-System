import { cookieOption } from "../Constants/auth.constants.js";
import { User } from "../Models/user.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";
import { generateAccessAndRefreshToken } from "../Utils/GenerateTokens.js";
import { sendResetPasswordEmail } from "../Utils/EmailService.js";
import { generateResetCode } from "../Utils/GenerateResetCode.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, secretCode } = req.body;

    if (!name || !email || !password) {
        throw new ErrorHandler(
            400,
            "Please provide all the information to register"
        );
    }

    if(secretCode !== "zoro-clinic") {
        throw new ErrorHandler(
            400,
            "Invalid Secret Code - Contact IT Team for the correct code (fahadzafarmayo123@gmail.com)"
        );
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ErrorHandler(409, "Email is already in use.");
    }

    const newUser = await User.create({
        name,
        email,
        password,
    });

    if (!newUser) {
        throw new ErrorHandler(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res
        .status(201)
        .json(new ApiResponseHandler(200, null, "User registered successfully."));
});




//Login User
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ErrorHandler(
            400,
            "Email and password are required. Please provide both."
        );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ErrorHandler(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ErrorHandler(400, "Incorrect email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -accessToken -refreshToken"
    );

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json(
            new ApiResponseHandler(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged In Successfully"
            )
        );
});


//Logout User
export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    res
        .status(200)
        .clearCookie("accessToken", cookieOption)
        .clearCookie("refreshToken", cookieOption)
        .json(new ApiResponseHandler(200, {}, "User logged out successfully."));
});




// TODO: 

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;
    const userType = req.body.userType;
    if (!incomingRefreshToken) {
        throw new ErrorHandler(401, "Unauthorized Request");
    }
    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        let user;

        if (userType === "user" || userType === "admin") {
            user = await User.findById(decodedToken._id);
        } else {
            throw new ErrorHandler(401, "Unauthorized Request");
        }

        if (!user) {
            throw new Error(401, "Invalid Token Provided - Please login again");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ErrorHandler(401, "Refresh Token is Expired or used"); //Well , it is used at this point.
        }

        const accessToken = await user.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOption)
            .json(
                new ApiResponseHandler(
                    200,
                    {
                        accessToken,
                        refreshToken: user.refreshToken,
                    },
                    "Access Token Refreshed"
                )
            );
    } catch (err) {
        throw new ErrorHandler(401, err?.message || "Cannot refresh access Token")
    }
});



export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ErrorHandler(400, "Email is required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ErrorHandler(404, "User with this email does not exist.");
    }

    // Generate reset code & set expiration time (10 minutes)
    const resetCode = generateResetCode();
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = expiresIn;
    await user.save();

    // Send reset code via email
    await sendResetPasswordEmail(email, resetCode);

    res.status(200).json({
        success: true,
        message: "Reset code sent to your email.",
    });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
        throw new ErrorHandler(400, "Email, reset code, and new password are required.");
    }

    const user = await User.findOne({
        email,
        resetPasswordCode: resetCode,
        resetPasswordExpires: { $gt: Date.now() }, // Ensure code is still valid
    });

    if (!user) {
        console.log("Invalid or expired reset code for email:", email);
        console.log("Provided reset code:", resetCode);
        console.log("Current time:", new Date());
        console.log("Reset code expiration time:", user?.resetPasswordExpires);
        throw new ErrorHandler(400, "Invalid or expired reset code.");
    }

    // Hash the new password before saving
    

    // Update password and clear reset fields
    user.password = newPassword
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successfully.",
    });
});