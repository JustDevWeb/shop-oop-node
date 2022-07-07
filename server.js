import express from "express";
import * as fs from "fs";
import router from "./cartRouter.js";
import path from "path";

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "dist")));
app.use("/api/cart/", router);

app.get("/api/products/", (req, res) => {
  fs.readFile(
    path.resolve(__dirname, "db", "products.json"),
    "utf-8",
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        res.send(console.log("error in get products"));
      }
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Communication with server is established");
});
