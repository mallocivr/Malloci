const vrmdParser = new Utils.VRMD()

const renderButton = document.getElementById('RenderVRMD')
const scene = document.querySelector('a-scene')
const rig = document.getElementById("rig")
const camera = document.getElementById("camera")

const malloci = document.createElement('a-entity')
const mdfield = document.getElementById('mdfield')
const imgupload = document.getElementById('imgUpload')
const addImages = document.getElementById('addImages')

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

malloci.setAttribute('malloci', {tree: JSON.stringify(tree), base64Mode: true})

renderButton.addEventListener('click', function () {   

    tree = vrmdParser.parse(mdfield.value)    

    // malloci.setAttribute('malloci', {md: md, API: "http://127.0.0.1:5000/generate"})
    malloci.setAttribute('malloci', {tree: JSON.stringify(tree), base64Mode: true})
})

function storeImgs(e) {
    let files = e.target.files;
    var reader = new FileReader();

    for(let i = 0; i < files.length; i++)
    {
        let file = files[0]
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
            let bits = e.target.result; 

            let src = `img/${file.name}`

            localStorage.setItem(src, bits)
        }
    }
}

addImages.addEventListener('change', function(e){storeImgs(e)})
