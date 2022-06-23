
//////////////GLOBALS/////////////////////////
//  ------------notes --------------------
let noteFontSize = 2.5 / 3.0;
let note = document.getElementById('note');

//-----------------write---------------------

let writeBaseFilename = "";
let textarea = document.getElementById("text-editor");
let documentDiv = document.getElementById('document-result');
let remSize = 1;
let marginSize = 2;
let writeUndos = [];
//let needsSave = true;

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

//------------------contacts ----------------------
//let table = {};
let contactsTable = document.getElementById("contacts-table");
let contactsEditForm = document.getElementById("contacts-edit-form");
let contactsEditFormMessage = document.getElementById("contacts-edit-form-message");
let sortAscending = 1; //direction -1 is descending, otherwise ascending
//let baseFilename = "";


//----------------calendar-------------------------
let calendarDatabase = {
    "name": "Calendar",
    "headers": ["start", "end", "name", "notes"],
    "inputTypes": {
        "start": "time",
        "end": "time",
        "name": "text",
        "notes": "text"
    },
    "2022": {
        "07": {
            "09": {
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
            },
            "06": {
                "data": [{
                    "start": "sometime",
                    "end": "sometime",
                    "name": "somename",
                    "notes": "somenotes"
                }, {
                    "start": "sometime",
                    "end": "sometime",
                    "name": "somename",
                    "notes": "somenotes"
                }]
            },
            "08": {
                "data": [] //an example of something needing purged
            }
        },
        "06": {
            "09": {
                "data": [] //needs purged
            }
        }
    }
}

let calendarTable = document.getElementById("calendar-table");
let calendarEditForm = document.getElementById("calendar-edit-form");
let calendarEditFormMessage = document.getElementById("calendar-edit-form-message");
let sortAscending = 1; //direction -1 is descending, otherwise ascending
let table = {}

//------------calculator---------------//
let calcString = "";
let calculatorInput = document.getElementById('calculator-input');
let charToAdd = "";
let expressionSpan = document.getElementById('expression-span');


////////////////////GLOBALS/////////////////////////

////////////////////Initialization////////////////////

//initializeNotesApp();
//initializizeWriteApp();
//initializeTablesApp();
//initializeContactsApp();
//initializeCalendarApp();
//initializeCalculatorApp();
