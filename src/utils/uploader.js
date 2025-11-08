import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/img");
  },
  filename: (req, file, callback) => {
    const nuevoNombreArchivo = Date.now() + "-" + file.originalname;
    callback(null, nuevoNombreArchivo);
  },
});

const uploader = multer({ storage: storage });

export default uploader;
