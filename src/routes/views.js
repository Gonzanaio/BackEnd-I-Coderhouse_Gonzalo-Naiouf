import express from "express";
import ProductManager from "../ProductManager.js";
import { engine } from "express-handlebars";

const viewsRouter = express.Router();

const productManager = new ProductManager("./src/productos.json");

viewsRouter.get("/", async (req, res) => {
  try {
    const user = { username: "Gonzalo", isAdmin: false };
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default viewsRouter;
