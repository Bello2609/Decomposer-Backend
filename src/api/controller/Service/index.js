const Service = require("../../model/Service");
const cloudinary = require("cloudinary").v2;
const CONFIG = require("../../../config");
const formidable = require("formidable");
const statusCodes = require("../../constants/status");
const serviceSchema = require("../../validationSchema/serviceSchema");
const { getLoggedUserId } = require("../../../utils/generalUtils");
const { default: mongoose } = require("mongoose");
const statusMessages = require("../../constants/messages");

cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY_API_KEY,
  api_secret: CONFIG.CLOUDINARY_API_SECRET,
});

module.exports.addService = (req, res) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (!files.image)
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        data: {
          message: "Image is required",
        },
      });

    //validate
    const { error } = serviceSchema.validate(
      {
        title: fields.title,
        price: fields.price,
        duration: fields.duration,
        description: fields.description,
      },
      {
        abortEarly: false,
      }
    );

    if (error) {
      return res.status(statusCodes.BAD_REQUEST).json({
        data: {
          message: error.details[0].message,
        },
      });
    }

    // save media
    cloudinary.uploader.upload(
      files.image.filepath,
      {
        folder: "decomposer",
      },
      async (err, result) => {
        if (err) {
          return res.status(statusCodes.SERVER_ERROR).json({
            success: false,
            data: {
              message: "Image could not upload",
            },
          });
        }

        // save to db
        let user_id = await getLoggedUserId(req.headers.authorization);
        const service = new Service({
          user_id,
          title: fields.title,
          price: fields.price,
          duration: fields.duration,
          description: fields.description,
          media: result.secure_url,
          public_id: result.public_id,
        });

        service.save((err, saved) => {
          if (err) {
            return res.status(statusCodes.SERVER_ERROR).json({
              success: false,
              data: {
                message: "Service could not be saved",
                err,
              },
            });
          }

          return res.status(statusCodes.CREATED).json({
            success: true,
            data: {
              message: "Service added successfully",
              service: saved,
              result,
            },
          });
        });
      }
    );
  });
};

// only owned service
module.exports.oneService = (req, res) => {
  //check for valid object Id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      data: {
        message: "Invalid id",
      },
    });
  }

  Service.findById(req.params.id).exec(async (err, service) => {
    if (err) {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    }

    if (!service) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        data: {
          message: "No service found",
        },
      });
    }

    return res.status(statusCodes.OK).json({
      success: true,
      data: {
        service,
      },
    });
  });
};

module.exports.myServices = async (req, res) => {
  const user_id = await getLoggedUserId(req.headers.authorization);
  Service.find({ user_id })
    .then((result) => {
      if (!result || result.length === 0) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          data: {
            message: "No service found",
          },
        });
      }

      return res.status(statusCodes.OK).json({
        success: true,
        data: { services: result },
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    });
};

module.exports.deleteService = (req, res) => {
  //check for valid object Id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      data: {
        message: "Invalid id",
      },
    });
  }

  Service.findById(req.params.id)
    .then(async (service) => {
      if (!service) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          data: {
            message: "Service not found",
          },
        });
      }

      // only permit owner of service
      let loggedUserId = await getLoggedUserId(req.headers.authorization);

      if (String(loggedUserId) === String(service.user_id)) {
        service.remove((err, deletedService) => {
          if (err) {
            return res.status(statusCodes.SERVER_ERROR).json({
              success: false,
              data: {
                message: err,
              },
            });
          }

          return res.status(statusCodes.OK).json({
            success: true,
            data: {
              message: "Service deleted successfully",
            },
          });
        });
      } else {
        return res.status(statusCodes.FORBIDDEN).json({
          success: false,
          data: {
            message: statusMessages.FORBIDDEN,
          },
        });
      }
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    });
};

// owner of service can only update
module.exports.updateService = (req, res) => {
  let { title, price, duration, description } = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      data: {
        message: statusMessages.BAD_REQUEST,
      },
    });
  }
  Service.findById(req.params.id)
    .then(async (service) => {
      if (!service) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          data: {
            message: "Service not found",
          },
        });
      } else {
        // check if the service is owned by current user
        let loggedUserId = await getLoggedUserId(req.headers.authorization);
        if (String(loggedUserId) != String(service.user_id)) {
          return res.status(statusCodes.FORBIDDEN).json({
            success: false,
            data: {
              message: statusMessages.FORBIDDEN,
            },
          });
        }

        service.title = title ? title : service.title;
        service.price = price ? price : service.price;
        service.duration = duration ? duration : service.duration;
        service.description = description ? description : service.description;

        //save
        service.save((err, updatedService) => {
          if (err) {
            return res.status(statusCodes.SERVER_ERROR).json({
              success: false,
              data: {
                message: err,
              },
            });
          }
          return res.status(statusCodes.OK).json({
            success: true,
            data: {
              service: updatedService,
            },
          });
        });
      }
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    });
};

module.exports.updateServiceMedia = (req, res) => {
  //check for valid object Id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      data: {
        message: "Invalid id",
      },
    });
  }
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (!files.media)
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        data: {
          message: "Media is required",
        },
      });

    Service.findById(req.params.id).then(async (service) => {
      if (!service) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          data: {
            message: "Service not found",
          },
        });
      }

      //is logged in user the owner
      let loggedUserId = await getLoggedUserId(req.headers.authorization);
      if (String(loggedUserId) != String(service.user_id)) {
        return res.status(statusCodes.FORBIDDEN).json({
          success: false,
          data: {
            message: statusMessages.FORBIDDEN,
          },
        });
      }

      // save media
      cloudinary.uploader.upload(
        files.media.filepath,
        {
          folder: "decomposer",
          public_id: service.public_id,
          invalidate: true,
        },
        async (err, result) => {
          if (err) {
            return res.status(statusCodes.SERVER_ERROR).json({
              success: false,
              data: {
                message: "Media could not upload",
              },
            });
          }

          service.media = result.secure_url;

          service.save((err, saved) => {
            if (err) {
              return res.status(statusCodes.SERVER_ERROR).json({
                success: false,
                data: {
                  message: "Service media could not be updated",
                  err,
                },
              });
            }

            return res.status(statusCodes.CREATED).json({
              success: true,
              data: {
                message: "Service media updated successfully",
                service: saved,
              },
            });
          });
        }
      );
    });
  });
};
