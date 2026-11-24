  let currentValue = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let expressionText = "";
let justCalculated = false;

const display = document.getElementById("display");
const expression = document.getElementById("expression");

function formatNumber(value) {
    if (value === "Error") {
        return "Error";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return number.toLocaleString("en-US", {
        maximumFractionDigits: 8
    });
}

function updateDisplay() {
    display.textContent = formatNumber(currentValue);
    expression.textContent = expressionText;
}

function inputDigit(digit) {
    if (currentValue === "Error" || justCalculated) {
        currentValue = digit;
        expressionText = "";
        justCalculated = false;
        waitingForSecondOperand = false;
        firstOperand = null;
        operator = null;
        updateDisplay();
        return;
    }

    if (waitingForSecondOperand) {
        currentValue = digit;
        waitingForSecondOperand = false;
    } else {
        currentValue = currentValue === "0"
            ? digit
            : currentValue + digit;
    }

    if (operator !== null) {
        expressionText =
            `${formatNumber(firstOperand)} ${operatorSymbol(operator)} ${formatNumber(currentValue)}`;
    }

    updateDisplay();
}

function inputDecimal() {
    if (currentValue === "Error" || justCalculated) {
        currentValue = "0.";
        expressionText = "";
        justCalculated = false;
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    if (waitingForSecondOperand) {
        currentValue = "0.";
        waitingForSecondOperand = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function operatorSymbol(op) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[op] || op;
}

function chooseOperator(nextOperator) {
    if (currentValue === "Error") {
        clearDisplay();
        return;
    }

    const inputValue = Number(currentValue);

    if (operator && !waitingForSecondOperand) {
        calculate();
    } else {
        firstOperand = inputValue;
    }

    if (currentValue === "Error") {
        return;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
    justCalculated = false;

    expressionText =
        `${formatNumber(currentValue)} ${operatorSymbol(operator)}`;

    updateDisplay();
}

function performCalculation(first, second, op) {
    switch (op) {
        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":
            if (second === 0) {
                return null;
            }
            return first / second;

        default:
            return second;
    }
}

function calculate() {
    if (operator === null || waitingForSecondOperand) {
        return;
    }

    const secondOperand = Number(currentValue);

    expressionText =
        `${formatNumber(firstOperand)} ${operatorSymbol(operator)} ${formatNumber(currentValue)} =`;

    const result = performCalculation(
        firstOperand,
        secondOperand,
        operator
    );

    if (result === null || !Number.isFinite(result)) {
        currentValue = "Error";
    } else {
        currentValue = String(Number(result.toFixed(8)));
    }

    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;
    justCalculated = true;

    updateDisplay();
}

function clearDisplay() {
    currentValue = "0";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    expressionText = "";
    justCalculated = false;

    updateDisplay();
}

function deleteLast() {
    if (currentValue === "Error" || justCalculated) {
        clearDisplay();
        return;
    }

    if (waitingForSecondOperand) {
        return;
    }

    currentValue = currentValue.length > 1
        ? currentValue.slice(0, -1)
        : "0";

    if (currentValue === "-") {
        currentValue = "0";
    }

    if (operator !== null) {
        expressionText =
            `${formatNumber(firstOperand)} ${operatorSymbol(operator)} ${formatNumber(currentValue)}`;
    }

    updateDisplay();
}

function percentage() {
    if (currentValue === "Error") {
        return;
    }

    currentValue = String(Number(currentValue) / 100);
    justCalculated = false;

    updateDisplay();
}

document.addEventListener("keydown", function(event) {
    if (event.key >= "0" && event.key <= "9") {
        inputDigit(event.key);
    } else if (event.key === ".") {
        inputDecimal();
    } else if (event.key === "+") {
        chooseOperator("+");
    } else if (event.key === "-") {
        chooseOperator("-");
    } else if (event.key === "*") {
        chooseOperator("*");
    } else if (event.key === "/") {
        event.preventDefault();
        chooseOperator("/");
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteLast();
    } else if (event.key === "Escape") {
        clearDisplay();
    }
});

updateDisplay();