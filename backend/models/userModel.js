//userModel.js


// /models/userModel.js 
const  mongoose = require ('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken");

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
        minlength: [8,'Mot de passe doit être au moins de 8 caractères'],
    }, 
    role:{
        type : Number,
        default : 0,
    }
},{timestamps:true})

//encrypting password before saving 

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password , 10)
})

// compare user password

userSchema.methods.comparePassword = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password)
}


// return a jwt token 
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id : this.id},process.env.JWT_SECRET,{
        expiresIn : 3600
    })
}


module.exports = mongoose.model("User",userSchema);