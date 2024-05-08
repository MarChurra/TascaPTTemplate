import { menuArr as menuOptions } from "/data.js"

let totalOrder = []

const totalOrderEl = document.getElementById('orderTotal')

//handle Clicks
document.addEventListener('click', function (e) {
    if (e.target.dataset.id) {
        const selectedOption = menuOptions.find(function (option) {
            return option.id === e.target.dataset.id
        })
        addToCashout(selectedOption)
    }
    if (e.target.classList.contains('remove-btn')) {
        const itemIndex = e.target.dataset.index
        removeFromCashout(itemIndex)
    }
    if (e.target.classList.contains('submit-order')) {
        renderPayment()
    }
    if (e.target.classList.contains('pay-btn')) {
        const form = document.querySelector('form')

        if (form.checkValidity()) {
            e.preventDefault()
            renderThankYou()
        }
    }
})

document.addEventListener('click', function () {
    const stars = document.querySelectorAll('.star')

    stars.forEach(function (star) {
        star.addEventListener('click', function () {
            let index = Array.from(stars).indexOf(star)
            stars.forEach(function (s, i) {
                if (i <= index) {
                    s.classList.toggle('highlight')
                }
            })
            setTimeout(closeModal, 1000)
        })
    })
})

// renders the menu
function renderMenuOpts(options) {
    return options.map(option => {
        const {
            name,
            ingredients,
            id,
            price,
            emoji,
        } = option
        const ingredientString = ingredients.join(', ');

        return `
        <div class="menu-option">
            <span class = "emoji" >${emoji}</span>
            <div class = "option-details" >
            <h3 class = "option-name">${name}</h3>
            <p class = "list-ingredients" >${ingredientString}</p>
            <p class = "price">${price}€</p>
            </div>
           <img src="/images/plus.png" data-id="${id}" class="plus-btn" alt="Plus icon">
        </div>
        `
    }).join(' ')
}

//adding items to the cashout
function addToCashout(option) {
    totalOrder.push(option)
    renderTotalOrder()
}

//rendering the total order 
function renderTotalOrder() {
    totalOrderEl.innerHTML = ''

    let totalPrice = 0
    let isFirstItem = true;

    totalOrder.forEach((item, index) => {
        if (isFirstItem) {
            totalOrderEl.innerHTML += `<h3 class="order-title">Your order</h3>`
            isFirstItem = false
        }

        totalOrderEl.innerHTML += `
        <div class="checkout">
            <p>${item.name}</p>
            <img class= "remove-btn" src="/images/bin.png" alt="remove" data-index="${index}"></img>
            <p class="checkout-item-price">${item.price}€</p>
        </div>
        `
        totalPrice += item.price
    })

    const totalPriceEl = totalOrderEl.querySelector('.totalPrice')
    if (totalPriceEl) {
        totalPriceEl.textContent = '`Total price: ${totalPrice}€`'
    } else {
        const submitOrderBtn = document.createElement("button")
        submitOrderBtn.classList.add('submit-order')
        submitOrderBtn.textContent = `Complete Order`
        const newTotalPriceEl = document.createElement("div")
        newTotalPriceEl.classList.add('totalPrice')
        newTotalPriceEl.innerHTML = `Total price: <span id="checkoutPrice" >${totalPrice}€</span>`
        totalOrderEl.appendChild(newTotalPriceEl)
        totalOrderEl.appendChild(submitOrderBtn)
        totalOrderEl.style.display = 'block'
    }
    saveOrderToSessionStorage()
}

//remove items from the checkout 
function removeFromCashout(index) {
    totalOrder.splice(index, 1)

    if (totalOrder.length === 0) {
        totalOrderEl.style.display = 'none'
    } else {
        renderTotalOrder()
        saveOrderToSessionStorage()
    }
}

//Render the Payment Modal
function renderPayment() {
    const modalContentExists = document.querySelector('.payment-modal')

    if (modalContentExists && modalContentExists.style.display !== 'none') {
        console.warn("Already in payment")
    }

    else {
        let modalContent = document.createElement('form')
        modalContent.classList.add('payment-modal')
        modalContent.innerHTML += `
        <label for ="form">Please enter your card details</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" required>

        <input type="number" id="cardNumber" name="cardNumber" placeholder="Enter your card number" oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)" maxlength="9" required>
        
        <input type="number" id="CVV" name="CVV" placeholder="Enter your CCV" oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)" maxlength="3" required>
        
        <input type="submit" class="pay-btn" name="Pay" value="Pay">
    `
        document.body.appendChild(modalContent)
    }
}

//Render the Thank you Message & Score
function renderThankYou() {
    const paymentModal = document.querySelector('.payment-modal')


    const appreciationModalExists = document.querySelector('.appreciationModal')
    if (appreciationModalExists && appreciationModalExists.style.display !== 'none') {
        console.warn("Already viewing this content")
    }

    else {
        const appreciationModal = document.createElement('div')
        appreciationModal.classList.add('appreciationModal')
        appreciationModal.innerHTML = `
    <h2>Thank you so much for your purchase!</h2>
    <h3>Your order will be processed right away</h3>
    <h4>Could you kindly rate our service?</h4>
    <div class = "rating" >
    <i class="fa-regular fa-star star"></i>
    <i class="fa-regular fa-star star"></i>
    <i class="fa-regular fa-star star"></i>
    <i class="fa-regular fa-star star"></i>
    <i class="fa-regular fa-star star"></i>
    </div>
    `
        document.body.appendChild(appreciationModal)
    }
}

function closeModal() {
    document.querySelector('#orderTotal').style.display = 'none'
    totalOrder = []
    document.querySelector('.payment-modal').remove()
    document.querySelector(".appreciationModal").remove()
    render()
}

//render the HTML
function render() {
    document.getElementById('selectOptions').innerHTML = renderMenuOpts(menuOptions)
}



function saveOrderToSessionStorage() {
    const orderJSON = JSON.stringify(totalOrder)
    sessionStorage.setItem('selectedOrder', orderJSON)
}

function loadOrderFromSessionStorage() {
    console.log(sessionStorage.getItem('selectedOrder'))
    const orderJSON = sessionStorage.getItem('selectedOrder')
    if (orderJSON) {
        totalOrder = JSON.parse(orderJSON)
        console.log(totalOrder)
        renderTotalOrder()
    }
}

loadOrderFromSessionStorage()
render ()