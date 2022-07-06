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

///////////////// serialize to web page //////////////////////

let monthChooser = document.getElementById("month-chooser");
monthChooser.addEventListener("input", makeCalendar);
monthChooser.addEventListener("change", makeCalendar);
monthChooser.value= getTodaysDate().slice(0,-3);
console.log(getTodaysDate().slice(0,-3));
makeCalendar();


function makeCalendar(){ //
	console.log("--------------------");
	console.log(monthChooser.value);
	console.log("--------------------");
	let daysAbbreviations=["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
	let d=new Date(monthChooser.value+"-01T00:00");
	let startDayIndex=d.getDay();//zero based day
	let monthToUse = parseInt(monthChooser.value.split("-")[1]) - 1;
	let yearToUse = parseInt(monthChooser.value.split("-")[0]);
	let daysInMonth = daysInSomeMonth(monthToUse,yearToUse);
	
	let calendarString="<table><tr>";
	
	//blank days
	//so start day is the number of loops to do conincidentally
	for (let i = 0; i < startDayIndex; i++){
		console.log("x",daysAbbreviations[i]);
		calendarString+="<td>"+"-"+"</td>";
	}
	
	//days
	for (let i = 0; i<daysInMonth; i++){
		let thisDate=i+1; //date 1 indexed
		let thisDayOfWeek = daysAbbreviations[(i+startDayIndex)%7];
		if ((i+startDayIndex)%7===0){
			console.log("--------new line ----------");
			calendarString+="</tr><tr>"
		}	
		calendarString+="<td class='return-calendar-date'>"+(i+1).toString()+"</td>";
		console.log(thisDate, thisDayOfWeek);
	}
	
	//blank days at end
	//find out what day of week last day is on
	let lastDayIndex=(daysInMonth - 1 + startDayIndex)%7;
	let blankSpacesRemaining = 6 - lastDayIndex;
	for (let i = 0; i < blankSpacesRemaining; i++){
		console.log("x",daysAbbreviations[lastDayIndex + 1 + i]);
		calendarString+="<td>"+"-"+"</td>";
	}
	calendarString+="</tr></table>";
	
	document.getElementById('special-calendar').innerHTML=calendarString;
	addEventListenersToCalendarEntries();
	colorCalendarEntries();
	return calendarString;
		
}

function addEventListenersToCalendarEntries(){
	let calendarEntries = document.getElementsByClassName('return-calendar-date');
	for (let entry of calendarEntries){
		entry.addEventListener("click",(evt)=>{openDayEntry(evt)});
	}
}

function openDayEntry(evt){
	//add "0" to date then slice -2 to ensure leading 0
	let theDate = monthChooser.value+"-"+("0"+evt.target.innerHTML).slice(-2);
	console.log(evt.target);
	console.log(theDate);
	//evt.target.style["backgroundColor"]="darkorange";
}

function colorCalendarEntries(){
	let calendarEntries = document.getElementsByClassName('return-calendar-date');
	for (let entry of calendarEntries){
		if (Math.random()>0.5){
			entry.style["backgroundColor"]="darkorange";
		}
	}
}



