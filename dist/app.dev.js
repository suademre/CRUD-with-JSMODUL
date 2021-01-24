"use strict";

// Storage Controller
var StorageController = function () {
  return {
    storeProduct: function storeProduct(product) {
      var products;

      if (localStorage.getItem('products') === null) {
        products = [];
        products.push(product);
      } else {
        products = JSON.parse(localStorage.getItem('products'));
        products.push(product);
      }

      localStorage.setItem('products', JSON.stringify(products));
    },
    getProducts: function getProducts() {
      var products;

      if (localStorage.getItem('products') === null) {
        products = [];
      } else {
        products = JSON.parse(localStorage.getItem('products'));
      }

      return products;
    },
    updateProduct: function updateProduct(product) {
      var products = JSON.parse(localStorage.getItem('products'));
      products.forEach(function (prd, index) {
        if (product.id == prd.id) {
          products.splice(index, 1, product);
        }
      });
      localStorage.setItem('products', JSON.stringify(products));
    },
    deleteProduct: function deleteProduct(id) {
      var products = JSON.parse(localStorage.getItem('products'));
      products.forEach(function (prd, index) {
        if (id == prd.id) {
          products.splice(index, 1);
        }
      });
      localStorage.setItem('products', JSON.stringify(products));
    }
  };
}(); //Product Controller


var ProductController = function () {
  //private
  var Product = function Product(id, namee, price) {
    this.id = id;
    this.namee = namee;
    this.price = price;
  };

  var data = {
    products: StorageController.getProducts(),
    selectedProduct: null,
    totalPrice: 0
  }; //public

  return {
    getProducts: function getProducts() {
      return data.products;
    },
    getData: function getData() {
      return data;
    },
    getProductById: function getProductById(id) {
      var product = null;
      data.products.forEach(function (prd) {
        if (prd.id == id) {
          product = prd;
        }
      });
      return product;
    },
    setCurrentProduct: function setCurrentProduct(product) {
      data.selectedProduct = product;
    },
    getCurrentProduct: function getCurrentProduct() {
      return data.selectedProduct;
    },
    addProduct: function addProduct(namee, price) {
      var id;

      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }

      var newProduct = new Product(id, namee, parseFloat(price));
      data.products.push(newProduct);
      console.log(newProduct);
      return newProduct;
    },
    updateProduct: function updateProduct(namee, price) {
      var product = null;
      data.products.forEach(function (prd) {
        if (prd.id == data.selectedProduct.id) {
          prd.namee = namee;
          prd.price = parseFloat(price);
          product = prd;
        }
      });
      return product;
    },
    deleteProduct: function deleteProduct(product) {
      data.products.forEach(function (prd, index) {
        if (prd.id == product.id) {
          data.products.splice(index, 1);
        }
      });
    },
    getTotal: function getTotal() {
      var total = 0;
      data.products.forEach(function (item) {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    }
  };
}(); //UI Controller


var UIController = function () {
  var Selectors = {
    productList: "#item-list",
    productListItems: "#item-list tr",
    addButton: ".addBtn",
    updateButton: ".updateBtn",
    deleteButton: ".deleteBtn",
    cancelButton: ".cancelBtn",
    productName: "#productName",
    productPrice: "#productPrice",
    productCard: "#productCard",
    totalTl: "#total-tl",
    totalDolar: "#total-dolar"
  };
  return {
    createProductList: function createProductList(products) {
      var html = "";
      products.forEach(function (prd) {
        html += "\n                    <tr>\n                        <td>".concat(prd.id, "</td>\n                        <td>").concat(prd.namee, "</td>\n                        <td>").concat(prd.price, " $</td>\n                        <td class=\"text-right\">\n                            \n                            <i class=\"far fa-edit edit-product\"></i>\n                        </td>\n                    </tr>\n                ");
      });
      document.querySelector(Selectors.productList).innerHTML = html;
    },
    getSelectors: function getSelectors() {
      return Selectors;
    },
    addProduct: function addProduct(prd) {
      document.querySelector(Selectors.productCard).style.display = 'block';
      var item = "\n                <tr>\n                    <td>".concat(prd.id, "</td>\n                    <td>").concat(prd.namee, "</td>\n                    <td>").concat(prd.price, " $</td>\n                    <td class=\"text-right\">\n                        <i class=\"far fa-edit edit-product\"></i>\n                    </td>\n                </tr>\n                ");
      document.querySelector(Selectors.productList).innerHTML += item;
    },
    updateProduct: function updateProduct(prd) {
      var updatedItem = null;
      var items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg-warning')) {
          item.children[1].textContent = prd.namee;
          item.children[2].textContent = prd.price + ' $';
          updatedItem = item;
        }
      });
      return updatedItem;
    },
    clearInputs: function clearInputs() {
      document.querySelector(Selectors.productName).value = '';
      document.querySelector(Selectors.productPrice).value = '';
    },
    clearWarnings: function clearWarnings() {
      var items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg-warning')) {
          item.classList.remove('bg-warning');
        }
      });
    },
    hideCard: function hideCard() {
      document.querySelector(Selectors.productCard).style.display = 'none';
    },
    showTotal: function showTotal(total) {
      document.querySelector(Selectors.totalDolar).textContent = total;
      document.querySelector(Selectors.totalTl).textContent = total * 7.44;
    },
    addProductToForm: function addProductToForm() {
      var selectedProduct = ProductController.getCurrentProduct();
      document.querySelector(Selectors.productName).value = selectedProduct.namee;
      document.querySelector(Selectors.productPrice).value = selectedProduct.price;
    },
    deleteProduct: function deleteProduct() {
      var items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg-warning')) {
          item.remove();
        }
      });
    },
    addingState: function addingState(item) {
      /*//if yerini anlamadim
      if(item){
          item.classList.remove('bg-warning');
      }
      */
      UIController.clearWarnings();
      UIController.clearInputs();
      document.querySelector(Selectors.addButton).style.display = 'inline';
      document.querySelector(Selectors.updateButton).style.display = 'none';
      document.querySelector(Selectors.deleteButton).style.display = 'none';
      document.querySelector(Selectors.cancelButton).style.display = 'none';
    },
    editState: function editState(tr) {
      /*
      // bu kodu hic anlamadim (neden bunu yazdik)
      const parent = tr.parentNode;
      console.log(parent);
        for (let i = 0; i < parent.children.length; i++) {
          parent.children[i].classList.remove('bg-warning');
      }
      //buraya kadar ama bu kodu sonrasinda sildik
      */
      tr.classList.add('bg-warning');
      document.querySelector(Selectors.addButton).style.display = 'none';
      document.querySelector(Selectors.updateButton).style.display = 'inline';
      document.querySelector(Selectors.deleteButton).style.display = 'inline';
      document.querySelector(Selectors.cancelButton).style.display = 'inline';
    }
  };
}(); //App Controller


var App = function (ProductCtrl, UICtrl, StorageCtrl) {
  var UISelectors = UICtrl.getSelectors(); //Load EventListeners

  var loadEventListeners = function loadEventListeners() {
    //add product event
    document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit); //edit product click

    document.querySelector(UISelectors.productList).addEventListener('click', productEditClick); //edit product submit

    document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit); //cancel button click

    document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate); //delete button click

    document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);
  };

  var productAddSubmit = function productAddSubmit(e) {
    var productName = document.querySelector(UISelectors.productName).value;
    var productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== '' && productPrice !== '') {
      //Add Product
      var newProduct = ProductCtrl.addProduct(productName, productPrice); //add item to List

      UICtrl.addProduct(newProduct); //add product to LS

      StorageCtrl.storeProduct(newProduct); //get total

      var total = ProductCtrl.getTotal(); //show total

      UICtrl.showTotal(total); //clear inputs

      UICtrl.clearInputs();
    }

    console.log(productName, productPrice);
    e.preventDefault();
  };

  var productEditClick = function productEditClick(e) {
    if (e.target.classList.contains('edit-product')) {
      var id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent; //get Selected Product

      var product = ProductCtrl.getProductById(id); //set current product

      ProductCtrl.setCurrentProduct(product);
      UICtrl.clearWarnings(); //add product to UI

      UICtrl.addProductToForm();
      UICtrl.editState(e.target.parentNode.parentNode);
    }

    e.preventDefault();
  };

  var editProductSubmit = function editProductSubmit(e) {
    var productName = document.querySelector(UISelectors.productName).value;
    var productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== '' && productPrice !== '') {
      //update product
      var updatedProduct = ProductCtrl.updateProduct(productName, productPrice); //update ui

      var item = UICtrl.updateProduct(updatedProduct); //get total

      var total = ProductCtrl.getTotal(); //show Total

      UICtrl.showTotal(total); //update storage

      StorageCtrl.updateProduct(updatedProduct);
      UICtrl.addingState();
    }

    e.preventDefault();
  };

  var cancelUpdate = function cancelUpdate(e) {
    UICtrl.addingState();
    UICtrl.clearWarnings();
    e.preventDefault();
  };

  var deleteProductSubmit = function deleteProductSubmit(e) {
    //get selected product
    var selectedProduct = ProductCtrl.getCurrentProduct(); //delete product

    ProductCtrl.deleteProduct(selectedProduct); //delete ui

    UICtrl.deleteProduct(); //get total

    var total = ProductCtrl.getTotal(); //show Total

    UICtrl.showTotal(total); //delete from storage

    StorageCtrl.deleteProduct(selectedProduct.id);
    UICtrl.addingState();

    if (total == 0) {
      UICtrl.hideCard();
    }

    e.preventDefault();
  };

  return {
    init: function init() {
      console.log('starting App...');
      UICtrl.addingState();
      var products = ProductCtrl.getProducts();

      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.createProductList(products);
      } //Load event Listener


      loadEventListeners();
    }
  };
}(ProductController, UIController, StorageController);

App.init();