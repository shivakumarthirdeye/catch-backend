import express from "express";
import { ModelIndividualUser } from "../db-model/model.individual.users";
import { ModelSubscription } from "../db-model/model.subscription";
import authenticateToken from "../middleware/authenticate";
import multerS3 from "multer-s3";
import multer from "multer";
import { s3 } from "../../shared/s3";
require("dotenv").config();

const userApp = express.Router();

userApp.use(express.json());
const uploadProfile = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      var newFileName = Date.now() + "-" + file.originalname;
      var fullPath = "user/profile/" + newFileName;
      cb(null, fullPath); //use Date.now() for unique file keys
    },
  }),
});

const uploadVehicle = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      var newFileName = Date.now() + "-" + file.originalname;
      var fullPath = "user/vehicle/" + newFileName;
      cb(null, fullPath); //use Date.now() for unique file keys
    },
  }),
});

userApp.get("/", authenticateToken, async (req, res) => {
  const id = req.user.id;
  try {
    const user = await ModelIndividualUser.collection().findOne({ id });
    if (!user) {
      return res.json({ status: "failed", msg: "User not found" });
    }

    const user_sub = await ModelSubscription.collection().findOne({
      user_id: id,
    });

    return res.json({ status: "ok", data: { ...user, ...user_sub } });
  } catch (e) {
    console.log(e);
    return res.json({ status: "ok", msg: "Server error" });
  }
});

userApp.patch("/active", authenticateToken, async (req, res) => {
  const id = req.user.id;
  try {
    await ModelIndividualUser.collection().updateOne(
      { id },
      {
        $set: {
          active: new Date(),
        },
      },
      { upsert: false }
    );
    return res.json({ status: "ok", msg: "updated" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "ok", msg: "Server error" });
  }
});

userApp.post(
  "/edit",
  authenticateToken,
  uploadProfile.single("profile_image"),
  async (req, res) => {
    const id = req.user.id;
    const {
      username,
      email,
      short_address,
      full_address,
      vehicle_type,
      latitude,
      longitude,
    } = req.body;

    let extra_params = {};

    if (req.file.location && req.file.location?.length > 0) {
      extra_params = { profile_image: req.file.location };
    }

    const subs = await ModelSubscription.collection().findOne({ user_id: id });

    if (!subs.status || subs.status != "active") {
      return res.json({
        status: "failed",
        msg: "Unsubscribed or subscription expired",
      });
    }

    if (latitude && longitude) {
      try {
        await ModelIndividualUser.collection().updateOne(
          { id },
          {
            $set: {
              username,
              email,
              short_address,
              updated: new Date(),
              full_address,
              vehicle_type,
              coordinates: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
              },
              ...extra_params,
            },
          },
          { upsert: false }
        );
        return res.json({ status: "ok", msg: "Updated successfully" });
      } catch (e) {
        console.log(e);
        return res.json({ status: "failed", msg: "Server error" });
      }
    } else {
      return res.json({ status: "failed", msg: "Coordinates are missing" });
    }
  }
);

userApp.post("/local", authenticateToken, async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const data = await ModelIndividualUser.collection()
      .aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            maxDistance: 10000,
            distanceField: "dist.calculated",
            includeLocs: "dist.location",
            spherical: true,
          },
        },
      ])
      .toArray();
    return res.json({ status: "ok", data });
  } catch (e) {
    return res.json({ staus: "failed", msg: "Server error" });
  }
});

userApp.post(
  "/upload",
  authenticateToken,
  uploadVehicle.array("vehicle_images"),
  async (req, res) => {
    const id = req.user.id;
    const images = [];
    if (req.files) {
      req.files.forEach((item) => {
        images.push({ uri: item.location });
      });
    }
    try {
      if (!(await ModelIndividualUser.collection().findOne({ id }))) {
        return res.json({ staus: "failed", msg: "User not found" });
      }

      await ModelIndividualUser.collection().updateOne(
        { id },
        {
          $set: {
            vehicle_images: images,
          },
        },
        { upsert: false }
      );
      return res.json({ staus: "ok", msg: "Uploaded" });
    } catch (e) {
      return res.json({ staus: "failed", msg: "Server error" });
    }
  }
);

export { userApp };
