//////////////GLOBALS/////////////////////////
//  ------------notes --------------------
let noteFontSize = 2.5 / 3.0;
let note = document.getElementById('note');


initializeNotesApp();

function initializeNotesApp() {
    note.style.fontSize = noteFontSize.toString() + "rem";
    note.spellcheck = false;
    note.focus();
    /////////////////////////////////////////////////
    ////Asks if you really want to close browser

    window.onbeforeunload = askConfirm;
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

function copyStringToClipboard(str) {
    //https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
    let el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {
        position: 'absolute',
        left: '-9999px'
    };
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Copied to Clipboard.');
}

////////////////////////////////////////////
//Save related functions, often used with date functions below
function notesSave() {
    basename = "notes" + getTodaysDate();
    saveStringToTextFile(note.value, basename, ".txt");
}

function saveStringToTextFile(str1, basename = "myfile", fileType = ".txt") {
    let filename = basename + fileType;
    let blobVersionOfText = new Blob([str1], {
        type: "text/plain"
    });
    let urlToBlob = window.URL.createObjectURL(blobVersionOfText);
    let downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.download = filename;
    downloadLink.href = urlToBlob;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.parentElement.removeChild(downloadLink);
}

//Date related functions for convience, uses same format as input type="date"
function getTodaysDate() {
    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let today = now.getFullYear() + "-" + month + "-" + day;
    return today;
}

function getFirstDayOfThisMonthDate() {
    let now = new Date();
    let day = "01";
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear() + "-" + month + "-" + day;
}

function getLastDayOfThisMonthDate() {
    let now = new Date();
    let day = daysInThisMonth().toString();
    day = "0" + day;
    day = day.slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear() + "-" + month + "-" + day;
}

function daysInSomeMonth(someMonth, someYear) { //use jan month is 0
    return new Date(someYear, someMonth + 1, 0).getDate();
}

function daysInThisMonth() {
    thisDate = new Date();
    thisMonth = thisDate.getMonth();
    thisYear = thisDate.getYear();
    return daysInSomeMonth(thisMonth, thisYear);
}


//Trying print functions
function printNotesDiv(id) {
    let a = window.open();
    a.document.write(serializeElementToPage(id, "html{background-color:white;}#note{font-size:" + noteFontSize + "rem}"));
    a.document.close();
    a.print();
}

function serializeElementToPage(id, extraStyle = "") {
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



function askConfirm() {
    //if (needsSave === true) {
    return "Did you remember to save your data?";
    //} else {
    //    return;
    //}
}

function simulateUndo() {

    document.execCommand('undo', false, null);

}
