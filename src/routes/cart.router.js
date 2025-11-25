import express from "express";
import Cart from "../models/cart.model.js";

const cartRouter = express.Router();

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = new Cart();
    await newCart.save();
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el carrito",
      error: error.message,
    });
  }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el producto al carrito",
      error: error.message,
    });
  }
});

cartRouter.get("/:cid/", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });
      return;
    }
    const products = cart.products.map((item) => ({
      quantity: item.quantity,
      product: {
        _id: item.product._id,
        title: item.product.title,
        price: item.product.price,
        thumbnail: item.product.thumbnail,
      },
    }));

    res.render("cart", { products });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message,
    });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const deleteProduct = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );
    res.status(200).json({ status: "success", payload: deleteProduct });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito",
      error: error.message,
    });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const emptyCart = await Cart.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    );
    res.status(200).json({ status: "success", payload: emptyCart });
  } catch (error) {
    res.status(500).json({
      message: "Error al vaciar el carrito",
      error: error.message,
    });
  }
});
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    const item = cart.products.find((p) => p.product.toString() === pid);

    if (!item) return res.status(404).send("Producto no encontrado");

    item.quantity = quantity;
    await cart.save();

    res.send({ status: "ok" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default cartRouter;
