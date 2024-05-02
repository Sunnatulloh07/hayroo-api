const { toTitleCase } = require("../config/function");
const categoryModel = require("../models/categories");
const { deleteFileFromFirebaseStorage, uploadFileToFirebaseStorage } = require("../utils/firebase");

class Category {
  async getAllCategory(req, res) {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddCategory(req, res) {
    let { cName, cDescription, cStatus } = req.body;
    let cImage = req.file;

    if (!cName || !cDescription || !cStatus || !cImage) {
      return res.json({ error: "All filled must be required" });
    } else {
      const image = await uploadFileToFirebaseStorage(cImage);
      cName = toTitleCase(cName);
      try {
        let checkCategoryExists = await categoryModel.findOne({ cName: cName });
        if (checkCategoryExists) {
          return res.json({ error: "Category already exists" });
        } else {
          let newCategory = new categoryModel({
            cName,
            cDescription,
            cStatus,
            cImage: image,
          });
          await newCategory.save((err) => {
            if (!err) {
              return res.json({ success: "Category created successfully" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditCategory(req, res) {
    let { cId, cDescription, cStatus } = req.body;
    if (!cId || !cDescription || !cStatus) {
      return res.json({ error: "All filled must be required" });
    }
    try {
      let editCategory = categoryModel.findByIdAndUpdate(cId, {
        cDescription,
        cStatus,
        updatedAt: Date.now(),
      });
      let edit = await editCategory.exec();
      if (edit) {
        return res.json({ success: "Category edit successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getDeleteCategory(req, res) {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deletedCategoryFile = await categoryModel.findById(cId);

        await deleteFileFromFirebaseStorage(
          deletedCategoryFile.cImage.public_id
        );
        let deleteCategory = await categoryModel.findByIdAndDelete(cId);
        if (deleteCategory) {
          // Delete Image from uploads -> categories folder

          return res.json({ success: "Category deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const categoryController = new Category();
module.exports = categoryController;
