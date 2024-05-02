const express = require("express");
const router = express.Router();
const customizeController = require("../controller/customize");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/get-slide-image", customizeController.getImages);
router.post("/delete-slide-image", customizeController.deleteSlideImage);
router.post(
  "/upload-slide-image",
  upload.single("image"),
  customizeController.uploadSlideImage
);
router.post("/dashboard-data", customizeController.getAllData);

module.exports = router;
