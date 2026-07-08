/* SORS */

"use strict";

; (function (window, document, undefined) {
    var tests = [];


    // Constants
    const EXCHANGE_RATE = 1.95583; // 1 EUR = 1.95583 BGN
    // const TOTAL_AMOUNT = 10.00; // Fixed total amount in EUR

    // DOM Elements

    const totalAmountInput = document.getElementById('totalAmount');

    const clientAmountInput = document.getElementById('clientAmount');
    const clientCurrencySelect = document.getElementById('clientCurrency');
    const optionalAmountInput = document.getElementById('optionalAmount');
    const optionalCurrencySelect = document.getElementById('optionalCurrency');
    const changeValueDisplay = document.getElementById('changeValue');
    const changeCurrencySelect = document.getElementById('changeCurrency');
    const unroundedChangeValueDisplay = document.getElementById('unroundedChangeValue');


    /**
     *
     * SorsChange is the constructor for SorsChange
     *
     * @class
     * @access public
     */

    var SorsChangePrototype = {
        _version: '1.0',
        _config: {
            'classPrefix': '',
            'enableClasses': true,
            'enableJSClass': true,
            'usePrefixes': true
        },

        _q: [],
        _delay: 400,
        _mirrorCheck: 0,
        _lock: false,

        formatCurrency: function (value) {
            return value.toFixed(2);
        },

        formatCurrencyUnrounded: function (value) {
            return value.toFixed(7);
        },

        convertCurrency: function (amount, fromCurrency, toCurrency) {
            if (fromCurrency === toCurrency) {
                return amount;
            }

            if (fromCurrency === 'EUR' && toCurrency === 'BGN') {
                return amount * EXCHANGE_RATE;
            } else if (fromCurrency === 'BGN' && toCurrency === 'EUR') {
                return amount / EXCHANGE_RATE;
            }

            return amount; // Fallback


        },


        autoSwitchCurrency: function () {
            const optionalCurrency = optionalCurrencySelect.value;

            // Set row 4 currency to the opposite of row 3
            if (optionalCurrency === 'EUR') {
                changeCurrencySelect.value = 'BGN';
            } else {
                changeCurrencySelect.value = 'EUR';
            }

            // Recalculate after switching currency
            SorsChange.calculateChange();

        },

        round: function (num, decimalPlaces = 2) {

            if (num < 0)
                return -SorsChange.round(-num, decimalPlaces);
            var p = Math.pow(10, decimalPlaces);
            var n = (num * p).toPrecision(15);
            let result = Math.round(n) / p;
            // return parseFloat(result);
            // return result === 0 ? 0 : result;
            return result;
        },

        calculateChange: function () {

            // Get values from inputs
            const totalAmount = parseFloat(totalAmountInput.value) || 0;
            const clientAmount = parseFloat(clientAmountInput.value) || 0;
            const clientCurrency = clientCurrencySelect.value;
            const optionalAmount = parseFloat(optionalAmountInput.value) || 0;
            const optionalCurrency = optionalCurrencySelect.value;
            const changeCurrency = changeCurrencySelect.value;

            // Step 1: Convert client amount to EUR
            const clientAmountInEUR = SorsChange.convertCurrency(clientAmount, clientCurrency, 'EUR');

            // Step 2: Calculate initial change in EUR (client amount - total)
            let changeInEUR = clientAmountInEUR - totalAmount;

            // Step 3: If optional amount is provided, subtract it (converted to EUR)
            if (optionalAmount > 0) {
                const optionalAmountInEUR = SorsChange.convertCurrency(optionalAmount, optionalCurrency, 'EUR');
                changeInEUR -= optionalAmountInEUR;
            }

            // Step 4: Convert the change to the desired currency
            let finalChange = SorsChange.convertCurrency(changeInEUR, 'EUR', changeCurrency);
            let roundFinallChange = parseFloat(SorsChange.round(finalChange));

            // Update the rounded display (2 decimal places)
            changeValueDisplay.textContent = `${SorsChange.formatCurrency(finalChange)} ${changeCurrency}`;

            // Update the unrounded display (7 decimal places)
            unroundedChangeValueDisplay.textContent = `${SorsChange.formatCurrencyUnrounded(finalChange)} ${changeCurrency}`;

            // Change color based on value for rounded display
            changeValueDisplay.classList.remove('negative-change', 'zero-change');

            if (roundFinallChange < 0) {
                changeValueDisplay.classList.add('negative-change'); // Red for negative change
            } else if (roundFinallChange === 0) {
                changeValueDisplay.classList.add('zero-change'); // Gray for zero change
            } else {
                // Keep default green color for positive change
                changeValueDisplay.style.color = '#27ae60';
            }

            // Also update color for unrounded display
            unroundedChangeValueDisplay.classList.remove('negative-change', 'zero-change');


            if (roundFinallChange < 0) {
                unroundedChangeValueDisplay.classList.add('negative-change');
            } else if (roundFinallChange === 0) {
                unroundedChangeValueDisplay.classList.add('zero-change');
            } else {
                unroundedChangeValueDisplay.style.color = '#4169e1'; // Royal blue for positive
            }
        },

        

    };


    // Fake some of Object.create so we can force non test results to be non "own" properties.
    var SorsChange = function () { };
    SorsChange.prototype = SorsChangePrototype;

    // Leak SorsChange globally when you `require` it rather than force it here.
    // Overwrite name so constructor name is nicer :D
    SorsChange = new SorsChange();


    /**
     * is returns a boolean if the typeof an obj is exactly type.
     *
     * @access private
     * @function is
     * @param {*} obj - A thing we want to check the type of
     * @param {string} type - A string to compare the typeof against
     * @returns {boolean}
     */

    function is(obj, type) {
        return typeof obj === type;
    }
    ;

    var classes = [];

    /**
     * Run through all tests and detect their support in the current UA.
     *
     * @access private
     */

    function testRunner() {
        var featureNames;
        var feature;

    }

    // Run each test
    /*
    testRunner();

    delete SorsChangePrototype.addTest;
    delete SorsChangePrototype.addAsyncTest;

    // Run the things that are supposed to run after the tests
    for (var i = 0; i < SorsChange._q.length; i++)
    {
        SorsChange._q[i]();
    }
    */

    // Leak SorsChange namespace
    window.SorsChange = SorsChange;

    // Initialize with error example calculation
    SorsChange.calculateChange();

    // Event Listeners

    totalAmountInput.addEventListener('input', SorsChange.calculateChange);

    clientAmountInput.addEventListener('input', SorsChange.calculateChange);
    clientCurrencySelect.addEventListener('change', SorsChange.calculateChange);
    optionalAmountInput.addEventListener('input', SorsChange.calculateChange);
    changeCurrencySelect.addEventListener('change', SorsChange.calculateChange);

    // Add event listener to optional currency select to auto-switch row 4
    optionalCurrencySelect.addEventListener('change', function () {
        // Auto-switch row 4 currency to opposite of row 3
        SorsChange.autoSwitchCurrency();
    });

    // Also call autoSwitchCurrency on initial load to ensure consistency
    SorsChange.autoSwitchCurrency();

    // Format inputs on blur
    clientAmountInput.addEventListener('blur', function () {
        if (this.value && !isNaN(parseFloat(this.value))) {
            this.value = SorsChange.formatCurrency(parseFloat(this.value));
        }
    });

    optionalAmountInput.addEventListener('blur', function () {
        if (this.value && !isNaN(parseFloat(this.value))) {
            this.value = SorsChange.formatCurrency(parseFloat(this.value));
        }
    });


})(window, document);

(function ($) {

    //    $(window).load(function () {
    //    });

    //    $(document).load(function () {
    //    });

    //    $(document).ready(function () {
    //    });

    //    $(window).bind("load", function () {
    //        SorsChange.test();
    //    });

})($);

