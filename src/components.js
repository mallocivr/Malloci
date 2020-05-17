AFRAME.registerComponent('beam', {
  schema: {
    length: {type: 'number'},
    width: {type: 'number'},
    thickness: {type: 'number'},
    height: {type: 'number'},
    src: {type: 'map', default: '#ceilingTexture'},    
  },

  init: function () {
    // Do something when component first attached.
    let data = this.data
    let el = this.el

    let geometry = new THREE.BoxBufferGeometry(data.length, data.thickness, data.width)
    let mat = null

    if (AFRAME.utils.device.isMobile())
    {
      mat = new THREE.MeshBasicMaterial({color: "#91745D"})
    }
    else
    {
      let texture = new THREE.TextureLoader().load(data.src.src)
      mat = new THREE.MeshBasicMaterial({map: texture})
    }

    let mesh = new THREE.Mesh(geometry, mat)

    el.setObject3D('mesh', mesh)
    mesh.position.set(data.length/2, data.height, 0)

    this.el.sceneEl.addEventListener('ceiling-update', () => {
      
      let geometry = new THREE.BoxBufferGeometry(data.length, data.thickness, data.width)
      let mat = null

      if (AFRAME.utils.device.isMobile())
      {
        mat = new THREE.MeshBasicMaterial({color: "#91745D"})
      }
      else
      {
        let texture = new THREE.TextureLoader().load(data.src.src)
        mat = new THREE.MeshBasicMaterial({map: texture})
      }

      let mesh = new THREE.Mesh(geometry, mat)

      el.setObject3D('mesh', mesh)
      mesh.position.set(data.length/2, data.height, 0)
    })

  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  }
});

AFRAME.registerComponent('wall', {
  schema: {
    length: {type: 'number'},
    height: {type: 'number', default: 5},
    orientation: {type: 'string', default: 'left'},
    color: {type:'string', default:'#ffffff'},
    artifacts: {
      default: "[]",
      parse: JSON.parse,
      stringify: JSON.stringify
    },
    src: {type: 'map', default: '#wallTexture'},
    base64Mode: {type: 'boolean', default: false},
    debug: {type: 'boolean', default: false}
  },

  init: function () {
    // Do something when component first attached.
    let data = this.data
    let el = this.el

    this._rig = document.getElementById("rig")
    this.distVector = new THREE.Vector3()
    
    this.artPlaced = false
    
    let wallTexture = new THREE.TextureLoader().load(data.src.src)
    let wallGeometry = new THREE.PlaneBufferGeometry(data.length, data.height)
    let wallMaterial = new THREE.MeshBasicMaterial({map: wallTexture})
    let wallMesh = new THREE.Mesh(wallGeometry, wallMaterial)

    el.setObject3D('mesh', wallMesh)

    let beam = document.createElement('a-entity')
    beam.setAttribute('beam', `length: ${data.length + 0.15}; width: ${0.3}; thickness: ${0.5}; height: ${data.height - 0.25}`)

    el.appendChild(beam)

    wallMesh.position.set(data.length/2, data.height/2, 0)
    if(data.orientation == "right") wallMesh.rotateY(3.14159)

    this.el.sceneEl.addEventListener('walls-update', () => {
      
      let wallTexture = new THREE.TextureLoader().load(data.src.src)
      let wallGeometry = new THREE.PlaneBufferGeometry(data.length, data.height)
      let wallMaterial = new THREE.MeshBasicMaterial({map: wallTexture})
      let wallMesh = new THREE.Mesh(wallGeometry, wallMaterial)

      el.setObject3D('mesh', wallMesh)
      wallMesh.position.set(data.length/2, data.height/2, 0)
      if(data.orientation == "right") wallMesh.rotateY(3.14159)
    })

    this.placeArt()
  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },

  tick: function (time, timeDelta) {

  },

  placeArt: function ()
  {
    let artifacts = this.data.artifacts
    let artWidth = 4

    for (let i = 0; i < artifacts.length; i++)
    {
        let artObj = artifacts[i]

        let multiplier = i == 0 ? 1 : (i*2) + 1

        let artifact = document.createElement('a-entity')
        artifact.setAttribute('wall-art', {artifact: JSON.stringify(artObj), width: artWidth, debug: this.data.debug, base64Mode: this.data.base64Mode})
        this.el.appendChild(artifact)
        artifact.setAttribute("position", {x:  artWidth * multiplier, y: 1.52, z: 0.2})
        if(this.data.orientation == "right")
        {
          artifact.setAttribute("position", {x:  artWidth * multiplier, y: 1.52, z: -0.2})
          artifact.setAttribute('rotation', {x: 0, y: 180, z: 0})

          if(AFRAME.utils.device.isMobile())
          {
              this.el.appendChild(this.initCheckPoint({x: artWidth * multiplier, y: 0.1, z: -2}))
          }
        }
        else
        {
          if(AFRAME.utils.device.isMobile())
          {
              this.el.appendChild(this.initCheckPoint({x: artWidth * multiplier, y: 0.1, z: 2}))
          }
        }
    }
  },

  initCheckPoint: function (position)
  {
    let checkpoint = document.createElement("a-cylinder")
    checkpoint.setAttribute('height', 0.1)
    checkpoint.setAttribute("checkpoint", '')
    checkpoint.setAttribute('class', 'clickable')
    checkpoint.setAttribute("position", position)
    checkpoint.setAttribute("opacity", 0.0)

    let ring = document.createElement("a-entity")
    ring.setAttribute("geometry", "primitive: ring; radiusInner: 0.6; radiusOuter: .8;")
    ring.setAttribute("material", "color: #1890ff; shader: flat;")
    ring.setAttribute("rotation", {x: -90, y:0, z:0})
    checkpoint.appendChild(ring)

    return checkpoint
  }
});

AFRAME.registerComponent('floor', {
  schema: {
    width: {type: 'number'},
    depth: {type: 'number'},
    text: {type:'string'},
    src: {type: 'map', default: '#floorTexture'},    
  },

  init: function () {
    // Do something when component first attached.
    let data = this.data
    let el = this.el    
    
    let floorTexture = new THREE.TextureLoader().load(data.src.src)
    let floorGeometry = new THREE.BoxBufferGeometry(data.depth, 0.01, data.width)
    let floorMesh = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({map: floorTexture}))

    el.setObject3D('mesh', floorMesh)
    floorMesh.position.set(data.depth/2, 0, -data.width/2)
    if(data.text)
    {
      let direction = document.createElement('a-entity')
      direction.setAttribute("checkpoint", '')
      direction.setAttribute('id', data.text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~()?]/g,"").trim().replace(/[ ’]/g, '-') + "_sign")
      let div = document.createElement('div')
      direction.setAttribute('htmlembed', {ppu: 256, styleSheetId: "malloci-style"})
      div.innerHTML = data.text
      direction.classList.add('sign')
      div.classList.add('section')
      direction.setAttribute('position', {x: data.depth - 1, y: 0.01, z: -(data.width/2)})
      direction.setAttribute('rotation', {x: -90, y: -90, z: 0})
      direction.appendChild(div)
      el.appendChild(direction)
    }
    if(AFRAME.utils.device.isMobile())
    {
      for(let step = 4; step < data.depth; step += 4){
        this.el.appendChild(this.initCheckPoint({x: step, y: 0.1, z: -(data.width/2)}))
      }
    }

    this.el.sceneEl.addEventListener('floor-update', () => {
      
      let floorTexture = new THREE.TextureLoader().load(data.src.src)
      let floorGeometry = new THREE.BoxBufferGeometry(data.depth, 0.01, data.width)
      let floorMesh = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({map: floorTexture}))

      el.setObject3D('mesh', floorMesh)
      floorMesh.position.set(data.depth/2, 0, -data.width/2)
    })
  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  },

  initCheckPoint: function (position)
  {
    let checkpoint = document.createElement("a-cylinder")
    checkpoint.setAttribute('height', 0.1)
    checkpoint.setAttribute("checkpoint", '')
    checkpoint.setAttribute('class', 'clickable')
    checkpoint.setAttribute("position", position)
    checkpoint.setAttribute("opacity", 0.0)

    let ring = document.createElement("a-entity")
    ring.setAttribute("geometry", "primitive: ring; radiusInner: 0.4; radiusOuter: .5;")
    ring.setAttribute("material", "color: #1890ff; shader: flat;")
    ring.setAttribute("rotation", {x: -90, y:0, z:0})
    checkpoint.appendChild(ring)

    return checkpoint
  }
});


AFRAME.registerComponent('ceiling', {
  schema: {
    width: {type: 'number'},
    height: {type: 'number', default: 5},
    rotateY: {type: 'number'},
    roomLength: {type: 'number'},
    src: {type: 'map', default: '#ceilingTexture'},
  },

  init: function () {
    // Do something when component first attached.
    let data = this.data
    let el = this.el

    let space = 8    

    for(let i = 0; i < data.roomLength; i += space)
    {
      let beam = document.createElement('a-entity')
      beam.setAttribute('beam', {length: data.width-0.3, width: 0.3, thickness: 0.5, height: data.height - 0.25})
      beam.setAttribute('position', {x: i, y: 0, z: data.rotateY < 0 ? 0.15 : -0.15})
      beam.setAttribute('rotation', {x: 0, y: data.rotateY, z: 0})
      el.appendChild(beam)
    }
  },

  update: function (oldData) {
    
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  }
});


AFRAME.registerComponent('rectframe', {
  schema: {
    height: {type:'number'},
    width: {type:'number'},
    wordart: {type: 'boolean', default: false},
    src: {type: 'map', default: '#frameTexture'},    
  },

 init: function() {
     let obj = this.el.object3D;
     let data = this.data;

     // create two geometries, one for vert, one for hor
     let geomVert = new THREE.BoxBufferGeometry(0.04, data.width + 0.08, 0.04);
     let geomHor = new THREE.BoxBufferGeometry(0.04, data.height + 0.08, 0.04);
      let mat
     // duplicate the geometries twice
     if(data.wordart)
     {
        mat = new THREE.MeshBasicMaterial({color: "#ffffff"})
     }
     else if (AFRAME.utils.device.isMobile())
     {
      mat = new THREE.MeshBasicMaterial({color: "#91745D"})
     }
     else
     {
       let texture = null
       if(!data.src.src)
       {
        texture = new THREE.TextureLoader().load(data.src)
       }
       else
       {
        texture = new THREE.TextureLoader().load(data.src.src)
       } 
       mat = new THREE.MeshBasicMaterial({map: texture})
     }
     let frameTop = new THREE.Mesh(geomHor, mat);
     let frameBottom = new THREE.Mesh(geomHor, mat);
     let frameRight = new THREE.Mesh(geomVert, mat);
     let frameLeft = new THREE.Mesh(geomVert, mat);

     //set positions and rotation
     frameTop.position.set(geomVert.parameters.height/2 - 0.02, 0, 0.0);
     frameBottom.position.set(-geomVert.parameters.height/2 + 0.02, 0, 0.0);

     frameRight.position.set(0, geomHor.parameters.height/2 - 0.02, 0.0);
     frameLeft.position.set(0, -geomHor.parameters.height/2 + 0.02, 0.0);

     frameRight.rotation.set(0, 0, Math.PI / 2);
     frameLeft.rotation.set(0, 0, Math.PI / 2);

     obj.add(frameTop);
     obj.add(frameBottom);
     obj.add(frameRight);
     obj.add(frameLeft);

     this.el.sceneEl.addEventListener('frames-update', () => {
      
      let geomVert = new THREE.BoxBufferGeometry(0.04, data.width + 0.08, 0.04);
     let geomHor = new THREE.BoxBufferGeometry(0.04, data.height + 0.08, 0.04);
      let mat
     // duplicate the geometries twice
     if(data.wordart)
     {
        mat = new THREE.MeshBasicMaterial({color: "#ffffff"})
     }
     else if (AFRAME.utils.device.isMobile())
     {
      mat = new THREE.MeshBasicMaterial({color: "#91745D"})
     }
     else
     {
       let texture = null
       if(!data.src.src)
       {
        texture = new THREE.TextureLoader().load(data.src)
       }
       else
       {
        texture = new THREE.TextureLoader().load(data.src.src)
       } 
       mat = new THREE.MeshBasicMaterial({map: texture})
     }
     let frameTop = new THREE.Mesh(geomHor, mat);
     let frameBottom = new THREE.Mesh(geomHor, mat);
     let frameRight = new THREE.Mesh(geomVert, mat);
     let frameLeft = new THREE.Mesh(geomVert, mat);

     //set positions and rotation
     frameTop.position.set(geomVert.parameters.height/2 - 0.02, 0, 0.0);
     frameBottom.position.set(-geomVert.parameters.height/2 + 0.02, 0, 0.0);

     frameRight.position.set(0, geomHor.parameters.height/2 - 0.02, 0.0);
     frameLeft.position.set(0, -geomHor.parameters.height/2 + 0.02, 0.0);

     frameRight.rotation.set(0, 0, Math.PI / 2);
     frameLeft.rotation.set(0, 0, Math.PI / 2);

     obj.add(frameTop);
     obj.add(frameBottom);
     obj.add(frameRight);
     obj.add(frameLeft);
    })
  }
});

AFRAME.registerComponent('wall-art', {
  schema: {
    artifact: {
      default: "{}",
      parse: JSON.parse,
      stringify: JSON.stringify
    },
    width: {type: 'number'},
    base64Mode: {type: 'boolean', default: false},
    debug: {type: 'boolean', default: false}
  },

  init: function () {
    // Do something when component first attached.
    let data = this.data
    let el = this.el
    let div = document.createElement('div')
    let pre
    let code

    el.className = "frame"
    el.setAttribute("htmlembed", {ppu: 256, styleSheetId: "malloci-style"})
    this.htmlembed = el.components.htmlembed

    let artClassNum =  6
    el.emit('loading-art')


    switch(data.artifact.type)
    {
        case 'image':
            if(data.base64Mode) data.artifact.src = this.decode(data.artifact.src)
            if(data.debug) console.log("img art",data.artifact.src);
              let image = document.createElement('a-image')
              image.setAttribute('src', data.artifact.src)
              el.appendChild(image)
              image.addEventListener('materialtextureloaded', function(e) {
                el.emit('loading-art')
                if(e.target != image) return
                
                let img = image.getObject3D('mesh').material.map.image
                let wpx = img.width
                let hpx = img.height
                let war = wpx/hpx
                let har = hpx/wpx
                let w = 1
                let h = 1
                let wc = 60
                if(4*har < 2.5)
                {
                  w = 4
                  h = 4*har
                }
                else
                {
                  w = 2.5*war
                  h= 2.5
                  wc = Math.floor((w-0.1)*15)
                }

                image.setAttribute('width', w)
                image.setAttribute('height', h)
                let cap = document.createElement('a-entity')
                
                let textBHeight = Math.ceil(data.artifact.alt.length/wc) * 0.091 + 0.1


                cap.setAttribute('geometry', {primitive:'plane', width: w, height: textBHeight})
                cap.setAttribute('material', {color: '#282828', opacity: 0.4})
                cap.setAttribute('text', {value: data.artifact.alt + '\n', wrapCount: wc, color:'#fff', xOffset: 0.02})
                

                cap.object3D.position.set(0, -h/2+textBHeight/2, 0.002)
                
                el.appendChild(cap)
                if(data.artifact.frameSrc != null)
                {
                  el.setAttribute('rectframe', {height: h, width: w, src: data.artifact.frameSrc})
                }
                else
                {
                  el.setAttribute('rectframe', {height: h, width: w})
                }

              })

            break
        case 'block quote':
            div.classList.add("vr-col-" + artClassNum)
            div.classList.add('block-quote')                   
            div.innerHTML += data.artifact.text
            break
        case 'word art':
            div.classList.add("vr-col-" + artClassNum)
            el.classList.add('word-art')                   
            div.innerHTML += data.artifact.html
            break
        case 'code':
            div.className = "code"
            pre = document.createElement("pre")
            code = document.createElement("code")
            code.innerHTML += data.artifact.code
            pre.appendChild(code)
            div.appendChild(pre)
            Utils.hljs.highlightBlock(code);
            break
        case 'code block':
            div.className = "code"
            pre = document.createElement("pre")
            code = document.createElement("code")
            code.className = "language-" + data.artifact.lang
            code.innerHTML += data.artifact.code
            pre.appendChild(code)
            div.appendChild(pre)
            Utils.hljs.highlightBlock(code);
            break
    }
    
    if(data.artifact.audioSrc != null)
    {
      audio = document.createElement('div')
      audio.className = 'audio'
      div.appendChild(audio)     
      el.classList.add('clickable')                   
      el.setAttribute('sound', {src: `url(${data.artifact.audioSrc})`, on: 'click', maxDistance: 2, autoplay: false})
    }
    
    el.appendChild(div)
    this.frame = false
  },

  decode: function(src)
  {
    if(this.isURL(src)) return src
    // Let us open our database

    let newSrc = null

    newSrc = 'data:image/jpeg;base64,' + window.btoa(sessionStorage.getItem(src));

    return newSrc
  },

  isURL: function (s) {
      var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(s);
  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
    if (!this.frame && this.htmlembed.width > 0) 
    {
      if (this.el.classList.contains('word-art'))
      {
        this.el.setAttribute('rectframe', {height: this.htmlembed.height, width: this.htmlembed.width, wordart: true})
      }
      else if(this.data.artifact.type != 'image')
      {
        if(this.data.artifact.frameSrc != null)
        {
          this.el.setAttribute('rectframe', {height: this.htmlembed.height, width: this.htmlembed.width, src: this.data.artifact.frameSrc})
        }
        else
        {
          this.el.setAttribute('rectframe', {height: this.htmlembed.height, width: this.htmlembed.width})
        }
      }
      this.frame = true
    }
  }
});

AFRAME.registerComponent('malloci', {
    schema: {
      tree: {
        default: "{}",
        parse: JSON.parse,
        stringify: JSON.stringify
      },
      API: {type: 'string', default: null},
      hallWidth: {type: 'number', default: 8},
      wallHeight: {type: 'number', default: 5},
      jumpButton: {type: 'boolean', default: true},
      base64Mode: {type: 'boolean', default: false},
      debug: {type: 'boolean', default: false}
    },
  
    /**
     * Initial creation and setting of the mesh.
     */
    init: function () {
      let data = this.data;

      this._roomWidth = data.hallWidth
      this._rig = document.getElementById("rig")
      this._camera = document.getElementById("camera")

      if(AFRAME.utils.device.isMobile())
      {
          this._rig.setAttribute("movement-controls", "controls: checkpoint")
          this._rig.setAttribute("checkpoint-controls", "mode: teleport")
          let cursor = document.createElement("a-entity")
          cursor.setAttribute("cursor", "fuse: true; fuseTimeout: 500")
          cursor.setAttribute("raycaster", "objects: .clickable")
          cursor.setAttribute("position", {x: 0, y: 0, z: -1})
          cursor.setAttribute("geometry", "primitive: ring; radiusInner: 0.01; radiusOuter: 0.02;")
          cursor.setAttribute("material", "color: #1890ff; shader: flat;")
          this._camera.appendChild(cursor)
      }
      
      this._tree = data.tree

      if(this._tree.theme.floor != null)
      {
        this.cropTheme(this._tree.theme.floor, 'floor').then(img => {
          document.getElementById("floorTexture").setAttribute("src", img[0])
          this.el.emit('floor-update')
        })
      }
      
      if(this._tree.theme.walls != null)
      {
        this.cropTheme(this._tree.theme.walls, 'walls').then(img => {
          document.getElementById("wallTexture").setAttribute("src", img[0])
          this.el.emit('walls-update')
        })
      }
      
      if(this._tree.theme.ceiling != null)
      {
        this.cropTheme(this._tree.theme.ceiling, 'ceiling').then(img => {
          document.getElementById("ceilingTexture").setAttribute("src", img[0])          
          this.el.emit('ceiling-update')
        })
      }
      if(this._tree.theme.frames != null)
      {
        this.cropTheme(this._tree.theme.frames, 'frames').then(img => {
          document.getElementById("frameTexture").setAttribute("src", img[0])          
          this.el.emit('frames-update')
        })
      }
      if(this._tree.theme.sky)
      {
        if(this._tree.theme.sky.includes('#'))
          this.el.sceneEl.setAttribute('background', `color: ${this._tree.theme.sky}`)
        else
          this.el.sceneEl.setAttribute('background', `color: rgb(${this._tree.theme.sky})`)
      }

        this.rng = new Utils.seedrandom(this._tree.name)
        this.el.appendChild(this.Wall('north', [], this._roomWidth, 0, 0, 0))

        this.rooms = this._tree.rooms

        this.xr = 0
        this.xl = this._roomWidth
        this.zr = 0
        this.zl = 0
        this.rot = 270
        this.left = 0
        this.right = 0

        this.trip_wire = null
        this.trip_wire_index = new THREE.Vector3(10000,10000,10000)
        this.tripped = false

        this.el.addEventListener('tripped', () => {
                    
          start = this.trip_wire_index + 1
          end = start + 3 < this.rooms.length ? start + 3 : this.rooms.length
          this.build(start, end)
        })
        this.build()
        if(data.jumpButton)
        {
          this.JumpTo()
        }
        else
        {
          document.addEventListener('jump-to', function(e){
            let rig = document.getElementById("rig")
  
            let section = e.detail
            if(!section){
              this.el.sceneEl.enterVR()
              return
            }
            let roomsign = document.getElementById(section + "_sign")
          
            let position = new THREE.Vector3();
            let v = new THREE.Vector3();
  
            let q = new THREE.Quaternion();
            roomsign.object3D.getWorldQuaternion(q);
  
            let r = new THREE.Euler()
            r.setFromQuaternion(q)
            
            position.setFromMatrixPosition(roomsign.object3D.matrixWorld);
            
            if(THREE.Math.radToDeg(r.z) < 0)
            {
              rig.setAttribute('position', {x: position.x - 4, y: 0, z: position.z})
            }
            else
            {
              rig.setAttribute('position', {x: position.x, y: 0, z: position.z - 4})
            }
            v.subVectors(rig.object3D.position, position).add(rig.object3D.position);
            rig.object3D.lookAt(v)
            rig.sceneEl.enterVR()
          })
        }
        

        this.timer = setTimeout(function(){
          document.querySelector('#splash').style.display = 'none';
        }, 3000);
        this.el.sceneEl.addEventListener('loading-art', function(){
          clearTimeout(this.timer);
          document.querySelector('#splash').style.display = 'flex';
          this.timer = setTimeout(function(){
            document.querySelector('#splash').style.display = 'none';
          }, 3000);
        })
    },

    update: function(oldData)
    {
      let data = this.data;

      if (Object.keys(oldData).length === 0) { return; }

      if(data.debug){
        console.log("old data", oldData.tree);
        console.log("new data", data.tree);
      } 
      

      if (data.tree != oldData.tree)
      {
        while (this.el.lastElementChild) {
          this.el.removeChild(this.el.lastElementChild);
        }
               
        this._tree = data.tree
        if(this._tree.theme.floor != null)
        {
          this.cropTheme(this._tree.theme.floor, 'floor').then(img => {
            document.getElementById("floorTexture").setAttribute("src", img[0])
            this.el.emit('floor-update')

          })
        }
        
        if(this._tree.theme.walls != null)
        {
          this.cropTheme(this._tree.theme.walls, 'walls').then(img => {
            document.getElementById("wallTexture").setAttribute("src", img[0])
            this.el.emit('walls-update')
          })
        }
        
        if(this._tree.theme.ceiling != null)
        {
          this.cropTheme(this._tree.theme.ceiling, 'ceiling').then(img => {
            document.getElementById("ceilingTexture").setAttribute("src", img[0])          
            this.el.emit('ceiling-update')
          })
        }
        if(this._tree.theme.frames != null)
        {
          this.cropTheme(this._tree.theme.frames, 'frames').then(img => {
            document.getElementById("frameTexture").setAttribute("src", img[0])          
            this.el.emit('frames-update')
          })
        }
        if(this._tree.theme.sky)
        {
          if(data.debug) console.log(this._tree.theme.sky, this.el.sceneEl);
          
          if(this._tree.theme.sky.includes('#'))
            this.el.sceneEl.setAttribute('background', `color: ${this._tree.theme.sky}`)
          else
            this.el.sceneEl.setAttribute('background', `color: rgb(${this._tree.theme.sky})`)
        }

        this.rng = new Utils.seedrandom(this._tree.name)
        this.el.appendChild(this.Wall('north', [], this._roomWidth, 0, 0, 0))

        this.rooms = this._tree.rooms

        this.xr = 0
        this.xl = this._roomWidth
        this.zr = 0
        this.zl = 0
        this.rot = 270
        this.left = 0
        this.right = 0
        document.querySelector('#splash').style.display = 'flex';
        this.build()
      }
    },

    tick: function (time, timeDelta) {
      
    },

    cropTheme: function (url, type) {
    
      // we return a Promise that gets resolved with our canvas element
      return new Promise(resolve => {
  
          // this image will hold our source image data
          const inputImage = new Image();
          inputImage.setAttribute('crossorigin',"anonymous")
  
          // we want to wait for our image to load
          inputImage.onload = () => {
  
              // let's store the width and height of our image
              const inputWidth = inputImage.naturalWidth;
              const inputHeight = inputImage.naturalHeight;
              let outputWidth = inputWidth;
              let outputHeight = inputHeight;
  
              if(type==='walls'){
                outputWidth = 2048
                outputHeight = 1024
              }
              if(type==='floor'){
                outputWidth = 1024
                outputHeight = 2048
              }
              if(type === 'ceiling' || type === 'frames'){
                outputWidth = 256
                outputHeight = 256
              }

              // calculate the position to draw the image at
  
              // create a canvas that will present the output image
              const outputImage = document.createElement('canvas');
              
              // set it to the same size as the image
              outputImage.width = outputWidth;
              outputImage.height = outputHeight;
  
              // draw our image at position 0, 0 on the canvas
              const ctx = outputImage.getContext('2d');
              ctx.drawImage(inputImage, 0, 0, inputWidth, inputHeight, 0, 0, outputWidth, outputHeight);
              let data = ctx.getImageData(0,0,outerWidth, outputHeight)

              let length = data.data.length;
              let blockSize = 30
              let i = -4
              let count = 0
              let r = 0
              let b = 0
              let g = 0
              while ( (i += blockSize * 4) < length ) {
                  ++count;
                  r += data.data[i];
                  g += data.data[i+1];
                  b += data.data[i+2];
              }
              // ~~ used to floor values
              r = ~~(r/count);
              g = ~~(g/count);
              b = ~~(b/count);
              
              color = `rgb(${r}, ${g}, ${b})`

              resolve([outputImage.toDataURL(), color]);
          };
  
          // start loading our image
          inputImage.src = url;
      })
      
  },

    build: function(first=1, last=this.rooms.length)
    {      
      last = last < this.rooms.length ? last : this.rooms.length
      
        for(let roomNum = first; roomNum <= last; roomNum++)
        {
            let room = this.rooms[roomNum-1]

            let roomDepth = 0

            roomDepth = room.artifacts.length * 4 + 3

            if(roomDepth < this._roomWidth)
            {
                roomDepth += this._roomWidth
            }

            let leftId = 'left_' + roomNum
            let rightId = 'right_' + roomNum
            let leftWall = null
            let rightWall = null

            let oddIndexedArtifacts = room.artifacts.filter((v,i) => { return i % 2})
            let evenIndexedArtifacts = room.artifacts.filter((v,i) => { return !(i % 2)})
            let leftArt, rightArt
            

            let lengthr = 0
            let lengthl = 0
            let floorLength = 0

            if (roomNum == 1)
            {

                if(this.rng() < 0.5) // turn this.left
                {
                    this.left++
                    lengthr = roomDepth + (this._roomWidth)
                    lengthl = roomDepth 
                    floorLength = lengthl

                }
                else // turn this.right
                {
                    this.right++
                    lengthr = roomDepth 
                    lengthl = roomDepth + (this._roomWidth)
                    floorLength = lengthr

                }

                leftArt = this.right == 0 ? evenIndexedArtifacts : oddIndexedArtifacts
                rightArt = leftArt === evenIndexedArtifacts ? oddIndexedArtifacts : evenIndexedArtifacts

                rightWall = this.Wall(rightId, rightArt, lengthr, this.xr, this.zr, this.rot, "right")
                leftWall = this.Wall(leftId, leftArt, lengthl, this.xl, this.zl, this.rot)


                rightWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, 0, this.rooms[roomNum].name))
                leftWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: lengthl, rotateY: -90})

                this.el.appendChild(rightWall)
                this.el.appendChild(leftWall)

                this.zr += lengthr
                this.zl += lengthl

                if(this.left> 0)
                {
                    this.rot += 90
                }
                else 
                {
                    this.rot -= 90
                }

            }
            else if(roomNum != this.rooms.length)
            {
                if((this.rng() < 0.5 && this.left < 2) || this.right == 2) // turn this.left
                {
                    lengthr = !this.left ? roomDepth : roomDepth + this._roomWidth*2
                    lengthl = roomDepth
                    floorLength = !this.left ? lengthl : roomDepth + this._roomWidth
                    this.left++
                    this.right = 0
                }
                else // turn this.right
                {
                    lengthr = roomDepth
                    lengthl = this.left > 0 ? roomDepth : roomDepth + this._roomWidth*2
                    floorLength = this.left > 0 ? lengthr : roomDepth + this._roomWidth
                    this.right++
                    this.left = 0
                }

                leftArt = (this.right == 0 && this.left < 2) || this.right >= 2 ? evenIndexedArtifacts : oddIndexedArtifacts
                rightArt = leftArt === evenIndexedArtifacts ? oddIndexedArtifacts : evenIndexedArtifacts

                rightWall = this.Wall(rightId, rightArt, lengthr, this.xr, this.zr, this.rot, "right")
                leftWall = this.Wall(leftId, leftArt, lengthl, this.xl, this.zl, this.rot)

                if((this.right == 0 && this.left < 2) || this.right >= 2)
                {
                    leftWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, this._roomWidth, 0, this.rooms[roomNum].name))
                    rightWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: floorLength, rotateY: 90})
                }
                else
                {
                    rightWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, 0, this.rooms[roomNum].name))
                    leftWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: floorLength, rotateY: -90})
                }

                this.el.appendChild(rightWall)
                this.el.appendChild(leftWall)

                this.rot = this.rot <= 360 ? this.rot : this.rot - 360
                this.rot = this.rot >= 0 ? this.rot : this.rot + 360

                switch(this.rot)
                {
                    case 90:
                        this.zr -= lengthr
                        this.zl -= lengthl
                        break
                    case 180:
                        this.xr -= lengthr
                        this.xl -= lengthl
                        break
                    case 270:
                        this.zr += lengthr
                        this.zl += lengthl
                        break
                    case 360:
                    case 0:
                        this.xr += lengthr
                        this.xl += lengthl
                        break
                }

                if(this.left> 0)
                {
                    this.rot += 90
                }
                else 
                {
                    this.rot -= 90
                }

            }
            else
            {
                if(this.left> 0)
                {
                    lengthr = roomDepth + this._roomWidth
                    lengthl = roomDepth
                }
                else // turn this.right
                {
                    lengthr = roomDepth
                    lengthl = roomDepth + this._roomWidth
                }

                leftArt = (this.right == 0 && this.left < 2) || this.right >= 2 ? evenIndexedArtifacts : oddIndexedArtifacts
                rightArt = leftArt === evenIndexedArtifacts ? oddIndexedArtifacts : evenIndexedArtifacts

                rightWall = this.Wall(rightId, rightArt, lengthr, this.xr, this.zr, this.rot, "right")
                leftWall = this.Wall(leftId, leftArt, lengthl, this.xl, this.zl, this.rot)


                floorLength = roomDepth + this._roomWidth
                
                if (lengthr > lengthl)
                {
                  leftWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: lengthl, rotateY: -90})
                }
                else
                {
                  rightWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: lengthr, rotateY: 90})
                }

                this.el.appendChild(rightWall)
                this.el.appendChild(leftWall)

                let lastx = this.xl
                let lastz = this.zl

                this.rot = this.rot <= 360 ? this.rot : this.rot - 360
                this.rot = this.rot >= 0 ? this.rot : this.rot + 360


                switch(this.rot)
                {
                    case 90:
                        lastz = this.zl - lengthl
                        break
                    case 180:
                        lastx = this.xl - lengthl
                        break
                    case 270:
                        lastz = this.zl + lengthl
                        break
                    case 360:
                    case 0:
                        lastx = this.xl + lengthl
                        break
                }

                let backWall = this.Wall('backwall', [], this._roomWidth, lastx, lastz, this.rot - 90)
                backWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, -90))

                if(this.left > 0)
                {
                    this.rot += 90
                }
                else 
                {
                    this.rot -= 90
                }

                this.el.appendChild(backWall)
            }
        }
        
        document.addEventListener('enter-vr', (e) => {
          document.getElementById("ambient-track").components.sound.playSound();
        })
        document.addEventListener('exit-vr', (e) => {
          document.getElementById("ambient-track").components.sound.stopSound();
        })
    },

    Wall: function (id, artifacts, length, x, z, rotation, leftOrRight = "left")
    {
        let wall = document.createElement('a-entity')
        wall.setAttribute('wall', {length: length, orientation: leftOrRight, artifacts: JSON.stringify(artifacts), debug: this.data.debug, base64Mode: this.data.base64Mode})
        wall.setAttribute('id', id)
        wall.setAttribute('width', length)
        wall.setAttribute('position', {x: x, y: 0, z: z})
        wall.setAttribute('rotation', {x: 0, y: rotation, z: 0})
        return wall
    },

    floor: function (id, width, depth, x, z, rotation, nextSection = null)
    {
        let floor = document.createElement('a-entity')
        floor.setAttribute("id", id)
        floor.setAttribute('class', 'scenery')
        floor.setAttribute('floor', {width: width, depth: depth, text: nextSection})

        floor.setAttribute('position', {x: x, y: 0, z: z})
        floor.setAttribute('rotation', {x: 0, y: rotation, z: 0})

        return floor
    },

    JumpTo: function()
    {
      let jumpButton = document.createElement('div')
      let img = document.createElement('img')
      img.setAttribute("src", Utils.VRIcon)
      jumpButton.appendChild(img)
      jumpButton.classList.add("jump")
      document.body.appendChild(jumpButton)

      jumpButton.addEventListener('click', () => {

        let isInViewPort = function (elem) {
          var distance = elem.getBoundingClientRect();
          return (
            distance.top >= 0 &&
            distance.left >= 0 &&
            distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            distance.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        };
        
        let htags = document.body.querySelectorAll("h1, h2, h3, h4, h5, h6")
        let section = null
        let index = 0

        for(let i = 0; i < htags.length; i++)
        {
          if(isInViewPort(htags[i]))
          {
            section = htags[i]
            index = i
            break
          }
        }

        if(!section){
          this.el.sceneEl.enterVR()
          return
        }
        
        let roomsign = document.getElementById(section.getAttribute('id') + "_sign")
        
        let position = new THREE.Vector3();
        let v = new THREE.Vector3();

        let q = new THREE.Quaternion();
        roomsign.object3D.getWorldQuaternion(q);

        let r = new THREE.Euler()
        r.setFromQuaternion(q)
        
        position.setFromMatrixPosition(roomsign.object3D.matrixWorld);
        
        if(THREE.Math.radToDeg(r.z) < 0)
        {
          this._rig.setAttribute('position', {x: position.x - 4, y: 0, z: position.z})
        }
        else
        {
          this._rig.setAttribute('position', {x: position.x, y: 0, z: position.z - 4})

        }
        v.subVectors(this._rig.object3D.position, position).add(this._rig.object3D.position);
        this._rig.object3D.lookAt(v)
        this.el.sceneEl.enterVR()
      })
    },
  });

  AFRAME.registerComponent('instructions', {
    schema: {
      height: {type:'number'},
      width: {type:'number'},
      src: {type: 'string'},    
    },
  
    init: function () {
      // Do something when component first attached.
      if(AFRAME.utils.device.checkHeadsetConnected())
      {
        let instr = document.createElement('a-image')
        instr.setAttribute('src', this.data.src)
        instr.setAttribute('width', this.data.width)
        instr.setAttribute('height', this.data.height)
        instr.setAttribute('opacity', 0.5)
        this.el.appendChild(instr)
      }
      
    },
  
    update: function () {
      // Do something when component's data is updated.
    },
  
    remove: function () {
      // Do something the component or its entity is detached.
    },
  
    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
    }
  });
  