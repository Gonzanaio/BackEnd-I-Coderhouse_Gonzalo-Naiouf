import express from "express";
import Product from "../models/product.model.js";
import e from "express";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const data = await Product.paginate({}, { limit, page });
    const products = data.docs;
    delete data.docs;
    res.status(200).json({ status: "sucess", payload: products, ...data });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos en product.routes.js",
      error: error.message,
    });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const product = new Product(newProduct);
    await product.save();
    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear producto en product.routes.js",
      error: error.message,
    });
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updateData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el producto en product.routes.js",
      error: error.message,
    });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto en product.routes.js",
      error: error.message,
    });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();

    if (!product) {
      return res
        .status(404)
        .render("404", { message: "Producto no encontrado" });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .lean();

    res.render("productDetail", {
      product,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).send("Error al obtener el producto");
  }
});

export default productRouter;
