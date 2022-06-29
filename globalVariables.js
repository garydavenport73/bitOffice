/////////////////GLOBALS///////////////////
//         calculator        //
let calcString = "";
let calculatorInput = document.getElementById('calculator-input');
let charToAdd = "";
let expressionSpan = document.getElementById('expression-span');
//////////////////////////////////////////

///////////////GLOBALS///////////////////////
//-------------tables-----------------------
let tableElement = document.getElementById('tables-table');
let tablesSortAscending = 1; //direction -1 is descending, otherwise ascending
let tablesTable = {
    "name": "Table",
    "headers": ["Column 1", "Column 2", "Column 3"],
    "data": [
        { "Column 1": "hi", "Column 2": "", "Column 3": "" },
        { "Column 1": "there", "Column 2": "", "Column 3": "" },
        { "Column 1": "everybody", "Column 2": "", "Column 3": "" }
    ]
}

let compareTablesTable = JSON.stringify(tablesTable);

let initialTablesTable = compareTablesTable;

//let table = {}

/////////////////////////////////////
///////////////////////////GLOBALS/////////////////////////////
//------------------contacts and calendar database ----------------------
//let table = {};
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
    "data": [{ "name": 'Amelia', "cell": '304-210-8924', "email": 'ameliamcpeak@gmail.com', "address": '2511 Vaughan Ave, Parkersburg, WV  26101' }]
}






//let sortAscending = 1; //direction -1 is descending, otherwise ascending
//let baseFilename = "";
/////////////////////////////////////////////////////

//////////////GLOBALS/////////////////////////
//  ------------notes --------------------
let noteFontSize = 2.5 / 3.0;
let note = document.getElementById('note');
note.value = "";
let compareNoteValue = "";

////////////////////////////////////////////




////////////////////GLOBALS/////////////////////////
//-----------------write---------------------

let writeBaseFilename = "";
let textarea = document.getElementById("text-editor");
let documentDiv = document.getElementById('document-result');
let remSize = 1;
let marginSize = 2;
let writeUndos = [];

let compareWriteData = "";
//this will be updated in initialization 
//function in the write program



////////////////////GLOBALS/////////////////////////
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
        "2022-07-09": {
            "data": [{
                "start": "09:00",
                "end": "10:00",
                "name": "Eat Breakfast",
                "notes": "Don't overeat"
            }, {
                "start": "21:01",
                "end": "",
                "name": "yo",
                "notes": "yoyo"
            }, {
                "start": "22:00",
                "end": "23:00",
                "name": "watch tv",
                "notes": "don't fall alseep"
            }]
        }
    }

}



////////////////////GLOBALS/////////////////////////

let combinedDatabase = {
    "contacts": contactsTable,
    "calendar": calendarDatabase
}

let compareCombinedDatabase = JSON.stringify(combinedDatabase);

let initialCombinedDatabase = compareCombinedDatabase;

let currentApp = "";