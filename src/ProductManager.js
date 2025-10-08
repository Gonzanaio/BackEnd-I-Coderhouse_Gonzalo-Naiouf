import fs from "fs/promises";
import crypto from "crypto";
class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async addProduct(newProduct) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);
      const newId = this.generateNewId();
      const product = { id: newId, ...newProduct };
      products.push(product);
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
      return product;
    } catch (error) {
      throw new Error(`Error al agregar el producto: ${error.message}`);
    }
  }

  async getProducts() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);
      return products;
    } catch (error) {
      throw new Error(`Error al leer los productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === id);
      return product;
    } catch (error) {
      throw new Error("Error al buscar un producto: " + error.message);
    }
  }

  async deleteProductById(id) {
    try {
      //recuperar los productos
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const filteredProducts = products.filter((product) => product.id !== id);
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(filteredProducts, null, 2),
        "utf-8"
      );

      return filteredProducts;
    } catch (error) {
      throw new Error("Error al borrar un producto: " + error.message);
    }
  }

  async setProductsById(id, updates) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const indexP = products.findIndex((p) => p.id === id);
      if (indexP === -1) throw new Error("Producto no encontrado");

      const updatedProduct = { ...products[indexP], ...updates, id };
      products[indexP] = updatedProduct;
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }
}
export default ProductManager;
//utilizo la funcion main para probar las funcionalidades de la clase ProductManager

// async function main() {
//   try {
//     const productManager = new ProductManager("./productos.json");

//     // const products = await productManager.deleteProductById(1);
//     await productManager.addProduct({
//       title: "Lapicera",
//       description: "Lapicera azul",
//       price: 150,
//     });
//     const products = await productManager.getProducts();
//     console.table(products);
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();
