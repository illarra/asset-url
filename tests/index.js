'use strict';

var assets = require('../index');
var expect = require('chai').expect;

describe('/index.js', function () {

    describe('# getCanonical()', function () {

        it('should order the options', function () {
            expect(assets.getCanonical('/:id/:imgId/:options', {
                'id':      1,
                'imgId':   2,
                'options': 'blur20,cover,blur10,bw,h100,w200,sepia,random,cover,w-200'
            })).to.equal('/1/2/blur10,bw,cover,h100,sepia,w200');
        });

        it('should keep "cover" if "w" or "h" are present', function () {
            expect(assets.getCanonical('/:id/:imgId/:options', {
                'id':      1,
                'imgId':   2,
                'options': 'cover,w200'
            })).to.equal('/1/2/cover,w200');

            expect(assets.getCanonical('/:id/:imgId/:options', {
                'id':      1,
                'imgId':   2,
                'options': 'cover,h100'
            })).to.equal('/1/2/cover,h100');
        });

        it('should ignore "cover" if "w" and "h" are not present', function () {
            expect(assets.getCanonical('/:id/:imgId/:options', {
                'id':      1,
                'imgId':   2,
                'options': 'blur10,cover'
            })).to.equal('/1/2/blur10');
        });

        it('should limit the value of some options', function () {
            expect(assets.getCanonical('/:id/:imgId/:options', {
                'id':      1,
                'imgId':   2,
                'options': 'w10000,h10000,blur500'
            })).to.equal('/1/2/blur25,h1500,w1500');
        });

        it('should accept empty options', function () {
            expect(assets.getCanonical('/:id/:imgId/:options', {
                'id':      1,
                'imgId':   2,
                'options': ''
            })).to.equal('/1/2');
        });

    });

    describe('# parseOptions()', function () {

        it('should return an empty object on empty string', function () {
           expect(assets.parseOptions('')).to.deep.equal({});
        });

        it('should return an empty object on null or undefined', function () {
           expect(assets.parseOptions(null)).to.deep.equal({});
           expect(assets.parseOptions(undefined)).to.deep.equal({});
        });

        it('should ignore unknown options', function () {
            expect(assets.parseOptions('unknown')).to.deep.equal({});
        });

        it('should ignore empty options', function () {
            expect(assets.parseOptions('bw,,,')).to.deep.equal({ bw: true });
        });

        it('should parse non-numeric as booleans', function () {
            expect(assets.parseOptions('bw')).to.deep.equal({ bw: true });
        });

        it('should parse numeric as integers', function () {
            expect(assets.parseOptions('blur10')).to.deep.equal({ blur: 10 });
        });

        it('should ignore integer options if they dont have any number', function () {
            expect(assets.parseOptions('blur')).to.deep.equal({});
        });

        it('should ignore strange integer options', function () {
            expect(assets.parseOptions('blur-10')).to.deep.equal({});
        });

        it('should ignore duplicate entries and use the last one', function () {
            expect(assets.parseOptions('blur10,blur20')).to.deep.equal({ blur: 20 });
        });

        it('should handle different combinations', function () {
            var ops = assets.parseOptions('blur10,bw,sepia,blur20,w100,h300,random');

            expect(ops).to.deep.equal({
                bw:      true,
                sepia:   true,
                blur:    20,
                w:       100,
                h:       300
            });

            var ops = assets.parseOptions('blur10,h100,bw,sepia,blur20,w150,h,cover');

            expect(ops).to.deep.equal({
                cover: true,
                bw:    true,
                sepia: true,
                blur:  20,
                w:     150,
                h:     100
            });
        });

    });

});
