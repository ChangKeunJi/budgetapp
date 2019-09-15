const list = document.getElementById("expense-list");
const deleteBtn = document.querySelector(".fa-trash-alt");
const expenseForm = document.querySelector("#expense-form");
const buttons = document.querySelectorAll(".btn-outline-warning");
const expenseInput = document.getElementById("expense-input");
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const budgetDisplay = document.querySelector(".display-budget-value");
const expenseDisplay = document.querySelector(".display-expense-value");
const balanceDisplay = document.querySelector(".display-balance-value");
const resetBtn = document.querySelector("#reset");
let total = 0;
let budget;

const renderList = doc => {
  let tableRow = document.createElement("tr");
  tableRow.innerHTML = `
  <td>
    <button type="button" class="btn btn-outline-light list-btn">
      ${doc.data().type}
    </button>
  </td>
  <td id='amount'>-$${doc.data().amount}</td>
  <td><i class="fas fa-trash-alt target" id=${doc.id} ></i></td>
  `;
  list.appendChild(tableRow);
};

// Real Time Listener

const expenseListen = db.collection("expense").onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type === "added") {
      total += parseInt(change.doc.data().amount);
      expenseDisplay.innerHTML = total;
      renderList(change.doc);
      getBalance();
    } else if (change.type === "removed") {
      let li = document.getElementById(`${change.doc.id}`).parentElement
        .parentElement;
      list.removeChild(li);
      total -= parseInt(change.doc.data().amount);
      expenseDisplay.innerHTML = total;
      getBalance();
    }
  });
});

const budgetListen = db.collection("budget").onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    budget = change.doc.data().budget;
    budgetDisplay.innerHTML = budget;
    getBalance();
  });
});

const getBalance = () => {
  db.collection("balance").onSnapshot(snapshot => {
    let change = snapshot.docChanges();

    let budget = parseInt(budgetDisplay.innerText);
    let expense = parseInt(expenseDisplay.innerText);

    change.forEach(change => {
      balanceDisplay.innerHTML = budget - expense;
    });
  });
};

// Delete List

list.addEventListener("click", e => {
  if (e.target.classList.contains("target")) {
    let id = e.target.id;
    db.collection("expense")
      .doc(id)
      .delete();
  }
});

resetBtn.addEventListener("click", () => {
  let deleteBtns = document.querySelectorAll(".target");
  deleteBtns.forEach(btn => {
    let id = btn.id;
    db.collection("expense")
      .doc(id)
      .delete();
  });
});

// Select Expense Button

buttons.forEach(btn => {
  btn.addEventListener("click", e => {
    buttons.forEach(btn => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
  });
});

// Saving Data - Expense

expenseForm.addEventListener("submit", e => {
  const activeBtn = document.querySelector(".active");
  let value = expenseInput.value;

  e.preventDefault();

  if (value <= 0 || value === null) {
    alert("Wrong Input");
  } else {
    db.collection("expense").add({
      type: activeBtn.id,
      amount: expenseInput.value
    });

    expenseForm.expense.value = "";
  }
});

// Saving Data - Budget

budgetForm.addEventListener("submit", e => {
  let value = budgetInput.value;
  let id = "gc3wbyd5ztmFQ2PpJTMl";
  let budgetData = db.collection("budget").doc(id);

  if (value <= 0 || value === null) {
    alert("Wrong Input");
  } else {
    budgetData.update({
      budget: value
    });
  }
  budgetForm.budget.value = "";
  e.preventDefault();
});
