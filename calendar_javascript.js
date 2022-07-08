initializeCalendarApp();

function initializeCalendarApp() {
    monthChooser.addEventListener("input", makeCalendar);
    monthChooser.addEventListener("change", makeCalendar);
    monthChooser.value = getTodaysDate().slice(0, -3);
    console.log(getTodaysDate().slice(0, -3));
    makeCalendar();
}

function processCalendarHome() {
    makeCalendar();
    showMain("main-calendar-start");
}

function processCalendarCSVClick() {
    let date = document.getElementById("calendar-date").value;;
    let tempTable = {};
    tempTable["headers"] = calendarDatabase["headers"];
    tempTable["data"] = calendarDatabase["dates"][date]["data"];
    tempTable["name"] = "Calendar";
    processCSVClick(tempTable);
}

function buildCalendarTableElement(date) { //needs headers data

    destructiveSort(calendarDatabase["dates"][date]["data"], calendarDatabase["headers"][0]); //sort by start time

    let daysEntries = calendarDatabase["dates"][date]["data"];
    let tableElement = "";
    let numberOfColumns = calendarDatabase["headers"].length;
    let numberOfRows = daysEntries.length;

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
            tableElement += "<td>" + daysEntries[i][fieldName] + "</td>";
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
    calendarEditFormMessage.innerHTML = document.getElementById("calendar-date").value + ": Entry " + clickedRowIndex.toString();
    calendarEditForm.innerHTML = buildCalendarEditForm(clickedRowIndex);
    showMain("main-calendar-form");
}

function buildCalendarEditForm(index) {
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
    calendarTable.innerHTML = buildCalendarTableElement(date);
    showMain("main-calendar-table");
}

function purgeCalendar() {
    let dates = calendarDatabase["dates"];
    for (let date in dates) {
        console.log(date);
        console.log(dates[date]["data"]);
        console.log(dates[date]["data"].length);
        if (dates[date]["data"].length === 0) {
            delete dates[date];
        }
    }
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

function sortCalendarByField(clickedHeaderElement) {
    let date = document.getElementById("calendar-date").value;
    let field = clickedHeaderElement.innerHTML;
    if (calendarDatabase["dates"][date]["data"].length > 1) { //don't sort if less than 2 rows.
        if (confirm("Sort by " + clickedHeaderElement.innerHTML + "?")) {
            destructiveSort(calendarDatabase["dates"][date]["data"], field, calendarSortAscending);
            calendarTable.innerHTML = buildCalendarTableElement(date);
            calendarSortAscending = -1 * calendarSortAscending;
        };
    }
}

function makeCalendar() {
    console.log("--------------------");
    console.log(monthChooser.value);
    console.log("--------------------");

    let d = new Date(monthChooser.value + "-01T00:00");
    let startDayIndex = d.getDay(); //zero based day
    let monthToUse = parseInt(monthChooser.value.split("-")[1]) - 1;
    let yearToUse = parseInt(monthChooser.value.split("-")[0]);
    let daysInMonth = daysInSomeMonth(monthToUse, yearToUse);

    let calendarString = "<table>";
    //header
    calendarString += "<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>";

    //start rows
    calendarString += "<tr>";

    //blank days
    //so start day is the number of loops to do conincidentally
    for (let i = 0; i < startDayIndex; i++) {
        console.log("x", daysAbbreviations[i]);
        calendarString += "<td>" + "-" + "</td>";
    }

    //days
    for (let i = 0; i < daysInMonth; i++) {
        let thisDate = i + 1; //date 1 indexed
        let thisDayOfWeek = daysAbbreviations[(i + startDayIndex) % 7];
        if ((i + startDayIndex) % 7 === 0) {
            console.log("--------new line ----------");
            calendarString += "</tr><tr>"
        }
        calendarString += "<td class='return-calendar-date'>" + (i + 1).toString() + "</td>";
        console.log(thisDate, thisDayOfWeek);
    }

    //blank days at end
    //find out what day of week last day is on
    let lastDayIndex = (daysInMonth - 1 + startDayIndex) % 7;
    let blankSpacesRemaining = 6 - lastDayIndex;
    for (let i = 0; i < blankSpacesRemaining; i++) {
        console.log("x", daysAbbreviations[lastDayIndex + 1 + i]);
        calendarString += "<td>" + "-" + "</td>";
    }
    calendarString += "</tr></table>";

    document.getElementById('special-calendar').innerHTML = calendarString;
    addEventListenersToCalendarEntries();
    purgeCalendar();
    colorCalendarEntries();
    return calendarString;

}

function addEventListenersToCalendarEntries() {
    let calendarEntries = document.getElementsByClassName('return-calendar-date');
    for (let entry of calendarEntries) {
        entry.addEventListener("click", (evt) => { openDayEntry(evt) });
    }
}

function openDayEntry(evt) {
    //add "0" to date then slice -2 to ensure leading 0
    let theDate = monthChooser.value + "-" + ("0" + evt.target.innerHTML).slice(-2);
    document.getElementById("calendar-date").value = theDate;
    if (theDate === "") {
        return;
    }
    //check to see if year entry is in database, if needed make entry
    if (calendarDatabase["dates"][theDate] === undefined) {
        calendarDatabase["dates"][theDate] = {};
        calendarDatabase["dates"][theDate]["data"] = [];
    }

    document.getElementById("calendar-table-name").innerHTML = daysAbbreviations[getDayOfWeek(theDate)] + " " + theDate + "</span>";
    calendarTable.innerHTML = buildCalendarTableElement(theDate);
    showMain("main-calendar-table");
}

function colorCalendarEntries() {
    purgeCalendar();
    let calendarEntries = document.getElementsByClassName('return-calendar-date');
    for (let entry of calendarEntries) {

        let thisDate = monthChooser.value + "-" + ("0" + entry.innerHTML).slice(-2);

        if (calendarDatabase["dates"][thisDate] === undefined) {
            entry.style["backgroundColor"] = "#E0E0E0;";
        } else {
            entry.style["backgroundColor"] = "darkorange";
        }

        if (getTodaysDate() === thisDate) {
            entry.style["border"] = "1px solid grey";
            entry.style["font-weight"] = "bold";
        }
    }
}