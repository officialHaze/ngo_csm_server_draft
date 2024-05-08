import express, { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import fs from "fs/promises";
import path from "path";

// Multer config
import multer from "multer";

// Configure where and how the file is to be stored
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/images");
  },
  filename: (req, file, cb) => {
    const mimetype = file.mimetype;
    const ext = mimetype.split("/")[1];
    const fileId = Date.now(); // Current time
    cb(null, `${fileId}.${ext}`);
  },
});

const upload = multer({
  storage: diskStorage,
});

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      console.log(req.file);

      const title = req.body.title;
      const description = req.body.description;

      const filename = req.file?.filename;

      const fileBuffer = await fs.readFile(
        path.join(__dirname, `../../public/uploads/images/${filename}`)
      );
      // Convert the file buffer to base64
      const fileBase64Encoded = fileBuffer.toString("base64");
      console.log("File encoded into base64");

      // Serialize and prepare the data to write into json
      const data = {
        id: crypto.randomUUID(),
        title,
        description,
        fileBase64Encoded,
        fileExt: filename?.split(".")[1],
      };

      const uploadDataBuffer = await fs.readFile(
        path.join(__dirname, `../../data/UploadData.json`)
      );

      // Parse the buffer
      const parsedData: any[] = JSON.parse(uploadDataBuffer.toString());

      // Push the data into json
      parsedData.push(data);

      // Write the file
      await fs.writeFile(
        path.join(__dirname, `../../data/UploadData.json`),
        JSON.stringify(parsedData)
      );
      console.log("Data written to JSON file");

      // Delete the file from uploads folder
      console.log("Deleting the original file in uploads dir");
      await fs.unlink(path.join(__dirname, `../../public/uploads/images/${filename}`));
      console.log("File deleted");

      return res.status(200).json({ message: "Success!" });
    } catch (err: any) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  }
);

export default router;
