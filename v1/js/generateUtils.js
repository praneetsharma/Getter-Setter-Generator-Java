const TAB = "\t";//&nbsp;&nbsp;&nbsp;&nbsp;";
const SPACE = " ";
const SEMI_COLON = ";";
const NEWLINE = "\r\n";//<br />";
const DOT = ".";
const EQUALS = "=";

const CURLY_BRACE_START = "{";
const CURLY_BRACE_END = "}";
const ROUND_BRACE_START = "(";
const ROUND_BRACE_END = ")";

const RETURN_STMT = "return";
const THIS_STMT = "this";

const ACCESS_MODIFIERS = {
    public:"public", 
    private:"private", 
    protected:"protected"
};

const JAVA_TYPES = {
    boolean: "boolean",
    void: "void",
    int: "int",
    float: "float",
    double: "double",
    long: "long",
    short: "short",
    byte: "byte",
    char: "char",
    String: "String"
};

const WRAPPER_JAVA_TYPES = {
    Boolean: "Boolean",
    Integer: "Integer",
    Float: "Float",
    Double: "Double",
    Long: "Long",
    Short: "Short",
    Byte: "Byte",
    Character: "Character"
}


function generate(stmts) {
    var htmlTxt = stmts.reduce((acc, cur, idx, arr) => {
        acc = acc.concat(
            generateGetterMethod(cur) + NEWLINE +
            generateSetterMethod(cur) + NEWLINE
        );
        return acc;
    }, "");
    return htmlTxt;
}

function generateGetterMethod(stmt) {
    return generateGetterHeader(stmt) + NEWLINE +
           generateGetterBody(stmt) + NEWLINE +
           generateGetterFooter(stmt) + NEWLINE
           ;
}

function generateGetterHeader(stmt) {
    return ACCESS_MODIFIERS.public + SPACE + 
           getGetterReturnType(stmt) + SPACE +
           getGetterMethodName(stmt) + ROUND_BRACE_START + ROUND_BRACE_END + SPACE +
           CURLY_BRACE_START
           ;
}

function generateGetterBody(stmt) {
    return TAB +
           RETURN_STMT + SPACE +
           THIS_STMT + DOT + getVarName(stmt) + SEMI_COLON
           ; 
}

function generateGetterFooter(stmt) {
    return CURLY_BRACE_END;
}

function getVarName(stmt) {
    var stmtSplits = getStmtParts(stmt);
    if (getStmtPartsLen(stmt) === 3) {
        return stmtSplits[2];
    } else if (getStmtPartsLen(stmt) === 2) {
        return stmtSplits[1];
    }
}

/**
 * 
 * @param {string} stmt 
 */
function getGetterMethodName(stmt) {
    var getterPrefix = "get";
    if (getGetterReturnType(stmt).toLowerCase() === JAVA_TYPES.boolean)
        getterPrefix = "is";

    var idxForMethodName = -1;
    if (getStmtPartsLen(stmt) === 3) {
        idxForMethodName = 2;
    } else if (getStmtPartsLen(stmt) === 2) {
        idxForMethodName = 1;
    }

    var stmtSplits = getStmtParts(stmt);
    return getterPrefix + 
        stmtSplits[idxForMethodName].substring(0, 1).toUpperCase() + stmtSplits[idxForMethodName].substring(1);
}

function getGetterReturnType(stmt) {
    return getTypeFromAttribute(stmt);
}

/**
 * 
 * @param {string} stmt 
 */
function getTypeFromAttribute(stmt) {
    var typePos = -1;

    if (getStmtPartsLen(stmt) === 3)
        typePos = 1;
    else if (getStmtPartsLen(stmt) === 2)
        typePos = 0;

    var stmtSplits = getStmtParts(stmt);
    return stmtSplits[typePos];
}

function getStmtPartsLen(stmt) {
    return getStmtParts(stmt).length;
}

/**
 * Splits the statement into parts based on SPACE but only
 * returns those parts which are non-empty
 * @param {string} stmt 
 */
function getStmtParts(stmt) {
    var parts = stmt.split(SPACE);
    parts = parts.reduce((acc, cur, idx, arr) => {
        if (! isNullOrEmpty(cur))
            acc.push(cur);
        return acc;
    }, []);
    return parts;
}


function isNullOrEmpty(stmt) {
    if (stmt == null || stmt.length === 0)
        return true;
    return false;
}

function generateSetterMethod(stmt) {
    return generateSetterHeader(stmt) + NEWLINE +
           generateSetterBody(stmt) + NEWLINE +
           generateSetterFooter(stmt) + NEWLINE
           ;
}

function generateSetterHeader(stmt) {
    return ACCESS_MODIFIERS.public + SPACE + 
           JAVA_TYPES.void + SPACE +
           getSetterMethodName(stmt) + ROUND_BRACE_START + 
           getSetterParamType(stmt) + SPACE + getVarName(stmt) +
           ROUND_BRACE_END + SPACE +
           CURLY_BRACE_START
           ;
}

function generateSetterBody(stmt) {
    return TAB +
           THIS_STMT + DOT + getVarName(stmt) + SPACE +
           EQUALS + SPACE + getVarName(stmt) + SEMI_COLON
           ; 
}

function generateSetterFooter(stmt) {
    return CURLY_BRACE_END;
}

function getSetterMethodName(stmt) {
    var setterPrefix = "set";
    var stmtSplits = getStmtParts(stmt);
    var methodPos = -1
    
    if (getStmtPartsLen(stmt) === 3)
        methodPos = 2;
    else if (getStmtPartsLen(stmt) === 2)
        methodPos = 1;

    return setterPrefix + stmtSplits[methodPos].substring(0, 1).toUpperCase() + stmtSplits[methodPos].substring(1);
}

function getSetterParamType(stmt) {
    return getTypeFromAttribute(stmt);
}