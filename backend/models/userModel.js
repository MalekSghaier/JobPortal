//userModel.js
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const jobsHistorySchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        maxlength: 70,
    },

    description: {
        type: String,
        trim: true
    },
    salary: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
    },
    interviewDate: {
        type: Date,
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },

    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },

}, { timestamps: true })

const userSchema = new mongoose.Schema({
    name:{
        type: String , 
        trim:true,
        required:[true,'Nom et prénom obligatoires'],
        maxlength: 55,
    }, 
    phone:{
        type: Number , 
        trim:true,
        required:[true,'Numéro de téléphone obligatoire'],
        maxlength: 8,
        unique:true,
    },
    cin:{
        type: Number , 
        trim:true,
        required:[true,'Numéro CIN obligatoire'],
        maxlength: 8,
        unique:true,
    },
    password:{
        type: String , 
        trim:true,
        required:[true,'Mot de passe obligatoire'],
        minlength: [8,'Mot de passe doit être au moins (8) caractères'],
    }, 
    jobsHistory: [jobsHistorySchema],

    role: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

//encrypting password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// return a JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}



module.exports = mongoose.model("User", userSchema);
