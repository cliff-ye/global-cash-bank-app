"use strict";

//store users data
const account1 = {
  username: "John Doe",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 2020,
};

const account2 = {
  username: "Prince Joy",
  transactions: [300, 150, -800, 1000, -550, -30, 100, 100],
  pin: 555,
};

const accounts = [account1, account2];

//select items here
//LABELS
const lblBalance = document.querySelector(".bal");
const lblTotalDep = document.querySelector(".totaldep");
const lblTotalWithd = document.querySelector(".totalwithd");
const lblAcctName = document.querySelector("#labelName");
//INPUT FIELDS
const txtUsername = document.querySelector(".input--username");
const txtPassword = document.querySelector(".input--password");
const txtDepAmt = document.querySelector(".input--depamt");
const txtWithdAmt = document.querySelector(".input--withdrawAmt");
const txtTransferAmt = document.querySelector(".input--transAmt");
const txttransferTo = document.querySelector(".input--transTo");

//BUTTONS
const btnLogin = document.querySelector(".btn--login");
const btnLogout = document.querySelector("#logout-btn");
const btnDeposit = document.querySelector(".btn--dep");
const featuresBtn = document.querySelector(".feature--btn");
const allBtn = document.querySelectorAll(".btn");
const closeDep = document.querySelector(".closeDep");
const btnWithd = document.querySelector(".btn--withdraw");
const btnCloseWithd = document.querySelector(".closeWithd");
const btnTransfer = document.querySelector(".btn--transfer");
const closeTrans = document.querySelector(".closeTrans");
const closeAlltrans = document.querySelector(".closeAlltrans");
//select modal
const loginForm = document.querySelector(".loginModal");
const mainAppContainer = document.querySelector(".mainDiv");
const overlay = document.querySelector(".overlay");
const allSubform = document.querySelectorAll(".sub");
const featuresModal = document.querySelector(".featuresModal");
const depModal = document.querySelector(".depositModal");
const withdModal = document.querySelector(".withdrawModal");
const transferModal = document.querySelector(".TransferModal");
const tbodyContainer = document.querySelector(".tbody");
const transModal = document.querySelector(".Alltransactions");

const setVals = function () {
  txtUsername.value = account1.username;
  txtPassword.value = account1.pin;
  txttransferTo.value = account2.username;
};
setVals();
//all transactions
const allTransactions = function (trans) {
  tbodyContainer.innerHTML = "";
  trans.forEach(function (t, i) {
    const state = t > 0 ? "deposit" : "withdrawal";

    const html = `
      <tr>
        <th scope="row">${i + 1}</th>
        <td>${state}</td>
        <td>$ ${t}</td>
      </tr>`;

    //attach html
    tbodyContainer.insertAdjacentHTML("afterbegin", html);
  });
};

//display balance
const calcDisplayBal = function (acc) {
  acc.balance = acc.transactions.reduce((initVal, trans) => initVal + trans, 0);

  lblBalance.textContent = `$ ${acc.balance.toFixed(2)}`;
};

//transactionSummary
const calcSummary = function (acc) {
  acc.totalDep = acc.transactions
    .filter((trans) => trans > 0)
    .reduce((initVal, trans) => initVal + trans, 0);
  lblTotalDep.textContent = `$ ${acc.totalDep.toFixed(2)}`;

  acc.totalWithdrawal = acc.transactions
    .filter((trans) => trans < 0)
    .reduce((initVal, trans) => initVal + trans, 0);
  lblTotalWithd.textContent = `$ ${Math.abs(acc.totalWithdrawal).toFixed(2)}`;
};

//update all ui stuff
const updateUI = function (acc) {
  calcDisplayBal(acc);
  calcSummary(acc);
  allTransactions(acc.transactions);
};
updateUI(account1);

//implementing login
let accountLoggedIn;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  //this will find the account with the username entered
  accountLoggedIn = accounts.find((acc) => acc.username === txtUsername.value);

  //compare the pin in the account
  if (accountLoggedIn.pin === +txtPassword.value) {
    //display name on platform
    Swal.fire("Login successful!", "", "success");

    lblAcctName.textContent = accountLoggedIn.username;
    updateUI(accountLoggedIn);
    loginForm.classList.add("hidden");
    overlay.classList.add("hidden");
    mainAppContainer.style.opacity = 100;
  }
  //console.log(accountLoggedIn);
});

//logout
btnLogout.addEventListener("click", function (e) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        "logged out!",
        " ",
        "success",
        (txtUsername.value = txtPassword.value = ""),
        loginForm.classList.remove("hidden"),
        overlay.classList.remove("hidden"),
        setVals(),
        (mainAppContainer.style.opacity = 0)
      );
    }
  });
});

//add feature btn events-event delegation
featuresBtn.addEventListener("click", function (e) {
  //console.log(e.target);
  e.preventDefault();

  const clicked = e.target.closest(".btn");
  // console.log(clicked.dataset.tab);

  if (!clicked) return;

  overlay.classList.remove("hidden");
  document
    .querySelector(`.f--${clicked.dataset.tab}`)
    .classList.remove("hidden");
});

const hideOverlay = function () {
  overlay.classList.add("hidden");
};

const closeMe = function (modal, btn) {
  btn.addEventListener("click", function (e) {
    modal.classList.add("hidden");
    hideOverlay();
  });
};

//close deposit
closeMe(depModal, closeDep);
//deposit
btnDeposit.addEventListener("click", function (e) {
  e.preventDefault();

  accountLoggedIn.transactions.push(Number(txtDepAmt.value));
  Swal.fire(
    "Deposit successful!",
    "",
    "success",
    depModal.classList.add("hidden"),
    hideOverlay()
  );
  updateUI(accountLoggedIn);
  txtDepAmt.value = "";
});

//withdrawal
closeMe(withdModal, btnCloseWithd);
btnWithd.addEventListener("click", function (e) {
  e.preventDefault();

  const amt = -Number(txtWithdAmt.value);
  accountLoggedIn.transactions.push(amt);
  Swal.fire(
    "withdrawal successful!",
    "",
    "success",
    withdModal.classList.add("hidden"),
    hideOverlay()
  );

  updateUI(accountLoggedIn);
  txtWithdAmt.value = "";
});

//transfer money
closeMe(transferModal, closeTrans);
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const receiverAcct = accounts.find(
    (acc) => acc.username === txttransferTo.value
  );

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        `sent to ${receiverAcct.username}!`,
        " ",
        "success",
        receiverAcct.transactions.push(Number(txtTransferAmt.value)),
        accountLoggedIn.transactions.push(-Number(txtTransferAmt.value)),
        updateUI(accountLoggedIn),
        transferModal.classList.add("hidden"),
        hideOverlay(),
        setVals()
        // (txttransferTo.value = txtTransferAmt.value = "")
      );
    }
  });
});

closeMe(transModal, closeAlltrans);
