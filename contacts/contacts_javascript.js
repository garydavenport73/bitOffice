initializeContactsApp();

function initializeContactsApp() {
    fillInEmptyPropertyValues(contactsTable);
    document.getElementById("contacts-table-name").innerHTML = contactsTable["name"];
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    contactsEditForm.innerHTML = buildContactsEditForm(contactsTable, -1);
}

function backupContactsDatabase() {
    return JSON.parse(JSON.stringify(contactsTable));
}

function buildContactsTableElement(contactsTable) {
    let tableElement = "";
    let numberOfColumns = contactsTable["headers"].length;
    //numberOfColumns = 2; //only showing first 3
    let numberOfRows = contactsTable["data"].length;

    //start contactsTable
    tableElement += "<table>";

    //build table header
    tableElement += "<thead><tr>";
    for (let j = 0; j < numberOfColumns; j++) {
        tableElement += "<th onclick='sortContactsByField(this);'>" + contactsTable["headers"][j] + "</th>";
    }
    tableElement += "</tr></thead>";

    //build table body	
    tableElement += "<tbody>";

    for (let i = 0; i < numberOfRows; i++) {
        tableElement += "<tr id='contacts-table-row-" + i.toString() + "' onclick='selectContactsEditForm(this)'>";
        for (let j = 0; j < numberOfColumns; j++) {
            let fieldName = contactsTable["headers"][j];
            //console.log(contactsTable["data"][i][fieldName]);
            tableElement += "<td>" + contactsTable["data"][i][fieldName] + "</td>";
        }
        tableElement += "</tr>";
    }
    tableElement += "</tbody>";

    return tableElement;
}

function newContactsEntry() {
    //show what's being edited
    contactsEditFormMessage.innerHTML = contactsTable["name"] + ": New Entry";
    contactsEditForm.innerHTML = buildContactsEditForm(contactsTable, -1);
    showMain("main-contacts-form")
}

function selectContactsEditForm(clickedRow) {
    //show what's being edited
    let index = parseInt(clickedRow.id.split("-")[3]);
    contactsEditFormMessage.innerHTML = contactsTable["name"] + ": Entry " + index.toString();
    contactsEditForm.innerHTML = buildContactsEditForm(contactsTable, index);
    showMain("main-contacts-form");
}

function buildContactsEditForm(contactsTable, index) {
    let editForm = "";
    editForm += "<form>";
    editForm = "<input type='hidden' id='contacts-row-index' value='" + index.toString() + "'>";
    let numberOfColumns = contactsTable["headers"].length;
    let headers = contactsTable["headers"];
    let row = contactsTable["data"][index];
    let inputTypes = contactsTable["inputTypes"];

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

function saveContactsEntry() {
    let index = parseInt(document.getElementById("contacts-row-index").value);
    //console.log(index);
    let headers = contactsTable["headers"];
    let row = {};
    for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = document.getElementById("contact-" + headers[j]).value;
    }
    if (index >= 0) { //an existing entry
        contactsTable["data"][index] = row;
    } else { // a new entry
        contactsTable["data"].push(row);
    }
    clearContactFormEntries(contactsTable);
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    showMain("main-contacts-table");
}

function deleteContactsEntry() {
    let index = parseInt(document.getElementById("contacts-row-index").value);
    if (index >= 0) { //editing an entry
        if (confirm("Delete this entry?")) {
            contactsTable["data"].splice(index, 1); //an object
        }
    }
    clearContactFormEntries(contactsTable);
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    showMain("main-contacts-table");
}

function cancelContactsEntry() {
    clearContactFormEntries(contactsTable);
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    showMain("main-contacts-table");
}


function clearContactFormEntries(contactsTable) {
    let headers = contactsTable["headers"];
    for (let j = 0; j < headers.length; j++) {
        document.getElementById("contact-" + headers[j]).value = "";
    }
    document.getElementById("contacts-row-index").value = -1;
    contactsEditFormMessage.innerHTML = "";
}

function sortContactsByField(clickedHeaderElement) {
    let field = clickedHeaderElement.innerHTML;

    if (confirm("Sort by " + clickedHeaderElement.innerHTML + "?")) {
        destructiveSort(contactsTable["data"], field, sortAscending);
        contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
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
                contactsTable = JSON.parse(fileContents);
                clearContactFormEntries(contactsTable);
                contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
            };

            fileReader.readAsText(inputFile, "UTF-8");
        });
        inputTypeIsFile.click();
    }
}

function savecontactsTableElement(contactsTable) {
    let str = JSON.stringify(contactsTable);
    //if (baseFilename === "") {
    baseFilename = contactsTable["name"] + getTodaysDate();
    //}
    saveStringToTextFile(str, baseFilename, ".json");
}