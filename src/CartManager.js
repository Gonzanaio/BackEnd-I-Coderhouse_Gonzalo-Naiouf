import fs from "fs/promises";
import crypto from "crypto";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }
  generateNewId() {
    return crypto.randomUUID();
  }

  async getCarts() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);
      return carts;
    } catch (error) {
      throw new Error(`Error al leer los carritos: ${error.message}`);
    }
  }
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id === id);
      return cart;
    } catch (error) {
      throw new Error(`Error al leer los carritos: ${error.message}`);
    }
  }

  async addCart() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);
      const newId = this.generateNewId();
      const cart = { id: newId, products: [] };
      carts.push(cart);
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar el carrito: ${error.message}`);
    }
  }

  async addProductToCart(cid, pId) {
    try {
      const carts = await this.getCarts();
      const indexC = carts.findIndex((c) => c.id === cid);
      if (indexC === -1) throw new Error("Carrito no encontrado");
      const products = carts[indexC].products;
      const indexP = products.findIndex((p) => p.id === pId);
      if (indexP === -1) {
        products.push({ id: pId, quantity: 1 });
      } else {
        products[indexP].quantity += 1;
      }
      carts[indexC].products = products;
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
      return carts[indexC];
    } catch (error) {
      throw new Error(
        `Error al agregar el producto al carrito: ${error.message}`
      );
    }
  }
}

export default CartManager;

// utilizo la funcion main para probar las funcionalidades de la clase CartManager

// async function main() {
//   try {
//     const cartManager = new CartManager("./cart.json");
//     // await cartManager.addCart();
//     const carts = await cartManager.getCartsById(
//       "5991c203-393d-46c9-8da4-5ccd5a8ec260"
//     );
//     console.table(carts);
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();
