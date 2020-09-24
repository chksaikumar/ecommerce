const Category = require("../models/category");
const slugify = require("slugify");

function createCategories(categories, parentId = null) {
  const categoryList = []; //this will be in arrary
  let category;
  if (parentId == null) {
    //if parent id is null it will fitech all the category
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    //if it not parent it will have some id
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    //category will be an array filter by filter function
    categoryList.push({
      // store the category
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };

  if (req.file) {
    categoryObj.categoryImage =
      process.env.API + "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    //if this exist use category object
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      //if category done it will show added category
      return res.status(201).json({ category });
    }
  });
};

exports.getCategories = (req, res) => {
  //if i pass empty object it will retrive all of the data
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    //if it is true the we send a requestit will fetch data
    if (categories) {
      const categoryList = createCategories(categories);

      res.status(200).json({ categoryList });
    }
  });
};
