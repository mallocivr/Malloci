let md = ''
const xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function(){
    md = xmlhttp.responseText;
};
xmlhttp.open("GET","TestSpace.md",false);
xmlhttp.send();

document.getElementById('article').innerHTML =
      marked(md);

const museum = new Malloci(md, 10)

//museum.SpiralMuseum(30)
museum.SquareMuseum()