const TAB = "&nbsp;&nbsp;&nbsp;&nbsp;";
const SPACE = " ";
const SEMI_COLON = ";";
const NEWLINE = "<br />";
const DOT = ".";

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
    boolean: "boolean"
};

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
    if (getStmtPartsLen(stmt) === 3) {
        var stmtSplits = getStmtParts(stmt);
        return stmtSplits[2];
    }
}

function getGetterMethodName(stmt) {
    if (getStmtPartsLen(stmt) === 3) {
        var getterPrefix = "get";
        if (getGetterReturnType(stmt) === JAVA_TYPES.boolean)
            getterPrefix = "is";

        var stmtSplits = getStmtParts(stmt);

        return getterPrefix + stmtSplits[2].substring(0, 1).toUpperCase() + stmtSplits[2].substring(1);
    }
}

function getGetterReturnType(stmt) {
    return getTypeFromAttribute(stmt);
}

function getTypeFromAttribute(stmt) {
    if (getStmtPartsLen(stmt) === 3) {
        var stmtSplits = getStmtParts(stmt);
        return stmtSplits[1];
    }
}

function getVarNameFromAttribute(attr) {

}

function getSetterParamType() {

}

function getStmtPartsLen(stmt) {
    return stmt.split(SPACE).length;
}

function getStmtParts(stmt) {
    return stmt.split(SPACE);
}