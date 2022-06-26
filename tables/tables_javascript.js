///////////////GLOBALS///////////////////////
//-------------tables-----------------------
// let tablesInitialTable = {
//     headers: ["Column 1", "Column 2", "Column 3"],
//     data: [
//         { "Column 1": "hi", "Column 2": "", "Column 3": "" },
//         { "Column 1": "there", "Column 2": "", "Column 3": "" },
//         { "Column 1": "everybody", "Column 2": "", "Column 3": "" }
//     ]
// }

// let table = {}
/////////////////////////////////////

// initializeTablesApp();

function initializeTablesApp() {
    showMain("main-tables-table");
    if (currentTablesTable["name"] === undefined) { //not yet initialized
        table = tablesInitialTable;
        currentTablesTable = table;
    } else {
        table = currentTablesTable;
    }

    //table = currentTablesTable;
    makeTable(table);
    window.onbeforeunload = askConfirm;
    //showMain("main-tables-table");
    //let needsSave = true;
}


function backupTablesTable() {
    //alert("called baclupTablesTable");
    updateDataFromCurrentInputs();
    return JSON.parse(JSON.stringify(currentTablesTable));
}


function processColumnClick(header) {
    //update the database	
    updateDataFromCurrentInputs();
    populateMoveColumnSelect(table);
    //fill out the form on the columns page
    document.getElementById("tables-current-header").innerHTML = header;
    showMain("main-tables-header-form");
}


function processRowClick(row) {
    //alert("need to process row "+row.toString());
    //update the database	
    updateDataFromCurrentInputs();
    populateMoveRowSelect(table);

    document.getElementById("tables-current-row").innerHTML = row.toString();
    showMain("main-tables-row-form");
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
    console.log("bodyData");
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
    console.log("headers");
    console.log(headers);
    //need to look and see what is currently in the table visibly
    //and rewrite the data to the data table
    for (let i = 0; i < table.data.length; i++) {
        for (let j = 0; j < table.headers.length; j++) {
            let id = "cell-" + i.toString() + "-" + j.toString();
            let thisCell = document.getElementById(id);
            //check here to handle an empty value
            //console.log(thisCell.value);
            console.log(id);
            console.log(thisCell); //yields null
            // if (thisCell === null) {
            //     table.data[i][headers[j]] = "";
            // } else {
            table.data[i][headers[j]] = thisCell.value;
            // }
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
    showMain('main-tables-table');
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
    showMain('main-tables-table');
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
    showMain('main-tables-table');
}




function tablesNewTable() {
    //alert("need to process new");
    //console.log("tablesNewTable() called");
    if (confirm("Are you sure?  This will erase all current data.")) {
        table = JSON.parse(JSON.stringify(tablesInitialTable));
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