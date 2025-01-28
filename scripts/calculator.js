import { calculateBasicOperations, factorialFunction } from './utilities.js';
import { setupEventHandlers } from './eventHandlers.js';

class Calculator {
    constructor() {
        this.equal_pressed = 0;
        this.lastResult = null;
        this.isDegreeMode = true;
        this.isSecondMode = false;
        this.input = document.getElementById("input");
        setupEventHandlers(this);
    }

    handleInputButtonClick(value) {
        if (this.equal_pressed === 1) {
            this.equal_pressed = 0;
        }
        this.input.value += value;
    }

    handleEqualButtonClick() {
        let inp_val = this.input.value;
        if (this.lastResult !== null && /^[+\-*/%]/.test(inp_val)) {
            inp_val = `${this.lastResult}${inp_val}`;
        }

        try {
            let solution = calculateBasicOperations(inp_val, this.isDegreeMode);
            if (typeof solution === 'number') {
                this.lastResult = solution;
                this.input.value = Number.isInteger(solution) ? solution : solution.toFixed(2);
            } else {
                alert(solution);
            }
        } catch (err) {
            alert(err.message);
        }

        this.equal_pressed = 1;
    }

    handleClearButtonClick() {
        this.input.value = "";
        this.lastResult = null;
    }

    handleEraseButtonClick() {
        this.input.value = this.input.value.substr(0, this.input.value.length - 1);
    }

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

    handleTrigButtonClick(func) {
        this.input.value += this.isSecondMode ? `${func}⁻¹(` : `${func}(`;
    }

    handleLogButtonClick() {
        if (this.isSecondMode) {
            this.input.value += this.input.value === "" ? "10^" : "10^";
        } else {
            this.input.value += "log(";
        }
    }

    handlePiButtonClick() {
        this.input.value += "π";
    }

    handleEButtonClick() {
        this.input.value += "e";
    }

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

    handleLnButtonClick() {
        if (this.isSecondMode) {
            this.input.value += this.input.value === "" ? "e^" : "e^";
        } else {
            this.input.value += "ln(";
        }
    }

    handlePowButtonClick() {
        if (this.input.value === "") {
            this.input.value = "0^";
        } else {
            this.input.value += "^";
        }
    }

    handleFactorialButtonClick() {
        if (this.input.value === "") {
            this.input.value += "0!";
        } else {
            this.input.value += "!";
        }
    }

    handleReciprocalButtonClick() {
        if (this.input.value === "") {
            this.input.value += "1/(";
        } else {
            let value = parseFloat(this.input.value);
            this.input.value = 1 / value;
        }
    }

    handleAbsButtonClick() {
        if (this.input.value === "") {
            this.input.value += "abs(";
        } else {
            this.input.value = `abs(${this.input.value})`;
        }
    }

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
}

export default Calculator;