/**
 * Sets up event handlers for the calculator.
 *
 * @param {Object} calculator - The calculator object that contains handler methods for various events.
 * @param {Function} calculator.handleInputButtonClick - Handles click events on input buttons.
 * @param {Function} calculator.handleEqualButtonClick - Handles click events on the equal button.
 * @param {Function} calculator.handleClearButtonClick - Handles click events on the clear button.
 * @param {Function} calculator.handleEraseButtonClick - Handles click events on the erase button.
 * @param {Function} calculator.handleDegButtonClick - Handles click events on the degree button.
 * @param {Function} calculator.handleSecondButtonClick - Handles click events on the second function button.
 * @param {Function} calculator.handleTrigButtonClick - Handles click events on trigonometric function buttons.
 * @param {Function} calculator.handleLogButtonClick - Handles click events on the log button.
 * @param {Function} calculator.handlePiButtonClick - Handles click events on the pi button.
 * @param {Function} calculator.handleEButtonClick - Handles click events on the e button.
 * @param {Function} calculator.handleSqrtButtonClick - Handles click events on the square root button.
 * @param {Function} calculator.handleLnButtonClick - Handles click events on the natural logarithm button.
 * @param {Function} calculator.handlePowButtonClick - Handles click events on the power button.
 * @param {Function} calculator.handleFactorialButtonClick - Handles click events on the factorial button.
 * @param {Function} calculator.handleReciprocalButtonClick - Handles click events on the reciprocal button.
 * @param {Function} calculator.handleAbsButtonClick - Handles click events on the absolute value button.
 * @param {Function} calculator.handleKeyboardInput - Handles keyboard input events.
 * @param {Function} calculator.handleThemeToggle - Handles theme toggle events.
 * @param {Function} calculator.clearHistory - Clears the calculation history.
 * @param {Function} calculator.toggleHistory - Toggles the visibility of the calculation history.
 */
export function setupEventHandlers(calculator) {
    document.querySelectorAll(".input-button").forEach(button => {
        button.addEventListener("click", () => calculator.handleInputButtonClick(button.value));
    });

    document.getElementById("equal").addEventListener("click", () => calculator.handleEqualButtonClick());
    document.getElementById("clear").addEventListener("click", () => calculator.handleClearButtonClick());
    document.getElementById("erase").addEventListener("click", () => calculator.handleEraseButtonClick());
    document.querySelector('input[value="deg"]').addEventListener("click", () => calculator.handleDegButtonClick());
    document.getElementById("2nd").addEventListener("click", () => calculator.handleSecondButtonClick());

    document.getElementById("sin").addEventListener("click", () => calculator.handleTrigButtonClick("sin"));
    document.getElementById("cos").addEventListener("click", () => calculator.handleTrigButtonClick("cos"));
    document.getElementById("tan").addEventListener("click", () => calculator.handleTrigButtonClick("tan"));
    document.getElementById("log").addEventListener("click", () => calculator.handleLogButtonClick());
    document.getElementById("pi").addEventListener("click", () => calculator.handlePiButtonClick());
    document.getElementById("e").addEventListener("click", () => calculator.handleEButtonClick());
    document.getElementById("sqrt").addEventListener("click", () => calculator.handleSqrtButtonClick());
    document.getElementById("ln").addEventListener("click", () => calculator.handleLnButtonClick());
    document.getElementById("pow").addEventListener("click", () => calculator.handlePowButtonClick());
    document.getElementById("factorial").addEventListener("click", () => calculator.handleFactorialButtonClick());
    document.getElementById("reciprocal").addEventListener("click", () => calculator.handleReciprocalButtonClick());
    document.getElementById("abs").addEventListener("click", () => calculator.handleAbsButtonClick());

    document.addEventListener("keydown", (event) => calculator.handleKeyboardInput(event));
    document.getElementById("theme-toggle-checkbox").addEventListener("change", () => calculator.handleThemeToggle());
    document.getElementById("clear-history").addEventListener("click", () => calculator.clearHistory());
    document.getElementById("history-toggle").addEventListener("click", () => calculator.toggleHistory());
    document.getElementById("close-history").addEventListener("click", () => calculator.toggleHistory());
}