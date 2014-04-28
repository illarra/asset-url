asset-url
=========

    var assetUrl = require('asset-url');

    assetUrl.getCanonical('http://assets.example.com/:imgId/:options', {
        imgId: 1337,
        options: {
            bw: true
            w: 100,
            blur: 10,
            h: 200
        }
    });

    // Returns
    'http://assets.example.com/1337/blur10,bw,h200,w100'

    assetUrl.parseOptions('blur10,bw,h200,w100');

    // Returns
    {
        bw: true
        w: 100,
        blur: 10,
        h: 200
    }
