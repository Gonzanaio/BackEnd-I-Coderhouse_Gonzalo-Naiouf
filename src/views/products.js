import express from "express";
import ProductManager from "../ProductManager.js";
import uploader from "../utils/uploader.js";

const productRouter = express.Router();
const productManager = new ProductManager("./src/productos.json");

productRouter.post("/", uploader.single("file"), async (req, res) => {
  const thumbnail = req.file ? `/img/${req.file.filename}` : "/img/default.jpg";
  try {
    const title = req.body.title;
    const price = req.body.price;
    await productManager.addProduct({ title, price, thumbnail });
    res.redirect("/");
    res.status(201).json({ message: "Producto agregado con exito" });
  } catch (error) {
    res.status(500).json({ errore: error.message });
  }
});
export default productRouter;
