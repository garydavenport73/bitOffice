csplit bitOfficeNotMinified.html /splitsplitsplit/ {*}

cat globalVariables.js commonFunctions.js notes_javascript.js write_javascript.js tables_javascript.js contacts_javascript.js calendar_javascript.js calculator_javascript.js startup.js >javascript.js

#sed -i 's/<!--splitsplitsplit-->//g' javascript.js
#sed -i 's/\/\/splitsplitsplit//g' javascript.js

sed -i 's/<!--splitsplitsplit-->//g' xx00
sed -i 's/\/\/splitsplitsplit//g' xx00
sed -i 's/<!--splitsplitsplit-->//g' xx02
sed -i 's/\/\/splitsplitsplit//g' xx02
sed -i 's/<!--splitsplitsplit-->//g' xx03
sed -i 's/\/\/splitsplitsplit//g' xx03
sed -i 's/<!--splitsplitsplit-->//g' xx05
sed -i 's/\/\/splitsplitsplit//g' xx05
sed -i 's/<!--splitsplitsplit-->//g' xx06
sed -i 's/\/\/splitsplitsplit//g' xx06

minify -o javascript.min.js javascript.js
minify -o style.min.css style.css

cat xx00 xx02 style.min.css xx03 xx05 javascript.min.js xx06 >deleteme.html

minify -o bitoffice.html deleteme.html

rm -rf xx00 xx01 xx02 xx03 xx04 xx05 xx06 style.min.css javascript.min.js javascript.js deleteme.html


