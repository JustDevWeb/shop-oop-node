let containers = {
  products: ".featured-content",
};

const apis = {
  products: "/api/products/",
  cartProducts: "/api/cart/",
  addProd: "/api/cart/add",
  updateProd: "/api/cart/update",
  deleteProd: "/api/cart/delete",
  changeQuant: "/api/cart/change",
  resetCart: "/api/cart/reset",
  createOrder: "/api/cart/createorder",
};

class List {
  constructor(url, container) {
    this.container = container;
    this.url = url;
    this.goods = [];
    this.getJson().then((data) => this.handleData(data));
    // this._init();
  }
  async getJson(url = this.url) {
    try {
      const result = await fetch(url);
      return await result.json();
    } catch (error) {
      return console.log(error);
    }
  }

  async postJson(url, data) {
    try {
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await result.json();
    } catch (err) {
      console.log('Error: ', err.message);
    }
  }

  async putJson(url, data) {
    try {
      const result = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await result.json();
    } catch (err) {
      console.log(err);
    }
  }

  async deleteJson(url, data) {
    try {
      const result = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await result.json();
    } catch (err) {
      console.log(err);
    }
  }

  handleData(data) {
    this.goods = data;
    this.render();
  }
  render() {
    const block = document.querySelector(this.container);
    block.innerHTML = "";
    for (let product of this.goods) {
      const productObj = new list[this.constructor.name](product);
      block.insertAdjacentHTML("beforeend", productObj.render());
    }

    this._init();
  }

  _init() {
    return false;
  }
}

// Items

// Template of item for the main page products

class Item {
  constructor(el) {
    this.id = el.id;
    this.name = el.name;
    this.description = el.description;
    this.price = el.price;
    this.imgPath = el.img;
  }

  render() {
    return `<div data-id="${this.id}" class="featured-content__card">
            <div class="card-content">
                <div class="img-wrapper">
                    <img src="${this.imgPath}" title="${this.name}" alt="${this.name}">

                    <div class="card-layout">
                        <button class="card-layout__btn"> 
                            <p class="btn-text" data-id="${this.id}" data-name="${this.name}" data-price="${this.price}" data-img="${this.imgPath}" >Add to Cart</p>
                        </button>
                </div>	
                    
                </div>						
            
            
                <div class="card-content__info">
                    <h4>${this.name}</h4>
                    <p>${this.description}</p>
                    <span class="colored-title">$${this.price}</span>
                </div>

            </div>
                
        </div>`;
  }
}

// Template of item for the cart page.

class CartItem extends Item {
  constructor(el) {
    super(el);
    this.quantity = el.quantity;
  }

  render() {
    return `<div data-id="${this.id}" class="cart-items__item">
    <img class="cart-item__img" src="${this.imgPath}">
    <div class="cart-item__info">                     
            <ul class="info-list">
            <li class="info-list__item info-title"><h4>${this.name}</h4></li>
            <li class="info-list__item">Price: <span class="colored-title">$${this.price}</span></li>
            <li class="info-list__item">Color: Red</li>
            <li class="info-list__item">Size: XL</li>
            <li class="info-list__item quantity-info">Quantity:<input data-id="${this.id}" class="quantity-info__input" min="1" type="number" value="${this.quantity}"></li>
            
        </ul>
    </div>
    <div class="delete-item__btn" data-id="${this.id}">
          <img src="./img/svgicons/cross-close.svg" alt="close-icon">
    </div>
  </div>`;
  }
}

// Obj for List class for render method in 86 str. to render right item.

const list = {
  ProductsList: Item,
  Cart: CartItem,
};

// End items

// Class for the main page functionality.

class ProductsList extends List {
  constructor(cart, url = apis.products, container = containers.products) {
    super(url, container);
    this.filtered = [];
    this.cart = cart;
  }

  filter(value) {
    const regexp = new RegExp(value, "i");
    this.filtered = this.goods.filter((product) => regexp.test(product.name));
    this.goods.forEach((el) => {
      const block = document.querySelector(
        `.featured-content__card[data-id="${el.id}"]`
      );
      if (!this.filtered.includes(el)) {
        block.classList.add("invisible");
      } else {
        block.classList.remove("invisible");
      }
    });
  }

  _init() {
    const filter = document.querySelector("#filter");
    const filterLink = document.querySelector(".item-filter__link");

    document.querySelector(this.container).addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-text")) {
        this.cart.addProduct(e.target);
      }
    });

    filterLink.addEventListener("click", () => {
      filter.parentNode.classList.toggle("visible");
    });

    filter.addEventListener("input", (event) => {
      this.filter(event.target.value);
    });
  }
}

// Class for add goods to the cart and display to the cart counter.

class ProductsToCart extends List {
  constructor(url = apis.cartProducts, container = ".item-cart__counter") {
    super(url, container);
  }

  //Add products to cart

  addProduct(element) {
    let itemToAdd = {
      id: element.dataset["id"],
      name: element.dataset["name"],
      price: element.dataset["price"],
      img: element.dataset["img"],
      quantity: 1,
    };

    if (this.goods.contents.find((el) => +el.id === +itemToAdd.id)) {
      this.putJson(apis.updateProd, itemToAdd).then((data) =>
        this.handleData(data)
      );
    } else {
      this.postJson(apis.addProd, itemToAdd).then((data) =>
        this.handleData(data)
      );
    }
  }

  render() {
    let cartCounterBox = document.querySelector(this.container);
    if (this.goods.countGoods > 0) {
      if (!cartCounterBox.classList.contains("active-counter")) {
        cartCounterBox.classList.add("active-counter");
      }
    } else if (this.goods.countGoods <= 0) {
      if (cartCounterBox.classList.contains("active-counter")) {
        cartCounterBox.classList.remove("active-counter");
      }
    }
    cartCounterBox.textContent = this.goods.countGoods;
  }
}

// Class for the cart page functionality.

class Cart extends ProductsToCart {
  constructor(url = apis.cartProducts, container = ".cart-items") {
    super(url, container);
    this.focusedInputs = [];
    this.inputs;
    this.order;
  }

  deleteProduct(element) {
    console.log(element);
    let itemToDelete = {
      id: element.dataset["id"],
    };

    this.deleteJson(apis.deleteProd, itemToDelete).then((data) =>
      this.handleData(data)
    );
  }

  resetCart() {
    this.getJson(apis.resetCart).then((data) => this.handleData(data));
  }

  changeQuantity(value, id) {
    let changeItem = {
      id: id,
      quantity: value,
    };

    this.putJson(apis.changeQuant, changeItem).then((data) =>
      this.handleData(data)
    );
  }

  createOrder(order) {
    // Create an order and render the details.

    this.postJson(apis.createOrder, order);

    const cartDiv = document.querySelector(".cart");

    const renderOrder = `<div class="order">
    <ul class="order-list">
    <li>Order № <b>${this.order.id}</b></li>
    <li>Total quantity of goods:<b> ${this.order.countGoods}</b></li>
    <li>Goods : ${this.order.contents
      .map(
        (item, index) =>
          `
      <p>${index + 1}. SKU: ${item.id} , Name: ${item.name}, Price: ${
            item.price
          }, Quantity: ${item.quantity} </p>     
      `
      )
      .join("")}</li>
    <li>Total amount: <b>${this.order.totalSum}$</b></li>  
    <li>Adress for shipping: <p><b>${this.order.shippingAdress.country}, ${this.order.shippingAdress.state}, ${this.order.shippingAdress.postcode}</b></p>
    </li>
    </ul>
    <a class="order-btn" href="/">CONTINUE SHOPPING</a>
    </div>`;

    cartDiv.innerHTML = renderOrder;
    
    document.querySelector('.order').scrollIntoView();      

    // reset cart

    this.getJson(apis.resetCart);
  }

  render() {
    const cartCounterBox = document.querySelector(".item-cart__counter");
    const block = document.querySelector(this.container);
    const subPrice = document.querySelector(".subtotal");
    const grandTotal = document.querySelector(".grandtotal");

    //Remove counter in cart page

    if (cartCounterBox.classList.contains("active-counter")) {
      cartCounterBox.classList.remove("active-counter");
    }

    block.innerHTML = "";

    //Render products

    if(this.goods.contents.length){
      for (let product of this.goods.contents) {
        const productObj = new list[this.constructor.name](product);
        block.insertAdjacentHTML("beforeend", productObj.render());
      }
  
      subPrice.textContent = `$${this.goods.totalSum}`;
      grandTotal.textContent = `$${this.goods.totalSum}`;
  
      this._init();

    }else{
      const emptyCart = `<div class="empty-cart"><p>Cart is empty :(</p></div>`;
      block.insertAdjacentHTML('beforeend',emptyCart);
      console.log('empty');
      subPrice.textContent = `$${this.goods.totalSum}`;
      grandTotal.textContent = `$${this.goods.totalSum}`;
  
      this._init();
    }

    
  }

  _init() {
    this.inputs = document.querySelectorAll(".quantity-info__input");
    const closeBtns = document.querySelectorAll(".delete-item__btn");
    const clearBtn = document.querySelector(".clear-btn");
    const contBtn = document.querySelector(".continue-btn");
    const checkoutBtn = document.querySelector(".checkout-btn");

    // Validate the form and create the order .

    checkoutBtn.addEventListener("click", () => {
      const cartForm = "cart-form";
      let validateForm = new Validator(cartForm);
      if (validateForm.valid) {
        this.order = Object.assign({}, this.goods);
        this.order["id"] = new Date().valueOf().toString();
        this.order["shippingAdress"] = validateForm.data;
        console.log(this.order);
        console.log(this.goods);
        this.createOrder(this.order);
      }
    });

    // Add listeners to card inputs

    this.inputs.forEach((item) => {
      // set and save Focus

      if (item.dataset.id == this.focusedInput) {
        item.focus();
        console.log(this.focusedInput);
      }

      // Set current product focus to inputs of the cart's cards

      item.addEventListener("click", (e) => {
        if (this.focusedInputs.length > 1) {
          this.focusedInputs[0].blur();
          this.focusedInputs.splice(0, 1);
        } else {
          e.target.focus();
          this.focusedInputs.push(e.target);
        }

        if (e.target.dataset.id != this.focusedInput) {
          e.target.focus();
          this.inputs.forEach((input) => {
            if (input.dataset.id == this.focusedInput) {
              input.blur();
            }
          });

          this.focusedInput = e.target.dataset.id;
          console.log(this.focusedInput);
        }
      });

      // Set input listener to update quantity

      item.addEventListener("input", (e) => {
        let itemId = e.target.closest(".cart-items__item").dataset.id;
        if (
          +e.target.value !== 0 &&
          e.target.value != "" &&
          !isNaN(e.target.value)
        ) {
          this.changeQuantity(e.target.value, itemId);
        } else {
          return false;
        }
      });
    });

    // End inputs

    closeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.deleteProduct(e.target.parentNode);
      });
    });

    clearBtn.addEventListener("click", () => {
      this.resetCart();
    });

    contBtn.addEventListener("click", () => {
      document.location = "/";
    });
  }
}

// Forms validator.

class Validator {
  constructor(form) {
    this.patterns = {
      country: /^[a-zа-яё]+$/i,
      state: /^[a-zа-яё]+$/i,
      postcode: /^[0-9]+$/,
    };
    this.errors = {
      country: "Field should contain only letters",
      state: "Field should contain only letters",
      postcode: "Field should contain only numbers",
    };
    this.errorClass = "error-msg";
    this.form = form;
    this.valid = false;
    this.data = {};
    this._validateForm();
  }

  _validateForm() {   
    let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)];
    if(errors.length > 0){
      for (let error of errors){
        error.remove();
       } 
    }
    
    let formFields = [
      ...document.getElementById(this.form).getElementsByTagName("input"),
    ];
    for (let field of formFields) {
      this._validate(field);
    }
    if (
      ![...document.getElementById(this.form).querySelectorAll(".invalid")]
        .length
    ) {
      this.valid = true;
    }
  }
  _validate(field) {
    if (this.patterns[field.name]) {
      if (!this.patterns[field.name].test(field.value)) {
        field.classList.add("invalid");
        this._addErrorMsg(field);
        this._watchField(field);
      } else {
        this.data[field.name] = field.value;
      }
    }
  }
  _addErrorMsg(field) {
    let error = `<div class="${this.errorClass}">${
      this.errors[field.name]
    }</div> `;
    field.parentNode.insertAdjacentHTML("beforeend", error);
  }
  _watchField(field) {
    field.addEventListener("input", () => {
      let error = field.parentNode.querySelector(`.${this.errorClass}`);
      if (this.patterns[field.name].test(field.value)) {       
        field.classList.remove("invalid");
        field.classList.add("valid");
        if (error) {
          error.remove();
        }
      } else {
        field.classList.remove("valid");
        field.classList.add("invalid");
        if (!error) {
          this._addErrorMsg(field);
        }
      }
    });
  }
}

// End Cart page js

const body = document.querySelector("body");

if (body.dataset.viewModel === "main-page") {
  const cartProducts = new ProductsToCart();
  const products = new ProductsList(cartProducts);
} else {
  const cart = new Cart();
}
