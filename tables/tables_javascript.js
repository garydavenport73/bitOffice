///////////////GLOBALS///////////////////////
//-------------tables-----------------------
let tablesInitialTable = {
    headers: ["Column 1", "Column 2", "Column 3"],
    data: [
        { "Column 1": "hi", "Column 2": "", "Column 3": "" },
        { "Column 1": "there", "Column 2": "", "Column 3": "" },
        { "Column 1": "everybody", "Column 2": "", "Column 3": "" }
    ]
}

let table = {}

/////////////////////////////////////

initializeTablesApp();

function initializeTablesApp() {
    table = JSON.parse(JSON.stringify(tablesInitialTable));
    makeTable(table);
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



function processColumnClick(header) {
    //update the database	
    updateDataFromCurrentInputs();
    populateMoveColumnSelect(table);
    //fill out the form on the columns page
    document.getElementById("tables-current-header").innerHTML = header;
}


function processRowClick(row) {
    //alert("need to process row "+row.toString());
    //update the database	
    updateDataFromCurrentInputs();
    populateMoveRowSelect(table);

    document.getElementById("tables-current-row").innerHTML = row.toString();
}

function makeTable(table) {
    let tableElement = document.getElementById('tables-table');
    let str = "";

    //fill in header from object
    str = "";
    let headers = table.headers; //an array of strings
    str += "<thead><tr><th></th>";
    for (let i = 0; i < headers.length; i++) {
        str += "<th id='" + headers[i] + "' onclick=\"processColumnClick('" + headers[i] + "');\">" + headers[i] + "</th>";
    }
    str += "<th id='add-column' onclick='addColumn(table)'>+</th>";
    str += "</tr></thead>";
    let tableHeader = str;

    //fill in body data from object
    str = "<tbody>";
    let bodyData = table.data; //an array of objects;
    console.log(bodyData);
    let rowCount = bodyData.length;
    for (let i = 0; i < rowCount; i++) {
        str += "<tr><td id='row-" + i.toString() + "' onclick='processRowClick(" + i.toString() + ")'>" + i.toString() + "</td>";
        let columnCount = headers.length;
        console.log(columnCount);
        for (let j = 0; j < columnCount; j++) {
            //console.log(headers[j]);
            str += "<td><input type='text' id='cell-" + i.toString() + "-" + j.toString() + "' value='" + bodyData[i][headers[j]].toString() + "'></td>";
            //str += "<td><input type='text' id='cell-" + (i + 1).toString() + "-" + (j + 1).toString() + "' value='" + i.toString()+j.toString() + "'></td>";
        }
        str += "</tr>";
    }
    str += "</tbody>"
    let tableBody = str;

    //make footer for additional controls
    str = "<tfoot><tr><th id='add-row' onclick='addRow(table)'>+</th>";
    for (let i = 0; i < headers.length; i++) {
        str += "<th id='footer-" + (i + 1).toString() + "' onclick=\"processColumnClick('" + headers[i] + "');\"></th>";
    }
    str += "</tr></tfoot>";
    let tableFooter = str;
    let strTable = tableHeader + tableBody + tableFooter;

    //addListenersToTable();
    populateMoveColumnSelect(table);
    populateMoveRowSelect(table);

    tableElement.innerHTML = strTable;

    return strTable;
}


function populateMoveColumnSelect(table) {
    let moveColumnSelect = document.getElementById('move-column');
    moveColumnSelect.options.length = 0;
    // moveColumnSelect.style.backgroundColor = "orange";
    let currentTableHeaders = table.headers; //an array of header names
    for (th of currentTableHeaders) {
        let option = document.createElement('option');
        option.value = th;
        option.text = th;
        moveColumnSelect.add(option);
    }
}

function populateMoveRowSelect(table) {
    // document.getElementById(selectbox).options.length = 0;
    let moveRowSelect = document.getElementById('move-row');
    moveRowSelect.options.length = 0;
    // moveRowSelect.style.backgroundColor = 'orange';
    for (let i = 0; i < table["data"].length; i++) {
        let option = document.createElement('option');
        option.value = i.toString();
        option.text = i.toString();
        moveRowSelect.add(option);
    }
}

function updateDataFromCurrentInputs() {
    let headers = table["headers"];
    //need to look and see what is currently in the table visibly
    //and rewrite the data to the data table
    for (let i = 0; i < table.data.length; i++) {
        for (let j = 0; j < table.headers.length; j++) {
            let id = "cell-" + i.toString() + "-" + j.toString();
            let thisCell = document.getElementById(id);
            table.data[i][headers[j]] = thisCell.value;
        }
    }
    //makeTable();
}
//Column functions
function updateHeaderName(table) {
    //updateDataFromCurrentInputs();
    //get old name
    let fieldName = document.getElementById("tables-current-header").innerHTML;
    //get new name
    let newName = document.getElementById('tables-new-header-name').value;

    //do nothing if they are the same
    if (fieldName === newName) {
        makeTable(table);
        return;
    }

    let headers = table["headers"];
    let data = table["data"];

    if (newName === "") { //if blank make name new
        newName = prompt("There is no name listed, please enter the new name");
        if (newName === null) {
            return;
        }
    }

    table = _changeHeaderAndDataPropertyName(table, newName, fieldName);

    makeTable(table);
    showMain('main-tables-table');
}

function _changeHeaderAndDataPropertyName(table, newName, oldName) {
    let nameCount = 0;
    let data = table["data"];

    newName = getBestName(table, newName);

    let index = table["headers"].indexOf(oldName); //get index of field 

    table["headers"][index] = newName; //change header name
    //update rows
    for (let i = 0; i < data.length; i++) {
        data[i][newName] = data[i][oldName]; //set new property to old
        delete data[i][oldName]; //delete old
    }
    return table;
}


function deleteColumn(table) {
    //alert("delete column called");
    console.log("delete column called");
    let columnName = document.getElementById("tables-current-header").innerHTML;
    let index = table["headers"].indexOf(columnName);

    table["headers"].splice(index, 1); //delete from header array

    //loop through rows

    for (let i = 0; i < table["data"].length; i++) {

        delete table["data"][i][columnName];

    }

    makeTable(table);
    showMain('main-tables-table');

}

function addColumn(table) {
    //alert("need to process add column");
    updateDataFromCurrentInputs();
    let newIndex = 1;
    let newColumnName = "new" + newIndex.toString(); //make a new name

    //if name already in use, make a new name
    while (table["headers"].includes(newColumnName)) {
        console.log("column name already in use");
        newIndex += 1;
        newColumnName = "new" + newIndex.toString();
    }
    //alert("new column name "+newColumnName);

    table.headers.push(newColumnName);


    fillInEmptyPropertyValues(table);
    makeTable(table);
    //table.headerNames.push("new");
    //for (let row of table.data) {
    //    row.push("");
    //}
    //makeTable();
}

function moveColumn(table) {
    let columnName = document.getElementById("tables-current-header").innerHTML;
    let destinationColumnName = document.getElementById("move-column").value;
    if (columnName === destinationColumnName) {
        console.log("destination is same as source");
        return;
    }
    let index = table["headers"].indexOf(columnName);


    let destinationIndex = table["headers"].indexOf(destinationColumnName);

    let headerToMove = table["headers"].splice(index, 1)[0]; //splice returns an array length 1

    table["headers"].splice(destinationIndex, 0, headerToMove);
    makeTable(table);
    showMain('main-tables-table');
}

function getBestName(table, name) {

    let headers = table["headers"];
    let nameCount = 0;
    let bestName = name;

    while (headers.includes(bestName)) {
        console.log("column name already in use");
        nameCount += 1;
        bestName = name + "-" + nameCount.toString();
    }

    return bestName;
}

function copyColumn(table) {
    //get column 
    let columnName = document.getElementById("tables-current-header").innerHTML;

    //make name for new column
    let newName = getBestName(table, columnName);
    //add to headers			
    table["headers"].push(newName);

    //go through rows of data
    for (let i = 0; i < table["data"].length; i++) {
        table["data"][i][newName] = table["data"][i][columnName];
    }

    makeTable(table);
    showMain('main-tables-table');

}



function calculateTotal(table) {
    //get column 
    let columnName = document.getElementById("tables-current-header").innerHTML;


    let total = 0;
    for (let row of table.data) {
        total = total + Number(row[columnName]);
    }
    if (confirm("The total is: " + total.toString() + "\nCopy to clipboard?")) {
        copyToClipBoard(total.toString());
    };
    showMain('main-tables-table');
}

function tablesCancel(table) {
    console.log("tablesCancel called");
    makeTable(table); //probably not needed
    showMain('main-tables-table');

}

function calculateAverage() {
    alert("calculate average called");
    console.log("calcualtoe average called");

    let columnName = document.getElementById("tables-current-header").innerHTML;


    let total = 0;

    for (let row of table.data) {
        total = total + Number(row[columnName]);
    }

    let average = total / table.data.length;

    if (confirm("The average is: " + average.toString() + "\nCopy to clipboard?")) {
        copyToClipBoard(average.toString());
    }
    showMain('main-tables-table');


    //updateDataFromCurrentInputs();
    //let columnNumber = usefulInteger - 1;
    //usefulInteger = -1;
    //let total = 0;
    //for (let row of table.data) {
    //total = total + Number(row[columnNumber]);
    //}
    //let average = total / table.data.length;

    //if (confirm("The average is: " + average.toString() + "\nCopy to clipboard?")) {
    //copyToClipBoard(average.toString());
    //}
    //showMain('main-tables-table');
}

//row functions
function addRow(table) {
    let headers = table["headers"];
    updateDataFromCurrentInputs();
    let numberOfColumns = table.headers.length;
    let tempRow = {};
    for (let i = 0; i < numberOfColumns; i++) {
        tempRow[headers[i]] = "";
    }
    table["data"].push(tempRow);
    makeTable(table);
}

function deleteRow() {
    //updateDataFromCurrentInputs();
    let index = parseInt(document.getElementById("tables-current-row").innerHTML);
    //let rowIndex = usefulInteger - 1;
    let data = table["data"];
    data.splice(index, 1);
    //usefulInteger = -1;
    makeTable(table);
    //showMain('main-tables-table');
}

function copyRow() {
    //alert("copy row called");
    console.log("copy row called");
    //updateDataFromCurrentInputs();
    let index = parseInt(document.getElementById("tables-current-row").innerHTML);
    let data = table["data"];
    console.log(data);

    let rowToCopy = JSON.parse(JSON.stringify(table.data[index]));

    data.push(rowToCopy);
    makeTable(table);
    //showMain('main-tables-table');
}

function moveRow() {
    //alert("move row called");
    console.log("move row called");



    let index = parseInt(document.getElementById("tables-current-row").innerHTML);


    let data = table["data"];




    let destinationIndex = parseInt(document.getElementById("move-row").value);



    let rowToMove = data.splice(index, 1)[0];


    data.splice(destinationIndex, 0, rowToMove);
    //console.log(table.data);
    makeTable(table);
    //showMain('main-tables-table');
}




function tablesNewTable() {
    //alert("need to process new");
    //console.log("tablesNewTable() called");
    if (confirm("Are you sure?  This will erase all current data.")) {
        table = JSON.parse(JSON.stringify(initialTable));
        makeTable(table);
        showMain('main-tables-table');
        return table;
    }
}

function tablesLoad() {
    console.log("tablesLoad() called");
    let fileContents = "";
    let inputTypeIsFile = document.createElement('input');
    inputTypeIsFile.type = "file";
    inputTypeIsFile.accept = ".csv";
    inputTypeIsFile.addEventListener("change", function() {
        let inputFile = inputTypeIsFile.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            fileContents = fileLoadedEvent.target.result;
            if (confirm("Use the first line as the header row?")) {
                //need to process
                //alert("need to get csv data and make headers and data");
                table = readCSV(fileContents, true);
            } else {
                //alert("need to get csv data and write own headers col1,col2, etc");
                table = readCSV(fileContents, false);
            }
            makeTable(table);
        };
        fileReader.readAsText(inputFile, "UTF-8");
    });
    inputTypeIsFile.click();
}

function tablesSave() {
    console.log("tablesSave() called");
    updateDataFromCurrentInputs();
    if (confirm("Include header as first line in csv file?")) {
        saveStringToTextFile(makeCSV(table, true), "csvTable" + getTodaysDate(), ".csv");
    } else {
        saveStringToTextFile(makeCSV(table, false), "csvTable" + getTodaysDate(), ".csv");
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
////Asks if you really want to close browser

window.onbeforeunload = askConfirm;
let needsSave = true;

function askConfirm() {
    if (needsSave === true) {
        return "Did you remember to save your data?";
    } else {
        return;
    }
}

function showMain(id) {
    console.log("show mains called with " + id);
    let mains = document.getElementsByTagName('main');
    for (let main of mains) {
        console.log(main.id);
        //main.style.display = "none";
    }
    document.getElementById(id).style.display = "inherit";
}

function makeCSV(thisTable, saveWithHeader = true) {
    let headers = thisTable["headers"];
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

function tablesShowRules() {
    alert('FORMATTING RULES:\n\nWhen Saving:\n1) All cells are quoted text.\n2) Interior double quotes in cells are converted like this: "->""\n\nIf loading CSV from other apps:\n1) Cells should all be text type.\n2) Quote all text strings when saving.')
}

function tablesCopyCSVToClipboard() {
    updateDataFromCurrentInputs();
    let thisResult = "";
    if (confirm("Include header as first line?")) {
        thisResult = copyToClipBoard(makeCSV(table, true));
    } else {
        thisResult = copyToClipBoard(makeCSV(table, false));
    }
    return thisResult;
}


//showMain('main-tables-table');



// console.log("HERE TEST\n----------------------------");
// table = {
//     headerNames: ["Field1", "\",\"Field2 is \"super cool\" and I like using \",\" because \",\"  is really cool   so you should really try \",\""],
//     data: [
//         [0, 2],
//         [1, 3]
//     ]
// }

// let aCSVTable = makeCSV(table, true);
// console.log(aCSVTable);

// console.log("SECOND TEST\n----------------");
// console.log(table);

// let anotherNewTable = readCSV(aCSVTable, false);
// console.log(anotherNewTable);

// table = anotherNewTable;
// makeTable();