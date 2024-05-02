const fs = require("fs");
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const orderModel = require("../models/orders");
const userModel = require("../models/users");
const customizeModel = require("../models/customize");
const {
  uploadFileToFirebaseStorage,
  deleteFileFromFirebaseStorage,
} = require("../utils/firebase");

class Customize {
  async getImages(req, res) {
    try {
      let Images = await customizeModel.find({});
      if (Images) {
        return res.json({ Images });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async uploadSlideImage(req, res) {
    let image = req.file;

    if (!image) {
      return res.json({ error: "All field required" });
    }
    try {
      const uploadImage = await uploadFileToFirebaseStorage(image);
      let newCustomzie = new customizeModel({
        slideImage: uploadImage,
      });
      let save = await newCustomzie.save();
      if (save) {
        return res.json({ success: "Image upload successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteSlideImage(req, res) {
    let { id } = req.body;
    if (!id) {
      return res.json({ error: "All field required" });
    } else {
      try {
        let deletedSlideImage = await customizeModel.findById(id);
        // const filePath = `../server/public/uploads/customize/${deletedSlideImage.slideImage}`;

        let deleteImage = await customizeModel.findByIdAndDelete(id);
        if (deleteImage) {
          // Delete Image from uploads -> customizes folder
          if (deletedSlideImage.slideImage.public_id)
            await deleteFileFromFirebaseStorage(
              deletedSlideImage.slideImage.public_id
            );
          return res.json({ success: "Image deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getAllData(req, res) {
    try {
      let Categories = await categoryModel.find({}).countDocuments();
      let Products = await productModel.find({}).countDocuments();
      let Orders = await orderModel.find({}).countDocuments();
      let Users = await userModel.find({}).countDocuments();
      if (Categories !== null && Products !== null && Orders !== null && Users !== null) {
        return res.json({ Categories, Products, Orders, Users });
      }else{
        return res.status(403).json({ error: "Something went wrong" });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const customizeController = new Customize();
module.exports = customizeController;
