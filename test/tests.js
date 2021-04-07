const assert = require('assert');
const moment =  require('moment');

const convert = require('../lib');

describe('Type-Magic', function () {
    describe('Expose Check', function () {
        it('should check string', function () {
            assert(convert.check.string('20161202'), 'Invalid Check');
        });
    });

    describe('Convert Method', function () {
        it('should convert string to number', function () {
            assert.strictEqual(convert.convert('123.3', 'number'), 123.3, 'Invalid Convert');
        });

        it('should convert string to date', function () {
            assert.strictEqual(
                convert.convert('2016-01-01T00:00:00Z', 'date').toISOString(),
                new Date('2016-01-01T00:00:00Z').toISOString(),
                'Invalid Convert'
            );
        });

        it('should convert string to date with format', function () {
            assert.strictEqual(
                convert.convert('20161202', 'date', null, 'YYYYMMDD').toISOString(),
                new Date('2016-12-02T00:00:00Z').toISOString(),
                'Invalid Convert'
            );
        });

        it('should convert number to string', function () {
            assert.strictEqual(convert.convert(123.3, 'string'), '123.3', 'Invalid Convert');
        });

        it('should convert date to string', function () {
            assert.strictEqual(
                convert.convert(new Date('2016-01-01T00:00:00Z'), 'string'),
                '2016-01-01T00:00:00.000Z',
                'Invalid Convert'
            );
        });

        it('should convert date to string with format', function () {
            assert.strictEqual(
                convert.convert(new Date('2016-02-01T00:00:00Z'), 'string', 'YYYYMMDD'),
                '20160201',
                'Invalid Convert'
            );
        });

        it('should convert moment date to string with format', function () {
            assert.strictEqual(
                convert.convert(moment.utc(new Date('2016-02-01T00:00:00Z')), 'string', 'YYYYMMDD'),
                '20160201',
                'Invalid Convert'
            );
        });

        it('should convert number to string with format', function () {
            assert.strictEqual(convert.convert(123.3, 'string', '0000.00'), '0123.30', 'Invalid Convert');
        });

        it('should convert integer 0 to string with format', function () {
            assert.strictEqual(convert.convert(0, 'string', '0000.00'), '0000.00', 'Invalid Convert');
        });

        it('should convert integer 0 to string', function () {
            assert.strictEqual(convert.convert(0, 'string'), '0', 'Invalid Convert');
        });

        it('should convert number 0 to string with format', function () {
            assert.strictEqual(convert.convert(0.0, 'string', '0000.00'), '0000.00', 'Invalid Convert');
        });

        it('should convert number 0 to string', function () {
            assert.strictEqual(convert.convert(0.0, 'string'), '0', 'Invalid Convert');
        });

        it('should convert integer to string with format', function () {
            assert.strictEqual(convert.convert(123.3, 'string', '$0000'), '$0123', 'Invalid Convert');
        });

        it('should convert number to integer', function () {
            assert.strictEqual(convert.convert(123.3, 'integer'), 123, 'Invalid Convert');
        });

        it('should convert string to currency', function () {
            assert.strictEqual(convert.convert('R 1.20', 'number'), 1.2, 'Invalid Convert');
        });

        it('should error on convert number to date', function () {
            assert.throws(
                function () {
                    convert.convert(123.3, 'date');
                },
                Error,
                'No error thrown'
            );
        });

        it('should error on convert string to integer', function () {
            assert.throws(
                function () {
                    convert.convert('abc', 'integer');
                },
                Error,
                'No error thrown'
            );
        });

        it('should convert the same type', function () {
            assert.strictEqual(convert.convert(123.3, 'number'), 123.3, 'Invalid Convert');
        });

        it('should convert the same type string', function () {
            assert.strictEqual(convert.convert('abc', 'string'), 'abc', 'Invalid Convert');
        });

        it('should convert object to string', function () {
            assert.strictEqual(convert.convert({a: 1}, 'string'), '{"a":1}', 'Invalid Convert');
        });

        it('should convert array to string', function () {
            assert.strictEqual(convert.convert([1, 2, 3], 'string'), '1,2,3', 'Invalid Convert');
        });

        it('should convert array to string', function () {
            assert.strictEqual(
                convert.convert([{a: 1}, {a: 2}, {a: 3}], 'string'),
                '{"a":1},{"a":2},{"a":3}',
                'Invalid Convert'
            );
        });

        it('should convert array to string with format', function () {
            assert.strictEqual(convert.convert([1, 2, 3], 'string', '0.00'), '1.00,2.00,3.00', 'Invalid Convert');
        });

        it('should convert array to string with format', function () {
            assert.strictEqual(convert.convert([1, 2, 3], 'string', '0.00'), '1.00,2.00,3.00', 'Invalid Convert');
        });


        // buffers
        it('should convert buffer to buffer', function () {
            assert.deepEqual(convert.convert(Buffer.from('test'), 'buffer' ), Buffer.from('test'), 'Invalid Convert');
        });

        it('should convert buffer to string', function () {
            assert.strictEqual(convert.convert(Buffer.from('test'), 'string' ), 'test', 'Invalid Convert');
        });

        it('should convert buffer to string with format base64', function () {
            assert.strictEqual(convert.convert(Buffer.from('test'), 'string' ,'base64'), 'dGVzdA==', 'Invalid Convert');
        });

        it('should convert buffer to string with format hex', function () {
            assert.strictEqual(convert.convert(Buffer.from('test'), 'string' ,'hex'), '74657374', 'Invalid Convert');
        });

        it('should convert buffer to array', function () {
            assert.deepEqual(convert.convert(Buffer.from('test'), 'array' ), [116,101,115,116], 'Invalid Convert');
        });

        it('should convert string to buffer', function () {
            assert.deepEqual(convert.convert('test', 'buffer' ), Buffer.from('test'), 'Invalid Convert');
        });

        it('should convert base64 string to buffer', function () {
            assert.deepEqual(convert.convert('dGVzdA==', 'buffer','base64' ), Buffer.from('test'), 'Invalid Convert');
        });

        it('should convert hex string to buffer', function () {
            assert.deepEqual(convert.convert('74657374', 'buffer','hex' ), Buffer.from('test'), 'Invalid Convert');
        });

        it('should convert array to buffer', function () {
            assert.deepEqual(convert.convert([116,101,115,116], 'buffer'), Buffer.from('test'), 'Invalid Convert');
        });

        it('should convert buffer to object', function () {
            assert.deepEqual(convert.convert(Buffer.from('test'), 'object' ), {
                "data": [
                    116,
                    101,
                    115,
                    116,
                ],
                "type": "Buffer"
            }, 'Invalid Convert');
        });

        it('should convert object to buffer', function () {
            assert.deepEqual(convert.convert({
                "data": [
                    116,
                    101,
                    115,
                    116,
                ],
                "type": "Buffer"
            }, 'buffer' ), Buffer.from('test'), 'Invalid Convert');
        });

        it('should not convert invalid object to buffer', function () {
            try{
                const x=convert.convert({
                    "data": [
                        116,
                        101,
                        115,
                        116,
                    ],
                    "type": "xxx"
                },'buffer');
                console.log(x);
            }catch(exp){
                return;
            }
            throw new Error("Invalid conversion")
        });

    });
});
