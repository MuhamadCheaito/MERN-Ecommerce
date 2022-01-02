const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto  = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxlength:[30,"Name cannot exceed 30 characters"],
        minlength:[4,"Name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minlength:[8,"Name should have greater than 8 characters"],
        select:false,
    },
    avatar:{
            public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

userSchema.pre("save", async function(next){
  
    if(!this.isModified("password")){
        next();
    }
    this.password = await bycrypt.hash(this.password,10); 
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id },process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

//Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//Generating Password Reset Token

userSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    
}

module.exports = mongoose.model("User",userSchema);