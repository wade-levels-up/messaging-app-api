import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage, limits: { fileSize: 1000000 } }); // Limits files less than 1mb

