;let selfString="";
function createSelf(){
    let html=document.getElementsByTagName("html")[0].innerHTML;
    selfString+="<!DOCTYPE html><html lang='en'>"+html+"</html>";
}
window.onload=createSelf();