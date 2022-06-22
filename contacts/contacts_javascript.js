///////////////////////////GLOBALS/////////////////////////////
//------------------contacts ----------------------
let table = {};
let contactsTable = document.getElementById("contacts-table");
let contactsEditForm = document.getElementById("contacts-edit-form");
let contactsEditFormMessage = document.getElementById("contacts-edit-form-message");
let sortAscending = 1; //direction -1 is descending, otherwise ascending
//let baseFilename = "";
/////////////////////////////////////////////////////

initializeContactsApp();

function initializeContactsApp() {
    let headers = [];
    let inputTypes = {};
    let data = [];
    headers = ["name", "cell phone", "email", "address", "age"];
    inputTypes = {
        "name": "text",
        "cell phone": "tel",
        "email": "email",
        "address": "text",
        "age": "number"
    }

    for (let j = 0; j < headers.length; j++) { //fill in empty input types
        if (inputTypes[headers[j]] === undefined) {
            inputTypes[headers[j]] = "text";
        }
    }

    data = [];

    data[0] = { "name": 'Amelia', "cell phone": '304-210-8924', "email": '', "address": '' };
    data[1] = { "name": 'Gary', "cell phone": '304-494-6682', "email": '', "address": '' };
    data[2] = { "name": 'Phoebe', "cell phone": '304-834-2240', "email": '', "address": '' };

    table = {
        "name": "Contacts",
        "headers": headers,
        "inputTypes": inputTypes,
        "data": data
    }
    fillInEmptyPropertyValues(table);

    if (table["name"] === undefined) { //fill in empty table name
        table["name"] = "Table";
    }
    document.getElementById("contacts-table-name").innerHTML = table["name"];
    contactsTable.innerHTML = buildContactsTableElement(table);
    contactsEditForm.innerHTML = buildContactsEditForm(table, -1);
    showMain("main-contacts-table");
}

function buildContactsTableElement(table) {
    let tableElement = "";
    let numberOfColumns = table["headers"].length;
    let numberOfRows = table["data"].length;

    //start table
    tableElement += "<table>";

    //build table header
    tableElement += "<thead><tr>";
    for (let j = 0; j < numberOfColumns; j++) {
        tableElement += "<th onclick='sortContactsByField(this);'>" + table["headers"][j] + "</th>";
    }
    tableElement += "</tr></thead>";

    //build table body	
    tableElement += "<tbody>";

    for (let i = 0; i < numberOfRows; i++) {
        tableElement += "<tr id='contacts-table-row-" + i.toString() + "' onclick='selectContactsEditForm(this)'>";
        for (let j = 0; j < numberOfColumns; j++) {
            let fieldName = table["headers"][j];
            //console.log(table["data"][i][fieldName]);
            tableElement += "<td>" + table["data"][i][fieldName] + "</td>";
        }
        tableElement += "</tr>";
    }
    tableElement += "</tbody>";

    return tableElement;
}

function newContactsEntry(table) {
    //show what's being edited
    contactsEditFormMessage.innerHTML = table["name"] + ": New Entry";
    contactsEditForm.innerHTML = buildContactsEditForm(table, -1);
    showMain("main-contacts-form")
}

function selectContactsEditForm(clickedRow) {
    //show what's being edited
    let index = parseInt(clickedRow.id.split("-")[3]);
    contactsEditFormMessage.innerHTML = table["name"] + ": Entry " + index.toString();
    contactsEditForm.innerHTML = buildContactsEditForm(table, index);
    showMain("main-contacts-form");
}

function buildContactsEditForm(table, index) {
    //hidden input is index
    //select row
    //loop through the headers
    //	the label name is the header name
    //	the id of the input is the header name
    //  the type of input is determined by inputType
    let editForm = "";
    editForm += "<form>";
    editForm = "<input type='hidden' id='contacts-row-index' value='" + index.toString() + "'>";
    let numberOfColumns = table["headers"].length;
    let headers = table["headers"];
    let row = table["data"][index];
    let inputTypes = table["inputTypes"];


    //make blank form
    for (let j = 0; j < numberOfColumns; j++) {
        let extraString = "";
        if (inputTypes[headers[j]] === "number") {
            extraString = " step='any' ";
        } else if (inputTypes[headers[j]] === "tel") {
            extraString = " placeholder='304-424-1000' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' ";
        }
        if (index === -1) { //adding new
            editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label><input type='" + inputTypes[headers[j]] + "' id='contact-" + headers[j] + "' " + extraString + "></div>";
        } else { //editing existing
            editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label><input type='" + inputTypes[headers[j]] + "' id='contact-" + headers[j] + "' value='" + row[headers[j]].replaceAll("\"", "&quot;").replaceAll("\'", "&apos;") + "'" + extraString + "></div>";
        }
    }
    editForm += "</form>";
    return editForm;
}

function saveContactsEntry(table) {
    let index = parseInt(document.getElementById("contacts-row-index").value);
    //console.log(index);
    let headers = table["headers"];
    let row = {};
    for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = document.getElementById("contact-" + headers[j]).value;
    }
    if (index >= 0) { //an existing entry
        table["data"][index] = row;
    } else { // a new entry
        table["data"].push(row);
    }
    clearContactFormEntries(table);
    contactsTable.innerHTML = buildContactsTableElement(table);
    showMain("main-contacts-table");
}

function deleteContactsEntry(table) {
    let index = parseInt(document.getElementById("contacts-row-index").value);
    if (index >= 0) { //editing an entry
        if (confirm("Delete this entry?")) {
            table["data"].splice(index, 1); //an object
        }
    }
    clearContactFormEntries(table);
    contactsTable.innerHTML = buildContactsTableElement(table);
    showMain("main-contacts-table");
}

function cancelContactsEntry(table) {
    clearContactFormEntries(table);
    contactsTable.innerHTML = buildContactsTableElement(table);
    showMain("main-contacts-table");
}


function clearContactFormEntries(table) {
    let headers = table["headers"];
    for (let j = 0; j < headers.length; j++) {
        document.getElementById("contact-" + headers[j]).value = "";
    }
    document.getElementById("contacts-row-index").value = -1;
    contactsEditFormMessage.innerHTML = "";
}

function sortContactsByField(clickedHeaderElement) {
    let field = clickedHeaderElement.innerHTML;

    if (confirm("Sort by " + clickedHeaderElement.innerHTML + "?")) {
        destructiveSort(table["data"], field, sortAscending);
        contactsTable.innerHTML = buildContactsTableElement(table);
        sortAscending = -1 * sortAscending;
    };
}

function loadContactsTable() {
    if (confirm("This will overwrite current table")) {
        let fileContents = "";
        let inputTypeIsFile = document.createElement('input');
        inputTypeIsFile.type = "file";
        inputTypeIsFile.accept = ".json";
        inputTypeIsFile.addEventListener("change", function() {
            let inputFile = inputTypeIsFile.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) {
                fileContents = fileLoadedEvent.target.result;
                if (inputFile["name"].slice(-5) === ".json") {
                    baseFilename = inputFile["name"].slice(0, -5);
                }
                table = JSON.parse(fileContents);
                clearContactFormEntries(table);
                contactsTable.innerHTML = buildContactsTableElement(table);
            };

            fileReader.readAsText(inputFile, "UTF-8");
        });
        inputTypeIsFile.click();
    }
}


function saveContactsTable(table) {
    let str = JSON.stringify(table);
    //if (baseFilename === "") {
    baseFilename = table["name"] + getTodaysDate();
    //}
    saveStringToTextFile(str, baseFilename, ".json");
}


//////////////////////FUNCTIONS NOT SPECIFIC TO CONTACTS APP ///////////////////

function destructiveSort(arrayOfObjects, field, direction = 1) {
    //direction -1 is descending, otherwise ascending
    if (direction != -1) { direction = 1; }
    arrayOfObjects.sort((a, b) => {
        if (a[field] < b[field]) {
            return -1 * direction;
        }
        if (a[field] > b[field]) {
            return 1 * direction;
        }
        return 0;
    });
}

function showMain(id) {
    console.log("show mains called with " + id);
    let mains = document.getElementsByTagName('main');
    for (let main of mains) {
        console.log(main.id);
        //main.style.display = "none";
    }
    //document.getElementById(id).style.display = "inherit";
}



function makeCSV(thisTable, saveWithHeader = true) { ////This one fixed
    let csvString = "";
    let tempString = "";
    let headers = thisTable["headers"];
    if (saveWithHeader === true) {
        //fill in header from object
        for (let header of headers) {
            tempString = header.toString().replaceAll('"', '""'); //any interior " needs to be replaced with ""
            csvString += "\"" + tempString + "\","; //surround each field with quotes
        }
        csvString = csvString.slice(0, -1) + "\n"; //remove last comma and add new line
    }
    //fill in body data
    let bodyData = thisTable["data"];
    let numberOfRows = bodyData.length;
    let numberOfColumns = headers.length;
    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            tempString = bodyData[i][headers[j]].toString().replaceAll('"', '""'); //any interior " needs to be replaced with ""
            csvString += "\"" + tempString + "\","; //surround each field with quotes
        }
        csvString = csvString.slice(0, -1) + "\n"; //remove last comma and add new line
    }
    console.log(csvString);
    return (csvString);
}

function processCSVClick(table) {

    let thisCSV = "";
    if (confirm("Include header as first line in csv file?")) {
        thisCSV = makeCSV(table, true);
    } else {
        thisCSV = makeCSV(table, false);
    }

    copyToClipBoard(thisCSV);

    if (confirm("Table copied to CSV.\n\nSave to file also?")) {
        saveStringToTextFile(thisCSV, table["name"] + getTodaysDate(), ".csv");
    }

}






function fillInEmptyPropertyValues(table) {
    let data = table["data"];
    let headers = table["headers"];
    for (let i = 0; i < data.length; i++) { //fill in empty property values;
        for (let j = 0; j < headers.length; j++) {
            if (data[i][headers[j]] === undefined) {
                data[i][headers[j]] = "";
            }
        }
    }
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


////////////////
////////////////////////////////////////////
//Save related functions, often used with date functions below



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




//////////////




function copyToClipBoard(str) {
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
    //alert('Copied to Clipboard.');
    return (str);
}



/*		
Your Input Field:	Input Filter Type	Compares as
date				date				string
time				time				string
text				text				string
//textarea			text				string
number				number				number

integer				number				number
float				number				number
checkbox			string				string
radio				string				string
*/