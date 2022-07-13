import * as express from "express";
import { cartHandler } from "./cartHandler.js";
import path from "path";

const __dirname = path.resolve();
const router = express.Router();
const pathCartProducts = path.join(
  __dirname, 
  "db",
  "cartProducts.json"
);

router.get("/", (req, res) => {
  const cart = new cartHandler(pathCartProducts, req, res);
  cart.readFile();
});

router.get("/reset", (req, res) => {
  const cart = new cartHandler(pathCartProducts, req, res, "resetCart");
  cart.writeFile();
});

router.put("/change", (req, res) => {
  const cart = new cartHandler(pathCartProducts, req, res, "setCount");
  cart.writeFile();
});

router.put("/update", (req, res) => {
  const cart = new cartHandler(pathCartProducts, req, res, "update");
  cart.writeFile();
});

router.post("/add", (req, res) => {
  const cart = new cartHandler(pathCartProducts, req, res, "add");
  cart.writeFile();
});

router.post("/createorder", (req, res) => {
  const cart = new cartHandler(pathCartProducts, req, res);
  cart.order();
});

router.delete("/delete", (req, res) => {
  const cart = new cartHandler(pathCartProducts, req, res, "delete");
  cart.writeFile();
});

export default router;
