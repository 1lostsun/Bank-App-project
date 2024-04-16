"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-04-12T17:01:17.194Z",
    "2024-04-14T23:36:17.929Z",
    "2024-04-15T10:51:36.790Z",
  ],
  currency: "RUB",
  locale: "pt-PT",
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2024-04-08T14:43:26.374Z",
    "2024-04-14T18:49:59.371Z",
    "2024-04-15T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "es-PE",
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "ru-RU",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

function formatMovementDate(date) {
  const calcDaysPaseed = (date1, date2) => Math.round((date1 - date2) / (1000 * 60 * 60 * 24))
  const daysPassed = calcDaysPaseed(new Date(), date)
  if (daysPassed === 0) return `Сегодня`
  if (daysPassed === 1) return `Вчера`
  if (daysPassed <= 4 && daysPassed >= 2) return `Прошло ${daysPassed} дня`
  if (daysPassed <= 7) return `Прошло ${daysPassed} дней`
  const data = Intl.DateTimeFormat(currentAccount.local, opt).format(date)
  return data
}

function displayMovement (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements
  movs.forEach((element, index) => {
    const date = new Date(acc.movementsDates[index])
    let movDate = formatMovementDate(date)
    const type = element > 0 ? "deposit" : "withdrawal"
    let typeMessage = element > 0 ? "Пополнение" : "Снятие"
    element = Intl.NumberFormat(acc.locale, acc.options).format(element)
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${index + 1} ${typeMessage}
        </div>
        <div class="movements__date">${movDate}</div>
        <div class="movements__value">${element}</div>
     </div
    `
    containerMovements.insertAdjacentHTML("afterbegin", html)
  });
}


function accountBalance (acc) {
  
  acc.balance = acc.movements.reduce((sum, el) => sum += el, 0)
  labelBalance.textContent = Intl.NumberFormat(acc.locale, acc.options).format(acc.balance)
  labelSumInterest.textContent = Intl.NumberFormat(acc.locale, acc.options).format(acc.balance);
}


function displaySum (acc) {
  const sumIn = acc.movements.filter((el) => el > 0).reduce((sum, el) => sum + el)
  labelSumIn.textContent = Intl.NumberFormat(acc.locale, acc.options).format(sumIn)
  const sumOut = acc.movements.filter((el) => el < 0).reduce((sum, el) => sum + el)
  labelSumOut.textContent = Intl.NumberFormat(acc.locale, acc.options).format(sumOut)
}

function createLogIn(name) {
  const userLogIn = name.owner.split(" ").map((el) => el[0].toLowerCase()).join("")
  name.logIn = userLogIn;
}
accounts.forEach((el) => createLogIn(el))

function updateUI(acc) {
  displayMovement(acc)
  accountBalance(acc)
  displaySum(acc)
}

function startLogOut () {
  let time = 300
  function tick () {
    let min = `${Math.trunc(time / 60)}`.padStart(2, 0)
    let sec = `${time % 60 }`.padStart(2, 0)
    labelTimer.textContent = `${min}:${sec}`
    if (time === 0) {
      clearInterval(timer)
      containerApp.style.opacity = 0
    }
    time--
  }
  tick()
  const timer = setInterval(tick, 1000) 
  return timer;
}

let currentAccount;
let timer;
let opt;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault()
  currentAccount = accounts.find((acc) => acc.logIn === inputLoginUsername.value)
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    const local = navigator.language
    opt = {
    year : "2-digit", 
    month : "numeric", 
    day : "numeric",  
    hour : "numeric", 
    minute : "numeric", 
    second : "numeric",     
    hour12 : false
    }
    currentAccount.options = {
      "style" : "currency",
      "currency" : currentAccount.currency
    }
    labelDate.textContent = Intl.DateTimeFormat(local, opt).format(new Date()) 
    setInterval(() => labelDate.textContent = Intl.DateTimeFormat(local, opt).format(new Date()), 1000)
    if (timer){
      clearInterval(timer)
    }
    timer = startLogOut()
    inputLoginUsername.value = inputLoginPin.value = ""
    updateUI(currentAccount)
  }
})

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault()
  const reciepientAccount = accounts.find((acc) => acc.logIn === inputTransferTo.value)
  const amount = Number(inputTransferAmount.value)
  if (reciepientAccount && amount > 0 && amount <= currentAccount.balance && reciepientAccount.logIn !== currentAccount.logIn) {
    currentAccount.movements.push(-amount)
    reciepientAccount.movements.push(amount)
    currentAccount.movementsDates.push((new Date()).toISOString())
    clearInterval(timer)
    timer = startLogOut()
    updateUI(currentAccount)
    inputTransferTo.value = inputTransferAmount.value = ""
  }
})

btnClose.addEventListener("click", (e) => {
  e.preventDefault()
  if (inputCloseUsername.value ===  currentAccount.logIn && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex((acc) => {
      return acc.logIn === currentAccount.logIn
     })
    accounts.splice(index, 1)
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ""
})

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const someAmount = Number(inputLoanAmount.value)
  if (someAmount > 0) {
    currentAccount.movements.push(someAmount)
    currentAccount.movementsDates.push((new Date()).toISOString())
    clearInterval(timer)
    timer = startLogOut()
    updateUI(currentAccount)
  }
  inputLoanAmount.value = ""
})

const allBalance = accounts.map((acc) => acc.movements).flat().reduce((sum, el) => sum + el, 0)

let sorted = 0 
btnSort.addEventListener("click", (e) => {
  e.preventDefault()
  displayMovement(currentAccount, !sorted)
  sorted = !sorted
})
