const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const nodemailer = require('nodemailer');


// Send job application email
exports.sendJobApplicationEmail = async (req, res, next) => {
    const { jobTitle, userEmail } = req.body;


    // Configure le transporteur d'email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'maleksg01@gmail.com', // Utilisez l'adresse email correcte ici
            pass: 'bpih xicx mofl mxxq', // Utilisez le mot de passe d'application ici
        },
    });

    const mailOptions = {
        from: userEmail,
        to: 'maleksg01@gmail.com', // L'adresse email de destination
        subject: `Job Application: ${jobTitle}`,
        text: `Bonjour,\n\nL'utilisateur avec l'email ${userEmail} a postulé pour le poste "${jobTitle}".\n\nCordialement,`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        next(error);
    }
};


//load all users
exports.allUsers = async (req, res, next) => {
    //enable pagination
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();

    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password')
            .skip(pageSize * (page - 1))
            .limit(pageSize)

        res.status(200).json({
            success: true,
            users,
            page,
            pages: Math.ceil(count / pageSize),
            count

        })
        next();
    } catch (error) {
        return next(error);
    }
}

exports.singleUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        });
        if (! user) {
            return next(new ErrorResponse("User not found", 404));
        }
    } catch (error) {
        return next(error);
    }


    
};



//edit user
exports.editUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            user
        })
        next();

    } catch (error) {
        return next(error);
    }
}

//delete job by id.
exports.deleteUser = async (req, res, next) => {
    try {
        const job = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "User deleted."
        })
    } catch (error) {
        next(error);
    }
}


//jobs history
exports.createUserJobsHistory = async (req, res, next) => {
    const { title, description, salary, location } = req.body;

    try {
        const currentUser = await User.findOne({ _id: req.user._id });
        if (!currentUser) {
            return next(new ErrorResponse("You must log In", 401));
        } else {
            const addJobHistory = {
                title,
                description,
                salary,
                location,
                user: req.user._id
            }
            currentUser.jobsHistory.push(addJobHistory);
            await currentUser.save();
        }

        res.status(200).json({
            success: true,
            currentUser
        })
        next();

    } catch (error) {
        return next(error);
    }
}