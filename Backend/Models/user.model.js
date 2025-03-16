import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
    },

    resetPasswordCode: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null
    },

    accessToken: {
      type: String,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);


//Hashing the password before saving..
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


//Checking password with the hash stored in the db.
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//Generate access token..
userSchema.methods.generateAccessToken = function () {
    const access_token = jwt.sign({
        _id: this._id,
        email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });

    return access_token;
}

//Generate Refresh Token..
userSchema.methods.generateRefreshToken = function () {
    const refresh_token = jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });

    return refresh_token;
}


export const User = mongoose.model("User", userSchema);