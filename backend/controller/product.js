const Product = require("../models/product");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body; //to add product into the product database
    // console.log("Req.User:-", req.user);
    let product = new Product({ name, description, price, category, stock });
    await product.save();
    res
      .status(200)
      .json({ msg: `Product Registered Successfully`, success: true });
  } catch (e) {
    console.error("Error in createProduct:", e);
    res.status(500).json({
      error: true,
      msg: "Internal Server Error",
      details: e.message,
      success: false,
    });
  }
};

const getProduct = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const products = await Product.find() //get all product
      .skip((page - 1) * limit) // Skip items for previous pages
      .limit(parseInt(limit)) // Limit items per page
      .exec();

    const total = await Product.countDocuments(); // Get total count

    res.json({
      products,
      total,
      currentPage: parseInt(page), //pagenitation implemented
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const searchProduct = async (req, res) => {
  try {
    const {
      q = "",
      category,
      minPrice,
      maxPrice,
      sort = "name", // Default sort by name
      order = "asc", // Default sort order
      page = 1,
      limit = 10,
    } = req.query;

    // Building the filter query
    const filter = {};

    // Search by name or description
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } }, // Case-insensitive regex
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    const sortOrder = order === "desc" ? -1 : 1;

    // Query the database
    const products = await Product.find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

module.exports = { createProduct, getProduct,searchProduct };
