/**
 * 
 * @param {Array<string>} statements 
 * @param {function} logger 
 */
function validate(statements, logger) {
    retCode = statements.reduce((acc, cur, idx, arr) => {
        if (! isNullOrEmpty(cur))
            acc = acc + (validateStatement(cur, idx, logger) ? 0 : 1);
        return acc;
    }, 0);

    return (retCode == 0) ? true : false;
}

/**
 * Validates the following in the mentioned order:
 *  1. Statement ends with semi-colon
 *  2. Access modifier is valid, if specified
 *  3. Attribute type is valid
 * 
 * @param {string} stmt_ 
 * @param {int} rowNum 
 * @param {function} logger 
 */
function validateStatement(stmt_, rowNum, logger) {
    const logPrefix = "[Line " + (rowNum + 1) + "] : ";
    var stmt = stmt_.trim();
    if (stmt.charAt(stmt.length - 1) !== ';') {
        logger(logPrefix + "The statement doesn't terminate with semi-colon");
        return false;
    }

    var parts = getStmtParts(stmt);

    if (parts.length == 1) {
        logger(logPrefix + "Either the attribute type or the attribute name is empty.");
        return false;
    }
    else if (parts.length == 2) {
        const type_ = parts[0];
        const varName = parts[1];
        if (! isValidAttrType(type_)) {
            logger(logPrefix + "[" + type_ + "] is not a valid Java data type.")
            return false;
        }
    }
    else if (parts.length == 3) {
        const accessMod = parts[0];
        const type_ = parts[1];
        const varName = parts[2];
        if (! isValidAccessModifier(accessMod)) {
            logger(logPrefix + "Illegal access modifier.");
            return false;
        }
        if (! isValidAttrType(type_)) {
            logger(logPrefix + "[" + type_ + "] is not a valid Java data type.")
            return false;
        }
    }
    return true;
}

/**
 * Returns true if the access modifier string
 * is a valid access modifier. This is case-sensitive.
 * @param {string} mod 
 */
function isValidAccessModifier(mod) {
    for (var accMod in ACCESS_MODIFIERS)
        if (mod.hasOwnProperty(accMod))
            if (mod !== ACCESS_MODIFIERS[accMod])
                return false;
    return true;
}

/**
 * Checks if the argument is a valid Java type
 * for an attribute declared in the Java class.
 * This also means that the type cannot be void.
 * And the comparison is case-sensitive.
 * @param {string} type_ 
 */
function isValidAttrType(type_) {
    if (type_ === JAVA_TYPES.void)
        return false;

    for (var tp in JAVA_TYPES) {
        if (JAVA_TYPES.hasOwnProperty(tp)) {
            if (JAVA_TYPES[tp] === type_)
                return true;
        }
    }

    for (var tp in WRAPPER_JAVA_TYPES) {
        if (WRAPPER_JAVA_TYPES.hasOwnProperty(tp)) {
            if (WRAPPER_JAVA_TYPES[tp] == type_)
                return true;
        }
    }

    return false;
}