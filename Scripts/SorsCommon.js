/*
 * Sors Common and Primitives  
 */

"use strict";


var __uniqUserSession = window.URL.createObjectURL(new Blob([])).substr(-36); // window.URL.createObjectURL(new Blob([])).substring(31);
var __guidEmpty = "00000000-0000-0000-0000-000000000000";


/*
 *  // get queryParams from url
 * @param {any} name
 * @param {any} url
 * var searchText = getParameterByName('search');
 */

function getParameterByName(name, url) {
    if (isNull(url))
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// if (!isNullOrEmpty(typeof SorsGridView))
function isNull(o) {
    if (o === null || o === "undefined" || o === "" || o === undefined || !o || o.length <= 0) {
        return true;
    }
    return false;
}

function isNullOrEmpty(o) {
    return isNull(o);
}

function isLocalhost() {
    var result = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
    return result;
}

function isFacebookApp() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

function getDomainName() {
    var url = $(location).attr('protocol') + "//" + $(location).attr('host');
    return url;
}

function isIeBrowser() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var edge = ua.indexOf('Edge/');
    var new_ie = ua.indexOf('Trident/');


    if (msie > -1) // If Internet Explorer, return version number
    {
        return true;
        // alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
    }
    else if (edge > -1) {
        return true;
    }
    else if (new_ie > -1) {
        return true;
    }
    else  // If another browser, return 0
    {
        return false;
        //alert('otherbrowser');
    }

}

function isMozillaBrowser() {
    var ua = window.navigator.userAgent;
    return ua.indexOf('Mozilla/') > -1 || ua.indexOf("Firefox/") > -1;
}

function MozillaBrowserVersion() {
    var match = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    var ver = match ? parseInt(match[1]) : 0;
    return ver;
}

function log() {
    let errorDetected = false;
    let errorMessage = 'The error was detected in Sors JS Framework objects: ';
    try {
        if (!_isJqLoad()) errorMessage += 'JQuery ';

        if (isNullOrEmpty(typeof SorsGridView)) { errorMessage += 'SorsGridView '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsBase)) { errorMessage += 'SorsBase '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsSecurity)) { errorMessage += 'SorsSecurity '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsNet)) { errorMessage += 'SorsNet '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsSession)) { errorMessage += 'SorsSession '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsCache)) { errorMessage += 'SorsCache '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsCookies)) { errorMessage += 'SorsCookies '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsEndpoint)) { errorMessage += 'SorsEndpoint '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsLoadBalancer)) { errorMessage += 'SorsLoadBalancer '; errorDetected = true; }
        if (isNullOrEmpty(typeof Balancer)) { errorMessage += 'Balancer '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsMail)) { errorMessage += 'SorsMail '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsMessages)) { errorMessage += 'SorsMessages '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsPrimitive)) { errorMessage += 'SorsPrimitive '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsProxy)) { errorMessage += 'SorsProxy '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsServices)) { errorMessage += 'SorsServices '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsNotification)) { errorMessage += 'SorsNotification '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsAnalytics)) { errorMessage += 'SorsAnalytics '; errorDetected = true; }
        if (isNullOrEmpty(typeof SorsCommon)) { errorMessage += 'SorsCommon '; errorDetected = true; }


        if (window.location.pathname == "/index.html" || window.location.pathname == "/")
            if (isNullOrEmpty(typeof SorsImdb)) { errorMessage += 'SorsImdb '; errorDetected = true; }

        if (window.location.pathname == "/youtube.html")
            if (isNullOrEmpty(typeof YoutubeViewModel)) { errorMessage += 'YoutubeViewModel '; errorDetected = true; }

        if (window.location.pathname == "/repeditor.html") {
            if (isNullOrEmpty(typeof SorsRepEditor)) { errorMessage += 'SorsRepEditor '; errorDetected = true; }
            if (isNullOrEmpty(typeof RepEditor)) { errorMessage += 'RepEditor '; errorDetected = true; }
        }

    }
    catch (e) {
        errorMessage += e;
        errorDetected = true;
    }

    if (errorDetected)
        return errorMessage;
    else
        return "";

}

function logMessage(message) {
    if (SorsCookies.GetUserId() == __guidEmpty)
        console.log(message);
}

function logRequest(description, create, userId) {
    
    var logModel = {
        description: description,
        create: create ?? new Date().toISOString(),
        user: userId  
    };

    $.ajax({
        async: true,
        crossDomain: true,
        // processData: false,
        timeout: 1000,
        method: "POST",
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "api/LogController/AddLog",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Token": "78b8f6dd-3e99-47c0-ba7a-6d87b7e87533",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE",
            "Access-Control-Allow-Headers": "Content-Type, soapaction, Origin, X-Requested-With, Content-Type, Accept"
        },
        // data:  JSON.stringify({
        //     "description": description,
        //     "create": create ?? "2024-09-17T14:22:30.1234567Z"
        // }),
        data: JSON.stringify(logModel),  
        success: function (response, textStatus, jqXhr) {
            console.log(response);
        },        
        error: function (jqXhr, textStatus, errorThrown) {           
            errorMessage(errorThrown, "HTTP Status: " + jqXhr.status + ". Error Text: " + jqXhr.responseText + ". Error message response from server GetMovieList: " + movieFilter + ", " + textStatus);             
        },
        statusCode: {
            404: function () {
                errorMessage(null, "page not found");
            },
            0: function () {
                errorMessage(null, "page cross-site scripting, DNS issues, ad blocker. request was interrupted. failed due to issue on the client side");
            }
        }

    });

}

// var err = new Error('message')
function errorMessage(error, message) {
    let promise = new Promise((resolve, reject) => {
        try {

            if (isNullOrEmpty(error))
                error = new Error('Unknown error.');

            if (isNullOrEmpty(message))
                message = error.message;

            if (isNullOrEmpty(error.stack))
                error.stack = '';

            if (!isNullOrEmpty(typeof SorsCookies))
                message += "</br> User Id: " + SorsCookies.GetUserId();

            message += log();

            if (SorsCookies.GetUserId() != __guidEmpty)
                SorsMail.sendInblueMail('SERVICE', 'SERVICE', 'SOFA', 'z.vmw@abv.bg', '</br>Session Id: ' + __uniqUserSession + '</br>AI.DIVING ERROR: ' + error, '</br> Error detected: ' + message + '</br> System info: ' + error.message + '</br> Browser: ' + window.navigator.userAgent + '</br> Stack: ' + error.stack.split("\n") + '</br> Date: ' + new Date(Date.now()).toGMTString());


            if (SorsCookies.GetUserId() == __guidEmpty)
                console.error(error.message + " " + message);

            resolve("done!")
        }
        catch (e) {
            console.error(e);
            reject(e);
        }
        // setTimeout(() => resolve("done!"), 1000)
    });
}

function clearCache(newVersion) {
    try {
        if ($('#ver').text() != newVersion) {
            localStorage.clear();
            window.location.href = window.location.href;
        }
    }
    catch (e) {
        localStorage.clear();
        window.location.href = window.location.href;
    }
}

