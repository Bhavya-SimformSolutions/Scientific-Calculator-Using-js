import { calculateBasicOperations, factorialFunction } from './utilities.js';
import { setupEventHandlers } from './eventHandlers.js';

class Calculator {
    /**
     * Initializes a new instance of the Calculator class.
     * 
     * @constructor
     * @property {number} equal_pressed - Tracks the number of times the equal button has been pressed.
     * @property {number|null} lastResult - Stores the result of the last calculation.
     * @property {string|null} lastExpression - Stores the last mathematical expression entered.
     * @property {boolean} isDegreeMode - Indicates whether the calculator is in degree mode (true) or radian mode (false).
     * @property {boolean} isSecondMode - Indicates whether the calculator is in second function mode.
     * @property {HTMLElement} input - The input element where expressions are entered.
     * @property {HTMLElement} historyList - The element that displays the list of past calculations.
     * @property {HTMLElement} historySection - The section element that contains the history list.
     * @method loadHistory - Loads the calculation history from local storage.
     * @function setupEventHandlers - Sets up event handlers for the calculator's buttons and input.
     */
    constructor() {
        this.equal_pressed = 0;
        this.lastResult = null;
        this.lastExpression = null;
        this.isDegreeMode = true;
        this.isSecondMode = false;
        this.input = document.getElementById("input");
        this.historyList = document.getElementById("history-list");
        this.historySection = document.getElementById("history-section");
        this.loadHistory();
        setupEventHandlers(this);
    }

    /**
     * Handles the click event for input buttons on the calculator.
     * 
     * @param {string} value - The value of the button that was clicked.
     * 
     * This function updates the calculator's input field based on the button clicked.
     * If the equal button was pressed previously, it resets the equal_pressed flag.
     * It ensures that two consecutive operators are not allowed by replacing the last operator
     * with the new one if necessary. Otherwise, it appends the value to the input field.
     */
    handleInputButtonClick(value) {
        const operators = ['+', '-', '*', '/', '%'];

        if (this.equal_pressed === 1) {
            this.equal_pressed = 0;
        }

        if (operators.includes(this.input.value.slice(-1)) && operators.includes(value)) {
            // Replace the last operator with the new one
            this.input.value = this.input.value.slice(0, -1) + value;
        } else {
            this.input.value += value;
        }
    }


    /**
     * Handles the click event for the equal button.
     * 
     * This function evaluates the current input value, performs the calculation,
     * and updates the input field with the result. It also manages the history of
     * calculations and handles cases where the input starts with a negative number
     * after a previous calculation.
     * 
     * @throws {Error} If the calculation fails, an error message is displayed.
     */
    handleEqualButtonClick() {
        let inp_val = this.input.value;
        if (this.equal_pressed === 1 && this.lastExpression) {
            inp_val = this.lastExpression;
        } else {
            this.lastExpression = inp_val;
        }

        // Handle case where input starts with a negative number after a previous calculation
        if (this.lastResult !== null && /^[+\-*/%]/.test(inp_val) && !/^-/.test(inp_val)) {
            inp_val = `${this.lastResult}${inp_val}`;
        }

        try {
            let solution = calculateBasicOperations(inp_val, this.isDegreeMode);
            if (typeof solution === 'number') {
                this.lastResult = solution;
                this.input.value = Number.isInteger(solution) ? solution : solution.toFixed(4);
                if (this.equal_pressed === 0 || inp_val !== this.lastExpression) {
                    this.addToHistory(inp_val, solution);
                }
            } else {
                alert(solution);
            }
        } catch (err) {
            alert(err.message);
        }

        this.equal_pressed = 1;
    }

    /**
     * Clears the calculator input and resets the state.
     * 
     * This method is called when the clear button is clicked. It performs the following actions:
     * - Sets the input value to an empty string.
     * - Resets the last result to null.
     * - Resets the last expression to null.
     * - Resets the equal_pressed flag to 0.
     */
    handleClearButtonClick() {
        this.input.value = "";
        this.lastResult = null; 
        this.lastExpression = null; 
        this.equal_pressed = 0; 
    }

    
    /**
     * Handles the click event for the erase button.
     * Removes the last character from the input value.
     */
    handleEraseButtonClick() {
        this.input.value = this.input.value.substr(0, this.input.value.length - 1);
    }

    /**
     * Handles the click event for the degree/radian toggle button.
     * Toggles the value between "deg" and "rad" and updates the isDegreeMode property accordingly.
     */
    handleDegButtonClick() {
        const deg = document.querySelector('input[value="deg"], input[value="rad"]');
        if (deg.value === "deg") {
            deg.value = "rad";
            this.isDegreeMode = false;
        } else {
            deg.value = "deg";
            this.isDegreeMode = true;
        }
    }

    /**
     * Toggles the calculator's second mode and updates the button values accordingly.
     * When the second mode is activated, the background color of the "2nd" button is changed.
     * When the second mode is deactivated, the background color is reset.
     * The button values are updated based on the current mode.
     */
    handleSecondButtonClick() {
        this.isSecondMode = !this.isSecondMode;
        const second = document.getElementById("2nd");
        if (this.isSecondMode) {
            second.style.backgroundColor = "#0083e9";
            this.updateButtonValues("second");
        } else {
            second.style.backgroundColor = "";
            this.updateButtonValues("primary");
        }
    }

    /**
     * Updates the values of calculator buttons based on the selected mode.
     *
     * @param {string} mode - The mode to set the button values to. 
     *                        It can be either 'primary' or 'second'.
     */
    updateButtonValues(mode) {
        const buttonValues = {
            primary: {
                sin: "sin",
                cos: "cos",
                tan: "tan",
                sqrt: "√",
                log: "log",
                ln: "ln",
                pow: "xʸ"
            },
            second: {
                sin: "sin⁻¹",
                cos: "cos⁻¹",
                tan: "tan⁻¹",
                sqrt: "x²",
                log: "10ˣ",
                ln: "eˣ"
            }
        };

        for (const [key, value] of Object.entries(buttonValues[mode])) {
            document.getElementById(key).value = value;
        }
    }

    /**
     * Handles the click event for trigonometric function buttons.
     * Appends the appropriate trigonometric function (or its inverse) to the input value.
     *
     * @param {string} func - The trigonometric function to be appended (e.g., 'sin', 'cos', 'tan').
     */
    handleTrigButtonClick(func) {
        this.input.value += this.isSecondMode ? `${func}⁻¹(` : `${func}(`;
    }

    /**
     * Handles the click event for the logarithm button.
     * If the calculator is in the second mode, it appends "10^" to the input value.
     * Otherwise, it appends "log(" to the input value.
     */
    handleLogButtonClick() {
        if (this.isSecondMode) {
            this.input.value += this.input.value === "" ? "10^" : "10^";
        } else {
            this.input.value += "log(";
        }
    }

    /**
     * Appends the mathematical constant π (pi) to the current input value.
     */
    handlePiButtonClick() {
        this.input.value += "π";
    }

    /**
     * Handles the click event for the "e" button.
     * Appends the mathematical constant "e" to the current input value.
     */
    handleEButtonClick() {
        this.input.value += "e";
    }

    /**
     * Handles the click event for the square root button.
     * If the calculator is in the second mode, it squares the current input value.
     * Otherwise, it calculates the square root of the current input value.
     * If there is no input value, it appends "√(" to the input field.
     */
    handleSqrtButtonClick() {
        if (this.isSecondMode) {
            let value = this.input.value || "0";
            this.input.value = Math.pow(parseFloat(value), 2);
        } else {
            if (this.input.value) {
                let value = this.input.value;
                this.input.value = Math.sqrt(parseFloat(value));
            } else {
                this.input.value += "√(";
            }
        }
    }

    /**
     * Handles the click event for the natural logarithm (ln) button.
     * If the calculator is in the second mode, it appends "e^" to the input value.
     * Otherwise, it appends "ln(" to the input value.
     */
    handleLnButtonClick() {
        if (this.isSecondMode) {
            this.input.value += this.input.value === "" ? "e^" : "e^";
        } else {
            this.input.value += "ln(";
        }
    }

    /**
     * Handles the click event for the power (^) button.
     * If the input value is empty, sets the input value to "0^".
     * Otherwise, appends "^" to the current input value.
     */
    handlePowButtonClick() {
        if (this.input.value === "") {
            this.input.value = "0^";
        } else {
            this.input.value += "^";
        }
    }

    /**
     * Handles the click event for the factorial button.
     * If the input value is empty, it sets the input value to "0!".
     * Otherwise, it appends "!" to the current input value.
     */
    handleFactorialButtonClick() {
        if (this.input.value === "") {
            this.input.value += "0!";
        } else {
            this.input.value += "!";
        }
    }

    /**
     * Handles the reciprocal button click event.
     * If the input value is empty, it appends "1/(" to the input value.
     * Otherwise, it calculates the reciprocal of the current input value and updates the input value.
     */
    handleReciprocalButtonClick() {
        if (this.input.value === "") {
            this.input.value += "1/(";
        } else {
            let value = parseFloat(this.input.value);
            this.input.value = 1 / value;
        }
    }

    /**
     * Handles the click event for the absolute value button.
     * If the input value is empty, it adds "abs(" to the input.
     * If the input value is not empty, it wraps the current input value with "abs()".
     */
    handleAbsButtonClick() {
        if (this.input.value === "") {
            this.input.value += "abs(";
        } else {
            this.input.value = `abs(${this.input.value})`;
        }
    }

    /**
     * Handles keyboard input for the calculator.
     * 
     * @param {KeyboardEvent} event - The keyboard event triggered by the user.
     * @returns {void}
     */
    handleKeyboardInput(event) {
        const key = event.key;
        const validKeys = "0123456789+-*/%^().";
        const specialKeys = {
            "Enter": "=",
            "Backspace": "erase",
            "Delete": "clear",
            "Escape": "clear"
        };

        if (validKeys.includes(key)) {
            this.handleInputButtonClick(key);
        } else if (specialKeys[key]) {
            if (specialKeys[key] === "=") {
                this.handleEqualButtonClick();
            } else if (specialKeys[key] === "erase") {
                this.handleEraseButtonClick();
            } else if (specialKeys[key] === "clear") {
                this.handleClearButtonClick();
            }
        }
    }

    /**
     * Toggles the theme of the calculator between light mode and dark mode.
     * This function checks the state of the theme toggle checkbox and applies
     * or removes the 'dark-mode' class to various elements in the document
     * based on whether the checkbox is checked or not.
     */
    handleThemeToggle() {
        const isChecked = document.getElementById('theme-toggle-checkbox').checked;
        document.body.classList.toggle('dark-mode', isChecked);
        document.querySelector('.calculator').classList.toggle('dark-mode', isChecked);
        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.classList.toggle('dark-mode', isChecked);
        });
        document.querySelectorAll('input[type="button"]').forEach(button => {
            button.classList.toggle('dark-mode', isChecked);
        });
        document.querySelectorAll('button#erase').forEach(button => {
            button.classList.toggle('dark-mode', isChecked);
        });
        document.querySelectorAll('input[value="AC"]').forEach(button => {
            button.classList.toggle('dark-mode', isChecked);
        });
        document.querySelectorAll('input[value="="]').forEach(button => {
            button.classList.toggle('dark-mode', isChecked);
        });
    }

    /**
     * Adds the given expression and its result to the calculation history.
     *
     * @param {string} expression - The mathematical expression that was evaluated.
     * @param {number|string} result - The result of the evaluated expression.
     */
    addToHistory(expression, result) {
        const historyItem = document.createElement("li");
        historyItem.textContent = `${expression} = ${result}`;
        this.historyList.appendChild(historyItem);
        this.saveHistory();
    }

    /**
     * Saves the current calculation history to the local storage.
     * The history is retrieved from the list items in the history list element.
     * Each list item's text content is stored in an array, which is then
     * serialized to a JSON string and saved in the local storage under the key "calculatorHistory".
     */
    saveHistory() {
        const historyItems = [];
        this.historyList.querySelectorAll("li").forEach(item => {
            historyItems.push(item.textContent);
        });
        localStorage.setItem("calculatorHistory", JSON.stringify(historyItems));
    }

    /**
     * Loads the calculator history from local storage and appends each history item to the history list in the DOM.
     * Retrieves the history items from local storage, parses them, and creates a list item for each history entry.
     * If no history is found in local storage, an empty array is used.
     */
    loadHistory() {
        const historyItems = JSON.parse(localStorage.getItem("calculatorHistory")) || [];
        historyItems.forEach(item => {
            const historyItem = document.createElement("li");
            historyItem.textContent = item;
            this.historyList.appendChild(historyItem);
        });
    }

    /**
     * Clears the calculator history.
     * This method empties the history list displayed in the UI and removes the stored history from local storage.
     */
    clearHistory() {
        this.historyList.innerHTML = "";
        localStorage.removeItem("calculatorHistory");
    }

    /**
     * Toggles the visibility of the history section.
     * Adds or removes the "show" class from the history section element.
     */
    toggleHistory() {
        this.historySection.classList.toggle("show");
    }
}

export default Calculator;