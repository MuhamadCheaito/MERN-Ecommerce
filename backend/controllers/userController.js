const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');

//Get All users
exports.getAllUsers = catchAsyncErrors( async (req,res,next) => {
    const users = await User.find({});

    if(!users){
        next(new ErrorHandler("There are no users yet.",404))
    }
    res.status(200).json({
        success:true,
        users
    }) 
});

exports.getUser = catchAsyncErrors( async (req,res,next) => {

    const {id} = req.params;

    const user = await User.findById(id);

    if(!user){
        next(new ErrorHandler(`The user with ${id} doesn't exist`,404));
    }

    res.status(200).json({
        success:true,
        user
    });
});
//Get User Details
exports.getUserDetails = catchAsyncErrors( async (req,res,next) => {
    const user = await User.findById({_id: req.user.id});


    res.status(200).json({
        success:true,
        user
    })
});

//Update User Password
exports.updatePassword = catchAsyncErrors( async (req,res,next) => {
    const user = await User.findById({_id: req.user.id}).select("+password");
    const {oldPassword,confirmPassword,newPassword} = req.body;
    const isPasswordMatched = await user.comparePassword(oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",401));
    }
    if(oldPassword !== confirmPassword){
        return next(new ErrorHandler("Passwords do not match",401));
    }
    user.password = newPassword;

    await user.save();

   sendToken(user,200,res);
});

//Update User Profile
exports.updateProfile = catchAsyncErrors( async (req,res,next) => {

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    const user = await User.findByIdAndUpdate({_id: req.user.id},newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

   res.status(200).json({
       success:true,
   });

});
//Update User Role -- Admin
exports.updateUserRole = catchAsyncErrors( async (req,res,next) => {

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate({_id: req.params.id},newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

   res.status(200).json({
       success:true,
   });

});

//Delete User -- Admin
exports.deleteUser = catchAsyncErrors( async (req,res,next) => {
   const user = await User.findById(req.params.id);

   if(!user){
       return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
   }
   await user.remove();

   res.status(200).json({
       success:true,
       message:`User with id ${req.params.id} deleted successfully`
   });

});

// Register a user
exports.registerUser = catchAsyncErrors( async (req,res,next) => {
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl",
        }
    });

    sendToken(user,201,res);
});

exports.loginUser = catchAsyncErrors( async (req,res,next) => {
     const {email,password} = req.body;

     //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400))
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    
    console.log(isPasswordMatched);
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res);
});

// Logout User

exports.logoutUser = catchAsyncErrors(async (req,res,next) => {

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged Out Successfully",
    });
});

exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get(
                                "host"
                                )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n
                     If you have not requested this email then please ignore it`;

    try{
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message
        });
        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message,500));
    }

});


exports.resetPassword = catchAsyncErrors(async (req,res,next)=> {


    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256")
                                     .update(req.params.token)
                                     .digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt:Date.now() },
    });
    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);

});