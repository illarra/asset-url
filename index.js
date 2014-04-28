'use strict';

var ints   = ['w', 'h', 'blur'];
var bools  = ['cover', 'bw', 'sepia'];
var limits = { w: 1500, h: 1500, blur: 25 };

module.exports.getCanonical = function (tpl, params) {
    var opts    = this.parseOptions(params.options);
    var vars    = ints.concat(bools).sort();
    var optsArr = [];
    var hasSize = false;
    var opt;

    for (var i = 0; i < vars.length; i++) {
        opt = vars[i];

        if (opt in opts) {
            if (typeof opts[opt] === 'boolean') {
                optsArr.push(opt);
            } else {
                // Check if width or height exist, change status
                if (opt === 'w' || opt === 'h') {
                    hasSize = true;
                }

                // Limit values
                if (opts[opt] > limits[opt]) {
                    opts[opt] = limits[opt];
                }

                optsArr.push(opt + opts[opt]);
            }
        }
    }

    // Remove cover if neither "w" or "h" are present
    var coverIdx = optsArr.indexOf('cover');

    if (coverIdx !== -1 && !hasSize) {
        optsArr.splice(coverIdx, 1);
    }

    // Replace input options
    params.options = optsArr.join(',')

    // Replace :vars
    for (var param in params) {
        tpl = tpl.replace(':'+ param, params[param]);
    }

    // Remove trailing slash
    return tpl.replace(/\/$/, '');
};

module.exports.parseOptions = function (opts) {
    var out = {};

    opts = (opts || '').split(',');

    for (var i = 0; i < opts.length; i++) {
        var opt = opts[i].toLowerCase();

        if (/^[a-z]+\d+$/.test(opt)) {
            var name = opt.replace(/\d+/, '');

            if (ints.indexOf(name) !== -1) {
                out[name] = parseInt(opt.replace(name, ''));
            }
        } else {
            if (bools.indexOf(opt) !== -1) {
                out[opt] = true;
            }
        }
    }

    return out;
};
