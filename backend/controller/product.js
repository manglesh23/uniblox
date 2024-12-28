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

module.exports = { createProduct, getProduct };
