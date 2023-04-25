for file in *.js;
do
  destination=${file%.*};
  minify $file > "./min/"$destination".min.js";
done;

for file in *.css;
do
  destination=${file%.*};
  minify $file > "./min/"$destination".min.css";
done;

# for file in *.html;
# do
#   destination=${file%.*};
#   minify $file > "./min/"$destination".min.html";
# done;

# for file in *.php;
# do
#   destination=${file%.*};
#   minify $file > "./min/"$destination".min.php";
# done;