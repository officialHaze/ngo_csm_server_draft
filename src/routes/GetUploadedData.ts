import express, { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataBuffer = await fs.readFile(path.join(__dirname, `../../data/UploadData.json`));

    const parsedData = JSON.parse(dataBuffer.toString());

    return res.status(200).json({ message: "Success!", data: parsedData });
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

export default router;
