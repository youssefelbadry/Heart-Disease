import app from "../src/index";
import { Request, Response } from "express";

export default function handler(req: Request, res: Response) {
  const allowedOrigin = process.env.AI_URL;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return app(req, res);
}
