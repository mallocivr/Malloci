let md = ""

xmlhttp.onreadystatechange = function(){
    md = xmlhttp.responseText;
};
xmlhttp.open("GET","artifact.md",false);
xmlhttp.send();

document.getElementById('article').innerHTML =
      marked(md);

const museum = new Malloci(md, 16)

//museum.SpiralMuseum(30)
museum.SquareMuseum()

museum.GetDevice()

hljs.initHighlightingOnLoad();