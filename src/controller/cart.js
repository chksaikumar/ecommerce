const Cart = require("../models/cart");

exports.addItemToCart = (req, res) => {
  //if user id already exist there is no need to creat cart
  Cart.findOne({ user: req.user._id }) //identify user exist or not
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        //if cart already exists then update cart by quantity
        const product = req.body.cartItems.product;
        const item = cart.cartItems.find((c) => c.product == product); //we gona see product is exist or not
        let condition, update;
        if (item) {
          condition = { user: req.user._id, "cartItems.product": product }; //checking user aswell as product exist or not
          update = {
            $set: {
              //update the cart
              "cartItems.$": {
                ...req.body.cartItems,
                quantity: item.quantity + req.body.cartItems.quantity,
              },
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              // push the record in a sub collection
              cartItems: req.body.cartItems,
            },
          };
        }
        //the function findone will first find the item after update the item based on condetion
        Cart.findOneAndUpdate(condition, update).exec((error, _cart) => {
          if (error) return res.status(400).json({ error });
          if (_cart) {
            return res.status(201).json({ cart: _cart });
          }
        });
      } else {
        //if cart not exist then create a new cart
        const cart = new Cart({
          user: req.user._id,
          cartItems: [req.body.cartItems],
        });
        cart.save((error, cart) => {
          if (error) return res.status(400).json({ error }); // if any error it will show error
          if (cart) {
            return res.status(201).json({ cart }); //if it execute it will show same as we gave
          }
        });
      }
    });
};
