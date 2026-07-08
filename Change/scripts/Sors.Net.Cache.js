/* SORS */

/*
   requireScript('examplejs', '0.0.3', 'example.js');

   requireScript('jquery', '1.11.2', 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js', function(){
     requireScript('examplejs', '0.0.3', 'example.js');
   });

  if (!_isJqLoad()) {
        _injectScriptForce("/javascripts/jquery.js");
        _injectScriptForce("/javascripts/jquery.validate.min.js");
    }



     $(window).trigger("cacheReadyEvent");



      // bind to event                    
        $(window).on("cacheReadyEvent", function (event) {
            console.clear();
            console.log("cache is ready");

        });     
 */

"use strict";

var _cacheScriptCount = 0;
var _cacheDisableEvent = false;

function GetXmlHttpObject() {
    var request;
    try {
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            request = new ActiveXObject("Msxml2.XMLHTTP");
            if (!request) {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
    }
    catch (e) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }

    return request
}

function ValidateUrl(url) {
    var xmlhttp = GetXmlHttpObject();
    // xmlhttp.open('HEAD', url, false);
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    // return http.status != 404;    
    return xmlhttp.status == 200;
}

function _cacheScript(name, version, url) {
    var xmlhttp = GetXmlHttpObject();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                localStorage.setItem(name, JSON.stringify({
                    content: xmlhttp.responseText,
                    version: version
                }));
            } else {
                console.warn('error loading ' + url);
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function _loadScript(url, name, version, callback) {
    var s = document.createElement('script');

    if (s.readyState) { //IE
        s.onreadystatechange = function () {
            if (s.readyState == "loaded" || s.readyState == "complete") {
                s.onreadystatechange = null;
                _cacheScript(name, version, url);
                if (callback) callback();
            }
        };
    } else { //Others
        s.onload = function () {
            _cacheScript(name, version, url);
            if (callback) callback();
        };
    }

    s.setAttribute("src", url);
    document.getElementsByTagName("head")[0].appendChild(s)
}

function _injectScriptForce(url) {
    var request = GetXmlHttpObject();
    var se = document.createElement('script');
    se.type = "text/javascript";
    request.open("GET", url, false);
    request.send(null);
    se.text = request.responseText;
    document.getElementsByTagName('head')[0].appendChild(se);
}

function _injectScript(content, url, name, version, callback) {
    var c = JSON.parse(content);
    if (c.version != version) {
        localStorage.removeItem(name);
        _loadScript(url, name, version, callback);
        return;
    }
    var s = document.createElement('script');
    s.type = "text/javascript";
    var scriptContent = document.createTextNode(c.content);
    s.appendChild(scriptContent);
    document.getElementsByTagName("head")[0].appendChild(s);
    if (callback) callback();
}

function requireScript(name, version, url, callback) {

    var c = localStorage.getItem(name);
    if (c == null) {
        _loadScript(url, name, version, callback);
    } else {
        _injectScript(c, url, name, version, callback);
    }

    ++_cacheScriptCount;
}

function _isBootstrapValidationLoad() {
    return !(typeof $.jqBootstrapValidation  == 'undefined') && !(typeof $.jqBootstrapValidation  == 'undefined')
}

function _isJqLoad() {
    return !(typeof jQuery == 'undefined') && !(typeof $ == 'undefined');
}

function _isCacheCompleted(maxCount) {
    return _isCacheCompleted1(maxCount) || _isCacheCompleted2(maxCount);
}

function _isCacheCompleted1(maxCount) {
    return (maxCount > 0 && window.localStorage.length >= maxCount);
}

function _isCacheCompleted2(maxCount) {
    return (maxCount > 0 && _cacheScriptCount >= maxCount);
}

function _isCacheCompleted3(maxCount = 31) {

    let active = true;
    try {
        active = _isJqLoad();

        active = active && (!_isNull(typeof SorsChange));
        

        // if (window.location.pathname == "/index.html" || window.location.pathname == "/")
        //     active = active && (!_isNull(typeof SorsImdb));

        // if (window.location.pathname == "/youtube.html")
        //     active = active && (!_isNull(typeof YoutubeViewModel));

        /*
        active = active && (SorsGridView != 'undefined');
        active = active && (SorsBase != 'undefined');
        active = active && (SorsSecurity != 'undefined');
        active = active && (SorsNet != 'undefined');
        active = active && (SorsSession != 'undefined');
        active = active && (SorsCache != 'undefined');
        active = active && (SorsCookies != 'undefined');
        active = active && (SorsEndpoint != 'undefined');
        active = active && (SorsLoadBalancer != 'undefined');
        active = active && (Balancer != 'undefined');
        active = active && (SorsMail != 'undefined');
        active = active && (SorsMessages != 'undefined');
        active = active && (SorsPrimitive != 'undefined');
        active = active && (SorsRepEditor != 'undefined');
        active = active && (SorsProxy != 'undefined');
        active = active && (SorsServices != 'undefined');
        active = active && (SorsNotification != 'undefined');
        active = active && (SorsAnalytics != 'undefined');
        active = active && (SorsCommon != 'undefined');
        */

        // if (window.location.pathname == "/index.html")
        //     active = active && (SorsImdb != 'undefined');

        // if (window.location.pathname == "/youtube.html")
        //     active = active && (YoutubeViewModel != 'undefined');

        active = active && _isCacheCompleted1(maxCount);
    }
    catch {
        active = false;

    }

    return active;
}

function _isCacheCompleted4(maxCount = 1) {
    return (maxCount > 0 && _cacheScriptCount >= maxCount && _isJqLoad());
}

function _isNull(o) {
    if (o === null || o === "undefined" || o === "" || o === undefined || !o || o.length <= 0) {
        return true;
    }
    return false;
}

function _isCacheReady(maxCount) {

    if (_isNull(maxCount))
        maxCount = 31;

    let active = true;
    try {
        active = _isJqLoad();

        active = active && (!_isNull(typeof SorsChange));
        // active = active && (!_isNull(typeof SorsBase));
        // active = active && (!_isNull(typeof SorsSecurity));
        // active = active && (!_isNull(typeof SorsNet));
        // active = active && (!_isNull(typeof SorsSession));
        // active = active && (!_isNull(typeof SorsCache));
        // active = active && (!_isNull(typeof SorsCookies));
        // active = active && (!_isNull(typeof SorsEndpoint));
        // active = active && (!_isNull(typeof SorsLoadBalancer));
        // active = active && (!_isNull(typeof Balancer));
        // active = active && (!_isNull(typeof SorsMail));
        // active = active && (!_isNull(typeof SorsMessages));
        // active = active && (!_isNull(typeof SorsPrimitive));
        // active = active && (!_isNull(typeof SorsProxy));
        // active = active && (!_isNull(typeof SorsServices));
        // active = active && (!_isNull(typeof SorsNotification));
        // active = active && (!_isNull(typeof SorsAnalytics));
        // active = active && (!_isNull(typeof SorsCommon));

        // if (window.location.pathname == "/index.html" || window.location.pathname == "/")
        //     active = active && (!_isNull(typeof SorsImdb));

        // if (window.location.pathname == "/youtube.html")
        //     active = active && (!_isNull(typeof YoutubeViewModel));

        // if (window.location.pathname == "/repeditor.html") {
        //     active = active && (!_isNull(typeof SorsRepEditor));
        //     active = active && (!_isNull(typeof RepEditor));
        // }

        active = active && maxCount > 0;

        // active = active && _cacheScriptCount >= maxCount; 
        active = active && window.localStorage.length >= maxCount;
    }
    catch {
        active = false;
    }

    return active;
}


const _eventCacheReadyRecursiveFunction = function () {
    setTimeout(function () {
        if (!_cacheDisableEvent && _isCacheCompleted3()) {
            _cacheDisableEvent = true;
            $(window).trigger("cacheReadyEvent");
        }
        else {
            _eventCacheReadyRecursiveFunction();
        }

    }, 400);
};

_eventCacheReadyRecursiveFunction();


