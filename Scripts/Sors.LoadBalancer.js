/* SORS */

"use strict";

; (function (window, document, undefined) {
    var tests = [];

    /**
     *
     * SorsLoadBalancer is the constructor for SorsLoadBalancer
     *
     * @class
     * @access public
     */

    var SorsLoadBalancerPrototype = {
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


        loadBalancer: function (queryParametars) {

            var urlPage1 = "https://" + SorsEndpoint.Server1Domain() + "/";
            var urlPage2 = "https://" + SorsEndpoint.Server2Domain() + "/";
            var urlPage3 = "https://" + SorsEndpoint.Server3Domain() + "/";

            var isUrl1Active = null;
            var isUrl2Active = null;
            var isUrl3Active = null;

            var request = new XMLHttpRequest();
            var request2 = new XMLHttpRequest();
            var request3 = new XMLHttpRequest();

            var currentUrlPage = location.protocol + "//" + $(location).attr('hostname') + "/";

            request.open('GET', urlPage1, true);
            request.onerror = function () {
                isUrl1Active = false;
                SorsLoadBalancer._mirrorCheck++;
            };
            request.onload = function () {
                if (this.status === 404) {
                    isUrl1Active = false;
                }
                else if (this.status === 200) {
                    isUrl1Active = true;
                }
                SorsLoadBalancer._mirrorCheck++;

            };
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    SorsLoadBalancer._mirrorCheck++;
                    isUrl1Active = false;
                }
                else if (request.readyState === 4 && request.status === 0) {
                    isUrl1Active = false;
                    return;
                }
            };

            request2.open('GET', urlPage2, true);
            request2.onerror = function () {
                isUrl2Active = false;
                SorsLoadBalancer._mirrorCheck++;
            };
            request2.onload = function () {
                if (this.status === 404) {
                    isUrl2Active = false;
                }
                else if (this.status === 200) {
                    isUrl2Active = true;
                }
                SorsLoadBalancer._mirrorCheck++;
            };
            request2.onreadystatechange = function () {
                if (request2.readyState === 4 && request2.status === 200) {
                    SorsLoadBalancer._mirrorCheck++;
                    isUrl2Active = false;
                }
                else if (request2.readyState === 4 && request2.status === 0) {
                    isUrl2Active = false;
                    return;
                }
            };

            request3.open('GET', urlPage3, true);
            request3.onerror = function () {
                isUrl3Active = false;
                SorsLoadBalancer._mirrorCheck++;
            };
            request3.onload = function () {
                if (this.status === 404) {
                    isUrl3Active = false;
                }
                else if (this.status === 200) {
                    isUrl3Active = true;
                }
                SorsLoadBalancer._mirrorCheck++;
            };
            request3.onreadystatechange = function () {
                if (request3.readyState === 4 && request3.status === 200) {
                    SorsLoadBalancer._mirrorCheck++;
                    isUrl3Active = false;
                }
                else if (request3.readyState === 4 && request3.status === 0) {
                    isUrl3Active = false;
                    return;
                }
            };

            // request.send();
            request2.send();
            request3.send();



            const myRefreshFunction = function () {
                setTimeout(function () {

                    if (SorsLoadBalancer._lock == false && SorsLoadBalancer._mirrorCheck >= 2 && (isUrl2Active == true || isUrl3Active == true)) {
                        SorsLoadBalancer._lock = true;

                        if (isUrl1Active) {
                            window.location.href = urlPage1 + queryParametars;
                        }
                        else if (isUrl2Active) {
                            window.location.href = urlPage2 + queryParametars;
                        }
                        else if (isUrl3Active) {
                            window.location.href = urlPage3 + queryParametars;
                        }
                    }
                    else {
                        myRefreshFunction();
                    }

                }, 500);
            };

            myRefreshFunction();


        },


        redirect: function (urlPage1, queryParametars) {

            let currentUrlPage = location.protocol + "//" + $(location).attr('hostname') + "/";

            if (currentUrlPage == urlPage1 && queryParametars)
                window.location.href = urlPage1 + queryParametars + "#about";
            else if (currentUrlPage == urlPage1)
                window.location.href = urlPage1;
        },

        test2: function () {


        },






    };



    // Fake some of Object.create so we can force non test results to be non "own" properties.
    var SorsLoadBalancer = function () { };
    SorsLoadBalancer.prototype = SorsLoadBalancerPrototype;

    // Leak SorsLoadBalancer globally when you `require` it rather than force it here.
    // Overwrite name so constructor name is nicer :D
    SorsLoadBalancer = new SorsLoadBalancer();



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

    delete SorsLoadBalancerPrototype.addTest;
    delete SorsLoadBalancerPrototype.addAsyncTest;

    // Run the things that are supposed to run after the tests
    for (var i = 0; i < SorsLoadBalancer._q.length; i++)
    {
        SorsLoadBalancer._q[i]();
    }
    */

    // Leak SorsLoadBalancer namespace
    window.SorsLoadBalancer = SorsLoadBalancer;

})(window, document);

//(function ($) {

//    $(window).load(function () {

//    });


//    $(document).load(function () {

//    });

//    $(document).ready(function () {

//    });


//    $(window).bind("load", function () {
//        // SorsLoadBalancer.test();
//    });

//})($);

