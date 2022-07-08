let license = "MIT License\n\n\
Copyright (c) 2022 Gary Davenport\n\n\
Permission is hereby granted, free of charge, to any person obtaining a copy \
of this software and associated documentation files (the \"Software\"), to deal \
in the Software without restriction, including without limitation the rights \
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell \
copies of the Software, and to permit persons to whom the Software is \
furnished to do so, subject to the following conditions:\n\n\
The above copyright notice and this permission notice shall be included in all \
copies or substantial portions of the Software.\n\n\
THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR \
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, \
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE \
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER \
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, \
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE \
SOFTWARE.";

//---calculator----
let calcInput = document.getElementById('calculator-input');

//---tables----
let tableElement = document.getElementById('tables-table');
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
let contactsSortAscending = 1;

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
    //"data": [{ "name": "John", "cell": "316-123-1234", "email": "john@junkmail.com", "address": "3160 Patmos Dr., Eden, WV  12345", "home": "", "work": "", "website": "" }]
    "data": []
}

//  ------------notes --------------------
let noteFontSize = 2.5 / 3.0;
let note = document.getElementById('note');
note.value = "";
let compareNoteValue = "";

//-----------------write---------------------
let textarea = document.getElementById("text-editor");
let documentDiv = document.getElementById('document-result');
let remSize = 1;
let marginSize = 2;
let writeUndos = [];
let writeUndosCursor = 0;
let compareWriteData = "";

//----------------calendar-------------------------
let calendarTable = document.getElementById("calendar-table");
let calendarEditForm = document.getElementById("calendar-edit-form");
let calendarEditFormMessage = document.getElementById("calendar-edit-form-message");
let monthChooser = document.getElementById("month-chooser");
let daysAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
let calendarSortAscending = 1;

let calendarDatabase = {
    "name": "Calendar",
    "headers": ["start", "end", "name", "notes"],
    "inputTypes": {
        "start": "time",
        "end": "time",
        "name": "text",
        "notes": "text"
    },
    "dates": {}

}

//	COMBINED DATABASE

let combinedDatabase = {
    "contacts": contactsTable,
    "calendar": calendarDatabase
}

let compareCombinedDatabase = JSON.stringify(combinedDatabase);
let initialCombinedDatabase = compareCombinedDatabase;
let currentApp = "";