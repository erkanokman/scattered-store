"use strict";

var Q = require('q');
var jetpack = require('fs-jetpack');
var core = require('./lib/core');

function create(storageDir, options) {
    var qd = Q.defer();
    
    function done() {
        qd.resolve(core(storageDir, options));
    }
    
    if (typeof storageDir !== 'string' || storageDir.length === 0) {
        qd.reject(new Error('Path to storage directory not specified.'));
    } else {
        // first check if directory exists
        jetpack.existsAsync(storageDir)
        .then(function (exists) {
            if (exists === 'file') {
                qd.reject(new Error('Given path is a file, but directory required.'));
            } else if (exists === 'dir') {
                // dir already exists, we have to do nothing
                done();
            } else {
                // dir doesn't exist, so create it
                jetpack.dirAsync(storageDir)
                .then(function () {
                    done();
                }, qd.reject);
            }
        }, qd.reject);
    }
    
    return qd.promise;
};

// API
module.exports.create = create;