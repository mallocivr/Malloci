let md = ''
const xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function(){
    md = xmlhttp.responseText;
};
xmlhttp.open("GET","proposal.md",false);
xmlhttp.send();

document.getElementById('article').innerHTML =
      marked(md);

const museum = new Malloci(md, 15)

//museum.SpiralMuseum(30)
museum.SquareMuseum()