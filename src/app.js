import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.js";
import productsRouter from "./views/products.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// handlebars config.
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//EndPoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
const productManager = new ProductManager("./src/productos.json");
const cartManager = new CartManager("./cart.json");

app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res
      .status(200)
      .json({ products, message: "Productos obtenidos con exito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    res.status(200).json({ product: product });
  } catch (error) {
    res.status(500).json({ error: "Producto no encontrado" });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);
    res.status(200).json({ products, message: "Producto eliminado con exito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;
    const updatedProduct = await productManager.setProductsById(pid, updates);
    res
      .status(200)
      .json({ updatedProduct, message: "Producto actualizado con exito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/products", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    res
      .status(201)
      .json({ newProduct, message: "Producto agregado con exito" });
  } catch (error) {
    res.status(500).json({ error: "app" + error.message });
  }
});

// Rutas para carritos

app.get("/api/cart/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    res.status(200).json({ cart, message: "Carrito obtenido con exito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.status(201).json({ newCart, message: "Carrito creado con exito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cart/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartManager.addProductToCart(cid, pid);
    res
      .status(200)
      .json({ cart, message: "Producto agregado al carrito con exito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8080, () => console.log("servidor desde el 8080"));
