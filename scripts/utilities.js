/**
 * Calculates the result of a mathematical expression with basic operations.
 *
 * @param {string} expression - The mathematical expression to evaluate.
 * @param {boolean} isDegreeMode - If true, trigonometric functions will use degrees; otherwise, radians.
 * @returns {number|string} The result of the evaluated expression or an error message if the expression is invalid.
 *
 * @throws {Error} If the expression is invalid, contains mismatched parentheses, or division by zero occurs.
 */
export function calculateBasicOperations(expression, isDegreeMode) {
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
    const isOperator = (char) => ['+', '-', '*', '/', '%', '^'].includes(char);
    const isNumber = (char) => !isNaN(char);

    try {
        const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/|\%|\^|\(|\)|sin|cos|tan|log|π|e|sin⁻¹|cos⁻¹|tan⁻¹|10\^|e\^|x²|√|ln|!|abs)/g);
        if (!tokens) {
            throw new Error("Invalid expression: Empty input or invalid characters.");
        }

        if (
            isOperator(tokens[0]) && tokens[0] !== '-' ||
            isOperator(tokens[tokens.length - 1])
        ) {
            throw new Error("Invalid expression: Cannot start or end with an operator.");
        }

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

        for (let i = 0; i < fixedTokens.length - 1; i++) {
            if (isOperator(fixedTokens[i]) && isOperator(fixedTokens[i + 1])) {
                throw new Error("Invalid expression: Consecutive operators are not allowed.");
            }
        }

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
            } else if (token === 'sin' || token === 'cos' || token === 'tan' || token === 'log' || token === 'sin⁻¹' || token === 'cos⁻¹' || token === 'tan⁻¹' || token === '10^' || token === 'e^' || token === 'x²' || token === '√' || token === 'ln' || token === '!' || token === 'abs') {
                operatorStack.push(token);
            } else if (token === 'π') {
                outputQueue.push(Math.PI);
            } else if (token === 'e') {
                outputQueue.push(Math.E);
            }
        });

        while (operatorStack.length) {
            const op = operatorStack.pop();
            if (op === '(' || op === ')') {
                throw new Error("Invalid expression: Mismatched parentheses.");
            }
            outputQueue.push(op);
        }

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
                    case '^':
                        evaluationStack.push(Math.pow(a, b));
                        break;
                }
            } else if (token === 'sin') {
                const a = evaluationStack.pop();
                evaluationStack.push(isDegreeMode ? Math.sin(a * Math.PI / 180) : Math.sin(a));
            } else if (token === 'cos') {
                const a = evaluationStack.pop();
                evaluationStack.push(isDegreeMode ? Math.cos(a * Math.PI / 180) : Math.cos(a));
            } else if (token === 'tan') {
                const a = evaluationStack.pop();
                evaluationStack.push(isDegreeMode ? Math.tan(a * Math.PI / 180) : Math.tan(a));
            } else if (token === 'sin⁻¹') {
                const a = evaluationStack.pop();
                evaluationStack.push(isDegreeMode ? Math.asin(a) * 180 / Math.PI : Math.asin(a));
            } else if (token === 'cos⁻¹') {
                const a = evaluationStack.pop();
                evaluationStack.push(isDegreeMode ? Math.acos(a) * 180 / Math.PI : Math.acos(a));
            } else if (token === 'tan⁻¹') {
                const a = evaluationStack.pop();
                evaluationStack.push(isDegreeMode ? Math.atan(a) * 180 / Math.PI : Math.atan(a));
            } else if (token === 'log') {
                const a = evaluationStack.pop();
                evaluationStack.push(Math.log10(a));
            } else if (token === '10^') {
                const a = evaluationStack.pop();
                evaluationStack.push(Math.pow(10, a));
            } else if (token === 'ln') {
                const a = evaluationStack.pop();
                evaluationStack.push(Math.log(a));
            } else if (token === 'e^') {
                const a = evaluationStack.pop();
                evaluationStack.push(Math.exp(a));
            } else if (token === 'x²') {
                const a = evaluationStack.pop();
                evaluationStack.push(Math.pow(a, 2));
            } else if (token === '√') {
                const a = evaluationStack.pop();
                evaluationStack.push(Math.sqrt(a));
            } else if (token === '!') {
                const a = evaluationStack.pop();
                evaluationStack.push(factorialFunction(a));
            } else if (token === 'abs') {
                const a = evaluationStack.pop();
                evaluationStack.push(Math.abs(a));
            }
        });

        if (evaluationStack.length !== 1) {
            throw new Error("Invalid expression: Unable to compute result.");
        }

        return evaluationStack[0];
    } catch (error) {
        return error.message;
    }
}

/**
 * Calculates the factorial of a given non-negative integer.
 *
 * @param {number} n - The non-negative integer for which to calculate the factorial.
 * @returns {number} The factorial of the given number. Returns NaN if the input is negative.
 */
export function factorialFunction(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}