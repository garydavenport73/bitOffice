///////////////////////////GLOBALS/////////////////////////////
//------------------contacts ----------------------
// let table = {};
// let contactsTable = document.getElementById("contacts-table");
// let contactsEditForm = document.getElementById("contacts-edit-form");
// let contactsEditFormMessage = document.getElementById("contacts-edit-form-message");
// let sortAscending = 1; //direction -1 is descending, otherwise ascending
/////////////////////////////////////////////////////

// initializeContactsApp();

function initializeContactsApp() {
    showMain("main-contacts-table");
    if (contactsTableObject["name"] === undefined) { //never initialized, first run
        let headers = [];
        let inputTypes = {};
        let data = [];
        headers = ["name", "cell", "email", "address", "home", "work", "website"];
        inputTypes = {
            "name": "text",
            "cell": "tel",
            "email": "email",
            "address": "text",
            "home": "tel",
            "work": "tel",
            "website": "text"
        }
        for (let j = 0; j < headers.length; j++) { //fill in empty input types
            if (inputTypes[headers[j]] === undefined) {
                inputTypes[headers[j]] = "text";
            }
        }
        data[0] = { "name": 'Amelia', "cell": '304-210-8924', "email": 'ameliamcpeak@gmail.com', "address": '2511 Vaughan Ave, Parkersburg, WV  26101' };
        data[1] = { "name": 'Gary', "cell": '304-494-6682', "email": '', "address": '' };
        data[2] = { "name": 'Phoebe', "cell": '304-834-2240', "email": '', "address": '' };

        contactsTableObject = {
            "name": "Contacts",
            "headers": headers,
            "inputTypes": inputTypes,
            "data": data
        }

        table = contactsTableObject;
        fillInEmptyPropertyValues(table);


    } else { //exists update when open
        table = contactsTableObject;
        fillInEmptyPropertyValues(table);
    }

    // let headers = [];
    // let inputTypes = {};
    // let data = [];
    // headers = ["name", "cell", "email", "address", "home", "work", "website"];
    // inputTypes = {
    //     "name": "text",
    //     "cell": "tel",
    //     "email": "email",
    //     "address": "text",
    //     "home": "tel",
    //     "work": "tel",
    //     "website": "text"
    // }

    // for (let j = 0; j < headers.length; j++) { //fill in empty input types
    //     if (inputTypes[headers[j]] === undefined) {
    //         inputTypes[headers[j]] = "text";
    //     }
    // }

    // data = [];

    // data[0] = { "name": 'Amelia', "cell": '304-210-8924', "email": 'ameliamcpeak@gmail.com', "address": '2511 Vaughan Ave, Parkersburg, WV  26101' };
    // data[1] = { "name": 'Gary', "cell": '304-494-6682', "email": '', "address": '' };
    // data[2] = { "name": 'Phoebe', "cell": '304-834-2240', "email": '', "address": '' };

    // table = {
    //     "name": "Contacts",
    //     "headers": headers,
    //     "inputTypes": inputTypes,
    //     "data": data
    // }
    // fillInEmptyPropertyValues(table);

    // if (table["name"] === undefined) { //fill in empty table name
    //     table["name"] = "Table";
    // }




    document.getElementById("contacts-table-name").innerHTML = table["name"];
    contactsTable.innerHTML = buildContactsTableElement(table);
    contactsEditForm.innerHTML = buildContactsEditForm(table, -1);
    //showMain("main-contacts-table");
}

function backupContactsDatabase() {
    return JSON.parse(JSON.stringify(contactsTableObject));
}

function buildContactsTableElement(table) {
    let tableElement = "";
    let numberOfColumns = table["headers"].length;
    //numberOfColumns = 2; //only showing first 3
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
            editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='contact-" + headers[j] + "' " + extraString + "></div>";
        } else { //editing existing
            editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='contact-" + headers[j] + "' value='" + row[headers[j]].replaceAll("\"", "&quot;").replaceAll("\'", "&apos;") + "'" + extraString + "></div>";
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