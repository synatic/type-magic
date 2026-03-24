# Type Magic

Utilities for checking and converting JavaScript values between common runtime types.

## Install

```bash
npm install @synatic/type-magic
```

## Quick start

```js
const TypeMagic = require('@synatic/type-magic');

TypeMagic.convert('123.3', 'number'); // 123.3
TypeMagic.convert(123.3, 'string'); // '123.3'
TypeMagic.convert(new Date('2016-02-01T00:00:00Z'), 'string', 'YYYYMMDD'); // '20160201'
TypeMagic.convert(Buffer.from('test'), 'string', 'base64'); // 'dGVzdA=='
```

## API

### `TypeMagic.convert(value, toType, [format])`

Converts a value to another type.  
Returns `null` for `null`/`undefined` input.  
Throws if a conversion is not supported or the value is invalid for that conversion.

```js
TypeMagic.convert('2016-01-01T00:00:00Z', 'date'); // Date
TypeMagic.convert('R 1.20', 'number'); // 1.2
TypeMagic.convert([1, 2, 3], 'string', '0.00'); // '1.00,2.00,3.00'
TypeMagic.convert({a: 1}, 'string'); // '{"a":1}'
```

### `TypeMagic.validate(value, toType, [format])`

Checks whether a value can be converted to a target type.  
Returns `null` for `null`/`undefined` input.

```js
TypeMagic.validate('123.3', 'number'); // true
TypeMagic.validate('abc', 'integer'); // false
```

### `TypeMagic.forceToString(value, [format])`

Normalizes a value into a string using optional format support for numbers and dates.

```js
TypeMagic.forceToString(123.3, '0000.00'); // '0123.30'
TypeMagic.forceToString(new Date('2016-01-01T00:00:00Z')); // '2016-01-01T00:00:00.000Z'
```

### `TypeMagic.getTypeName(value)`

Returns the internal type name used for conversion routing.

```js
TypeMagic.getTypeName(123); // 'integer'
TypeMagic.getTypeName(Buffer.from('test')); // 'buffer'
TypeMagic.getTypeName([1, 2]); // 'array'
```

### `TypeMagic.check`

Exposes the underlying [`check-types`](https://www.npmjs.com/package/check-types) instance:

```js
TypeMagic.check.string('20161202'); // true
```

## Supported type names

- `string`
- `boolean`
- `date`
- `number`
- `integer`
- `array`
- `object`
- `buffer`
- `base64string` (string input converted to base64-encoded string)

## Common examples

### String and number formatting

```js
TypeMagic.convert(0, 'string', '0000.00'); // '0000.00'
TypeMagic.convert(123.3, 'string', '$0000'); // '$0123'
```

### Buffer conversions

```js
TypeMagic.convert('test', 'buffer'); // <Buffer 74 65 73 74>
TypeMagic.convert('dGVzdA==', 'buffer', 'base64'); // <Buffer 74 65 73 74>
TypeMagic.convert(Buffer.from('test'), 'array'); // [116, 101, 115, 116]
TypeMagic.convert(Buffer.from('test'), 'object'); // { type: 'Buffer', data: [116, 101, 115, 116] }
```

### Date parsing and formatting

```js
TypeMagic.convert('2016-01-01T00:00:00Z', 'date'); // Date
TypeMagic.convert(new Date('2016-02-01T00:00:00Z'), 'string', 'YYYYMMDD'); // '20160201'
```
