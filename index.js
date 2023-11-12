GetAllProducts();
let CartData={};


function AddToCart(){
 document.getElementById("Add-To-Cart").innerHTML
}

function GetCartItems(){
  axios.get('https://fakestoreapi.com/carts/user/2')
    .then(function (response) {
      console.log(response.data);

      let Categories = response.data;
      const categoryList = document.getElementById("Catagory-List");

      categoryList.innerHTML = '';

      for (Category of Categories) {
        let content = `<li><a class="dropdown-item" href="#" data-category="${Category}">${Category}</a></li>`;

        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = content;
        const categoryLink = categoryItem.querySelector('a');
        
        categoryLink.addEventListener('click', function (e) {
          e.stopPropagation();
          const categoryName = categoryLink.getAttribute('data-category');
          GetSpecificCategory(categoryName);
        });

        categoryList.appendChild(categoryItem);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}
function GetALLCategories(event) {
  axios.get('https://fakestoreapi.com/products/categories')
    .then(function (response) {
      console.log(response.data);

      let Categories = response.data;
      const categoryList = document.getElementById("Catagory-List");

      categoryList.innerHTML = '';

      for (Category of Categories) {
        let content = `<li><a class="dropdown-item" href="#" data-category="${Category}">${Category}</a></li>`;

        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = content;
        const categoryLink = categoryItem.querySelector('a');
        
        categoryLink.addEventListener('click', function (e) {
          e.stopPropagation();
          const categoryName = categoryLink.getAttribute('data-category');
          GetSpecificCategory(categoryName);
        });

        categoryList.appendChild(categoryItem);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
    });

  event.preventDefault();
  event.stopPropagation();
}
function DeleteCartBtn(productId) {
  const cardToRemove = document.querySelector(`.Card-${productId}`);

  if (cardToRemove) {
    cardToRemove.remove();
    delete cartItems[productId];
  } 
  else {
    console.log("Product card not found in the cart.");
  }
}
function GetAllProducts(){
  let ResultsContainer = document.getElementsByClassName("Cards-Container")[0];
  axios.get('https://fakestoreapi.com/products')
    .then(function (response) {
      let products = response.data;
      for(product of products){
          let content = `
          <div class="card " style="width: 19rem; margin-left:20px;margin-bottom:20px;height:600px;display:flex;justify-content:center;flex-direction:column;">
              <img style="width: 100%;height:400px" src="${product.image}" alt="">
              <span id="Title-${product.id}" style="padding:5px;font-weight: bold; font-size:18px;margin-top:20px">${product.title}</span>
              <span style="padding:5px;font-weight: bolder; font-size:20px;margin-bottom:20px" id="Price">${product.price}$</span>
              <button style="margin-top: auto;" type="button" data-product-id="${product.id}" class="btn btn-primary">Add To Cart</button>
          </div>
          `;
          ResultsContainer.innerHTML += content;
      }
      handleAddToCartClick();
    })
    .catch(function (error) {
      console.log(error);
    })
}
let cartItems = {};

let ProductsContainer = document.getElementById("Items");

function addProductToCart(productId) {
  console.log('Adding product to cart. Product ID:', productId);

  // Find the quantity input element
  const quantityInput = document.querySelector(`#quantity-${productId}`);

  if (cartItems[productId]) {
    // Product already exists in the cart
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += 1;
    quantityInput.value = currentQuantity;

    // Update the quantity and total price in the cartItems object
    cartItems[productId].quantity = currentQuantity;
    cartItems[productId].totalPrice = cartItems[productId].price * currentQuantity;

    // Recalculate the total price for all items in the cart
    calculateTotalPrice();
  } else {
    // Product not in the cart, retrieve its details
    axios.get('https://fakestoreapi.com/products/' + productId)
      .then(function(response) {
        let product = response.data;
        let content = `
              <div class="card mb-3 Card-${product.id}" style="max-width: 540px;">
                  <div class="row g-0">
                      <div class="col-md-4">
                          <img src="${product.image}" class="img-fluid rounded-start" alt="...">
                      </div>
                      <div class="col-md-8">
                          <div class="card-body">
                              <h5 class="Title-${product.id}">${product.title}</h5>
                              <div style="font-weight: bold;color:red;font-weight:bolder">${product.price}$</div>
                              <p class="card-text"></p>
                              <div class="d-flex flex-column align-items-end">
                                  <div class="item-quantity mb-2">
                                      <label for="quantity">Quantity:</label>
                                      <input type="number" id="quantity-${product.id}" value="1" min="1" class="form-control" style="width: 70px;">
                                  </div>
                                  <button id="DeleteButton" class="btn btn-dark" onclick="DeleteCartBtn(${product.id})" style="height:30px;font-size:10px" type="button">X</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
        ProductsContainer.innerHTML += content;

        // Add the product to the cartItems object
        cartItems[productId] = product;
        // Initialize the total price with the product's price
        cartItems[productId].totalPrice = product.price;

        // Calculate and update the total price in the finalPriceDiv
        calculateTotalPrice();
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  const offcanvasElement = document.getElementById('offcanvasExample');
  const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
  offcanvas.show();
}



function calculateTotalPrice() {
  let totalPrice = 0;

  for (const productId in cartItems) {
    totalPrice += cartItems[productId].totalPrice || 0; // Calculate the total price
  }

  const totalPriceDiv = document.getElementById('finalPriceDiv');
  totalPriceDiv.textContent = `Final Price: $${totalPrice.toFixed(2)}`; // Update the content of the div with the total price
}

function handleAddToCartClick() {
  const ResultsContainer = document.getElementsByClassName("Cards-Container")[0];
  const buttons = ResultsContainer.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = button.getAttribute('data-product-id');
      addProductToCart(productId);
    });
  });
}



function GetSpecificCategory(categoryName) {
  let ResultsContainer = document.getElementsByClassName("Cards-Container")[0];
  axios.get(`https://fakestoreapi.com/products/category/${categoryName}`)
    .then(function (response) {
      let products = response.data;
      ResultsContainer.innerHTML = ''; 

      for (product of products) {
        let content = `
          <div class="card" style="width: 19rem; margin-left:20px;margin-bottom:20px;height:600px;display:flex;justify-content:center;flex-direction:column;">
              <img style="width: 100%;height:400px" src="${product.image}" alt="">
              <span id="Title" style="padding:5px;font-weight: bold; font-size:18px;margin-top:20px">${product.title}</span>
              <span style="padding:5px;font-weight: bolder; font-size:20px;margin-bottom:20px" id="Price">${product.price}$</span>
              <button style="margin-top: auto;" type="button" data-product-id="${product.id}" class="btn btn-primary">Add To Cart</button>
          </div>
          `;
        ResultsContainer.innerHTML += content;
      }
      handleAddToCartClick();
      const categoryList = document.getElementById("Catagory-List");
      categoryList.classList.remove("show");
    })
    .catch(function (error) {
      console.log(error);
    });
}
function SetupUI(){
  let token = localStorage.getItem("token");
  let loginDiv=document.getElementById("Login-Div")
  let LogoutDiv=document.getElementById("Logout-Div")
  let userData = JSON.parse(localStorage.getItem("current_user"));
  let ProfileBtn=document.getElementById('Profile-Btn');
  
  if(token==null){
      LogoutDiv.classList.add("d-none")
      postButton.classList.add("d-none")
      ProfileBtn.classList.add("d-none")

  }
  else{
      loginDiv.classList.add("d-none")
      let userData = JSON.parse(localStorage.getItem("current_user"));
      document.getElementById("NavUName").innerHTML=`<span id="NavUImg" class="m-2" style="font-size: large;font-weight: 500;">${userData.username}</span>`;
      if(userData.profile_image==null){
          document.getElementById("NavUImg").innerHTML=img;
      }else{
          document.getElementById("NavUImg").innerHTML=`<img class="rounded-circle border border-secondary" src=${UPhoto(userData)} alt="" style="width: 50px;">`;
          console.log(userData.profile_image)
      }
      
  }
  
}
 


  

console.log("Cart"+cartItems)


  
 