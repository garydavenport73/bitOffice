////////////////////GLOBALS/////////////////////////
//----------------calendar-------------------------
let calendarDatabase = {
    "name": "Calendar",
    "headers": ["start", "end", "name", "notes"],
    "inputTypes": {
        "start": "time",
        "end": "time",
        "name": "text",
        "notes": "text"
    },
    "2022": {
        "07": {
            "09": {
                "data": [{
                    "start": "09:00",
                    "end": "10:00",
                    "name": "Eat Breakfast",
                    "notes": "Don't overeat"
                }, {
                    "start": "21:01",
                    "end": "",
                    "name": "yo",
                    "notes": "yoyo"
                }, {
                    "start": "22:00",
                    "end": "23:00",
                    "name": "watch tv",
                    "notes": "don't fall alseep"
                }]
            },
            "06": {
                "data": [{
                    "start": "sometime",
                    "end": "sometime",
                    "name": "somename",
                    "notes": "somenotes"
                }, {
                    "start": "sometime",
                    "end": "sometime",
                    "name": "somename",
                    "notes": "somenotes"
                }]
            },
            "08": {
                "data": [] //an example of something needing purged
            }
        },
        "06": {
            "09": {
                "data": [] //needs purged
            }
        }
    }
}

let calendarTable = document.getElementById("calendar-table");
let calendarEditForm = document.getElementById("calendar-edit-form");
let calendarEditFormMessage = document.getElementById("calendar-edit-form-message");
let sortAscending = 1; //direction -1 is descending, otherwise ascending
let table = {}

////////////////////GLOBALS/////////////////////////

////////////////////Initialization////////////////////
initializeCalendarApp()
    /////////////////////////////////////////////////////

///////////////////FUNCTIONS////////////////

function initializeCalendarApp() {
    headers = calendarDatabase["headers"];
    table["headers"] = calendarDatabase["headers"];
    inputTypes = calendarDatabase["inputTypes"];
    table["inputTypes"] = calendarDatabase["inputTypes"];

    for (let j = 0; j < headers.length; j++) { //fill in empty input types
        if (inputTypes[headers[j]] === undefined) {
            inputTypes[headers[j]] = "text";
        }
    }

    // for (let j = 0; j < table["headers"].length; j++) { //fill in empty input types
    //     if (table["inputTypes"][table["headers"][j]] === undefined) {
    //         table["inputTypes"][table["headers"][j]] = "text";
    //     }
    // }

    table["data"] = [];
    table["name"] = "not named yet";
    document.getElementById("calendar-table-name").innerHTML = table["name"];
    calendarTable.innerHTML = buildCalendarTableElement(table);
    calendarEditForm.innerHTML = buildCalendarEditForm(table, -1);
    showMain("main-calendar-table");
}

function processOpenCalendar() {
    let yearMonthDate = document.getElementById("calendar-date").value.split("-");
    let year = yearMonthDate[0];
    let month = yearMonthDate[1];
    let date = yearMonthDate[2];

    //check to see if year entry is in datbase
    if (calendarDatabase[year] === undefined) {
        calendarDatabase[year] = {};
    }
    if (calendarDatabase[year][month] === undefined) {
        calendarDatabase[year][month] = {};
    }
    if (calendarDatabase[year][month][date] === undefined) {
        calendarDatabase[year][month][date] = {};
    }
    if (calendarDatabase[year][month][date]["data"] === undefined) {
        calendarDatabase[year][month][date]["data"] = [];
    }
    table["data"] = calendarDatabase[year][month][date]["data"];
    table["name"] = year + "-" + month + "-" + date;
    document.getElementById("calendar-table-name").innerHTML = table["name"];
    calendarTable.innerHTML = buildCalendarTableElement(table);
    showMain("main-calendar-table");
    console.log(calendarDatabase);
}

function processCalendarHome(table) {
    let yearMonthDate = document.getElementById("calendar-date").value.split("-");
    let year = yearMonthDate[0];
    let month = yearMonthDate[1];
    let date = yearMonthDate[2];

    calendarDatabase[year][month][date]["data"] = JSON.parse(JSON.stringify(table["data"]));
    console.log(calendarDatabase);

}

function buildCalendarTableElement(table) { //needs headers data
    let tableElement = "";
    let numberOfColumns = table["headers"].length;
    let numberOfRows = table["data"].length;

    //start table
    tableElement += "<table>";

    //build table header
    tableElement += "<thead><tr>";
    for (let j = 0; j < numberOfColumns; j++) {
        tableElement += "<th onclick='sortCalendarByField(this);'>" + table["headers"][j] + "</th>";
    }
    tableElement += "</tr></thead>";

    //build table body	
    tableElement += "<tbody>";

    for (let i = 0; i < numberOfRows; i++) {
        tableElement += "<tr id='calendar-table-row-" + i.toString() + "' onclick='selectCalendarEditForm(this)'>";
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

function newCalendarEntry(table) {
    //show what's being edited
    calendarEditFormMessage.innerHTML = table["name"] + ": New Entry";
    calendarEditForm.innerHTML = buildCalendarEditForm(table, -1);
    showMain("main-calendar-form")
}

function selectCalendarEditForm(clickedRow) {
    //show what's being edited
    let index = parseInt(clickedRow.id.split("-")[3]);
    calendarEditFormMessage.innerHTML = table["name"] + ": Entry " + index.toString();
    calendarEditForm.innerHTML = buildCalendarEditForm(table, index);
    showMain("main-calendar-form");
}

function buildCalendarEditForm(table, index) {
    //hidden input is index
    //select row
    //loop through the headers
    //	the label name is the header name
    //	the id of the input is the header name
    //  the type of input is determined by inputType
    let editForm = "";
    editForm += "<form>";
    editForm = "<input type='hidden' id='calendar-row-index' value='" + index.toString() + "'>";
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
            editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label><input type='" + inputTypes[headers[j]] + "' id='" + headers[j] + "' " + extraString + "></div>";
        } else { //editing existing
            editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label><input type='" + inputTypes[headers[j]] + "' id='" + headers[j] + "' value='" + row[headers[j]].replaceAll("\"", "&quot;").replaceAll("\'", "&apos;") + "'" + extraString + "></div>";
        }
    }
    editForm += "</form>";
    return editForm;
}

function saveCalendarEntry(table) {
    let index = parseInt(document.getElementById("calendar-row-index").value);
    //console.log(index);
    let headers = table["headers"];
    let row = {};
    for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = document.getElementById(headers[j]).value;
    }
    if (index >= 0) { //an existing entry
        table["data"][index] = row;
    } else { // a new entry
        table["data"].push(row);
    }
    clearCalendarFormEntries(table);
    calendarTable.innerHTML = buildCalendarTableElement(table);
    showMain("main-calendar-table");
}

function deleteCalendarEntry(table) {
    let index = parseInt(document.getElementById("calendar-row-index").value);
    if (index >= 0) { //editing an entry
        if (confirm("Delete this entry?")) {
            table["data"].splice(index, 1); //an object
        }
    }
    clearCalendarFormEntries(table);
    calendarTable.innerHTML = buildCalendarTableElement(table);
    showMain("main-calendar-table");
}

function cancelCalendarEntry(table) {
    clearCalendarFormEntries(table);
    calendarTable.innerHTML = buildCalendarTableElement(table);
    showMain("main-calendar-table");
}


function clearCalendarFormEntries(table) {
    let headers = table["headers"];
    for (let j = 0; j < headers.length; j++) {
        document.getElementById(headers[j]).value = "";
    }
    document.getElementById("calendar-row-index").value = -1;
    calendarEditFormMessage.innerHTML = "";
}

function sortCalendarByField(clickedHeaderElement) {
    let field = clickedHeaderElement.innerHTML;

    if (confirm("Sort by " + clickedHeaderElement.innerHTML + "?")) {
        destructiveSort(table["data"], field, sortAscending);
        calendarTable.innerHTML = buildCalendarTableElement(table);
        sortAscending = -1 * sortAscending;
    };
}

function loadCalendarDatabase() {
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
                //if (inputFile["name"].slice(-5) === ".json") {
                //	baseFilename = inputFile["name"].slice(0, -5);
                //}
                calendarDatabase = JSON.parse(fileContents);
                //clearCalendarFormEntries(table);
                //calendarTable.innerHTML=buildCalendarTableElement(table);
            };

            fileReader.readAsText(inputFile, "UTF-8");
        });
        inputTypeIsFile.click();
    }
}

function saveCalendarDatabase(calendarDatabase) {
    let str = JSON.stringify(calendarDatabase);
    //if (baseFilename === "") {
    let baseFilename = calendarDatabase["name"] + getTodaysDate();
    //}
    saveStringToTextFile(str, baseFilename, ".json");
}


/////////////FUNCTIONS NOT SPECIFIC TO CALENDAR APP ///////////

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

function makeCSV(thisTable, saveWithHeader = true) {
    let csvString = "";
    let tempString = "";
    if (saveWithHeader === true) {
        //fill in header from object
        let headers = thisTable["headers"];
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