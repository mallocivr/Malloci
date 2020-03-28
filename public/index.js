let md = ""

xmlhttp = new XMLHttpRequest()

xmlhttp.onreadystatechange = function(){
    md = xmlhttp.responseText;
};
xmlhttp.open("GET","index.md",false);
xmlhttp.send();

document.getElementById('article').innerHTML =
      marked(md);

const museum = new Malloci(md, 8)

museum.build()
hljs.initHighlightingOnLoad();

// museum.GetArtifacts("http://127.0.0.1:5000/generate")
//             .then(function(){
//                 museum.SquareMuseum()
//                 hljs.initHighlightingOnLoad();
//             });

//museum.SpiralMuseum(30)

museum.GetDevice()