const JobType = require('../models/jobTypeModel');
const ErrorResponse = require('../utils/errorResponse');

//create job category
exports.createJobType = async (req, res, next) => {
    try {
        const jobT = await JobType.create({
            jobTypeName: req.body.jobTypeName,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            jobT
        })
    } catch (error) {
        next(error);
    }
}


//all jobs category
exports.allJobsType = async (req, res, next) => {
    try {
        const jobT = await JobType.find();
        res.status(200).json({
            success: true,
            jobT
        })
    } catch (error) {
        next(error);
    }
}


//update job type
exports.updateJobType = async (req, res, next) => {
    try {
        const jobT = await JobType.findByIdAndUpdate(req.params.type_id, req.body, { new: true });
        res.status(200).json({
            success: true,
            jobT
        })
    } catch (error) {
        next(error);
    }
}


// Delete job type
exports.deleteJobType = async (req, res, next) => {
    try {
        const jobT = await JobType.findByIdAndDelete(req.params.type_id); // Utilisation de findByIdAndDelete

        if (!jobT) {
            return next(new ErrorResponse("Type d'employé non trouvé", 404));
        }

        res.status(200).json({
            success: true,
            message: "Type d'employé supprimé"
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du type d\'employé:', error);
        next(new ErrorResponse(error.message || "Erreur serveur", 500));
    }
};