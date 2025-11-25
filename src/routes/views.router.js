import express from "express";
import Product from "../models/product.model.js";

const viewRouter = express.Router();
viewRouter.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const data = await Product.paginate({}, { limit, page, lean: true });

    const products = data.docs;
    delete data.docs;

    const links = [];
    for (let i = 1; i <= data.totalPages; i++) {
      links.push({ text: i, links: `?limit=${limit}&page=${i}` });
    }
    res.render("index", { products, links });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos",
      error: error.message,
    });
  }
});

export default viewRouter;
