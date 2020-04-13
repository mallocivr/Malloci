const xmlhttp = new XMLHttpRequest()
const vrmdParser = new VRMD()
const rig = document.getElementById("rig")
const camera = document.getElementById("camera")

if(AFRAME.utils.device.isMobile())
{
    rig.setAttribute("movement-controls", "controls: checkpoint")
    rig.setAttribute("checkpoint-controls", "mode: teleport")
    let cursor = document.createElement("a-entity")
    cursor.setAttribute("cursor", "fuse: true; fuseTimeout: 500")
    cursor.setAttribute("raycaster", "far: 2; objects: .clickable")
    cursor.setAttribute("position", {x: 0, y: 0, z: -1})
    cursor.setAttribute("geometry", "primitive: ring; radiusInner: 0.01; radiusOuter: 0.02;")
    cursor.setAttribute("material", "color: #CCC; shader: flat;")
    camera.appendChild(cursor)
}

let md = ""

xmlhttp.onreadystatechange = function(){
    md = xmlhttp.responseText;
};
xmlhttp.open("GET","md/exhibits/museums.md",false);
xmlhttp.send();

let tree = vrmdParser.parse(md)

document.getElementById('article').innerHTML = marked(vrmdParser.cleanedMD)
hljs.initHighlightingOnLoad();

let malloci = document.createElement('a-entity')

//malloci.setAttribute('malloci', {md: md, API: "http://127.0.0.1:5000/generate"})
malloci.setAttribute('malloci', {tree: JSON.stringify(tree)})

document.querySelector('a-scene').appendChild(malloci)