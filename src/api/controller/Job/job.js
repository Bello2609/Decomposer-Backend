const Job = require("../../model/Job");
const jobSchema = require("../../validationSchema/jobSchema");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const CONFIG = require("../../../config");
// const { getLoggedUserId } = require("../../../utils/generalUtils");


cloudinary.config({
    cloud_name: CONFIG.CLOUDINARY_CLOUD_NAME,
    api_key: CONFIG.CLOUDINARY_API_KEY,
    api_secret: CONFIG.CLOUDINARY_API_SECRET,
  });

module.exports.postJob = async(req, res, next)=>{
    const form  = formidable();
    // const { title, category, jobType, description, image  } = req.body;
    try{
        form.parse(req, (err, fields, files)=>{
            const postJob = {
                title: fields.title,
                category: fields.category,
                jobType: fields.jobType,
                description: fields.description,
                media: files.media.filepath
            }; 
            const { error } = jobSchema.validate(postJob, {
                abortEarly: false
            });
            if(error){
                return res.status(400).json({
                    data: {
                        message: error.details[0].message
                    }
                })
            }
            //save media
            cloudinary.uploader.upload(files.media.filepath, {
                folder: "decomposer"
            }, async(err, result)=>{
                if(err){
                    return res.status(500).json({
                        success: false,
                        data: {
                            message: "sorry the image could not upload"
                        }
                    })
                }
                // save the job to the databse
                //the the id of the user that postthe job
                // const getUserId = await getLoggedUserId(req.headers.authorization);
                const job = new Job({
                    title: fields.title,
                    category: fields.category,
                    jobType: fields.jobType,
                    description: fields.description,
                    media: {
                        url: result.secure_url,
                        public_id: result.public_id
                    }
                });
                job.save(async(err, job)=>{
                    if(err){
                        return res.status(401).json({
                            data: {
                                message: err.message
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
            });   
        });
    }catch(err){
        res.status(404).json({
            data: {
                message: err.message
            }
        })
    }
        
    
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