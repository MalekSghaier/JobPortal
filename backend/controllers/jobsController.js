const Job = require('../models/jobModel');
const JobType = require('../models/jobTypeModel');
const ErrorResponse = require('../utils/errorResponse');

//create job
exports.createJob = async (req, res, next) => {
    try {
        const job = await Job.create({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            salary: req.body.salary,
            jobType: req.body.jobType,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


//single job
exports.singleJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


//update job by id.
exports.updateJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, { new: true }).populate('jobType', 'jobTypeName').populate('user', 'name');
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


// Show all jobs with filtering, search, and pagination
exports.showJobs = async (req, res, next) => {
    try {
        // Enable search by keyword
        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        // Retrieve all jobType IDs for filtering by category
        let ids = [];
        const jobTypeCategory = await JobType.find({}, { _id: 1 });
        jobTypeCategory.forEach(cat => {
            ids.push(cat._id);
        });

        // Filter jobs by category ID or all if no category provided
        let cat = req.query.cat;
        let categ = cat ? cat : ids;

           
         //jobs by location
        let locations = [];
        const jobByLocation = await Job.find({}, { location: 1 });
        jobByLocation.forEach(val => {
           locations.push(val.location);
        });
        let setUniqueLocation = [...new Set(locations)];
        let location = req.query.location;
        let locationFilter = location !== '' ? location : setUniqueLocation;


        // Enable pagination
        const pageSize = 5;
        const page = Number(req.query.pageNumber) || 1;

        // Count total jobs matching the filters
        const count = await Job.find({ ...keyword, jobType: categ , location : locationFilter}).countDocuments();

        // Fetch jobs based on filters, pagination, and limit results
        const jobs = await Job.find({ ...keyword, jobType: categ ,location : locationFilter})
            .sort({createdAt : -1})
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        res.status(200).json({
            success: true,
            jobs,
            page,
            pages: Math.ceil(count / pageSize),
            count,
            setUniqueLocation
        });
    } catch (error) {
        next(error);
    }
};