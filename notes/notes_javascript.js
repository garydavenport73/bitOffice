//////////////GLOBALS/////////////////////////
//  ------------notes --------------------
// let noteFontSize = 2.5 / 3.0;
// let note = document.getElementById('note');
//////////////GLOBALS/////////////////////////

// initializeNotesApp();

function initializeNotesApp() {
    note.style.fontSize = noteFontSize.toString() + "rem";
    note.spellcheck = false;
    note.focus();
    /////////////////////////////////////////////////
    ////Asks if you really want to close browser

    window.onbeforeunload = askConfirm;
    showMain('main-notes');
    //let needsSave = true;
}


function changeFontSize(fontButton) {
    let doThis = fontButton.innerHTML;
    if (doThis === "-") {
        if (noteFontSize > 0.2) {
            noteFontSize -= 0.2; //no need to go less than 0.2rem
        }
    } else {
        noteFontSize += 0.2;
    }
    note.style.fontSize = noteFontSize.toString() + "rem";
}

function newEntry() {
    if (note.value != '') {
        if (confirm("This will erase current contents.")) {
            note.value = '';
        }
    }
}

function notesLoad() {
    let fileContents = "";
    let inputTypeIsFile = document.createElement('input');
    inputTypeIsFile.type = "file";
    inputTypeIsFile.accept = ".txt";
    inputTypeIsFile.addEventListener("change", function() {
        let inputFile = inputTypeIsFile.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            fileContents = fileLoadedEvent.target.result;
            note.value = fileContents;
        };
        fileReader.readAsText(inputFile, "UTF-8");
    });
    inputTypeIsFile.click();
}



////////////////////////////////////////////
//Save related functions, often used with date functions below
function notesSave() {
    basename = "notes" + getTodaysDate();
    saveStringToTextFile(note.value, basename, ".txt");
}





//Trying print functions
function printNotesDiv(id) {
    let a = window.open();
    a.document.write(serializeNotesElementToPage(id, "html{background-color:white;}#note{font-size:" + noteFontSize + "rem}"));
    a.document.close();
    a.print();
}

function serializeNotesElementToPage(id, extraStyle = "") {
    let boilerPlate1 = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title></title><style>";

    let allStyleTags = document.getElementsByTagName('style');

    let styleElementContent = "";
    for (let i = 0; i < allStyleTags.length; i++) {
        styleElementContent = allStyleTags[i].innerHTML;
    }
    //let styleElementContent = document.getElementsByTagName('style')[0].innerHTML;
    //let extraStyle = "html,#document-result,#document-parent{background-color:white;}";
    let boilerPlate2 = "</style></head><body>"
    let boilerPlate3 = "</body></html>";
    //let s = new XMLSerializer();
    //let myElement = document.getElementById(id);
    //let str = s.serializeToString(myElement);
    let str = "<pre id='note'>" + document.getElementById(id).value + "</pre>";
    let htmlPage = boilerPlate1 + styleElementContent + extraStyle + boilerPlate2 + str + boilerPlate3;
    console.log(htmlPage);
    return htmlPage;
}