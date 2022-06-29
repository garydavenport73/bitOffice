////////////////////GLOBALS/////////////////////////


// let calendarTable = document.getElementById("calendar-table");
// let calendarEditForm = document.getElementById("calendar-edit-form");
// let calendarEditFormMessage = document.getElementById("calendar-edit-form-message");
// let sortAscending = 1; //direction -1 is descending, otherwise ascending
// let table = {}

////////////////////GLOBALS/////////////////////////

////////////////////Initialization////////////////////
// initializeCalendarApp();
/////////////////////////////////////////////////////

///////////////////FUNCTIONS////////////////

function initializeCalendarApp() {
    document.getElementById("calendar-table-name").innerHTML = calendarDatabase["name"];
    //calendarTable.innerHTML = buildCalendarTableElement(calendarDatabase);
    //calendarEditForm.innerHTML = buildCalendarEditForm(calendarDatabase, -1);
}
//showMain("main-calendar-start");




function processOpenCalendar() {
    let date = document.getElementById("calendar-date").value;
    console.log(date);

    if (date === "") {
        return;
    }
    //check to see if year entry is in datbase
    if (calendarDatabase["dates"][date] === undefined) {
        calendarDatabase["dates"][date] = {};
        calendarDatabase["dates"][date]["data"] = [];

        // "2022-07-09": {
        //     "data": [{
        //         "start": "09:00",
        //         "end": "10:00",
        //         "name": "Eat Breakfast",
        //         "notes": "Don't overeat"
        //     }


    }

    //table["data"] = calendarDatabase[year][month][date]["data"];
    //table["name"] = year + "-" + month + "-" + date;
    document.getElementById("calendar-table-name").innerHTML = "<span onclick='processCalendarHome();'>" + date + " &#128197;</span>";
    //sortCalendarByStartTime(date);

    calendarTable.innerHTML = buildCalendarTableElement(date);
    showMain("main-calendar-table");
    console.log(calendarDatabase);
}

function processCalendarHome() {
    showMain("main-calendar-start");
    //setColorOfBackupSaveButton();
}

function processCalendarCSVClick() {
    let headers = calendarDatabase["headers"];
    let date = document.getElementById("calendar-date").value;
    let data = calendarDatabase["dates"][date]["data"];
    let tempTable = {};
    tempTable["headers"] = headers;
    tempTable["data"] = data;
    tempTable["name"] = "Calendar";

    processCSVClick(tempTable);

}

function buildCalendarTableElement(date) { //needs headers data
    sortCalendarByStartTime(date);
    let dataEntriesArrayForGivenDay = calendarDatabase["dates"][date]["data"];
    let tableElement = "";
    let numberOfColumns = calendarDatabase["headers"].length;
    let numberOfRows = dataEntriesArrayForGivenDay.length;

    //start table
    tableElement += "<table>";

    //build table header
    tableElement += "<thead><tr>";
    for (let j = 0; j < numberOfColumns; j++) {
        tableElement += "<th onclick='//sortCalendarByField(this);'>" + calendarDatabase["headers"][j] + "</th>";
    }
    tableElement += "</tr></thead>";

    //build table body	
    tableElement += "<tbody>";

    for (let i = 0; i < numberOfRows; i++) {
        tableElement += "<tr id='calendar-table-row-" + i.toString() + "' onclick=\"selectCalendarEditForm(" + i.toString() + ")\">";
        for (let j = 0; j < numberOfColumns; j++) {
            let fieldName = calendarDatabase["headers"][j];
            //console.log(table["data"][i][fieldName]);
            tableElement += "<td>" + dataEntriesArrayForGivenDay[i][fieldName] + "</td>";
        }
        tableElement += "</tr>";
    }
    tableElement += "</tbody>";

    return tableElement;
}

function newCalendarEntry(table) {
    //show what's being edited
    calendarEditFormMessage.innerHTML = document.getElementById("calendar-date").value + ": New Entry";
    calendarEditForm.innerHTML = buildCalendarEditForm(-1);
    showMain("main-calendar-form")
}

function selectCalendarEditForm(clickedRowIndex) {
    //show what's being edited
    //let index = parseInt(clickedRow.id.split("-")[3]);
    calendarEditFormMessage.innerHTML = document.getElementById("calendar-date").value + ": Entry " + clickedRowIndex.toString();
    calendarEditForm.innerHTML = buildCalendarEditForm(clickedRowIndex);
    showMain("main-calendar-form");
}

function buildCalendarEditForm(index) {
    //hidden input is index
    //select row
    //loop through the headers
    //	the label name is the header name
    //	the id of the input is the header name
    //  the type of input is determined by inputType

    //console.log(calendarDatabase[year][month][date]);
    let date = document.getElementById("calendar-date").value;

    let thisEntry = calendarDatabase["dates"][date]["data"][index];


    let editForm = "";
    editForm += "<form>";
    editForm = "<input type='hidden' id='calendar-row-index' value='" + index.toString() + "'>";
    let numberOfColumns = calendarDatabase["headers"].length;
    let headers = calendarDatabase["headers"];
    let row = thisEntry;
    let inputTypes = calendarDatabase["inputTypes"];


    //make blank form
    for (let j = 0; j < numberOfColumns; j++) {
        let extraString = "";
        if (inputTypes[headers[j]] === "number") {
            extraString = " step='any' ";
        } else if (inputTypes[headers[j]] === "tel") {
            extraString = " placeholder='304-424-1000' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' ";
        }
        if (index === -1) { //adding new
            editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='" + headers[j] + "' " + extraString + "></div>";
        } else { //editing existing
            editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='" + headers[j] + "' value='" + row[headers[j]].replaceAll("\"", "&quot;").replaceAll("\'", "&apos;") + "'" + extraString + "></div>";
        }
    }
    editForm += "</form>";
    return editForm;
}

function saveCalendarEntry() {
    let index = parseInt(document.getElementById("calendar-row-index").value);
    let date = document.getElementById("calendar-date").value;
    //let thisEntry = calendarDatabase[date]["data"][index];
    //console.log(index);
    let headers = calendarDatabase["headers"];
    let row = {};
    for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = document.getElementById(headers[j]).value;
    }
    if (index >= 0) { //an existing entry
        calendarDatabase["dates"][date]["data"][index] = row;
    } else { // a new entry
        calendarDatabase["dates"][date]["data"].push(row);
    }
    clearCalendarFormEntries();
    //sortCalendarByStartTime(date);
    calendarTable.innerHTML = buildCalendarTableElement(date);
    showMain("main-calendar-table");
}

function purgeCalendar() {
    //go through calendar "dates"
    //dates are an object
    //the objects properties are strings
    //the objects properties key are arrays
    //
    //
    // "dates": {
    //     "2022-07-09": {
    //         "data": [{
    //             "start": "09:00",
    //             "end": "10:00",
    //             "name": "Eat Breakfast",
    //             "notes": "Don't overeat"
    //         }, {
    console.log(calendarDatabase["dates"]);
    let dates = calendarDatabase["dates"];

    for (let date in dates) {
        console.log(date);
        console.log(dates[date]["data"]);
        console.log(dates[date]["data"].length);
        if (dates[date]["data"].length === 0) {
            //need to remove this specific property 
            //from the dates object
            delete dates[date];
        }
    }

    console.log(calendarDatabase["dates"]);

    // let date = calendarDatabase["dates"];
    // for (let date of dates) {
    //     console.log(date);
    // }
}

function deleteCalendarEntry() {
    let index = parseInt(document.getElementById("calendar-row-index").value);
    let date = document.getElementById("calendar-date").value;
    if (index >= 0) { //editing an entry
        if (confirm("Delete this entry?")) {
            calendarDatabase["dates"][date]["data"].splice(index, 1); //an object
        }
    }
    clearCalendarFormEntries();
    calendarTable.innerHTML = buildCalendarTableElement(date);
    showMain("main-calendar-table");
}

function cancelCalendarEntry() {
    let date = document.getElementById("calendar-date").value;
    clearCalendarFormEntries();
    calendarTable.innerHTML = buildCalendarTableElement(date);
    showMain("main-calendar-table");
}


function clearCalendarFormEntries() {
    let headers = calendarDatabase["headers"];
    for (let j = 0; j < headers.length; j++) {
        document.getElementById(headers[j]).value = "";
    }
    document.getElementById("calendar-row-index").value = -1;
    calendarEditFormMessage.innerHTML = "";
}

function sortCalendarByStartTime(date) {
    //let date = document.getElementById("calendar-date").value;
    let field = calendarDatabase["headers"][0];
    destructiveSort(calendarDatabase["dates"][date]["data"], field);
}

function sortCalendarByField(clickedHeaderElement) {
    let date = document.getElementById("calendar-date").value;
    let field = clickedHeaderElement.innerHTML;
    if (calendarDatabase["dates"][date]["data"].length > 1) { //shouldn't sort if there is only one row.
        if (confirm("Sort by " + clickedHeaderElement.innerHTML + "?")) {
            destructiveSort(calendarDatabase["dates"][date]["data"], field, sortAscending);
            calendarTable.innerHTML = buildCalendarTableElement(date);
            sortAscending = -1 * sortAscending;
        };
    }
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