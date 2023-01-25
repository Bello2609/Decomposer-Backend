const Job = require("../../model/Job");
const jobSchema = require("../../validationSchema/jobSchema");
module.exports.postJob = async(req, res, next)=>{
    const { title, category, jobType, description, image  } = req.body;
    const postJob = {
        title: title,
        category: category,
        jobType: jobType,
        description: description,
        image: image
    }; 
    const { error } = jobSchema.validate(postJob, {
        abortEarly: false
    });
    if(error){
        res.status(400).json({
            data: {
                message: error
            }
        })
    }
    const job = new Job(postJob);
    // job.save();
    // console.log("success");
    // res.status(201).json({
    //     data: {
    //         message: "Job posted successfully"
    //     }
    // });
    job.save(async(err, job)=>{
        if(err){
            return res.status(401).json({
                data: {
                    message: "there is an error"
                }
            });
        }
        return res.status(201).json({
            data: {
                message: "Job posted successfully",
                job: job
            }
        })
    });
} 
module.exports.getAllJobs = async(req, res, next)=>{
    const job = await Job.find({}).exec();
    if(!job){
        return res.status().json({
            data: {
                message: "No job is found"
            }
        });
    }
    return res.status(200).json({
        data: {
            message: "All job has been fetched",
            jobs: job
        }
    })
}