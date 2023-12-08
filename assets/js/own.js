function allfunction() {
    if (validateForm()) {
        signup();
    }
}
function validateForm() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var password = document.getElementById('password').value;
    var nameRegex = /^[A-Z][A-Za-z\s]+$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phoneRegex = /^[1-9][0-9]{9}$/;
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;':",.<>?\/])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;':",.<>?\/]{6,}$/;
    document.getElementById('nameError').innerHTML = '';
    document.getElementById('emailError').innerHTML = '';
    document.getElementById('phoneError').innerHTML = '';
    document.getElementById('passwordError').innerHTML = '';

    if (!nameRegex.test(name)) {
        document.getElementById('nameError').innerHTML = 'Please enter a valid name.';
        return false;
    }
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').innerHTML = 'Please enter a valid email address.';
        return false;
    }
    if (!phoneRegex.test(phone)) {
        document.getElementById('phoneError').innerHTML = 'Please enter a valid Phone Number.';
        return false;
    }
    if (!passwordRegex.test(password)) {
        document.getElementById('passwordError').innerHTML = 'Please enter a valid Password.';
        return false;
    }
    return true;
}

function eyeicon() {
    const passwordInput = document.querySelector("#password");
    const eyeIcon = document.querySelector("#eye");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }
}

function signup() {

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var password = document.getElementById('password').value;


    var existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    for (var i = 0; i < existingUsers.length; i++) {
        if (existingUsers[i].name === name) {
            alert('name already exists. Please choose a different one.');
            return;
        }
    }


    var newUser = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    window.location.href = 'home.html';

}


function login() {

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    for (var i = 0; i < existingUsers.length; i++) {
        if (existingUsers[i].email === email && existingUsers[i].password === password) {
            window.location.href = './assets/pages/home.html';
            return;
        }
    }
    alert('Invalid email or password. Please try again.');
}

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
        return disdetal(product)
    })
    .catch(error => {
        return console.error('Error fetching product details:', error)
    });

function disdetal(product) {
    const prodit = document.getElementById('product-details');
    prodit.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <div id="quantity-container">
          <label for="quantity">Quantity:</label>
          <button onclick="dec()">-</button>
          <input id="quantity" value="3" min="3" max="10">
          <button onclick="inc()">+</button>
          <button class="btn" onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
        </div>
      `;
}

function inc() {
    const quanbox = document.getElementById('quantity');
    if (quanbox.value < 10) {
        quanbox.value++;
    }
}

function dec() {
    const quanbox = document.getElementById('quantity');
    if (quanbox.value > 3) {
        quanbox.value--;
    }
}

function addToCart(productId, title, price) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = quantity * price;
    const cartItem = { productId, title, quantity, price, totalPrice };
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert('item add to cart');
    window.location.href = 'home.html';
}

const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartContainer = document.getElementById('cart-items');
const totalAmountSpan = document.getElementById('totalAmount');
const paymentButton = document.getElementById('paymentButton');
const cartListContainer = document.getElementById('cart-list');

if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    paymentButton.disabled = true;
} else {
    let totalAmount = 0;
    cartItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
                    <p><strong>Product ID:</strong> ${item.productId}</p>
                    <p><strong>Product:</strong> ${item.title}</p>
                    <p><strong>Quantity:</strong> ${item.quantity}</p>
                    <p><strong>Price per unit:</strong> $${item.price.toFixed(2)}</p>
                    <p><strong>Total Price:</strong> $${item.totalPrice.toFixed(2)}</p>
                    <button class="remove-button" onclick="removeItem(${index})">Remove Item</button>
                    <hr>
                `;
        cartListContainer.appendChild(itemDiv);
        totalAmount += item.totalPrice;
    });
    totalAmountSpan.textContent = totalAmount.toFixed(2);
}

function removeItem(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    window.location.reload();
}

function makePayment() {
    const totalAmount = parseFloat(totalAmountSpan.textContent);
    const currentDate = new Date().toLocaleDateString();

    const detailedOrder = cartItems.map(item => {
        return {
            productId: item.productId,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice
        };
    });

    const oldOrders = JSON.parse(localStorage.getItem('oldOrders')) || [];
    oldOrders.push({ totalAmount, date: currentDate, products: detailedOrder });
    localStorage.setItem('oldOrders', JSON.stringify(oldOrders));

    localStorage.removeItem('cart');

    alert('Payment successful!');
    window.location.href = 'invoice.html';
}




