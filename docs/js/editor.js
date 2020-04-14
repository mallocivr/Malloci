const vrmdParser = new Utils.VRMD()

const renderButton = document.getElementById('RenderVRMD')
const scene = document.querySelector('a-scene')
const rig = document.getElementById("rig")
const camera = document.getElementById("camera")

const malloci = document.createElement('a-entity')
const mdfield = document.getElementById('mdfield')

if(AFRAME.utils.device.isMobile())
{
    rig.setAttribute("movement-controls", "controls: checkpoint")
    rig.setAttribute("checkpoint-controls", "mode: teleport")
    let cursor = document.createElement("a-entity")
    cursor.setAttribute("cursor", "fuse: true; fuseTimeout: 500")
    cursor.setAttribute("position", {x: 0, y: 0, z: -1})
    cursor.setAttribute("geometry", "primitive: ring; radiusInner: 0.01; radiusOuter: 0.02;")
    cursor.setAttribute("material", "color: #CCC; shader: flat;")
    camera.appendChild(cursor)
}

let tree = vrmdParser.parse(mdfield.value)

scene.appendChild(malloci)

malloci.setAttribute('malloci', {tree: JSON.stringify(tree)})

renderButton.addEventListener('click', function () {   

    tree = vrmdParser.parse(mdfield.value)
    console.log(tree);
    

    // malloci.setAttribute('malloci', {md: md, API: "http://127.0.0.1:5000/generate"})
    malloci.setAttribute('malloci', {tree: JSON.stringify(tree)})
})

