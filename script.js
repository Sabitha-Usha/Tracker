// script.js
let entries = JSON.parse(localStorage.getItem('entries')) || [];
let isEditing = false;
let editingId = null;

const form = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const resetBtn = document.getElementById('reset-btn');
const entryList = document.getElementById('entry-list');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const netBalance = document.getElementById('net-balance');
const filterRadios = document.getElementsByName('filter');

function updateLocalStorage() {
  localStorage.setItem('entries', JSON.stringify(entries));
}

function calculateTotals() {
  let income = 0, expense = 0;
  entries.forEach(e => {
    if (e.type === 'income') income += e.amount;
    else expense += e.amount;
  });
  totalIncome.textContent = income.toFixed(2);
  totalExpense.textContent = expense.toFixed(2);
  netBalance.textContent = (income - expense).toFixed(2);
}

function renderEntries() {
  const filter = document.querySelector('input[name="filter"]:checked').value;
  entryList.innerHTML = '';
  entries.filter(e => filter === 'all' || e.type === filter).forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${entry.description} - $${entry.amount.toFixed(2)} (${entry.type})</span>
      <span class="entry-actions">
        <button onclick="editEntry(${entry.id})">Edit</button>
        <button onclick="deleteEntry(${entry.id})">Delete</button>
      </span>
    `;
    entryList.appendChild(li);
  });
  calculateTotals();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!description || isNaN(amount) || amount <= 0) return;

  if (isEditing) {
    const index = entries.findIndex(e => e.id === editingId);
    if (index > -1) {
      entries[index] = { ...entries[index], description, amount, type };
    }
    isEditing = false;
    editingId = null;
  } else {
    entries.push({ id: Date.now(), description, amount, type });
  }

  updateLocalStorage();
  renderEntries();
  form.reset();
});

resetBtn.addEventListener('click', () => {
  form.reset();
  isEditing = false;
  editingId = null;
});

function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  if (entry) {
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeInput.value = entry.type;
    isEditing = true;
    editingId = id;
  }
}

function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  updateLocalStorage();
  renderEntries();
}

filterRadios.forEach(radio => {
  radio.addEventListener('change', renderEntries);
});

renderEntries();
