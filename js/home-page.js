const USERS_API = "http://localhost:8000/users"; //подключение к базе
let user = JSON.parse(localStorage.getItem("user"));
let navBarDiv = document.querySelector("#navBarUl");
function addDropDownMenu() {
  navBarDiv.innerHTML += `<li class="nav-item dropdown">
                            <a
                              class="nav-link dropdown-toggle text-white"
                              href="#"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false">
                              ${user.user}
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="#" id="additem-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                  Add item
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#" id="settings-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                  Settings
                                </a>
                              </li>
                              <li>
                                <hr class="dropdown-divider" />
                              </li>
                              <li>
                                <a class="dropdown-item" href="#" id="logout-btn">
                                  Logout
                                </a>
                              </li>
                            </ul>
                          </li>`;
}
checkLoginLogoutStatus();
addDropDownMenu();
let logOutBtn = document.querySelector("#logout-btn");
let settingsBtn = document.querySelector("#settings-btn");
let addItemBtn = document.querySelector("#additem-btn");

function checkLoginLogoutStatus() {
  let user = localStorage.getItem("user");
  if (!user) {
    setTimeout(function () {
      location.href = "./pages/LoginRegistration-page.html";
    }, 1000);
  }
}
logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  checkLoginLogoutStatus();
});

//! Проверка на админа

function checkUserForProductCreate() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) return user.isAdmin;
  return false;
}

function showAddItemBtn() {
  if (!checkUserForProductCreate()) {
    addItemBtn.setAttribute("style", "display: none !important;");
  } else {
    addItemBtn.setAttribute("style", "display: block !important;");
  }
}
showAddItemBtn();

let settingsBlock = document.querySelector("#settings-block");
let addItemBlock = document.querySelector("#addItem-block");

settingsBtn.addEventListener("click", () => {
  settingsBlock.style.display = "block";
  addItemBlock.style.display = "none";
});
addItemBtn.addEventListener("click", () => {
  settingsBlock.style.display = "none";
  addItemBlock.style.display = "block";
});

let productTitle = document.querySelector("#product-title");
let productPrice = document.querySelector("#product-price");
let productDesc = document.querySelector("#product-desc");
let productImage = document.querySelector("#product-image");
let productCategory = document.querySelector("#product-category");

const PRODUCTS_API = "http://localhost:8000/products";

async function createProduct() {
  if (
    !productTitle.value.trim() ||
    !productPrice.value.trim() ||
    !productDesc.value.trim() ||
    !productImage.value.trim() ||
    !productCategory.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }

  let productObj = {
    title: productTitle.value,
    price: productPrice.value,
    desc: productDesc.value,
    image: productImage.value,
    category: productCategory.value,
  };

  await fetch(PRODUCTS_API, {
    method: "POST",
    body: JSON.stringify(productObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  productTitle.value = "";
  productPrice.value = "";
  productDesc.value = "";
  productImage.value = "";
  productCategory.value = "";

  render();
}

let addProductBtn = document.querySelector("#add-product-btn");
addProductBtn.addEventListener("click", createProduct);

let currentPage = 1;
let search = "";

async function render() {
  let productsList = document.querySelector("#products-list");
  productsList.innerHTML = "";
  let requestAPI = `${PRODUCTS_API}?q=${search}&_page=${currentPage}&_limit=3`;
  let res = await fetch(requestAPI);
  let data = await res.json();

  data.forEach(item => {
    productsList.innerHTML += `
      <div class="card m-5 rounded-0" style="width: 18rem;">
          <img src=${item.image} class="card-img-top" alt="..." height="150">
          <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">${item.desc}</p>
              <p class="card-text">${item.price}</p>
              <p class="card-text">${item.category}</p>
              ${
                checkUserForProductCreate()
                  ? `<a href="#" class="btn btn-danger btn-delete" id="${item.id}">DELETE</a>
              <a href="#" class="btn btn-success btn-edit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">EDIT</a>`
                  : ""
              }
          </div>
      </div>
      `;
  });

  if (data.length === 0) return;
  addDeleteEvent();
  addEditEvent();
}
render();
async function deleteProduct(e) {
  let productId = e.target.id;

  await fetch(`${PRODUCTS_API}/${productId}`, {
    method: "DELETE",
  });

  render();
}

function addDeleteEvent() {
  let deleteProductBtn = document.querySelectorAll(".btn-delete");
  deleteProductBtn.forEach(item => {
    item.addEventListener("click", deleteProduct);
  });
}

// update
let saveChangesBtn = document.querySelector(".save-product-btn");

function checkCreateAndSaveBtn() {
  if (saveChangesBtn.id) {
    addProductBtn.setAttribute("style", "display: none;");
    saveChangesBtn.setAttribute("style", "display: block;");
    settingsBlock.style.display = "none";
    addItemBlock.style.display = "nlock";
  } else {
    addProductBtn.setAttribute("style", "display: block;");
    saveChangesBtn.setAttribute("style", "display: none;");
    settingsBlock.style.display = "none";
    addItemBlock.style.display = "block";
  }
}
checkCreateAndSaveBtn();
async function addProductDataToForm(e) {
  let productId = e.target.id;
  let res = await fetch(`${PRODUCTS_API}/${productId}`);
  let productObj = await res.json();

  productTitle.value = productObj.title;
  productPrice.value = productObj.price;
  productDesc.value = productObj.desc;
  productImage.value = productObj.image;
  productCategory.value = productObj.category;

  saveChangesBtn.setAttribute("id", productObj.id);

  checkCreateAndSaveBtn();
}
function addEditEvent() {
  let btnEditProduct = document.querySelectorAll(".btn-edit");
  btnEditProduct.forEach(item => {
    item.addEventListener("click", addProductDataToForm);
  });
}
async function saveChanges(e) {
  let updatedProductObj = {
    id: e.target.id,
    title: productTitle.value,
    price: productPrice.value,
    desc: productDesc.value,
    image: productImage.value,
    category: productCategory.value,
  };

  await fetch(`${PRODUCTS_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedProductObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  productTitle.value = "";
  productPrice.value = "";
  productDesc.value = "";
  productImage.value = "";
  productCategory.value = "";

  saveChangesBtn.removeAttribute("id");

  checkCreateAndSaveBtn();
  let btnCloseModal = document.querySelector("#btn-close-modal");
  btnCloseModal.click();

  render();
}

saveChangesBtn.addEventListener("click", saveChanges);

// search
let searchInp = document.querySelector("#search-inp");
searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});

let nextPage = document.querySelector("#next-page");
let prevPage = document.querySelector("#prev-page");
async function checkPages() {
  let res = await fetch(PRODUCTS_API);
  let data = await res.json();
  let pages = Math.ceil(data.length / 3);

  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    prevPage.style.display = "block";
    nextPage.style.display = "none";
  } else {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
  }
}
checkPages();

nextPage.addEventListener("click", () => {
  currentPage++;
  render();
  checkPages();
});

prevPage.addEventListener("click", () => {
  currentPage--;
  render();
  checkPages();
});

// home
let homeBtn = document.querySelector("#home-btn");
homeBtn.addEventListener("click", () => {
  currentPage = 1;
  category = "";
  search = "";
  render();
  checkPages();
});
