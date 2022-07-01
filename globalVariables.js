/////////////////GLOBALS///////////////////
//         calculator        //
// let calcString = "";
// let calculatorInput = document.getElementById('calculator-input');
// let charToAdd = "";
// let expressionSpan = document.getElementById('expression-span');


let calcInput = document.getElementById('calculator-input');

//-------------tables-----------------------
let tableElement = document.getElementById('tables-table');
let tablesSortAscending = 1; //direction -1 is descending, otherwise ascending
let tablesTable = {
    "name": "Table",
    "headers": ["Column 1", "Column 2", "Column 3"],
    "data": [
        { "Column 1": "", "Column 2": "", "Column 3": "" },
        { "Column 1": "", "Column 2": "", "Column 3": "" },
        { "Column 1": "", "Column 2": "", "Column 3": "" }
    ]
}

let compareTablesTable = JSON.stringify(tablesTable);

let initialTablesTable = compareTablesTable;

//------------------contacts and calendar database ----------------------

let contactsTableElement = document.getElementById("contacts-table");
let contactsEditForm = document.getElementById("contacts-edit-form");
let contactsEditFormMessage = document.getElementById("contacts-edit-form-message");

let contactsTable = {
    "name": "Contacts",
    "headers": ["name", "cell", "email", "address", "home", "work", "website"],
    "inputTypes": {
        "name": "text",
        "cell": "tel",
        "email": "email",
        "address": "text",
        "home": "tel",
        "work": "tel",
        "website": "text"
    },
    "data": [{ "name": 'John', "cell": '316-123-1234', "email": 'john@junkmail.com', "address": '3160 Patmos Dr., Eden, WV  12345' }]
}

//  ------------notes --------------------
let noteFontSize = 2.5 / 3.0;
let note = document.getElementById('note');
note.value = "";
let compareNoteValue = "";

//-----------------write---------------------

let writeBaseFilename = "";
let textarea = document.getElementById("text-editor");
let documentDiv = document.getElementById('document-result');
let remSize = 1;
let marginSize = 2;
let writeUndos = [];

let compareWriteData = "";

//----------------calendar-------------------------
let calendarTable = document.getElementById("calendar-table");
let calendarEditForm = document.getElementById("calendar-edit-form");
let calendarEditFormMessage = document.getElementById("calendar-edit-form-message");

let calendarDatabase = {
    "name": "Calendar",
    "headers": ["start", "end", "name", "notes"],
    "inputTypes": {
        "start": "time",
        "end": "time",
        "name": "text",
        "notes": "text"
    },
    "dates": {

    }

}



//              COMBINED DATABASE

let combinedDatabase = {
    "contacts": contactsTable,
    "calendar": calendarDatabase
}

let compareCombinedDatabase = JSON.stringify(combinedDatabase);

let initialCombinedDatabase = compareCombinedDatabase;

let currentApp = "";