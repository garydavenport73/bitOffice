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


///////////////// serialize to web page //////////////////////

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
    let s = new XMLSerializer();
    let myElement = document.getElementById(id);
    let str = s.serializeToString(myElement);
    let htmlPage = boilerPlate1 + styleElementContent + extraStyle + boilerPlate2 + str + boilerPlate3;
    console.log(htmlPage);
    return htmlPage;
}

function simulateUndo() {
    document.execCommand('undo', false, null);
}

///////////before page close

function askConfirm() {
    //if (needsSave === true) {
    return "Did you remember to save your data?";
    //} else {
    //    return;
    //}
}


////////////page navigation ///////////////////

function showMain(id) {
    let currentMainId = getCurrentDisplayedMain();
    let currentApp = currentMainId.split("-")[1];
    let destinationApp = id.split("-")[1];

    console.log("current app is " + currentApp);

    if (currentApp === destinationApp) {
        //do nothing
    } else {
        if ((currentApp === "tables") || (currentApp === "contacts") || (currentApp === "calendar")) {
            //alert(currentApp + " is being left, so " + currentApp + "'s data needs stored.");
        }
        if (currentApp === "calendar") {
            calendarDatabase = backupCalendarDatabase();
        } else if (currentApp === "contacts") {
            contactsTableObject = backupContactsDatabase();
        } else if (currentApp === "tables") {
            currentTablesTable = backupTablesTable();
        }
    }

    console.log("show mains called with " + id);
    let mains = document.getElementsByTagName('main');
    for (let main of mains) {
        //console.log(main.id);
        main.style.display = "none"; //comment out
    }
    document.getElementById(id).style.display = "flex"; //comment out
}



function getCurrentDisplayedMain() {
    let mains = document.getElementsByTagName('main');
    for (let main of mains) {
        console.log(main.id);
        if (main.style.display != "none") {
            return main.id;
        }; //comment out
    }
}

/////////////////clipboard function//////////////////
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
    alert('Copied to Clipboard.');
    return (str);
}


/////// "Table" related functions where tables have data (array of objects) and header (array)

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


///////////////////////CSV related functions ////////////////////

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

//needs rewritten to match above format
function readCSV(csvString, loadWithHeader = true) {
    //trim string
    csvString = csvString.trim();

    //make lines out of csvString
    let lines = csvString.split("\n");

    let newCSVArrayOfArrays = [];

    for (let i = 0; i < lines.length; i++) {
        //trim whitespace of each line
        lines[i] = lines[i].trim();

        //remove leading and trailing " character
        lines[i] = lines[i].slice(1, -1);

        //split by ","
        let tempRowArray = lines[i].split('","');

        //make randomString
        let randomString = tokenMaker(32);
        while (lines[i].includes(randomString) === true) { //tests to see if randomString already in line (seems unlikely)
            randomString = tokenMaker(32);
        };

        //join by a randome string (make real random string here)
        let newString = tempRowArray.join(randomString);

        //look for the double quotes around randomString that is where the "," ie "","" (CSV convention) was
        newString = newString.replaceAll('"' + randomString + '"', '","');
        //split by randomString without the quotes
        tempRowArray = newString.split(randomString);

        //for each element in the row of elements, replace the "" with " CSV convention
        for (let j = 0; j < tempRowArray.length; j++) {
            tempRowArray[j] = tempRowArray[j].replaceAll('""', '"');
        }

        // console.log(tempRowArray);
        newCSVArrayOfArrays.push(tempRowArray); //add each row to the new array
    }

    console.log(newCSVArrayOfArrays); //now we have a straight array of arrays of strings in a csv style grid

    //convert to headers and data.
    let headers = [];
    let data = [];

    if (newCSVArrayOfArrays.length > 0) {
        if (loadWithHeader === true) {
            //finalTable["headerNames"] = JSON.parse(JSON.stringify(newCSVArrayOfArrays[0]));
            headers = newCSVArrayOfArrays[0];
            if (newCSVArrayOfArrays.length > 1) {
                for (let i = 1; i < newCSVArrayOfArrays.length; i++) { //loop through rows
                    let tempRow = {};
                    for (let j = 0; j < newCSVArrayOfArrays[i].length; j++) { //loop through cells in rows
                        tempRow[headers[j]] = newCSVArrayOfArrays[i][j];
                    }
                    data.push(tempRow);
                }
            }
        } else {
            if (newCSVArrayOfArrays.length > 0) {
                for (let j = 0; j < newCSVArrayOfArrays[0].length; j++) {
                    headers.push("Column " + (j + 1).toString());
                }
                for (let i = 0; i < newCSVArrayOfArrays.length; i++) { //loop through rows
                    let tempRow = {};
                    for (let j = 0; j < newCSVArrayOfArrays[i].length; j++) { //loop through cells in rows
                        tempRow[headers[j]] = newCSVArrayOfArrays[i][j];
                    }
                    data.push(tempRow);
                }
            }
        }
    }

    console.log(headers);
    console.log(data);

    let finalTable = {};
    finalTable["headers"] = headers;
    finalTable["data"] = data;

    return JSON.parse(JSON.stringify(finalTable));
}

function tokenMaker(intSize) {
    let token = "";
    let specialString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let index = 0;
    for (let i = 0; i < intSize; i++) {
        token += specialString[Math.floor(Math.random() * specialString.length)];
    }
    console.log(token);
    return token;
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

////////////////sort array by field

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