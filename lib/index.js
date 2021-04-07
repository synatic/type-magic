const $moment = require('moment');
const $numeral = require('numeral');
const $check = require('check-types');
$moment.suppressDeprecationWarnings = true;

// the conversion matrix to convert between types
const _conversionMatrix = {
    string: {
        string: {
            convert: function (val) {
                return val;
            },
            validate: function (val) {
                return true;
            },
        },
        boolean: {
            validate: function (val) {
                switch (val.toLowerCase().trim()) {
                    case 'true':
                    case 'yes':
                    case '1':
                        return true;
                    case 'false':
                    case 'no':
                    case '0':
                    case null:
                        return true;
                    default:
                        return false;
                }
            },
            convert: function (val) {
                switch (val.toLowerCase().trim()) {
                    case 'true':
                    case 'yes':
                    case '1':
                        return true;
                    case 'false':
                    case 'no':
                    case '0':
                    case null:
                        return false;
                    default:
                        throw new Error('Cannot convert string to boolean');
                }
            },
        },
        date: {
            validate: function (val, format) {
                const d = $moment(val, format);
                return d.isValid();
            },
            convert: function (val, format) {
                const d = $moment.utc(val, format);
                if (!d.isValid()) {
                    throw new Error('Cannot convert string to date');
                } else {
                    return d.toDate();
                }
            },
        },
        number: {
            validate: function (val, format) {
                return !isNaN($numeral(val));
            },
            convert: function (val) {
                const v = $numeral(val);
                if (v.value() !== null) {
                    return v.value();
                } else {
                    throw new Error('Cannot convert string to number');
                }
            },
        },
        integer: {
            validate: function (val, format) {
                return !isNaN($numeral(val));
            },
            convert: function (val, format) {
                const v = $numeral(val);
                if (v.value() !== null) {
                    return Math.trunc(v.value());
                } else {
                    throw new Error('Cannot convert string to number');
                }
            },
        },
        array: {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return val.split(',');
            },
        },
        object: {
            validate: function (val) {
                try {
                    JSON.parse(val);
                    return true;
                } catch (exp) {
                    return false;
                }
            },
            convert: function (val) {
                try {
                    return JSON.parse(val);
                } catch (exp) {
                    throw new Error('Cannot convert string to object');
                }
            },
        },
        base64string: {
            convert: function (val) {
                return Buffer.from(val).toString('base64');
            },
            validate: function (val) {
                return true;
            },
        },
        buffer:{
            convert: function (val,format) {
                return Buffer.from(val,format);
            },
            validate: function () {
                return true;
            },
        }
    },
    boolean: {
        boolean: {
            convert: function (val) {
                return val;
            },
            validate: function (val) {
                return true;
            },
        },
        string: {
            validate: function (val) {
                return true;
            },
            convert: function (val, format) {
                return TypeMagic.forceToString(val, format);
            },
        },
        integer: {
            convert: function (val) {
                return val === true ? 1 : 0;
            },
            validate: function (val) {
                return true;
            },
        },
        number: {
            convert: function (val) {
                return val === true ? 1.0 : 0.0;
            },
            validate: function (val) {
                return true;
            },
        },
    },
    date: {
        date: {
            convert: function (val) {
                return val;
            },
            validate: function (val) {
                return true;
            },
        },
        string: {
            validate: function (val) {
                return true;
            },
            convert: function (val, format) {
                return TypeMagic.forceToString(val, format);
            },
        },
        integer: {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return val.getTime();
            },
        },
        number: {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return val.getTime();
            },
        },
    },
    integer: {
        integer: {
            convert: function (val) {
                return val;
            },
            validate: function (val) {
                return true;
            },
        },
        string: {
            validate: function (val) {
                return true;
            },
            convert: function (val, format) {
                return TypeMagic.forceToString(val, format);
            },
        },
        boolean: {
            validate: function (val) {
                return val === 0 || val === 1;
            },
            convert: function (val) {
                if (val === 1) {
                    return true;
                } else if (val === 0) {
                    return false;
                } else {
                    throw new Error('Cannot convert integer to boolean');
                }
            },
        },
        date: {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return new Date(val);
            },
        },
        number: {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return Number(val);
            },
        },
    },
    number: {
        integer: {
            convert: function (val) {
                return Math.trunc(val);
            },
            validate: function (val) {
                return true;
            },
        },
        string: {
            validate: function (val) {
                return true;
            },
            convert: function (val, format) {
                return TypeMagic.forceToString(val, format);
            },
        },
        number: {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return val;
            },
        },
    },
    object: {
        object: {
            convert: function (val) {
                return val;
            },
            validate: function (val) {
                return true;
            },
        },
        string: {
            validate: function (val) {
                return true;
            },
            convert: function (val, format) {
                return TypeMagic.forceToString(val, format);
            },
        },
        buffer:{
            validate: function (value) {
                return value !== null &&
                    typeof value === 'object' &&
                    'type' in value           &&
                    value.type === 'Buffer'   &&
                    'data' in value           &&
                    Array.isArray(value.data);
            },
            convert: function (value, format) {
                if (value !== null &&
                    typeof value === 'object' &&
                    'type' in value           &&
                    value.type === 'Buffer'   &&
                    'data' in value           &&
                    Array.isArray(value.data)){
                    return Buffer.from(value.data);
                }else{
                    throw new Error("Invalid object for buffer")
                }

            },
        }

    },
    array: {
        array: {
            convert: function (val) {
                return val;
            },
            validate: function (val) {
                return true;
            },
        },
        string: {
            validate: function (val) {
                return true;
            },
            convert: function (val, format) {
                return TypeMagic.forceToString(val, format);
            },
        },
        buffer: {
            validate: function (val) {
                return true;
            },
            convert: function (val, format) {
                return Buffer.from(val);
            },
        },
    },
    buffer:{
        buffer: {
            convert: function (val) {
                return val;
            },
            validate: function (val) {
                return true;
            },
        },
        string: {
            validate: function () {
                return true;
            },
            convert: function (val, format) {
                return TypeMagic.forceToString(val, format);
            },
        },
        array: {
            validate: function () {
                return true;
            },
            convert: function (val, format) {
                return Array.prototype.slice.call(val, 0)
            },
        },
        object: {
            validate: function() {
                return true;
            },
            convert: function(val, format) {
                return val.toJSON();
            }
        }
    }
};

/**
 * TypeMagic provides conversion functionality to convert between javascript types
 */
class TypeMagic {
    /** Convert between types
     *
     * @param {*} val - the value to convert
     * @param {string }toType
     * @param {string} [format] - the format to user/convert to
     * @return {null|*}
     */
    static convert(val, toType, format) {
        if (!$check.assigned(val)) {
            return null;
        }

        const valType = TypeMagic.getTypeName(val);
        if (!isValidCast(valType, toType)) {
            throw new Error('Cannot convert ' + valType + ' to ' + toType);
        }
        return _conversionMatrix[valType][toType].convert(val, format);
    }

    /** Checks is a cast is valid
     *
     * @param {*} val - the value to validate can eb converted
     * @param {string} toType - the type to be converted to
     * @param {string} [format] - the format to try
     * @return {null|boolean|*}
     */
    static validate(val, toType, format) {
        if (!$check.assigned(val)) {
            return null;
        }

        const valType = TypeMagic.getTypeName(val);
        if (!isValidCast(valType, toType)) {
            return false;
        }

        return _conversionMatrix[valType][toType].validate(val, format);
    }

    /** Forces a value to a string
     *
     * @param {*} val - the value to force to a string
     * @param {string} format - the format to use on the string conversion
     * @return {string|null|*}
     */
    static forceToString(val, format) {
        if (!$check.assigned(val)) {
            return null;
        } else if ($check.string(val)) {
            return val;
        } else if ($check.number(val)) {
            if (format) {
                return $numeral(val).format(format);
            } else {
                return val.toString();
            }
        } else if ($check.date(val)) {
            if (format) {
                return $moment(val).format(format);
            } else {
                return val.toISOString();
            }
        } else if ($moment.isMoment(val)) {
            if (format) {
                return $moment(val).format(format);
            } else {
                return val.toISOString();
            }
        } else if ($check.integer(val)) {
            if (format) {
                return $numeral(val).format(format);
            } else {
                return val.toString();
            }
        } else if ($check.boolean(val)) {
            return val.toString();
        }else if (Buffer.isBuffer(val)) {
            return val.toString(format);
        }
        else if ($check.array(val)) {
            return val
                .map((doc) => {
                    return TypeMagic.forceToString(doc, format);
                })
                .join(',');
        } else if ($check.object(val)) {
            return JSON.stringify(val);
        } else {
            throw new Error('Unable to force type:' + typeof val + ' to string');
        }
    }

    /** Gets the name of a type
     *
     * @param {*} val - the value to get the type name of
     * @return {string|null|"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"}
     */
    static getTypeName(val) {
        if (!$check.assigned(val)) {
            return null;
        }
        if ($check.string(val)) {
            return 'string';
        }
        if ($check.integer(val)) {
            return 'integer';
        }
        if ($check.number(val)) {
            return 'number';
        }
        if ($check.date(val)) {
            return 'date';
        }
        if ($moment.isMoment(val)) {
            return 'date';
        }
        if ($check.boolean(val)) {
            return 'boolean';
        }
        if (Buffer.isBuffer(val)) {
            return 'buffer';
        }
        if ($check.array(val)) {
            return 'array';
        }
        if ($check.object(val)) {
            return 'object';
        }
        return typeof val;
    }

    static get check() {
        return $check;
    }
}

//* *********************************************************************************************************************
// Private Functions
//* *********************************************************************************************************************

/** Checks whether a conversion is valid
 *
 * @param {string} fromType - the type to convert from
 * @param {string} toType - the type to convert to
 * @return {boolean}
 */
function isValidCast(fromType, toType) {
    return !!(_conversionMatrix[fromType] && _conversionMatrix[fromType][toType]);
}



module.exports = TypeMagic;
