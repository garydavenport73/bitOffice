<main id="main-tables">
    <h2>Tables</h2>
    <nav>
        <button onclick="tablesNewTable();">New</button>
        <button onclick="tablesLoad();">Load</button>
        <button onclick="tablesSave();">Save</button>
        <button onclick="tablesCopyCSVToClipboard()">Copy</button>
        <button onclick="showTablesDiv('tables-help');">?</button>
    </nav>
    <div class="tables-div" id="tables-tables-table">

        <div class="table-container">
            <table id="tables-table">
            </table>
        </div>
    </div>
    <div class="tables-div" id="tables-tables-header-form">
        <!-- <h2>Tables</h2> -->
        <div>
            <h3>Column: <span id="tables-current-header">header name here</span></h3>

            <div class="surround-box">
                <button onclick="updateHeaderName();">Change name to:</button>
                <input id="tables-new-header-name" type="text" placeholder="name">
            </div>
            <div class="surround-box">
                <button onclick="deleteColumn();">Delete Column</button>
                <button onclick="copyColumn()">Copy Column</button>
            </div>
            <div class="surround-box">
                <button onclick="moveColumn()">Move To Column</button><select id="move-column"></select>
            </div>
            <div>
                <button onclick="calculateTotal()">Add Total</button>
                <button onclick="calculateAverage()">Compute Average</button>
            </div>
            <div>
                <button onclick="tablesSort(1)">Sort Ascending &uarr;</button>
                <button onclick="tablesSort(-1)">Sort Descending &darr;</button>
            </div>
            <div>
                <button onclick="tablesCancel()">Cancel</button>
            </div>
        </div>
    </div>
    <div class="tables-div" id="tables-tables-row-form">
        <!-- <h2>Tables</h2> -->
        <div>
            <h3>Row: <span id="tables-current-row">row number here</span></h3>
            <div>
                <button onclick="deleteRow()">Delete Row</button>
                <button onclick="copyRow()">Copy Row</button>
            </div>
            <div>
                <button onclick="moveRow()">Move To Row</button>
                <select id="move-row"></select>
            </div>
            <div>
                <button onclick="tablesCancel()">Cancel</button>
            </div>
        </div>
    </div>
    <div class="tables-div" id="tables-help">
        <p>
        <h3>Tables-Help</h3>
        </p>
        <p>
        <nav><button onclick="showTablesDiv('tables-tables-table');">Back To Table</button></nav>
        </p>
        <p>FORMATTING RULES:</p>
        <p>When Saving:
        <ol>
            <li>All cells are quoted text.
            </li>
            <li>Interior double quotes in cells are converted like this: "-&gt;""</li>
        </ol>
        </p>
        <p>If loading CSV from other apps:
        <ol>
            <li>Cells should all be text type.</li>
            <li>Quote all text strings when saving is best practice.</li>
            <li>There should be no spaces or tabs between the comma delimiter.</li>
            <li>Interior double quotation marks (i.e. ") in a cell should be stored as ""</li>
        </ol>
        </p>
        <p>
            For example, these 2 cell contents:
        <pre>  She said "Yeah, Yeah, Yeah",Hi</pre>
        </p>
        <p>
            Would be stored as
        <pre>  "She said ""Yeah, Yeah, Yeah""","Hi"</pre>
        </p>
        <hr>
        <p>
            <i>Notes on CSV:</i>
        </p>
        <p>
            There is no universal standard among programs, but this program uses the following standards
            adapted from <a href="https://en.wikipedia.org/wiki/Comma-separated_values#Standardization" target="_blank">RFC 4180 and MIME standards</a>.:
        <ul>
            <li>Each record should contain the same number of comma-separated fields.</li>
            <li>Any field may be quoted (with double quotes).</li>
            <li>If double-quotes are used to enclose fields, then a double-quote in a field must be represented by two double-quote characters. (internal " is escaped with "")</li>
            <li>Some type of carriage return/line feed must be used- this program uses the "\n" convention, not "\r\n".</li>
        </ul>
        </p>
    </div>
</main>