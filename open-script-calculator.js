function makeFavicon(letter, color, backgroundColor) {
    //put this in head of html document
    //<link id="favicon-link" rel="icon" type="image/x-icon" href="">
    let canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    let ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, 16, 16);

    let ctx2 = canvas.getContext("2d");
    ctx2.fillStyle = color;
    ctx2.font = "bold 12px Arial";
    ctx2.fillText(letter, 4, 12);

    let link = document.getElementById("favicon-link");
    link.href = canvas.toDataURL("image/x-icon");
}
function askConfirm() {
    return "Did you remember to save your data?";
}
makeFavicon("p", "white", "mediumblue");
window.onbeforeunload = askConfirm;
document.getElementById("top-nav").style.display="none";
// showMain('main-calculator');