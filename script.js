function getUsers() {
  let users = JSON.parse(localStorage.getItem("users"));
  if (users == null) {
    users = [];
  }
  return users;
}

function getCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart == null) {
    cart = [];
  }
  return cart;
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getLoggedInUser() {
  let email = localStorage.getItem("loggedInUser");
  let users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      return users[i];
    }
  }
  return null;
}

function getTotal(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].price * cart[i].qty;
  }
  return total;
}

function clearErrors() {
  let errors = document.getElementsByClassName("error");
  for (let i = 0; i < errors.length; i++) {
    errors[i].innerText = "";
  }
}

function showNotice(text, link, linkText) {
  document.getElementById("content").style.display = "none";
  document.getElementById("notice").style.display = "block";
  document.getElementById("notice-text").innerText = text;
  document.getElementById("notice-link").href = link;
  document.getElementById("notice-link").innerText = linkText;
}

function updateNav() {
  let registerLink = document.getElementById("register-link");
  let loginLink = document.getElementById("login-link");

  if (getLoggedInUser() != null) {
    registerLink.style.display = "none";
    loginLink.innerText = "Logout";
    loginLink.href = "index.html";
    loginLink.onclick = function () {
      localStorage.removeItem("loggedInUser");
    };
  } else {
    registerLink.style.display = "inline";
    loginLink.innerText = "Login";
    loginLink.href = "login.html";
  }
}

function updateCartCount() {
  let cart = getCart();
  let count = 0;
  for (let i = 0; i < cart.length; i++) {
    count = count + cart[i].qty;
  }
  document.getElementById("cart-count").innerText = count;
}

function addToCart(title, price, button) {
  let cart = getCart();
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].title == title) {
      cart[i].qty = cart[i].qty + 1;
      found = true;
    }
  }
  if (found == false) {
    cart.push({ title: title, price: price, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  button.innerText = "Added to Cart";
}

function searchFromHome() {
  let text = document.getElementById("home-search").value;
  localStorage.setItem("search", text);
  window.location.href = "catalog.html";
}

function pickCategory(category) {
  localStorage.setItem("category", category);
}

function loadCatalog() {
  let text = localStorage.getItem("search");
  if (text != null) {
    document.getElementById("search").value = text;
    localStorage.removeItem("search");
  }
  let category = localStorage.getItem("category");
  if (category != null) {
    document.getElementById("category").value = category;
    localStorage.removeItem("category");
  }
  filterBooks();
}

function filterBooks() {
  let text = document.getElementById("search").value.toLowerCase();
  let category = document.getElementById("category").value;
  let cards = document.getElementsByClassName("book-card");

  for (let i = 0; i < cards.length; i++) {
    let title = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
    let author = cards[i].getElementsByClassName("author")[0].innerText.toLowerCase();
    let bookCategory = cards[i].getElementsByClassName("tag")[0].innerText;

    let matchText = title.includes(text) || author.includes(text);
    let matchCategory = category == "All" || bookCategory == category;

    if (matchText && matchCategory) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function register() {
  clearErrors();
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let ok = true;

  if (name.length < 3) {
    document.getElementById("nameError").innerText = "Please enter your full name";
    ok = false;
  }
  if (email.includes("@") == false || email.includes(".") == false) {
    document.getElementById("emailError").innerText = "Please enter a valid email";
    ok = false;
  }
  if (phone.length != 10 || isNaN(phone)) {
    document.getElementById("phoneError").innerText = "Phone number must be 10 digits";
    ok = false;
  }
  if (address.length < 10) {
    document.getElementById("addressError").innerText = "Please enter your full address";
    ok = false;
  }
  if (password.length < 6) {
    document.getElementById("passwordError").innerText = "Password must be at least 6 characters";
    ok = false;
  }
  if (confirmPassword != password) {
    document.getElementById("confirmError").innerText = "Passwords do not match";
    ok = false;
  }
  if (ok == false) {
    return;
  }

  let users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      document.getElementById("emailError").innerText = "This email is already registered";
      return;
    }
  }

  let user = {
    name: name,
    email: email,
    phone: phone,
    address: address,
    password: password
  };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "login.html";
}

function login() {
  clearErrors();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  if (email == "") {
    document.getElementById("emailError").innerText = "Please enter your email";
    return;
  }
  if (password == "") {
    document.getElementById("passwordError").innerText = "Please enter your password";
    return;
  }

  let users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i].password == password) {
      localStorage.setItem("loggedInUser", email);
      if (getCart().length > 0) {
        window.location.href = "cart.html";
      } else {
        window.location.href = "profile.html";
      }
      return;
    }
  }
  document.getElementById("passwordError").innerText = "Wrong email or password";
}

function loadProfile() {
  let user = getLoggedInUser();
  if (user == null) {
    showNotice("Please login to see your profile.", "login.html", "Click here to Login");
    return;
  }
  document.getElementById("view-name").innerText = user.name;
  document.getElementById("view-email").innerText = user.email;
  document.getElementById("view-phone").innerText = user.phone;
  document.getElementById("view-address").innerText = user.address;
}

function editProfile() {
  let user = getLoggedInUser();
  document.getElementById("name").value = user.name;
  document.getElementById("phone").value = user.phone;
  document.getElementById("address").value = user.address;
  document.getElementById("profile-view").style.display = "none";
  document.getElementById("profile-form").style.display = "block";
}

function cancelEdit() {
  document.getElementById("profile-form").style.display = "none";
  document.getElementById("profile-view").style.display = "block";
}

function saveProfile() {
  clearErrors();
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();
  let ok = true;

  if (name.length < 3) {
    document.getElementById("nameError").innerText = "Please enter your full name";
    ok = false;
  }
  if (phone.length != 10 || isNaN(phone)) {
    document.getElementById("phoneError").innerText = "Phone number must be 10 digits";
    ok = false;
  }
  if (address.length < 10) {
    document.getElementById("addressError").innerText = "Please enter your full address";
    ok = false;
  }
  if (ok == false) {
    return;
  }

  let email = localStorage.getItem("loggedInUser");
  let users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      users[i].name = name;
      users[i].phone = phone;
      users[i].address = address;
    }
  }
  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("message").innerText = "Profile updated successfully";
  loadProfile();
  cancelEdit();
}

function loadCart() {
  let cart = getCart();
  let table = document.getElementById("cart-table");

  if (cart.length == 0) {
    document.getElementById("empty-message").innerText = "Your cart is empty.";
  }

  for (let i = 0; i < cart.length; i++) {
    let row = table.insertRow();
    row.insertCell().innerText = cart[i].title;
    row.insertCell().innerText = cart[i].price;
    row.insertCell().innerText = cart[i].qty;
    row.insertCell().innerHTML = '<button onclick="changeQty(this, -1)">-</button> <button onclick="changeQty(this, 1)">+</button>';
    row.insertCell().innerText = cart[i].price * cart[i].qty;
    row.insertCell().innerHTML = '<button class="remove-btn" onclick="removeItem(this)">Remove</button>';
  }

  document.getElementById("total").innerText = getTotal(cart);
}

function changeQty(button, change) {
  let index = button.parentElement.parentElement.rowIndex - 1;
  let cart = getCart();
  cart[index].qty = cart[index].qty + change;
  if (cart[index].qty < 1) {
    cart[index].qty = 1;
  }
  saveCart(cart);
  window.location.reload();
}

function removeItem(button) {
  let index = button.parentElement.parentElement.rowIndex - 1;
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  window.location.reload();
}

function checkout() {
  if (getCart().length == 0) {
    document.getElementById("empty-message").innerText = "Your cart is empty. Add some books first.";
    return;
  }
  window.location.href = "payment.html";
}

function loadPayment() {
  if (getLoggedInUser() == null) {
    showNotice("Please login before making a payment.", "login.html", "Click here to Login");
    return;
  }
  if (getCart().length == 0) {
    showNotice("Your cart is empty. Add some books before making a payment.", "catalog.html", "Click here to Browse Books");
    return;
  }
  document.getElementById("amount").innerText = getTotal(getCart());
}

function formatExpiry() {
  let box = document.getElementById("expiry");
  let value = box.value.replace("/", "");
  if (value.length > 2) {
    box.value = value.substring(0, 2) + "/" + value.substring(2);
  }
}

function pay() {
  clearErrors();
  let cardName = document.getElementById("cardName").value.trim();
  let cardNumber = document.getElementById("cardNumber").value.trim();
  let expiry = document.getElementById("expiry").value.trim();
  let cvv = document.getElementById("cvv").value.trim();
  let ok = true;

  if (cardName.length < 3) {
    document.getElementById("cardNameError").innerText = "Please enter the name on the card";
    ok = false;
  }
  if (cardNumber.length != 16 || isNaN(cardNumber)) {
    document.getElementById("cardNumberError").innerText = "Card number must be 16 digits";
    ok = false;
  }
  let month = Number(expiry.substring(0, 2));
  if (expiry.length != 5 || expiry[2] != "/" || month < 1 || month > 12) {
    document.getElementById("expiryError").innerText = "Enter expiry date as MM/YY";
    ok = false;
  }
  if (cvv.length != 3 || isNaN(cvv)) {
    document.getElementById("cvvError").innerText = "CVV must be 3 digits";
    ok = false;
  }
  if (ok == false) {
    return;
  }

  document.getElementById("pay-btn").innerText = "Processing payment...";
  setTimeout(placeOrder, 2000);
}

function placeOrder() {
  let cart = getCart();
  let order = {
    id: Math.floor(Math.random() * 100000),
    name: getLoggedInUser().name,
    date: new Date().toLocaleString(),
    items: cart,
    total: getTotal(cart)
  };
  localStorage.setItem("order", JSON.stringify(order));
  localStorage.removeItem("cart");
  window.location.href = "confirmation.html";
}

function loadConfirmation() {
  let order = JSON.parse(localStorage.getItem("order"));
  if (order == null) {
    showNotice("You have not placed any order yet.", "catalog.html", "Click here to Shop");
    return;
  }

  document.getElementById("order-id").innerText = order.id;
  document.getElementById("order-name").innerText = order.name;
  document.getElementById("order-date").innerText = order.date;

  let table = document.getElementById("order-table");
  for (let i = 0; i < order.items.length; i++) {
    let row = table.insertRow();
    row.insertCell().innerText = order.items[i].title;
    row.insertCell().innerText = order.items[i].qty;
    row.insertCell().innerText = order.items[i].price;
    row.insertCell().innerText = order.items[i].price * order.items[i].qty;
  }

  document.getElementById("order-total").innerText = order.total;
}

updateNav();
updateCartCount();
