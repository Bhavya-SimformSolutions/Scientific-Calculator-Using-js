let equal_pressed = 0;
let lastResult = null; // To store the result of the last calculation
let button_input = document.querySelectorAll(".input-button");
let input = document.getElementById("input");
let equal = document.getElementById("equal");
let clear = document.getElementById("clear");
let erase = document.getElementById("erase");

window.onload = () => {
    input.value = "";
};

// Handle input buttons click event
button_input.forEach((button_class) => {
    button_class.addEventListener("click", () => {
        // If an expression was just evaluated, don't clear the input
        if (equal_pressed === 1) {
            equal_pressed = 0; // Allow further edits/appends to the current value
        }
        input.value += button_class.value; // Append the new input
    });
});

// Handle equal button click event
equal.addEventListener("click", () => {
    let inp_val = input.value;

    // If there's a previous result and input starts with an operator, prepend the last result
    if (lastResult !== null && /^[+\-*/%]/.test(inp_val)) {
        inp_val = `${lastResult}${inp_val}`;
    }

    try {
        let solution = calculateBasicOperations(inp_val);

        // If solution is valid, update lastResult and display
        if (typeof solution === 'number') {
            lastResult = solution;
            input.value = Number.isInteger(solution) ? solution : solution.toFixed(2);
        } else {
            // Display pop-up with error message if it's a string (error)
            alert(solution);
        }
    } catch (err) {
        alert(err.message);
    }

    equal_pressed = 1; // Mark equal_pressed to allow appending to the last result
});

// Handle clear button click event
clear.addEventListener("click", () => {
    input.value = "";
    lastResult = null; // Reset the last result
});

// Handle erase button click event
erase.addEventListener("click", () => {
    input.value = input.value.substr(0, input.value.length - 1); // Remove the last character
});

// Shunting Yard Algorithm
function calculateBasicOperations(expression) {
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };
    const isOperator = (char) => ['+', '-', '*', '/', '%'].includes(char);
    const isNumber = (char) => !isNaN(char);

    try {
        // Step 1: Tokenize the input
        const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/|\%|\(|\))/g);
        if (!tokens) {
            throw new Error("Invalid expression: Empty input or invalid characters.");
        }

        // Check for invalid start or end of the expression
        if (
            isOperator(tokens[0]) && tokens[0] !== '-' || // Only allow '-' at the start
            isOperator(tokens[tokens.length - 1]) // Expression cannot end with an operator
        ) {
            throw new Error("Invalid expression: Cannot start or end with an operator.");
        }

        // Fix tokens for negative numbers
        let fixedTokens = [];
        for (let i = 0; i < tokens.length; i++) {
            if (
                tokens[i] === '-' &&
                (i === 0 || tokens[i - 1] === '(' || isOperator(tokens[i - 1]))
            ) {
                // Merge negative sign with the next number
                fixedTokens.push(tokens[i] + tokens[i + 1]);
                i++;
            } else {
                fixedTokens.push(tokens[i]);
            }
        }

        // Check for consecutive operators (excluding valid `-` for negative numbers)
        for (let i = 0; i < fixedTokens.length - 1; i++) {
            if (isOperator(fixedTokens[i]) && isOperator(fixedTokens[i + 1])) {
                throw new Error(
                    "Invalid expression: Consecutive operators are not allowed."
                );
            }
        }

        // Check for mismatched parentheses
        let openParentheses = 0;
        for (const token of fixedTokens) {
            if (token === '(') openParentheses++;
            if (token === ')') openParentheses--;
            if (openParentheses < 0) {
                throw new Error("Invalid expression: Mismatched parentheses.");
            }
        }
        if (openParentheses !== 0) {
            throw new Error("Invalid expression: Mismatched parentheses.");
        }

        let outputQueue = [];
        let operatorStack = [];

        // Step 2: Shunting-Yard Algorithm to convert to RPN
        fixedTokens.forEach((token) => {
            if (isNumber(token)) {
                outputQueue.push(parseFloat(token));
            } else if (isOperator(token)) {
                while (
                    operatorStack.length &&
                    isOperator(operatorStack[operatorStack.length - 1]) &&
                    precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
            }
        });

        while (operatorStack.length) {
            const op = operatorStack.pop();
            if (op === '(' || op === ')') {
                throw new Error("Invalid expression: Mismatched parentheses.");
            }
            outputQueue.push(op);
        }

        // Step 4: Evaluate the RPN expression
        let evaluationStack = [];
        outputQueue.forEach((token) => {
            if (typeof token === "number") {
                evaluationStack.push(token);
            } else if (isOperator(token)) {
                const b = evaluationStack.pop();
                const a = evaluationStack.pop();
                if (token === '/' && b === 0) {
                    throw new Error("Division by zero");
                }
                switch (token) {
                    case '+':
                        evaluationStack.push(a + b);
                        break;
                    case '-':
                        evaluationStack.push(a - b);
                        break;
                    case '*':
                        evaluationStack.push(a * b);
                        break;
                    case '/':
                        evaluationStack.push(a / b);
                        break;
                    case '%':
                        evaluationStack.push(a % b);
                        break;
                }
            }
        });

        // Final validation
        if (evaluationStack.length !== 1) {
            throw new Error("Invalid expression: Unable to compute result.");
        }

        return evaluationStack[0];
    } catch (error) {
        return error.message; // Return the error message instead of throwing it
    }
}
