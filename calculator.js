const display = document.querySelector("#display");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let previousValue = null;
let operator = null;
let shouldStartNewInput = false;

function render() {
    display.textContent = currentInput;
}

function enterNumber(number) {
    if (currentInput === "Error" || shouldStartNewInput) {
        currentInput = number;
        shouldStartNewInput = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    display.removeAttribute("title");
    render();
}

function enterDecimal() {
    if (currentInput === "Error" || shouldStartNewInput) {
        currentInput = "0";
        shouldStartNewInput = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    display.removeAttribute("title");
    render();
}

function formatResult(value) {
    return String(Number(value.toPrecision(12)));
}

function calculate(left, right, operation) {
    switch (operation) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            return right === 0 ? null : left / right;
        default:
            return null;
    }
}

function chooseOperator(nextOperator) {
    if (currentInput === "Error") {
        return;
    }

    const inputValue = Number(currentInput);

    if (operator && !shouldStartNewInput) {
        const result = calculate(previousValue, inputValue, operator);
        if (result === null || !Number.isFinite(result)) {
            showError();
            return;
        }
        currentInput = formatResult(result);
        render();
    }

    previousValue = Number(currentInput);
    operator = nextOperator;
    shouldStartNewInput = true;
}

function showError() {
    currentInput = "Error";
    previousValue = null;
    operator = null;
    shouldStartNewInput = true;
    display.title = "Cannot divide by zero or represent this result.";
    render();
}

function calculateResult() {
    if (!operator || previousValue === null || currentInput === "Error") {
        return;
    }

    const result = calculate(previousValue, Number(currentInput), operator);
    if (result === null || !Number.isFinite(result)) {
        showError();
        return;
    }

    currentInput = formatResult(result);
    previousValue = null;
    operator = null;
    shouldStartNewInput = true;
    render();
}

function clearCalculator() {
    currentInput = "0";
    previousValue = null;
    operator = null;
    shouldStartNewInput = false;
    display.removeAttribute("title");
    render();
}

function deleteDigit() {
    if (currentInput === "Error" || shouldStartNewInput) {
        currentInput = "0";
        shouldStartNewInput = false;
    } else {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
        if (currentInput === "-") {
            currentInput = "0";
        }
    }

    display.removeAttribute("title");
    render();
}

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else if (button.dataset.action === "decimal") {
        enterDecimal();
    } else if (button.dataset.action === "equals") {
        calculateResult();
    } else if (button.dataset.action === "clear") {
        clearCalculator();
    } else if (button.dataset.action === "delete") {
        deleteDigit();
    }
});

document.addEventListener("keydown", (event) => {
    if (/^\d$/.test(event.key)) {
        enterNumber(event.key);
    } else if (event.key === ".") {
        enterDecimal();
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculateResult();
    } else if (event.key === "Backspace") {
        deleteDigit();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});
