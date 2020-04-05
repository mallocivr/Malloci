let renderButton = document.getElementById('RenderVRMD')
let scene = document.querySelector('a-scene')
let malloci = document.createElement('a-entity')
let mdfield = document.getElementById('mdfield')
let md = mdfield.value
console.log(md);
console.log(scene);

scene.appendChild(malloci)

malloci.setAttribute('malloci', {md: md})

renderButton.addEventListener('click', function () {
    md = mdfield.value
    // malloci.setAttribute('malloci', {md: md, API: "http://127.0.0.1:5000/generate"})
    malloci.setAttribute('malloci', {md: md})
})

