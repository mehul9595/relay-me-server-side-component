var express = require('express');

var google = require('./google');

module.exports = function(baseUrl, app, modules) {
    google(baseUrl + '/google', app, modules);
}
