// / controolers/authController.js

const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

exports.signup= async (req, res, next)=>{
   const {cin} = req.body;
   const userExist = await User.findOne({cin }); 
   if (userExist){
    return next (new ErrorResponse("Numéro CIN existe déjà",400) ); 
   }
   try {
    const user = await  User.create(req.body);
    res.status(201).json({
        success : true,
        user
    })
   } catch (error) {
    next(error);
   }
}

exports.signin= async (req, res, next)=>{

    try {
     const {cin , password} = req.body;
     //validation
     if (!cin){
        return next ( new ErrorResponse ("Ajoutez un numéro CIN",403))
     }
     if (!password){
        return next ( new ErrorResponse ("Ajoutez un mot de passe",403))
     }

     // check user Cin
      const user = await User.findOne({cin }); 
      if (!user){
        return next ( new ErrorResponse ("informations d'identification invalides",400))
     }

     //check password

     const isMatched = await user.comparePassword(password);
     if (!isMatched){
        return next ( new ErrorResponse ("informations d'identification invalides",400))
     }
      
     sendTokenResponse(user, 200,res);
    } catch (error) {
     next(error);
    }

 }

 const sendTokenResponse= async (user,codeStatus, res)=>{
    const token = await user.getJwtToken();
    res
    .status(codeStatus)
    .cookie('token',token,{maxAge : 60*60*1000, httpOnly : true })
    .json ({success : true , token , user})
 }


 //logout

 exports.logout = (req,res,next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success : true , 
        message : "Déconnecté"
    });
 }

  // user profile
exports.userProfile = async (req, res, next) => {

   const user = await User.findById(req.user.id).select('-password');

   res.status(200).json({
       success: true,
       user
   })
}







