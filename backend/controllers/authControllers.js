// import { get } from "mongoose";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { resetPasswordTemplate } from "../utils/emailTampletes.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";


// Register a user => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,

    });

    sendToken(user, 201, res);
});


// Login a user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }


    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }


    sendToken(user, 200, res);

});


// Logout a user => /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});


// Upload user avatar => /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");

    //remove previous avatar from cloudinary
    if(req.user?.avatar?.public_id){
        await delete_file(req.user.avatar.public_id);
    }

    // 1. Find the user first
    const user = await User.findById(req.user?.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    try {
        // 2. Update the avatar field
        user.avatar = {
            public_id: avatarResponse.public_id,
            url: avatarResponse.url,
        };

        // 3. Save the changes to the database
        await user.save();

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Failed to upload avatar", 500));
    }

    // 4. Now 'user' is accessible here
    res.status(200).json({
        success: true,
        user,
    });
});



// Forgot password => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // Finding user in database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("No user found with this email", 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = resetPasswordTemplate(user.name, resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopIT Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new ErrorHandler(error.message, 500));
    }

});


// Reset password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

     if (!user) {
        return next(new ErrorHandler("Invalid or expired token", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});


// Get currently logged in user details => /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});


// Update Password  => /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, password } = req.body;
    console.log(oldPassword, password);
    if (!oldPassword || !password) {
        return next(new ErrorHandler("Please enter old and new password", 400));
    }
    const user = await User.findById(req.user.id).select("+password");

        // Check previous user password
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }

        user.password = req.body.password;
        await user.save(); 

    res.status(200).json({
        success: true
    });
});


// Update User Profile  => /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUSerData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUSerData, {
        new: true,
    });

    res.status(200).json({
        user,
    });
});


// Get All users  => /api/v1/admin/users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    if (!users) {
        return next(new ErrorHandler("No users found", 404));
    }
    res.status(200).json({
        success: true,
        users,
    });
});


// Get user details  => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
});


// Update User details -ADMIN  => /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUSerData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUSerData, {
        new: true,
    });

    res.status(200).json({
        user,
    });
});

// Delete user -ADMIN  => /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }

    if(user.avatar?.public_id){
        await delete_file(user.avatar.public_id);
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
    });
});