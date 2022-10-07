//!ACCOUNT LOGIC
// show modal logic
//Подключения ко всем кнопкам
let loginBtn = document.querySelector(".login-btn");
let regBtn = document.querySelector(".reg-btn");
let loginBtnModal = document.querySelector("#loginUser-btn");
let regBtnModal = document.querySelector("#registerUser-btn");
let registerUserModalBlock = document.querySelector("#registerUser-block");
let loginUserModalBlock = document.querySelector("#loginUser-block");
let btnCloseModal = document.querySelector("#btn-close-modal");
let regWarnings = document.querySelector("#reg-warnings");
let logWarnings = document.querySelector("#log-warnings");

//Убирает инпуты регистрации или логина
regBtn.addEventListener("click", () => {
  registerUserModalBlock.setAttribute("style", "display: block !important!;");
  regBtnModal.setAttribute("style", "display: block;");
  loginUserModalBlock.setAttribute("style", "display: none !important;");
  loginBtnModal.setAttribute("style", "display: none;");
});
loginBtn.addEventListener("click", () => {
  registerUserModalBlock.setAttribute("style", "display: none !important;");
  regBtnModal.setAttribute("style", "display: none;");
  loginUserModalBlock.setAttribute("style", "display: block !important;");
  loginBtnModal.setAttribute("style", "display: block;");
});

//Очищает инпуты после закрытия
btnCloseModal.addEventListener("click", () => {
  regWarnings.innerHTML = "";
  usernameInp.value = "";
  ageInp.value = "";
  passwordInp.value = "";
  passwordConfirmInp.value = "";
  isAdminInp.checked = false;
});
// register logic
//! npx json-server -w db.json -p 8000 сервер JSON

const USERS_API = "http://localhost:8000/users"; //подключение к базе

// подключение к инпутам
let usernameInp = document.querySelector("#reg-username");
let ageInp = document.querySelector("#reg-age");
let passwordInp = document.querySelector("#reg-password");
let passwordConfirmInp = document.querySelector("#reg-passwordConfirm");
let isAdminInp = document.querySelector("#isAdmin");

//Проверка на наличие уникального логина
async function checkUniqueUserName(userName) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some(item => item.username === userName);
}

//функция регистрации
async function registerUser() {
  if (
    !usernameInp.value.trim() ||
    !ageInp.value.trim() ||
    !passwordInp.value.trim() ||
    !passwordConfirmInp.value.trim()
  ) {
    regWarnings.innerHTML += `<div class="alert alert-danger" role="alert">
    Some inputs are empty!
    </div>`;
    return;
  }
  let uniqueUsername = await checkUniqueUserName(usernameInp.value); //проверка на уникальное имя пользователя

  if (uniqueUsername) {
    regWarnings.innerHTML += `<div class="alert alert-danger" role="alert">
    User with this username already exists!
    </div>`;
    return;
  }

  if (passwordInp.value !== passwordConfirmInp.value) {
    regWarnings.innerHTML += `<div class="alert alert-danger" role="alert">
    Passwords don't match!
    </div>`;
    return;
  }

  let userObj = {
    username: usernameInp.value,
    age: ageInp.value,
    password: passwordInp.value,
    isAdmin: isAdminInp.checked,
  };

  fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  regWarnings.innerHTML += `<div class="alert alert-success" role="alert">
  Register success!
  </div>`;

  usernameInp.value = "";
  ageInp.value = "";
  passwordInp.value = "";
  passwordConfirmInp.value = "";
  isAdminInp.checked = false;
}
regBtnModal.addEventListener("click", registerUser);

//!LOGIN
function checkLoginLogoutStatus() {
  let user = localStorage.getItem("user");
  if (user) {
    setTimeout(function () {
      location.href = "../Home-page.html";
    }, 1000);
  }
}
checkLoginLogoutStatus();
//подключение к инпутам логина
let loginUsernameInp = document.querySelector("#login-username");
let loginPasswordInp = document.querySelector("#login-password");

function checkUserInUsers(username, users) {
  return users.some(item => item.username === username);
}

function checkUserPassword(user, password) {
  return user.password === password;
}

function initStorage() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "{}");
  }
}

function setUserToStorage(username, isAdmin) {
  localStorage.setItem(
    "user",
    JSON.stringify({ user: username, isAdmin: isAdmin })
  );
}
async function loginUser() {
  let res = await fetch(USERS_API);
  let users = await res.json();

  if (!loginUsernameInp.value.trim() || !loginPasswordInp.value.trim()) {
    logWarnings.innerHTML += `<div class="alert alert-danger" role="alert">
    Some inputs are empty!
    </div>`;
    return;
  }

  if (!checkUserInUsers(loginUsernameInp.value, users)) {
    logWarnings.innerHTML += `<div class="alert alert-danger" role="alert">
    User not found!
    </div>`;
    return;
  }

  let userObj = users.find(item => item.username === loginUsernameInp.value);

  if (!checkUserPassword(userObj, loginPasswordInp.value)) {
    logWarnings.innerHTML += `<div class="alert alert-danger" role="alert">
    Wrong password!
    </div>`;
    return;
  }

  initStorage();

  setUserToStorage(userObj.username, userObj.isAdmin);

  loginUsernameInp.value = "";
  loginPasswordInp.value = "";

  // let btnCloseModal = document.querySelector("#btn-close-modal");
  // btnCloseModal.click();

  // render();+
  setTimeout(function () {
    location.href = "../Home-page.html";
  }, 1000);
}

loginBtnModal.addEventListener("click", loginUser);
