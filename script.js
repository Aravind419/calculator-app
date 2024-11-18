// Global Variables
let inputField = document.getElementById("inputField");
let historyList = document.getElementById("historyList");
let isDarkMode = localStorage.getItem("darkMode") === "true";

// Set Initial Theme
if (isDarkMode) {
  document.body.classList.add("dark-mode");
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  isDarkMode = !isDarkMode;
  localStorage.setItem("darkMode", isDarkMode); // Save dark mode state
}

// Add operation to input field
function press(value) {
  inputField.value += value;
}

// Clear display
function clearDisplay() {
  inputField.value = "";
}

// Delete last character
function deleteLast() {
  inputField.value = inputField.value.slice(0, -1);
}

// Calculate result
function calculate() {
  try {
    const result = eval(inputField.value);
    let expression = inputField.value;
    inputField.value = result;
    addToHistory(expression, result); // Save operation in history with result
  } catch (error) {
    inputField.value = "Error";
  }
}

// Get today's date in the format: Month Day, Year (e.g., November 20, 2024)
function getFormattedDate() {
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return currentDate.toLocaleDateString("en-US", options);
}

// Add to history with date
function addToHistory(expression, result) {
  const currentDate = getFormattedDate();
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");

  // Create a new section for the date
  let existingDateSection = document.querySelector(
    `.history-date[data-date="${currentDate}"]`
  );

  if (!existingDateSection) {
    // Create a new section for the date
    existingDateSection = document.createElement("div");
    existingDateSection.classList.add("history-date");
    existingDateSection.dataset.date = currentDate;
    existingDateSection.innerHTML = `<h3>${currentDate}</h3>`;
    historyList.appendChild(existingDateSection);
  }

  // Create the history operation with result
  const operationItem = document.createElement("li");
  operationItem.innerHTML = `
        <span class="history-operation">${expression} = ${result}</span>
        <button class="remove-history" onclick="removeHistory(this)">X</button>
    `;
  existingDateSection.appendChild(operationItem);

  // Save to localStorage
  saveHistoryToLocalStorage();
}

// Remove history
function removeHistory(button) {
  button.parentElement.remove();
  saveHistoryToLocalStorage(); // Save after removal
}

// Clear history (only if the user clicks the clear button)
function clearHistory() {
  historyList.innerHTML = "";
  saveHistoryToLocalStorage(); // Save after clearing history
}

// Save history to Local Storage
function saveHistoryToLocalStorage() {
  const historyItems = [];
  document.querySelectorAll(".history-date").forEach((dateSection) => {
    const date = dateSection.dataset.date;
    const operations = [];
    dateSection.querySelectorAll(".history-item").forEach((item) => {
      const operation = item.querySelector(".history-operation").innerText;
      operations.push(operation);
    });
    historyItems.push({ date, operations });
  });
  localStorage.setItem("history", JSON.stringify(historyItems)); // Save to Local Storage
}

// Load history from Local Storage
function loadHistoryFromLocalStorage() {
  const savedHistory = localStorage.getItem("history");
  if (savedHistory) {
    const historyItems = JSON.parse(savedHistory);
    historyItems.forEach((item) => {
      const dateSection = document.createElement("div");
      dateSection.classList.add("history-date");
      dateSection.dataset.date = item.date;
      dateSection.innerHTML = `<h3>${item.date}</h3>`;

      item.operations.forEach((operation) => {
        const operationItem = document.createElement("li");
        operationItem.innerHTML = `
          <span class="history-operation">${operation}</span>
          <button class="remove-history" onclick="removeHistory(this)">X</button>
        `;
        dateSection.appendChild(operationItem);
      });

      historyList.appendChild(dateSection);
    });
  }
}

// Handle Enter key press for equal button
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    calculate();
  }
});

// Display clicked history in input field
historyList.addEventListener("click", (e) => {
  if (e.target.classList.contains("history-operation")) {
    inputField.value = e.target.innerText.split(" = ")[0]; // Set only expression
  }
});

// Load history when the page is loaded
window.onload = function () {
  loadHistoryFromLocalStorage();
};
