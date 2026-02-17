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

        /*
        (async () => {
          const isUp = await SorsLoadBalancer.checkSite("https://sors.somee.com");
          console.log("Reachable?", isUp);
        })();
        */

        checkSite: function (url) {
             return fetch(url, { mode: 'no-cors' })
                .then(() => {
                  SorsLoadBalancer._mirrorCheck++;
                  return true;  
                })
                .catch(() => {
                  SorsLoadBalancer._mirrorCheck++;
                  return false;  // site is not reachable
                });
        },

        loadBalancer: function (queryParametars) {

            var urlPage1 = "https://" + SorsEndpoint.Server1Domain() + "/";
            var urlPage2 = "https://" + SorsEndpoint.Server2Domain() + "/";
            var urlPage3 = "https://" + SorsEndpoint.Server3Domain() + "/";
            var currentUrlPage = location.protocol + "//" + $(location).attr('hostname') + "/";
                       
            var [isUrl2Active, isUrl3Active] = [null, null];
                     
            (async () => {
                  [isUrl2Active, isUrl3Active] = await Promise.all([
                       SorsLoadBalancer.checkSite(urlPage2),
                       SorsLoadBalancer.checkSite(urlPage3)
                  ]);
                
                  console.log("Reachable urlPage2?", isUrl2Active);
                  console.log("Reachable urlPage3?", isUrl3Active);                            
            })();
            
          

            const myRefreshFunction = function () {
                setTimeout(function () {

                    if (SorsLoadBalancer._lock == false && SorsLoadBalancer._mirrorCheck >= 2 && isUrl2Active != null && isUrl3Active != null) {
                        SorsLoadBalancer._lock = true;
                        
                        const roundRobin = randomInt(0, 2);
                        

                        if (isUrl2Active && isUrl3Active && roundRobin == 0) {
                            window.location.href = urlPage2 + queryParametars;
                        }
                        else if (isUrl2Active && isUrl3Active && roundRobin > 0) {
                            window.location.href = urlPage3 + queryParametars;
                        }
                        // else if (isUrl1Active) {
                        //    window.location.href = urlPage1 + queryParametars;
                        // }
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

    function randomInt(min, max) { // min and max included 
         return Math.floor(Math.random() * (max - min + 1) + min);
    }

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












