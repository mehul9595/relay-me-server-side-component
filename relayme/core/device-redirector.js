// Returns the URL where user should be redirected, based on the device.
module.exports = function(modules) {
    var redirectFunction = function redirect(device, version, querystring) {
        switch (device.toLowerCase()) {
        case modules.config.application.deviceTypeAndroid:
            return modules.config.application.deviceRedirectUrlAndroid + '?' + querystring;
            break;
        }
    };
    return redirectFunction;
}
