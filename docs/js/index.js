let md = ""

xmlhttp = new XMLHttpRequest()

xmlhttp.onreadystatechange = function(){
    md = xmlhttp.responseText;
};
xmlhttp.open("GET","../md/index.md",false);
xmlhttp.send();

document.getElementById('article').innerHTML = marked(md)

let malloci = document.createElement('a-entity')

// malloci.setAttribute('malloci', {md: md, API: "http://127.0.0.1:5000/generate"})
malloci.setAttribute('malloci', {md: md})

document.querySelector('a-scene').appendChild(malloci)