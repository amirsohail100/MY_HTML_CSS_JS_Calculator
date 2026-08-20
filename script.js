const displayElement = document.querySelector(".output-box");
const numberButtons = document.querySelectorAll(".but");
const actionButtons = document.querySelectorAll(".but-s");
const operatorButtons = document.querySelectorAll(".but-sin");
const deleteButton = document.querySelector(".delBut");

let currentExpression = "";

// Helper: Enable or disable operator buttons
function setOperatorsDisabledState(isDisabled) {
    operatorButtons.forEach((btn) => {
        btn.disabled = isDisabled;
    });
}

// Helper: Update display UI
function updateDisplay(value) {
    displayElement.innerText = value === "" ? "0" : value;
}

// Helper: Format arithmetic float precision and prevent overflow
function formatResult(value) {
    if (isNaN(value) || !isFinite(value)) {
        return "Error";
    }
    // Round to 4 decimal places cleanly without trailing zeroes
    const roundedValue = Math.round(value * 10000) / 10000;
    return String(roundedValue);
}

// Core Mathematical Evaluator Engine
function calculateExpression(expression) {
    try {
        if (!expression) return "0";

        // Convert UI symbols to standard JavaScript operators
        let sanitizedExpression = expression
            .replace(/x/g, "*")
            .replace(/%/g, "/100");

        // Strip trailing operator if equal is pressed prematurely
        if (/[+\-*\/]$/.test(sanitizedExpression)) {
            sanitizedExpression = sanitizedExpression.slice(0, -1);
        }

        const evaluatedResult = Function(`"use strict"; return (${sanitizedExpression})`)();
        return formatResult(evaluatedResult);
    } catch (error) {
        return "Error";
    }
}

// Handle Single Character Deletion
function handleDelete() {
    if (currentExpression.length > 0) {
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay(currentExpression);
    }
}

// Handle Number Buttons & Sign Toggle (+/-)
numberButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const inputChar = btn.textContent.trim();

        // Toggle positive/negative sign
        if (inputChar === "+/-") {
            if (currentExpression) {
                if (currentExpression.startsWith("-")) {
                    currentExpression = currentExpression.slice(1);
                } else {
                    currentExpression = "-" + currentExpression;
                }
                updateDisplay(currentExpression);
            }
            return;
        }

        if (currentExpression.length < 15) {
            // Prevent duplicate decimal points within a single operand
            if (inputChar === ".") {
                const operands = currentExpression.split(/[+\-x/]/);
                const currentOperand = operands[operands.length - 1];
                if (currentOperand.includes(".")) return;
            }

            currentExpression += inputChar;
            updateDisplay(currentExpression);
            setOperatorsDisabledState(false);
        }
    });
});

// Handle Operator Buttons (+, -, x, /, %)
operatorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const operator = btn.textContent.trim();

        if (currentExpression.length < 15 && currentExpression !== "") {
            const lastChar = currentExpression[currentExpression.length - 1];
            const isLastCharOperator = ["+", "-", "x", "/", "%"].includes(lastChar);

            // Replace operator if clicked consecutively
            if (isLastCharOperator) {
                currentExpression = currentExpression.slice(0, -1) + operator;
            } else {
                currentExpression += operator;
            }

            updateDisplay(currentExpression);
        }
    });
});

// Handle Action Buttons (CE, DEL, =)
actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const action = btn.textContent.trim();

        if (action === "CE") {
            currentExpression = "";
            updateDisplay("0");
            setOperatorsDisabledState(false);
        } else if (action === "DEL") {
            handleDelete();
        } else if (action === "=") {
            if (currentExpression) {
                currentExpression = calculateExpression(currentExpression);
                updateDisplay(currentExpression);
                setOperatorsDisabledState(false);
            }
        }
    });
});

// Feature Add: Global Keyboard Navigation Integration
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if ((key >= "0" && key <= "9") || key === ".") {
        if (currentExpression.length < 15) {
            if (key === ".") {
                const operands = currentExpression.split(/[+\-x/]/);
                const currentOperand = operands[operands.length - 1];
                if (currentOperand.includes(".")) return;
            }
            currentExpression += key;
            updateDisplay(currentExpression);
        }
    } else if (["+", "-", "*", "/"].includes(key)) {
        const mappedOperator = key === "*" ? "x" : key;
        if (currentExpression !== "") {
            const lastChar = currentExpression[currentExpression.length - 1];
            if (["+", "-", "x", "/", "%"].includes(lastChar)) {
                currentExpression = currentExpression.slice(0, -1) + mappedOperator;
            } else {
                currentExpression += mappedOperator;
            }
            updateDisplay(currentExpression);
        }
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        if (currentExpression) {
            currentExpression = calculateExpression(currentExpression);
            updateDisplay(currentExpression);
        }
    } else if (key === "Backspace") {
        handleDelete();
    } else if (key === "Escape") {
        currentExpression = "";
        updateDisplay("0");
    }
});