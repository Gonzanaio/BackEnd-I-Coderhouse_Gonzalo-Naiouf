import mongoose from "mongoose";
const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.CONEX_MONGODB);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
};
export default connectMongoDb;
