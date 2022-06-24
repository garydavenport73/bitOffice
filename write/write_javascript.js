////////////////////GLOBALS/////////////////////////
//-----------------write---------------------

let writeBaseFilename = "";
let textarea = document.getElementById("text-editor");
let documentDiv = document.getElementById('document-result');
let remSize = 1;
let marginSize = 2;
let writeUndos = [];
//let needsSave = true;

initializeWriteApp();

function initializeWriteApp() {
    documentDiv.style.fontSize = remSize + "rem";
    documentDiv.style.marginLeft = marginSize + "rem";
    documentDiv.style.marginRight = marginSize + "rem";
    writeUndos.push(textarea.value);
    ////Asks if you really want to close browser
    window.onbeforeunload = askConfirm;
    writeUpdateResult();

    textarea.spellcheck = false;
    textarea.focus(); //ensures spellcheck update

    document.getElementById('text-editor').addEventListener('keydown', function(e) {
        //https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
        //https://stackoverflow.com/users/819732/kasdega
        if (e.key == 'Tab') {
            e.preventDefault();
            let start = this.selectionStart;
            let end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) +
                //"    " + this.value.substring(end); using 4 spaces
                "\t" + this.value.substring(end);

            // put caret at right position again
            this.selectionStart =
                //this.selectionEnd = start + 4; using 4 spaces
                this.selectionEnd = start + 1;
            writeUpdateResult();
        }
    });
}

//Script to print the content of a div
function exportToHTML() {
    let contents = serializeElementToPage("document-parent", "html,#document-result,#document-parent{background-color:white;}");
    copyToClipBoard(contents);
    if (confirm("HTML document exported to clipboard.\n\nWould you like to export to HTML file?")) {
        saveStringToTextFile(contents, 'write' + getTodaysDate(), '.html');
    }
}



function newDocument() {
    if (confirm("This will overwrite current document.")) {
        writeResetAll();
    }
}

function writeResetAll() {
    //reset global variables;
    writeBaseFilename = "";
    remSize = 1;
    marginSize = 2;

    //reset text area value
    textarea.value = "";

    //reapply base styles to the div
    documentDiv.style.textAlign = "left";
    documentDiv.style.fontFamily = "Georgia, 'Times New Roman', Garamond, Times, serif";
    documentDiv.style.fontSize = "1rem";
    documentDiv.style.marginLeft = "2rem";
    textarea.spellcheck = false;

    //reset undo array
    writeUndos = [];
    writeUndos.push(textarea.value);

    //redisplay new result
    writeUpdateResult();

    //set focus to textarea
    textarea.focus(); //ensures spell check is refreshed

}

function writeDataToJSON() {
    writeUpdateResult();
    data = {}
    data["text"] = textarea.value;
    data["textAlign"] = documentDiv.style.textAlign;
    data["fontFamily"] = documentDiv.style.fontFamily;
    data["fontSize"] = documentDiv.style.fontSize;
    data["marginSize"] = documentDiv.style.marginLeft;
    data["spellCheck"] = textarea.spellcheck;
    if (writeBaseFilename === "") {
        writeBaseFilename = "write" + getTodaysDate();
    };
    let saveContents = JSON.stringify(data);
    saveStringToTextFile(saveContents, writeBaseFilename, ".json");
}

function writeLoad() {
    console.log("writeLoad() called");
    console.log(textarea.value);
    //if (textarea.value != "") {
    console.log(textarea.value);
    if (confirm("This will overwrite current document")) {
        let fileContents = "";
        let inputTypeIsFile = document.createElement('input');
        inputTypeIsFile.type = "file";
        inputTypeIsFile.accept = ".json";
        inputTypeIsFile.addEventListener("change", function() {
            let inputFile = inputTypeIsFile.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) {
                fileContents = fileLoadedEvent.target.result;

                console.log(inputFile);
                if (inputFile["name"].slice(-5) === ".json") {
                    //alert("it's json!");
                    writeBaseFilename = inputFile["name"].slice(0, -5);
                    //alert("writeBaseFilename: " + writeBaseFilename);
                }

                let loadedData = JSON.parse(fileContents);
                textarea.value = loadedData["text"];
                documentDiv.style.textAlign = loadedData["textAlign"];
                documentDiv.style.fontFamily = loadedData["fontFamily"];
                documentDiv.style.fontSize = loadedData["fontSize"];
                documentDiv.style.marginLeft = loadedData["marginSize"];
                textarea.spellcheck = loadedData["spellCheck"];
                writeUpdateResult();
                remSize = parseFloat(loadedData["fontSize"].split("rem")[0]);
                marginSize = parseFloat(loadedData["marginSize"].split("rem")[0]);
                writeUndos = [];
                console.log("writeUndos length", writeUndos.length);
                writeUndos.push(textarea.value);
                textarea.focus(); //ensures spell check is refreshed

            };

            fileReader.readAsText(inputFile, "UTF-8");
        });
        inputTypeIsFile.click();
    }
    //}

}



function processSelectedText(clickedElement) {
    let action = clickedElement.innerHTML;
    console.log(action);
    if (action != "⟲") {
        if (writeUndos.length >= 316) { //316 levels of undo
            writeUndos.shift();
            writeUndos.push(textarea.value);
        } else {
            writeUndos.push(textarea.value);
        }
    }

    if (action === "⇚") { //align left
        documentDiv.style.textAlign = "left";
    } else if (action === "⇛⇚") { //align center
        documentDiv.style.textAlign = "center";
    } else if (action === "⇛") { //align right
        documentDiv.style.textAlign = "right";
    } else if (action === "Mono") {
        documentDiv.style.fontFamily = "'Courier New', Courier, monospace";
    } else if (action === "Serif") {
        documentDiv.style.fontFamily = "Georgia, 'Times New Roman', Garamond, Times, serif";
    } else if (action === "Sans") {
        documentDiv.style.fontFamily = "Arial, Verdana, Helvetica, Tahoma, sans-serif";
    } else if (action === "<sub>A</sub>A") {
        remSize = remSize + .2;
        documentDiv.style.fontSize = remSize.toString() + "rem";
    } else if (action === "<sup>A</sup>A") {
        remSize = remSize - .2;
        documentDiv.style.fontSize = remSize.toString() + "rem";
    } else if (action === "⇥⇤") { //increase margins
        marginSize = marginSize + 1;
        if (marginSize > 20) {
            marginSize = 20;
        }
        documentDiv.style.marginLeft = marginSize.toString() + "rem";
        documentDiv.style.marginRight = marginSize.toString() + "rem";

    } else if (action === "⇤⇥") { //decrease margins
        marginSize = marginSize - 1;
        if (marginSize < 0) {
            marginSize = 0;
        }
        documentDiv.style.marginLeft = marginSize.toString() + "rem";
        documentDiv.style.marginRight = marginSize.toString() + "rem";
    } else if (action === "⟲") {
        //console.log("undo called");
        console.log(writeUndos);
        if (writeUndos.length > 1) {
            let thisText = writeUndos.pop();
            textarea.value = thisText;
            writeUpdateResult();
        } else if (writeUndos.length === 1) { //don't go past initial entry
            textarea.value = writeUndos[0];
            writeUpdateResult()
        } else if (writeUndos.length === 0) { //should never reach this case;
            textarea.value = "";
            writeUpdateResult();
        }

    } else if (action === "✓") {
        console.log(textarea.spellcheck);
        textarea.spellcheck = !(textarea.spellcheck);
        console.log(textarea.spellcheck);
        textarea.focus();

        //textarea.blur();
    }
    //alert(action);

    let len = textarea.value.length;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let sel = textarea.value.substring(start, end);

    // This is the selected text and alert it
    //alert(sel);

    let replace = sel;

    if (action === "<b>B</b>") {
        replace = '<b>' + sel + '</b>';
    } else if (action === "<u>U</u>") {
        replace = '<u>' + sel + '</u>';
    } else if (action === "<em>I</em>") {
        replace = '<em>' + sel + '</em>';
    } else if (action === "H1") {
        replace = '<h1>' + sel + '</h1>';
    } else if (action === "H2") {
        replace = '<h2>' + sel + '</h2>';
    } else if (action === "H3") {
        replace = '<h3>' + sel + '</h3>';
    } else if (action === "¶") {
        replace = '<p>' + sel + '</p>';
    } else if (action === "―") {
        replace = '<hr>' + sel;
    } else if (action === "•") {
        replace = '&bullet; ' + sel;
    }
    // Here we are replacing the selected text with this one
    textarea.value = textarea.value.substring(0, start) + replace + textarea.value.substring(end, len);
    writeUpdateResult();
}

function writeUpdateResult() {
    let currentContents = document.getElementById('text-editor').value;
    console.dir(document.getElementById('text-editor'));
    //console.log(currentContents);
    document.getElementById('document-result').innerHTML = currentContents.replaceAll('\n', '<br>');
    if (textarea.spellcheck === true) {
        document.getElementById("spell-check").style.color = "green";
    } else {
        document.getElementById("spell-check").style.color = "red";
    }
}


function printWriteDiv(id) {
    let a = window.open();
    a.document.write(serializeElementToPage(id, "html,#document-result,#document-parent{background-color:white;}"));
    a.document.close();
    a.print();
}