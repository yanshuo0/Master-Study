var data = [];
var vocabulary = [];

function getSelectionBoundary(el, start) {
    var property = start ? "selectionStart" : "selectionEnd";
    var originalValue, textInputRange, precedingRange, pos, bookmark, isAtEnd;

    if (typeof el[property] == "number") {
        return el[property];
    } else if (document.selection && document.selection.createRange) {
        el.focus();

        var range = document.selection.createRange();
        if (range) {
            // Collapse the selected range if the selection is not a caret
            if (document.selection.type == "Text") {
                range.collapse(!!start);
            }

            originalValue = el.value;
            textInputRange = el.createTextRange();
            precedingRange = el.createTextRange();
            pos = 0;

            bookmark = range.getBookmark();
            textInputRange.moveToBookmark(bookmark);

            if (/[\r\n]/.test(originalValue)) {
                // Trickier case where input value contains line breaks

                // Test whether the selection range is at the end of the
                // text input by moving it on by one character and
                // checking if it's still within the text input.
                try {
                    range.move("character", 1);
                    isAtEnd = (range.parentElement() != el);
                } catch (ex) {
                    log.warn("Error moving range", ex);
                    isAtEnd = true;
                }
                range.moveToBookmark(bookmark);

                if (isAtEnd) {
                    pos = originalValue.length;
                } else {
                    // Insert a character in the text input range and use
                    // that as a marker
                    textInputRange.text = " ";
                    precedingRange.setEndPoint("EndToStart", textInputRange);
                    pos = precedingRange.text.length - 1;

                    // Delete the inserted character
                    textInputRange.moveStart("character", -1);
                    textInputRange.text = "";
                }
            } else {
                // Easier case where input value contains no line breaks
                precedingRange.setEndPoint("EndToStart", textInputRange);
                pos = precedingRange.text.length;
            }
            return pos;
        }
    }
    return 0;
}

function getTextAreaSelection(textarea) {
    var start = getSelectionBoundary(textarea, true),
        end = getSelectionBoundary(textarea, false);

    return {
        start: start,
        end: end,
        length: end - start,
        text: textarea.value.slice(start, end)
    };
}

function detectPaste(textarea, callback) {
    textarea.onpaste = function () {
        var sel = getTextAreaSelection(textarea);
        var initialLength = textarea.value.length;
        window.setTimeout(function () {
            var val = textarea.value;
            var pastedTextLength = val.length - (initialLength - sel.length);
            var end = sel.start + pastedTextLength;
            callback({
                start: sel.start,
                end: end,
                length: pastedTextLength,
                text: val.slice(sel.start, end),
                replacedText: sel.text
            });
        }, 1);
    };
}



window.onload = function () {
    var textarea = document.getElementById("importer");
    detectPaste(textarea, function (pasteInfo) {
        var val = textarea.value;
        var keyval = document.getElementById("importer").value.split(/[\r\n]/);
        if (!(/\d/.test(keyval))) {
                for (var index = 0; index < keyval.length; index++) {
                    var temp = keyval[index].split('/');
                    vocabulary.push({"key": temp[0].trim(), "value": temp[1].trim()});
                }
                for (var index = 0; index < vocabulary.length; index++) {
                    console.log(vocabulary[index]);
                }
            alert("Your Vocabulary Knowledge Have Been Saved!");
        } else {
            for (var index = 0; index < keyval.length; index++) {
                data.push({ "key": keyval[index], "value": eval(keyval[index]) });
            }
            for (var index = 0; index < data.length; index++) {
                console.log(data[index]);
            }
            alert("Your Math Equations Have Been Saved!");
        }
        //console.log(data);
        //localStorage.setItem('obj', JSON.stringify(obj));
        //var restoredData = JSON.parse(localStorage.getItem('obj'));
        
        
        //obj[keyval[0].trim()] = keyval[1].trim();
        //console.log(restoredData);

        // Delete the pasted text and restore any previously selected text
        /*textarea.value = val.slice(0, pasteInfo.start) +
            pasteInfo.replacedText + val.slice(pasteInfo.end);*/

    });
};