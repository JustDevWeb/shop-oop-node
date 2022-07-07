import * as fs from "fs";
import path from "path";

const __dirname = path.resolve();
const pathCartProducts = path.join(
  __dirname,
  "db",
  "cartProducts.json"
);

export class cartHandler {
  constructor(path, req, res, action) {
    this.cart = [];
    this.action = action;
    this.orders;
    this.data = req.body;
    this.path = path;
    this.req = req;
    this.res = res;
  }

  // Read cartproducts.json file

  readFile() {
    fs.readFile(this.path, "utf-8", (err, data) => {
      if (!err) {
        this.cart = JSON.parse(data);

        this.res.send(data);
      } else {
        this.res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
      }
    });
  }

  // Write the data to cartproducts.json file

  writeFile() {
    fs.readFile(pathCartProducts, "utf-8", (err, data) => {
      if (!err) {
        this.cart = JSON.parse(data);
        this[this.action]();
        fs.writeFile(
          pathCartProducts,
          JSON.stringify(this.cart, null, 4),
          (err) => {
            if (!err) {
              this.res.send(JSON.stringify(this.cart, null, 4));
            } else {
              this.res.sendStatus(404, JSON.stringify({ text: err }));
            }
          }
        );
      } else {
        res.sendStatus(404, JSON.stringify({ text: err }));
      }
    });
  }

  // Add product to the cart

  add() {
    this.cart.contents.push(this.data);
    this.modifyCart();
  }

  // Update number of the product when add product to the cart.

  update() {
    let updateItem = this.cart.contents.find((el) => +el.id === +this.data.id);
    updateItem.quantity += 1;
    this.modifyCart();
  }

  // Delete product

  delete() {
    let deleteItem = this.cart.contents.find((el) => +el.id === +this.data.id);
    this.cart.contents.splice(this.cart.contents.indexOf(deleteItem), 1);
    this.modifyCart();
  }

  // Reset cart

  resetCart() {
    this.cart.contents.length = 0;
    this.modifyCart();
  }

  //Set number of the good in products of the cart

  setCount() {
    console.log(this.data.quantity);
    let changeItem = this.cart.contents.find((el) => +el.id === +this.data.id);
    changeItem.quantity = +this.data.quantity;
    this.modifyCart();
  }

  //Create the order file

  order() {    
    const orderPath = path.join(__dirname, "server", "db", "orders.json");

    fs.readFile(orderPath,"utf-8",(err,data)=>{
      if(!err){
        this.orders = JSON.parse(data);
        this.orders.allOrders.push(this.data);
        fs.writeFile(orderPath, JSON.stringify(this.orders, null, 4), (err) => {
          if (!err) {     
            this.res.status(200).send(JSON.stringify({text: 'OK'}));      
            // this.res.sendStatus(200,JSON.stringify({text: 'OK'}));
          } else {
            this.res.sendStatus(404, JSON.stringify({ text: err }));
            console.log("not work");
          }
        });
      }else {
        res.sendStatus(404, JSON.stringify({ text: err }));
      }
    })

    
  }

  // Count and update total sum and number of goods

  modifyCart() {
    this.cart.countGoods = 0;
    this.cart.totalSum = 0;
    if (this.cart.contents.length > 0) {
      this.cart.contents.forEach((elem) => {
        this.cart.countGoods += elem.quantity;
        this.cart.totalSum += +elem.price * elem.quantity;
      });
    }
  }
}

export function readFile(path, req, res) {
  fs.readFile(path, "utf-8", (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
    }
  });
}
