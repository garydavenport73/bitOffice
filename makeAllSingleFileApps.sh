mkdir -p min
mkdir -p singleFileApps
minify style.css > ./min/style.min.css
minify license.js > ./min/license.min.js;
minify csvreaderwriter.js > ./min/csvreaderwriter.min.js;
minify commonFunctions.js > ./min/commonFunctions.min.js;
minify planner.js > ./min/planner.min.js;
minify notes.js > ./min/notes.min.js;
minify write.js > ./min/write.min.js;
minify tables.js > ./min/tables.min.js;
minify calculator.js > ./min/calculator.min.js;
minify nestedmenu.js > ./min/nestedmenu.min.js;
minify open-script-bitoffice.js > ./min/open-script-bitoffice.min.js;
minify open-script-planner.js > ./min/open-script-planner.min.js;
minify open-script-notes.js > ./min/open-script-notes.min.js;
minify open-script-write.js > ./min/open-script-write.min.js;
minify open-script-tables.js > ./min/open-script-tables.min.js;
minify open-script-calculator.js > ./min/open-script-calculator.min.js;

node nodeMakeBitOffice.js;
node nodeMakePlanner.js;
node nodeMakeNotes.js;
node nodeMakeWrite.js;
node nodeMakeTables.js;
node nodeMakeCalculator.js;

minify ./singleFileApps/bitOffice.html > ./singleFileApps/bitOffice.min.html;
cp ./singleFileApps/bitOffice.min.html ./singleFileApps/bitOffice.html;
rm ./singleFileApps/bitOffice.min.html;

minify ./singleFileApps/planner.html > ./singleFileApps/planner.min.html;
cp ./singleFileApps/planner.min.html ./singleFileApps/planner.html;
rm ./singleFileApps/planner.min.html;

minify ./singleFileApps/notes.html > ./singleFileApps/notes.min.html;
cp ./singleFileApps/notes.min.html ./singleFileApps/notes.html;
rm ./singleFileApps/notes.min.html;

minify ./singleFileApps/write.html > ./singleFileApps/write.min.html;
cp ./singleFileApps/write.min.html ./singleFileApps/write.html;
rm ./singleFileApps/write.min.html;

minify ./singleFileApps/tables.html > ./singleFileApps/tables.min.html;
cp ./singleFileApps/tables.min.html ./singleFileApps/tables.html;
rm ./singleFileApps/tables.min.html;

minify ./singleFileApps/calculator.html > ./singleFileApps/calcualtor.min.html;
cp ./singleFileApps/calcualtor.min.html ./singleFileApps/calcualtor.html;
rm ./singleFileApps/calcualtor.min.html;