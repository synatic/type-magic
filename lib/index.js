const $check = require("check-types");
const base64regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
// /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const $moment = require('moment');
const $numeral = require('numeral');

const conversionMatrix = {
    "string": {
        "string": {
            convert: function (val) {return val;},
            validate: function (val) {return true;}
        },
        "boolean": {
            validate: function (val) {
                switch (val.toLowerCase().trim()) {
                    case "true":
                    case "yes":
                    case "1":
                        return true;
                    case "false":
                    case "no":
                    case "0":
                    case null:
                        return true;
                    default:
                        return false;
                }
            },
            convert: function (val) {
                switch (val.toLowerCase().trim()) {
                    case "true":
                    case "yes":
                    case "1":
                        return true;
                    case "false":
                    case "no":
                    case "0":
                    case null:
                        return false;
                    default:
                        throw new Error("Cannot convert string to boolean");
                }
            }
        },
        "date": {
            validate: function (val, format) {
                let d = $moment(val, format);
                return d.isValid();
            },
            convert: function (val, format) {
                let d = $moment.utc(val, format);
                if (!d.isValid()) {
                    throw new Error("Cannot convert string to date");
                } else {
                    return d.toDate();
                }
            }
        },
        "number": {
            validate: function (val, format) {
                return !isNaN($numeral(val));
            },
            convert: function (val) {
                let v = $numeral(val);
                if (v.value()!==null) {
                    return v.value();
                } else {
                    throw new Error("Cannot convert string to number");
                }
            }
        },
        "integer": {
            validate: function (val, format) {
                return !isNaN($numeral(val));
            },
            convert: function (val, format) {
                let v = $numeral(val);
                if (v.value()!==null) {
                    return Math.trunc(v.value());
                } else {
                    throw new Error("Cannot convert string to number");
                }
            }
        },
        "array": {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return val.split(",");
            }
        },
        "object": {
            validate: function (val) {
                try {
                    JSON.parse(val);
                    return true;
                }
                catch (exp) {
                    return false;
                }
            },
            convert: function (val) {
                try {
                    return JSON.parse(val);
                }
                catch (exp) {
                    throw new Error("Cannot convert string to object");
                }
            }
        },
        "base64string": {
            convert: function (val) {
                return Buffer.from(val).toString('base64');
            },
            validate: function (val) {
                return true;
            }
        }
    },
    "boolean": {
        "boolean": {
            convert: function (val) {return val;},
            validate: function (val) {return true;}
        },
        "string": {
            validate: function (val) {return true;},
            convert: function (val, format) {return forceToString(val, format);}
        },
        "integer": {
            convert: function (val) {return val === true ? 1 : 0;},
            validate: function (val) {return true;}
        },
        "number": {
            convert: function (val) {return val === true ? 1.0 : 0.0;},
            validate: function (val) {return true;}
        }
    },
    "date": {
        "date": {
            convert: function (val) {return val;},
            validate: function (val) {return true;}
        },
        "string": {
            validate: function (val) {return true;},
            convert: function (val, format) {return forceToString(val, format);}
        },
        "integer": {
            validate: function (val) {return true;},
            convert: function (val) {return val.getTime();}
        },
        "number": {
            validate: function (val) {return true;},
            convert: function (val) {return val.getTime();}
        }
    },
    "integer": {
        "integer": {
            convert: function (val) {return val;},
            validate: function (val) {return true;}
        },
        "string": {
            validate: function (val) {return true;},
            convert: function (val, format) {return forceToString(val, format);}
        },
        "boolean": {
            validate: function (val) {
                if (val === 0 || val === 1) {
                    return true;
                } else {
                    return false;
                }
            },
            convert: function (val) {
                if (val === 1) {
                    return true;
                } else if (val === 0) {
                    return false;
                } else {
                    throw new Error("Cannot convert integer to boolean");
                }
            }

        },
        "date": {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return new Date(val);
            }
        },
        "number": {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return Number(val);
            }
        }
    },
    "number": {
        "integer": {
            convert: function (val) {return Math.trunc(val);},
            validate: function (val) {
                return true;
            }
        },
        "string": {
            validate: function (val) {return true;},
            convert: function (val, format) {return forceToString(val, format);}
        },
        "number": {
            validate: function (val) {
                return true;
            },
            convert: function (val) {
                return val;
            }
        }
    },
    "object": {
        "object": {
            convert: function (val) {return val;},
            validate: function (val) {return true;}
        },
        "string": {
            validate: function (val) {return true;},
            convert: function (val, format) {return forceToString(val, format);}
        }
    },
    "array": {
        "array": {
            convert: function (val) {return val;},
            validate: function (val) {return true;}
        },
        "string": {
            validate: function (val) {return true;},
            convert: function (val, format) {return forceToString(val, format);}
        }
    }
};

module.exports = {
    convert: convert,
    validate: validate,
    getTypeName: getTypeName,
    forceToString: forceToString,
    check:$check
};

function convert(val, toType, format) {
    if (!$check.assigned(val)) {
        return null;
    }

    let valType = getTypeName(val);
    if (!isValidCast(valType, toType)) {
        throw new Error("Cannot convert " + valType + " to " + toType);
    }
    return conversionMatrix[valType][toType].convert(val, format);
}

function validate(val, toType, format) {
    if (!$check.assigned(val)) {
        return null;
    }

    let valType = getTypeName(val);
    if (!isValidCast(valType, toType)) {
        return false;
    }
    return conversionMatrix[valType][toType].validate(val, format);
}

//**********************************************************************************************************************
//Private Functions
//**********************************************************************************************************************

function isValidCast(fromType, toType) {
    return (conversionMatrix[fromType] && conversionMatrix[fromType][toType]);
}

function forceToString(val, format) {
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
        if (format){
            return $moment(val).format(format);
        }else{
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
    } else if ($check.array(val)) {
        return val.map(function (doc) {
            return forceToString(doc,format);
        }).join(",");
    } else if ($check.object(val)) {
        return JSON.stringify(val);
    } else {
        throw new Error("Unable to force type:" + (typeof val) + " to string");
    }

}

function getTypeName(val) {
    if (!$check.assigned(val)) {
        return null;
    }
    if ($check.string(val)) {
        return "string";
    }
    if ($check.integer(val)) {
        return "integer";
    }
    if ($check.number(val)) {
        return "number";
    }
    if ($check.date(val)) {
        return "date";
    }
    if ($check.boolean(val)) {
        return "boolean";
    }
    if ($check.array(val)) {
        return "array";
    }
    if ($check.object(val)) {
        return "object";
    }
    return (typeof val);
}
