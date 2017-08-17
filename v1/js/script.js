$(document).ready(function(){

    var ACCESS_MODIFIERS = ["public", "private", "protected"];

    // to show line numbers in the text box
    $(".lined").linedtextarea();

    $("#generate-btn").click(function(){
        // reset output box
        resetOutputBox();

        var attrs = $("#attr-box").val();
        
        // Don't do anything if the text box is empty
        if (! isEmpty(attrs)) {
            // split the text based on linefeed char
            var stmts = attrs.split("\n");
            
            // Perform cleanup of each statement separately
            stmts = stmts.reduce((acc, cur, idx, arr) => {
                acc.push(cleanup(cur));
                return acc;
            }, []);

            // Validate each statement separately
            retCode = stmts.reduce((acc, cur, idx, arr) => {
                ret = validate(cur, idx);
                if (!ret)
                    acc = acc + 1;
                return acc;
            }, 0);
            // If retCode is greater than 0, it means one or more 
            // statements are invalid.
            if (retCode > 0)
                return;

            // remove empty statements
            stmts = stmts.reduce((acc, cur, idx, array) => {
                if (cur != null && cur.length > 0)
                    acc.push(cur);
                return acc;
            }, []);

            // remove semi-colon from end of the statement
            stmts = stmts.reduce((acc, cur, idx, array) => {
                acc.push(cur.substring(0, cur.length - 1));
                return acc;
            }, []);

            $("#output-box").html(generate(stmts));
        }
    });

    $("#clear-btn").click(function(){
        reset();
    });

    /*$("#copy-clipboard-btn").click(function(){
        copyToClipboard();
    });*/

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

    function cleanup(line) {
        if (isEmpty(line)) return line;

        var line_ = line; // to make sure this function is pure

        // Remove spaces from front and end
        line_ = line_.trim();

        return line_;
    }

    function validate(line, idx) {
        if (isEmpty(line)) return true;

        // check if the statement ends with semi-colon
        if (line.charAt(line.length - 1) !== ';') {
            logError("Statement [" + line + "] at line number ["+ (idx + 1) +"] doesn't have semi-colon at the end.");
            return false;
        }
        return true;
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
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($("#output-box").text()).select();
        document.execCommand("copy");
        $temp.remove();
    }

});