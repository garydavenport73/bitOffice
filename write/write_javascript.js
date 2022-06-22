        let baseFilename = "";
        let textarea = document.getElementById("text-editor");
        let documentDiv = document.getElementById('document-result');
        let remSize = 1;
        let marginSize = 2;
        textarea.spellcheck = false;
        textarea.focus(); //ensures spellcheck update
        let undos = [];
        console.log("undos length", undos.length);
        undos.push(textarea.value);
        

        function exportToHTML(){
			let contents = serializeElementToPage("document-parent","html,#document-result,#document-parent{background-color:white;}");
			copyToClipBoard(contents);
			if (confirm("HTML document exported to clipboard.\n\nWould you like to export to HTML file?")){
				saveStringToTextFile(contents,'write'+getTodaysDate(),'.html');
				}
			}
			
        function copyToClipBoard(str) {
            //https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
            let el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style = {
                position: 'absolute',
                left: '-9999px'
            };
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            //alert('Copied to Clipboard.');
            return (str);
        }
        
        function newDocument(){
			if (confirm("This will overwrite current document.")){
				resetAll();
				}
			}
        
        function resetAll(){
			//reset global variables;
			baseFilename = "";
			remSize=1;
			marginSize=2;
			
			//reset text area value
			textarea.value = "";
			
			//reapply base styles to the div
			documentDiv.style.textAlign = "left";
			documentDiv.style.fontFamily = "Georgia, 'Times New Roman', Garamond, Times, serif";
			documentDiv.style.fontSize = "1rem";
			documentDiv.style.marginLeft = "2rem";
			textarea.spellcheck = false;
			
			//reset undo array
			undos=[];
			undos.push(textarea.value);
			
			//redisplay new result
			updateResult();
			
			//set focus to textarea
			textarea.focus(); //ensures spell check is refreshed
			
		}
        
        function dataToJSON() {
            updateResult();
            data = {}
            data["text"] = textarea.value;
            data["textAlign"] = documentDiv.style.textAlign;
            data["fontFamily"] = documentDiv.style.fontFamily;
            data["fontSize"] = documentDiv.style.fontSize;
            data["marginSize"] = documentDiv.style.marginLeft;
            data["spellCheck"] = textarea.spellcheck;
            if (baseFilename === "") {
                baseFilename = "write" + getTodaysDate();
            };
            let saveContents = JSON.stringify(data);
            saveStringToTextFile(saveContents, baseFilename, ".json");
        }

        function load() {
            if (textarea.value != "") {
                if (confirm("This will overwrite current document")) {
                    let fileContents = "";
                    let inputTypeIsFile = document.createElement('input');
                    inputTypeIsFile.type = "file";
                    inputTypeIsFile.accept = ".json";
                    inputTypeIsFile.addEventListener("change", function() {
                        let inputFile = inputTypeIsFile.files[0];
                        let fileReader = new FileReader();
                        fileReader.onload = function(fileLoadedEvent) {
                            fileContents = fileLoadedEvent.target.result;

                            console.log(inputFile);
                            if (inputFile["name"].slice(-5) === ".json") {
                                //alert("it's json!");
                                baseFilename = inputFile["name"].slice(0, -5);
                                //alert("basefilename: " + baseFilename);
                            }

                            let loadedData = JSON.parse(fileContents);
                            textarea.value = loadedData["text"];
                            documentDiv.style.textAlign = loadedData["textAlign"];
                            documentDiv.style.fontFamily = loadedData["fontFamily"];
                            documentDiv.style.fontSize = loadedData["fontSize"];
                            documentDiv.style.marginLeft = loadedData["marginSize"];
                            textarea.spellcheck = loadedData["spellCheck"];
                            updateResult();
                            remSize = parseInt(loadedData["fontSize"].split("rem")[0]);
                            marginSize = parseInt(loadedData["marginSize"].split("rem")[0]);
                            undos = [];
                            console.log("undos length", undos.length);
                            undos.push(textarea.value);
                            textarea.focus(); //ensures spell check is refreshed

                        };

                        fileReader.readAsText(inputFile, "UTF-8");
                    });
                    inputTypeIsFile.click();

                }
            }

        }



        function processSelectedText(clickedElement) {
            let action = clickedElement.innerHTML;
            console.log(action);
            if (action != "⟲") {
                if (undos.length >= 316) { //316 levels of undo
                    undos.shift();
                    undos.push(textarea.value);
                } else {
                    undos.push(textarea.value);
                }
            }

            if (action === "⇚") { //align left
                documentDiv.style.textAlign = "left";
            } else if (action === "⇛⇚") { //align center
                documentDiv.style.textAlign = "center";
            } else if (action === "⇛") { //align right
                documentDiv.style.textAlign = "right";
            } else if (action === "Mono") {
                documentDiv.style.fontFamily = "'Courier New', Courier, monospace";
            } else if (action === "Serif") {
                documentDiv.style.fontFamily = "Georgia, 'Times New Roman', Garamond, Times, serif";
            } else if (action === "Sans") {
                documentDiv.style.fontFamily = "Arial, Verdana, Helvetica, Tahoma, sans-serif";
            } else if (action === "<sub>A</sub>A") {
                remSize = remSize + .2;
                documentDiv.style.fontSize = remSize.toString() + "rem";
            } else if (action === "<sup>A</sup>A") {
                remSize = remSize - .2;
                documentDiv.style.fontSize = remSize.toString() + "rem";
            } else if (action === "⇥⇤") { //increase margins
                marginSize = marginSize + 1;
                if (marginSize > 20) {
                    marginSize = 20;
                }
                documentDiv.style.marginLeft = marginSize.toString() + "rem";
                documentDiv.style.marginRight = marginSize.toString() + "rem";

            } else if (action === "⇤⇥") { //decrease margins
                marginSize = marginSize - 1;
                if (marginSize < 0) {
                    marginSize = 0;
                }
                documentDiv.style.marginLeft = marginSize.toString() + "rem";
                documentDiv.style.marginRight = marginSize.toString() + "rem";
            } else if (action === "⟲") {
                //console.log("undo called");
                console.log(undos);
                if (undos.length > 1) {
                    let thisText = undos.pop();
                    textarea.value = thisText;
                    updateResult();
                } else if (undos.length === 1) { //don't go past initial entry
                    textarea.value = undos[0];
                    updateResult()
                } else if (undos.length === 0) { //should never reach this case;
                    textarea.value = "";
                    updateResult();
                }

            } else if (action === "✓") {
                console.log(textarea.spellcheck);
                textarea.spellcheck = !(textarea.spellcheck);
                console.log(textarea.spellcheck);
                textarea.focus();

                //textarea.blur();
            }
            //alert(action);

            let len = textarea.value.length;
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;
            let sel = textarea.value.substring(start, end);

            // This is the selected text and alert it
            //alert(sel);

            let replace = sel;

            if (action === "<b>B</b>") {
                replace = '<b>' + sel + '</b>';
            } else if (action === "<u>U</u>") {
                replace = '<u>' + sel + '</u>';
            } else if (action === "<em>I</em>") {
                replace = '<em>' + sel + '</em>';
            } else if (action === "H1") {
                replace = '<h1>' + sel + '</h1>';
            } else if (action === "H2") {
                replace = '<h2>' + sel + '</h2>';
            } else if (action === "H3") {
                replace = '<h3>' + sel + '</h3>';
            } else if (action === "¶") {
                replace = '<p>' + sel + '</p>';
            } else if (action === "―") {
                replace = '<hr>' + sel;
            } else if (action === "•") {
                replace = '&bullet; ' + sel;
            }
            // Here we are replacing the selected text with this one
            textarea.value = textarea.value.substring(0, start) + replace + textarea.value.substring(end, len);
            updateResult();
        }

        document.getElementById('text-editor').addEventListener('keydown', function(e) {
            //https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
            //https://stackoverflow.com/users/819732/kasdega
            if (e.key == 'Tab') {
                e.preventDefault();
                let start = this.selectionStart;
                let end = this.selectionEnd;

                // set textarea value to: text before caret + tab + text after caret
                this.value = this.value.substring(0, start) +
                    //"    " + this.value.substring(end); using 4 spaces
                    "\t" + this.value.substring(end);

                // put caret at right position again
                this.selectionStart =
                    //this.selectionEnd = start + 4; using 4 spaces
                    this.selectionEnd = start + 1;
                updateResult();
            }
        });


        function updateResult() {
            let currentContents = document.getElementById('text-editor').value;
            console.dir(document.getElementById('text-editor'));
            //console.log(currentContents);
            document.getElementById('document-result').innerHTML = currentContents.replaceAll('\n', '<br>');
            if (textarea.spellcheck === true) {
                document.getElementById("spell-check").style.color = "green";
            } else {
                document.getElementById("spell-check").style.color = "red";
            }
        }
        updateResult();

        documentDiv.style.fontSize = remSize + "rem";
        documentDiv.style.marginLeft = marginSize + "rem";
        documentDiv.style.marginRight = marginSize + "rem";

        //Script to print the content of a div

        function printDiv(id) {
            let a = window.open();
            a.document.write(serializeElementToPage(id,"html,#document-result,#document-parent{background-color:white;}"));
            a.document.close();
            a.print();
        }

        function serializeElementToPage(id, extraStyle = "") {
            let boilerPlate1 = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title></title><style>";
            
            let allStyleTags = document.getElementsByTagName('style');
            
            let styleElementContent="";
            for (let i = 0; i < allStyleTags.length; i++){
				styleElementContent = allStyleTags[i].innerHTML;
				}
            //let styleElementContent = document.getElementsByTagName('style')[0].innerHTML;
            //let extraStyle = "html,#document-result,#document-parent{background-color:white;}";
            let boilerPlate2 = "</style></head><body>"
            let boilerPlate3 = "</body></html>";
            let s = new XMLSerializer();
            let myElement = document.getElementById(id);
            let str = s.serializeToString(myElement);
            let htmlPage = boilerPlate1 + styleElementContent + extraStyle + boilerPlate2 + str + boilerPlate3;
            console.log(htmlPage);
            return htmlPage;
        }

        ////////////////////////////////////////////
        //Save related functions, often used with date functions below
        function save() {
            let basename = "write" + getTodaysDate();
            saveStringToTextFile(str, basename, ".txt");
        }

        function saveStringToTextFile(str1, basename = "myfile", fileType = ".txt") {
            let filename = basename + fileType;
            let blobVersionOfText = new Blob([str1], {
                type: "text/plain"
            });
            let urlToBlob = window.URL.createObjectURL(blobVersionOfText);
            let downloadLink = document.createElement("a");
            downloadLink.style.display = "none";
            downloadLink.download = filename;
            downloadLink.href = urlToBlob;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.parentElement.removeChild(downloadLink);
        }

        //Date related functions for convience, uses same format as input type="date"
        function getTodaysDate() {
            let now = new Date();
            let day = ("0" + now.getDate()).slice(-2);
            let month = ("0" + (now.getMonth() + 1)).slice(-2);
            let today = now.getFullYear() + "-" + month + "-" + day;
            return today;
        }

        function getFirstDayOfThisMonthDate() {
            let now = new Date();
            let day = "01";
            let month = ("0" + (now.getMonth() + 1)).slice(-2);
            return now.getFullYear() + "-" + month + "-" + day;
        }

        function getLastDayOfThisMonthDate() {
            let now = new Date();
            let day = daysInThisMonth().toString();
            day = "0" + day;
            day = day.slice(-2);
            let month = ("0" + (now.getMonth() + 1)).slice(-2);
            return now.getFullYear() + "-" + month + "-" + day;
        }

        function daysInSomeMonth(someMonth, someYear) { //use jan month is 0
            return new Date(someYear, someMonth + 1, 0).getDate();
        }

        function daysInThisMonth() {
            thisDate = new Date();
            thisMonth = thisDate.getMonth();
            thisYear = thisDate.getYear();
            return daysInSomeMonth(thisMonth, thisYear);
        }

        /////////////////////////////////////////////////
        ////Asks if you really want to close browser

        window.onbeforeunload = askConfirm;
        let needsSave = true;

        function askConfirm() {
            if (needsSave === true) {
                return "Did you remember to save your data?";
            } else {
                return;
            }
        }
