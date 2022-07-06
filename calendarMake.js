///////////////// serialize to web page //////////////////////

let monthChooser = document.getElementById("month-chooser");
monthChooser.addEventListener("input", makeCalendar);
monthChooser.addEventListener("change", makeCalendar);
monthChooser.value = getTodaysDate().slice(0, -3);
console.log(getTodaysDate().slice(0, -3));
makeCalendar();


function makeCalendar() { //
    console.log("--------------------");
    console.log(monthChooser.value);
    console.log("--------------------");
    let daysAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    let d = new Date(monthChooser.value + "-01T00:00");
    let startDayIndex = d.getDay(); //zero based day
    let monthToUse = parseInt(monthChooser.value.split("-")[1]) - 1;
    let yearToUse = parseInt(monthChooser.value.split("-")[0]);
    let daysInMonth = daysInSomeMonth(monthToUse, yearToUse);

    let calendarString = "<table>";
    calendarString += "<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>";
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
    console.log(evt.target);
    console.log(theDate);
    //evt.target.style["backgroundColor"]="darkorange";

    //let date = document.getElementById("calendar-date").value;
    //console.log(date);

    document.getElementById("calendar-date").value = theDate;

    if (theDate === "") {
        return;
    }
    //check to see if year entry is in datbase
    if (calendarDatabase["dates"][theDate] === undefined) {
        calendarDatabase["dates"][theDate] = {};
        calendarDatabase["dates"][theDate]["data"] = [];
    }

    document.getElementById("calendar-table-name").innerHTML = "<span onclick='processCalendarHome();'>" + theDate + " &#128197;</span>";

    //document.getElementById("calendar-table-name").innerHTML = "<span onclick='processCalendarHome();'>" + theDate + "</span>";

    calendarTable.innerHTML = buildCalendarTableElement(theDate);

    showMain("main-calendar-table");

    console.log(calendarDatabase);


}


function purgeCalendar2() {
    console.log(calendarDatabase["dates"]);
    let dates = calendarDatabase["dates"];

    for (let date in dates) {
        console.log(date);
        console.log(dates[date]["data"]);
        console.log(dates[date]["data"].length);
        if (dates[date]["data"].length === 0) {
            delete dates[date];
        }
    }
    console.log(calendarDatabase["dates"]);
}


function colorCalendarEntries() {
    purgeCalendar();
    let calendarEntries = document.getElementsByClassName('return-calendar-date');
    for (let entry of calendarEntries) {
        let thisDate = monthChooser.value + "-" + ("0" + entry.innerHTML).slice(-2);
        console.log(thisDate);

        console.log(calendarDatabase["dates"][thisDate]);

        if (calendarDatabase["dates"][thisDate] === undefined) {
            entry.style["backgroundColor"] = "#E0E0E0;";
        } else {
            entry.style["backgroundColor"] = "darkorange";
        }
        
        if (getTodaysDate()===thisDate){
			entry.style["border"]="1px solid mediumblue";
			entry.style["font-weight"]="bold";
		}
    }
}
