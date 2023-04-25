<main id="main-notes">
    <h2>Notes</h2>
    <nav>
        <button onclick="newNotesEntry()">New</button>
        <button onclick="notesLoad()">Load</button>
        <button onclick="notesSave()">Save</button>
        <button id="copy" onclick="copyToClipBoard(document.getElementById('note').value);">Copy</button>
        <button onclick="printNotesDiv('note');">&#128424;</button>
        <button class="plus-minus" onclick="changeFontSize(this);">-</button>
        <button class="plus-minus" onclick="changeFontSize(this);">+</button>
        <button onclick="simulateUndo()">&#10226;</button>
        <button onclick="simulateRedo()">&#10227;</button>
    </nav>
    <textarea id="note" rows="10" placeholder="your notes here"></textarea>
</main>