<main id="main-write">
    <h2>Write</h2>
    <nav id="file-bar">
        <button onclick="newDocument();">New</button>
        <button onclick="writeLoad();">Load</button>
        <button onclick="writeDataToJSON();">Save</button>
        <button onclick="exportToHTML()">Export</button>
        <button onclick="printDiv('document-parent');//window.print()">&#128424;</button>
    </nav>
    <nav id="document-settings">
        <button class="mono" onclick='processSelectedText(this);'>Mono</button>
        <button class="serif" onclick='processSelectedText(this);'>Serif</button>
        <button class="sans" onclick='processSelectedText(this);'>Sans</button>
        <button onclick='processSelectedText(this);//decrease font'><sup>A</sup>A</button>
        <button onclick='processSelectedText(this);//increase font;'><sub>A</sub>A</button>
        <button onclick='processSelectedText(this);//inc margin;'>&rarrb;&larrb;</button>
        <button onclick='processSelectedText(this);//dec margin;'>&larrb;&rarrb;</button>
        <button onclick='processSelectedText(this);//align left;'>&#8666;</button>
        <button onclick='processSelectedText(this);//align center;'>&#8667;&#8666;</button>
        <button onclick='processSelectedText(this);//align right;'>&#8667;</button>
        <button id="spell-check" onclick='processSelectedText(this);//spellcheck;'>&check;</button>
    </nav>
    <nav id="edit-bar">
        <button onclick='processSelectedText(this);'><b>B</b></button>
        <button onclick='processSelectedText(this);'><u>U</u></button>
        <button onclick='processSelectedText(this);'><em>I</em></button> &nbsp;
        <button onclick='processSelectedText(this);'>&#8633;</button>
        <button onclick='processSelectedText(this);//paragraph;'>&para;</button>
        <button onclick='processSelectedText(this);'>H1</button>
        <button onclick='processSelectedText(this);'>H2</button>
        <button onclick='processSelectedText(this);'>H3</button> &nbsp;
        <button onclick='processSelectedText(this);//horizontal rule'>&#8213;</button>
        <button onclick='processSelectedText(this);//bullet;'>&bullet;</button> &nbsp;
        <button onclick='processSelectedText(this);//undo;'>&#10226;</button>
        <button onclick="writeRedo()">&#10227;</button>
    </nav>
    <textarea id="text-editor" spellcheck="false" oninput="writeUpdateResult();"></textarea>
    <div id="document-parent">
        <div id="document-result"></div>
    </div>
</main>