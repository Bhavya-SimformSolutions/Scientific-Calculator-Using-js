let equal_pressed = 0;
let button_input = document.querySelectorAll(".input-button");
let input = document.getElementById("input");
let equal = document.getElementById("equal");
let clear = document.getElementById("clear");
let erase = document.getElementById("erase");

window.onload = () => {
    input.value = "";
};

//bdha input buttons upar ni click event
button_input.forEach((button_class) => {
    button_class.addEventListener("click", () => {
        if (equal_pressed == 1) {
            input.value = "";
            equal_pressed = 0;
        }
        input.value += button_class.value;
    });
});

//equal button upar ni click event
equal.addEventListener("click", () => {
    equal_pressed = 1;
    let inp_val = input.value;
    try {
        let solution = calculateBasicOperations(inp_val);

        // Display the solution or format it if it's a valid number
        if (typeof solution === 'number') {
            input.value = Number.isInteger(solution) ? solution : solution.toFixed(2);
        } else {
            // Display pop-up with error message if it's a string (error)
            alert(solution);
        }
    } catch (err) {
        // Catch any unexpected errors and show an alert
        alert(err.message);
    }
});


//clear button upar ni click event
clear.addEventListener("click", () => (input.value = ""));

//erase button upar ni click event
erase.addEventListener("click", () => {
    input.value = input.value.substr(0, input.value.length - 1); // last character remove 
});

// Shunting Yard Algorithm
function calculateBasicOperations(expression) {
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 , '%': 2};
    const isOperator = (char) => ['+', '-', '*', '/','%'].includes(char);
    const isNumber = (char) => !isNaN(char);

    try {
        // Step 1: Tokenize the input
        const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/|\%|\(|\))/g);
        if (!tokens) {
            throw new Error("Invalid expression: Empty input or invalid characters.");
        }

        // Check for invalid expressions before proceeding further
        if (tokens[0] === '+' || tokens[0] === '-' || isOperator(tokens[tokens.length - 1])) {
            throw new Error("Invalid expression: Expression cannot start or end with an operator.");
        }

        // Fix tokens for negative numbers
        let fixedTokens = [];
        for (let i = 0; i < tokens.length; i++) {
            if (
                tokens[i] === '-' &&
                (i === 0 || tokens[i - 1] === '(' || isOperator(tokens[i - 1]))
            ) {
                fixedTokens.push(tokens[i] + tokens[i + 1]);
                i++;
            } else {
                fixedTokens.push(tokens[i]);
            }
        }

        // Check for consecutive operators
        for (let i = 0; i < fixedTokens.length - 1; i++) {
            if (isOperator(fixedTokens[i]) && isOperator(fixedTokens[i + 1])) {
                throw new Error("Invalid expression: Consecutive operators are not allowed.");
            }
        }

        let outputQueue = [];
        let operatorStack = [];

        // Step 2: Shunting-Yard Algorithm to convert to RPN
        fixedTokens.forEach(token => {
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
            outputQueue.push(operatorStack.pop());
        }

        // Step 4: Evaluate the RPN expression
        let evaluationStack = [];
        outputQueue.forEach(token => {
            if (typeof token === 'number') {
                evaluationStack.push(token);
            } else if (isOperator(token)) {
                const b = evaluationStack.pop();
                const a = evaluationStack.pop();
                if (token === '/' && b === 0) {
                    throw new Error("Division by zero");
                }
                switch (token) {
                    case '+': evaluationStack.push(a + b); break;
                    case '-': evaluationStack.push(a - b); break;
                    case '*': evaluationStack.push(a * b); break;
                    case '/': evaluationStack.push(a / b); break;
                    case '%': evaluationStack.push(a % b); break;
                }
            }
        });

        return evaluationStack[0];

    } catch (error) {
        return error.message; // Return the error message instead of throwing it
    }
}
