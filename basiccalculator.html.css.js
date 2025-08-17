<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Calculator</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        /* General Styling */
        :root {
            --bg-color: #f0f2f5;
            --calculator-bg: #ffffff;
            --display-bg: #222;
            --display-text: #fff;
            --button-bg: #f8f9fa;
            --button-hover-bg: #e9ecef;
            --operator-bg: #ff9f0a;
            --operator-hover-bg: #f5b90b;
            --special-bg: #6c757d;
            --special-hover-bg: #5a6268;
            --shadow-color: rgba(0, 0, 0, 0.15);
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: var(--bg-color);
            font-family: 'Roboto', sans-serif;
            margin: 0;
        }

        /* Calculator Container */
        .calculator {
            width: 100%;
            max-width: 360px;
            background: var(--calculator-bg);
            border-radius: 20px;
            box-shadow: 0 10px 30px var(--shadow-color);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* Display Screen */
        .calculator-display {
            background: var(--display-bg);
            color: var(--display-text);
            padding: 25px 20px;
            text-align: right;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
        }

        .display-history {
            font-size: 0.9rem;
            color: #bbb;
            min-height: 20px;
            overflow-wrap: break-word;
        }

        .display-input {
            font-size: 2.5rem;
            font-weight: 500;
            min-height: 50px;
            overflow-wrap: break-word;
        }

        /* Button Grid */
        .calculator-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1px;
            background-color: #ddd;
            padding: 0;
        }

        /* Individual Buttons */
        .btn {
            padding: 20px;
            font-size: 1.5rem;
            border: none;
            background-color: var(--button-bg);
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
            -webkit-tap-highlight-color: transparent; /* Removes tap highlight on mobile */
        }

        .btn:hover {
            background-color: var(--button-hover-bg);
        }

        .btn:active {
            transform: scale(0.98);
        }

        /* Operator Buttons Styling */
        .btn-operator {
            background-color: var(--operator-bg);
            color: white;
        }

        .btn-operator:hover {
            background-color: var(--operator-hover-bg);
        }

        /* Special Function Buttons Styling */
        .btn-special {
            background-color: var(--special-bg);
            color: white;
        }

        .btn-special:hover {
            background-color: var(--special-hover-bg);
        }
        
        /* Equal Button Styling */
        .btn-equal {
            grid-column: span 2;
            background-color: var(--operator-bg);
            color: white;
        }
        .btn-equal:hover {
            background-color: var(--operator-hover-bg);
        }

    </style>
</head>
<body>

    <div class="calculator">
        <!-- Calculator Display -->
        <div class="calculator-display">
            <div class="display-history" id="history"></div>
            <div class="display-input" id="display">0</div>
        </div>
<!-- Calculator Buttons -->
        <div class="calculator-buttons">
            <button class="btn btn-special" data-action="clear">AC</button>
            <button class="btn btn-special" data-action="sign">+/-</button>
            <button class="btn btn-special" data-action="percentage">%</button>
            <button class="btn btn-operator" data-action="divide">÷</button>

            <button class="btn" data-value="7">7</button>
            <button class="btn" data-value="8">8</button>
            <button class="btn" data-value="9">9</button>
            <button class="btn btn-operator" data-action="multiply">×</button>

            <button class="btn" data-value="4">4</button>
            <button class="btn" data-value="5">5</button>
            <button class="btn" data-value="6">6</button>
            <button class="btn btn-operator" data-action="subtract">−</button>

            <button class="btn" data-value="1">1</button>
            <button class="btn" data-value="2">2</button>
            <button class="btn" data-value="3">3</button>
            <button class="btn btn-operator" data-action="add">+</button>

            <button class="btn" data-value="0">0</button>
            <button class="btn" data-action="decimal">.</button>
            <button class="btn btn-equal" data-action="calculate">=</button>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const display = document.getElementById('display');
            const historyDisplay = document.getElementById('history');
            const buttons = document.querySelector('.calculator-buttons');

            // Calculator State
            let currentInput = '0';
            let firstOperand = null;
            let operator = null;
            let shouldResetDisplay = false;

            /**
             * Updates the calculator display with the current input.
             */
            function updateDisplay() {
                display.textContent = currentInput;
            }

            /**
             * Handles number button clicks.
             * @param {string} number - The number that was clicked.
             */
            function handleNumber(number) {
                if (currentInput === '0' || shouldResetDisplay) {
                    currentInput = number;
                    shouldResetDisplay = false;
                } else {
                    currentInput += number;
                }
            }

            /**
             * Handles operator button clicks.
             * @param {string} nextOperator - The operator that was clicked.
             */
            function handleOperator(nextOperator) {
                const inputValue = parseFloat(currentInput);

                if (operator && !shouldResetDisplay) {
                    const result = calculate(firstOperand, inputValue, operator);
                    currentInput = String(result);
                    firstOperand = result;
                } else {
                    firstOperand = inputValue;
                }

                operator = nextOperator;
                shouldResetDisplay = true;
                historyDisplay.textContent = ${firstOperand} ${getOperatorSymbol(operator)};
            }

            /**
             * Performs the calculation based on the operands and operator.
             * @param {number} a - The first operand.
             * @param {number} b - The second operand.
             * @param {string} op - The operator.
             * @returns {number} The result of the calculation.
             */
            function calculate(a, b, op) {
                switch (op) {
                    case 'add': return a + b;
                    case 'subtract': return a - b;
case 'multiply': return a * b;
                    case 'divide':
                        if (b === 0) {
                            return 'Error';
                        }
                        return a / b;
                    default: return b;
                }
            }
            
            /**
             * Converts operator action to its symbol for display.
             * @param {string} opAction - The operator action name.
             * @returns {string} The operator symbol.
             */
            function getOperatorSymbol(opAction) {
                switch(opAction) {
                    case 'add': return '+';
                    case 'subtract': return '−';
                    case 'multiply': return '×';
                    case 'divide': return '÷';
                    default: return '';
                }
            }

            /**
             * Resets the calculator to its initial state.
             */
            function clearCalculator() {
                currentInput = '0';
                firstOperand = null;
                operator = null;
                shouldResetDisplay = false;
                historyDisplay.textContent = '';
            }

            /**
             * Main event listener for all button clicks.
             */
            buttons.addEventListener('click', (event) => {
                const { target } = event;
                if (!target.matches('button')) return;

                const { action, value } = target.dataset;

                if (value) {
                    handleNumber(value);
                } else if (action) {
                    switch (action) {
                        case 'add':
                        case 'subtract':
                        case 'multiply':
                        case 'divide':
                            handleOperator(action);
                            break;
                        case 'decimal':
                            if (!currentInput.includes('.')) {
                                currentInput += '.';
                            }
                            break;
                        case 'clear':
                            clearCalculator();
                            break;
                        case 'sign':
                            currentInput = String(parseFloat(currentInput) * -1);
                            break;
                        case 'percentage':
                            currentInput = String(parseFloat(currentInput) / 100);
                            break;
                        case 'calculate':
                            if (operator && firstOperand !== null) {
                                const secondOperand = parseFloat(currentInput);
                                const result = calculate(firstOperand, secondOperand, operator);
                                historyDisplay.textContent = ${firstOperand} ${getOperatorSymbol(operator)} ${secondOperand} =;
                                currentInput = String(result);
                                operator = null;
                                firstOperand = null;
                                shouldResetDisplay = true;
                            }
                            break;
                    }
                }
                updateDisplay();
            });

            // Initialize display
            updateDisplay();
        });
    </script>

</body>
</html>