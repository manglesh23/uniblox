const Cart = require("../models/cart");

const addToCart = async (req, res) => {
  const { productId, name, price, quantity = 1 } = req.body;
//   console.log("Req user:-", req.user);
  const userId = req.user.id;
try {
    let cart = await Cart.findOne({ userId });  //check the user's cart in cart Database if not then create one and add the items in the cart

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId     //if cart already have the item then increase the quantity else push new product into cart Database
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity });
    }

    await cart.save();
    res.status(200).json({msg:cart,success:true});
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

const getCartProduct=async(req,res)=>{
    console.log("get cart product");
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");  //get user's added product into the cart
  
      if (!cart) {
        return res.status(200).json({ items: [] });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = { addToCart,getCartProduct };
