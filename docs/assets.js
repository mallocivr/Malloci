function windowEntity() {
    let windowEnt = document.createElement('a-entity');
    windowEnt.setAttribute('id', 'window');
    
    let windowInner = document.createElement('a-entity');
    windowInner.setAttribute('id', 'window-inner-frame');

    let boxHor = document.createElement('a-box');
    boxHor.setAttribute('position', '0 0 0.04');
    boxHor.setAttribute('material', {color: '#d7bd98'});
    boxHor.setAttribute('width', '0.04');
    boxHor.setAttribute('depth', '0.04');
    boxHor.setAttribute('height', '1.54');
    boxHor.setAttribute('shadow','');

    let boxVer = document.createElement('a-box');
    boxVer.setAttribute('position', '0 0 0.04');
    boxVer.setAttribute('rotation', '0 0 90');
    boxVer.setAttribute('material', {color: '#d7bd98'});
    boxVer.setAttribute('width', '0.04');
    boxVer.setAttribute('depth', '0.04');
    boxVer.setAttribute('height', '1');
    boxVer.setAttribute('shadow','');

    windowInner.appendChild(boxHor);
    windowInner.appendChild(boxVer);

    let windowOuter = document.createElement('a-entity');
    windowInner.setAttribute('id', 'window-outer-frame');

    let boxTop = document.createElement('a-box');
    boxTop.setAttribute('position', '-0.5 0 0.04');
    boxTop.setAttribute('material', {color: '#d7bd98'});
    boxTop.setAttribute('width', '0.04');
    boxTop.setAttribute('depth', '0.04');
    boxTop.setAttribute('height', '1.54');
    boxTop.setAttribute('shadow','');

    let boxBottom = document.createElement('a-box');
    boxBottom.setAttribute('position', '0.5 0 0.04');
    boxBottom.setAttribute('material', {color: '#d7bd98'});
    boxBottom.setAttribute('width', '0.04');
    boxBottom.setAttribute('depth', '0.04');
    boxBottom.setAttribute('height', '1.54');
    boxBottom.setAttribute('shadow','');

    let boxRight = document.createElement('a-box');
    boxRight.setAttribute('position', '0 0.75 0.04');
    boxRight.setAttribute('rotation', '0 0 90');
    boxRight.setAttribute('material', {color: '#d7bd98'});
    boxRight.setAttribute('width', '0.04');
    boxRight.setAttribute('depth', '0.04');
    boxRight.setAttribute('height', '1');
    boxRight.setAttribute('shadow','');

    let boxLeft = document.createElement('a-box');
    boxLeft.setAttribute('position', '0 -0.75 0.04');
    boxLeft.setAttribute('rotation', '0 0 90');
    boxLeft.setAttribute('material', {color: '#d7bd98'});
    boxLeft.setAttribute('width', '0.04');
    boxLeft.setAttribute('depth', '0.04');
    boxLeft.setAttribute('height', '1');
    boxLeft.setAttribute('shadow','');

    windowOuter.appendChild(boxTop);
    windowOuter.appendChild(boxBottom);
    windowOuter.appendChild(boxLeft);
    windowOuter.appendChild(boxRight);

    windowEntity.addEventListener('loaded', function () {
        console.log('window is in');
    });

    return windowEnt;
}