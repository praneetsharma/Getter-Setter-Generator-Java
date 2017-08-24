$(document).ready(function(){

    // to show line numbers in the text box
    $(".lined").linedtextarea();

    // When the page loads, cursor should be set
    // in the input textbox
    $("#attr-box").focus();

    function generateGetterSetter() {
        // reset output box
        resetOutputBox();

        var attrs = $("#attr-box").val();
        
        // Don't do anything if the text box is empty
        if (! isEmpty(attrs)) {
            // split the text based on linefeed char
            var stmts = attrs.split("\n");

            // Validate the statements entered by the user.
            // Validation has to happen before clean-up so 
            // that original line-numbers can be used for 
            // reporting errors.
            if (! validate(stmts, logError))
                return;

            // Perform clean-up of input statements which includes
            // removal of empty lines, comments, and commas from the end.
            stmts = cleanupStmts(stmts);

            // Generation of getter and setter methods
            $("#output-box").html(generate(stmts));
        }
    }

    $("#generate-btn").click(function(){
        generateGetterSetter();
    });

    $("#attr-box").keydown(function(event){
        if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
            generateGetterSetter();
        }
    });

    $("#clear-btn").click(function(){
        reset();
    });

    $("#copy-clipboard-btn").click(function(){
        copyToClipboard();
    });

    $("input[name='indent-radio']").change(function(){
        if ($("#indent-radio-1").prop("checked")) {
            INDENTATION = "\t";
        }
        if ($("#indent-radio-2").prop("checked")) {
            INDENTATION = "&nbsp;&nbsp;";
        }
        if ($("#indent-radio-3").prop("checked")) {
            INDENTATION = "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
    });

    /**
     * 
     * @param {Array<String>} stmts 
     */
    function cleanupStmts(stmts) {

        // 1. Remove empty statements
        // 2. Trim statements
        stmts = stmts.reduce((acc, cur, idx, array) => {            
            if (cur != null && cur.length > 0) { // ensure it is not empty
                var trimmedCur = trimStmt(cur); // trim
                acc.push(trimmedCur);
            }
            return acc;
        }, []);

        // Remove comment lines from contention
        var isComment = false;
        var stmtFinal = [];
        for (var i = 0; i < stmts.length; i = i + 1) {
            var stmt = stmts[i];

            // If the statement starts with a comment, skip it
            if (stmt.startsWith(MULTILINE_COMMENT_START) || 
                stmt.startsWith(JAVADOC_COMMENT_START)) {
                isComment = true;
                continue;
            }
            if (isComment && stmt.startsWith(MULTILINE_COMMENT_END)) {
                isComment = false; // multi-line comment has ended
                continue;
            }
            // End of multi-line comment is yet to be reached, hence skip the statement
            if (isComment) {
                continue;
            }
            if (stmt.startsWith(COMMENT_START)) {
                continue;
            }

            // If the comment is somewhere in between and not at the beginning
            // of the statement, remove the comment section
            if (stmt.includes(COMMENT_START)) {
                stmt = stmt.split("//")[0];
            }
            stmtFinal.push(stmt);
        }

        // Remove semi-colon from the end
        stmts = stmts.reduce((acc, cur, idx, array) => {
            acc.push(cur.substring(0, cur.length - 1)); // remove semi-colon before pushing
            return acc;
        }, []);

        return stmtFinal;
    }

    function reset() {
        resetOutputBox();
        $("#attr-box").val("");
    }

    function resetOutputBox() {
        $("#output-box").html("");
        $("#output-box").css('color', 'black');
    }

    function isEmpty(stmt) {
        if (stmt == null || stmt.length === 0)
            return true;
        return false;
    }

    function trimStmt(line) {
        if (isEmpty(line)) return line;
        var line_ = line; // to make sure this function is pure
        // Remove spaces from front and end
        line_ = line_.trim();
        return line_;
    }

    function logError(line) {
        var txt = $("#output-box").html();
        if (isEmpty(txt)) {
            $("#output-box").css("color", "red");
            txt = "Generation failed due to the following errors:" + NEWLINE;            
        } else {
        }
        txt = txt.concat("  > ").concat(line).concat(NEWLINE);
        $("#output-box").html(txt);
    }

    function copyToClipboard() {
        // Create a temporary hidden text field
        // and add it to the body
        var $temp = $("<textarea>");
        $("body").append($temp);

        // Get the content you want to copy to clipboard
        var dat = $("#output-box").html();
        // Replacing code of space with actual space
        dat = dat.replace(/&nbsp;/g, " ");

        // Select the content after setting it
        // in the temporary text field
        $temp.val(dat).select();

        // execute th copy command
        document.execCommand("copy");

        // Remove temporary hidden text field
        $temp.remove();
    }

});