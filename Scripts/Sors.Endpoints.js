
// service bus



/* SORS */

"use strict";

; (function (window, document, undefined) {
    var tests = [];

    /**
     *
     * SorsEndpoint is the constructor for SorsEndpoint
     *
     * @class
     * @access public
     */

    var SorsEndpointPrototype = {
        _version: '1.0',
        _config: {
            'classPrefix': '',
            'enableClasses': true,
            'enableJSClass': true,
            'usePrefixes': true
        },

        _q: [],
        _delay: 400,

        Gate: function () {
            return '256.12.12.3';
        },

        // BG
        Server1: function () {
            return '156.12.12.1';
        },

        // US - FACEBOOK CENTR
        Server2: function () {
            return '156.102.12.1';
        },

        // RU
        Server3: function () {
            return '200.12.120.1';
        },

        // INDIA
        Server4: function () {
            return '233.92.12.1';
        },

        // INDIA2
        Server5: function () {
            return '10.5.185.1';
        },

        // INDIA3
        Server6: function () {
            return '88.77.200.1';
        },






        GateDomain: function () {
            return 'sub.bg';
        },

        // BG
        Server1Domain: function () {
            return 'sorset.github.io';
        },

        // US - FACEBOOK CENTR
        Server2Domain: function () {
            return 'sorsconstruct.github.io';
        },

        // RU
        Server3Domain: function () {
            return 'sors.somee.com';
        },

        // INDIA
        Server4Domain: function () {
            return 'sub.i';
        },

        // INDIA2
        Server5Domain: function () {
            return 'sub.in';
        },

        // INDIA3
        Server6Domain: function () {
            return 'sub.india';
        },

        // Amazon 
        Server7Domain: function () {
            return 'sub.de';
        },


        Server01LocalDomain: function () {
            return 'localhost';
        },

        Server02LocalDomain: function () {
            return 'localhost/Sors.Subtitles';
        },



        // Free public
        Server01Domain: function () {
            return 'subsdiving.somee.com';
        },

        Server02Domain: function () {
            return 'aisub.bsite.net';
        },

        Server03Domain: function () {
            return 'subsdiv.info';
        },

        Server04Domain: function () {
            return 'pzprovi.github.io';
        },

        Server05Domain: function () {
            return 'subtitles.free.bg';
        },



    };



    // Fake some of Object.create so we can force non test results to be non "own" properties.
    var SorsEndpoint = function () { };
    SorsEndpoint.prototype = SorsEndpointPrototype;

    SorsEndpoint = new SorsEndpoint();

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
     * @access private
     */





    function test1() {

    }



    window.SorsEndpoint = SorsEndpoint;

})(window, document);


