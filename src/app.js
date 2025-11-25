import express from "express";
import connectMongoDb from "./config/db.js";
import productRouter from "./routes/product.router.js";
import viewRouter from "./routes/views.router.js";
import dotenv from "dotenv";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import hbs from "express-handlebars";
dotenv.config();
const app = express();
app.use(express.json());

connectMongoDb();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);
app.use(express.static("public"));
app.engine(
  "handlebars",
  hbs.engine({
    helpers: {
      multiply: (a, b) => a * b,
      cartTotal: (products) => {
        return products.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
    },
  })
);
app.set("view engine", "handlebars");

app.listen(8080, () => {
  console.log("Servidor corriendo en 8080");
});
