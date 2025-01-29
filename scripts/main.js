/**
 * @fileoverview Main script for initializing the Scientific Calculator application.
 * Initializes the Calculator instance when the window loads.
*/

import Calculator from './calculator.js';

window.onload = () => {
    new Calculator();
};