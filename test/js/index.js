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
xmlhttp.open("GET","md/index.md",false);
xmlhttp.send();

let tree = vrmdParser.parse(md)

document.getElementById('article').innerHTML = marked(vrmdParser.cleanedMD)

let malloci = document.createElement('a-entity')
malloci.setAttribute('geometry-merger', '')

malloci.setAttribute('malloci', {tree: JSON.stringify(tree)})

document.querySelector('a-scene').appendChild(malloci)


let jumpButton = document.createElement('div')
let img = document.createElement('img')
img.setAttribute("src", Utils.Icon)

// jumpButton.appendChild(img)
// jumpButton.classList.add("jump")
// document.body.appendChild(jumpButton)

// jumpButton.addEventListener('click', () => {

//     let isInViewPort = function (elem) {
//       var distance = elem.getBoundingClientRect();
//       return (
//         distance.top >= 0 &&
//         distance.left >= 0 &&
//         distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//         distance.right <= (window.innerWidth || document.documentElement.clientWidth)
//       );
//     };
    
//     let htags = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
//     let section = null

//     for(let i = 0; i < htags.length; i++)
//     {
//       if(isInViewPort(htags[i]))
//       {
//         section = htags[i].id
//         break
//       }
//     }

//     let event = new CustomEvent('jump-to', { bubbles: true, detail: section });
    
//     jumpButton.dispatchEvent(event);
// })