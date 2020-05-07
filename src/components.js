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
    beam.setAttribute('beam', `length: ${data.length + 0.2}; width: ${0.3}; thickness: ${0.5}; height: ${data.height - 0.25}`)

    el.appendChild(beam)

    wallMesh.position.set(data.length/2, data.height/2, 0)
    if(data.orientation == "right") wallMesh.rotateY(3.14159)

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
    ring.setAttribute("material", "color: #CCC; shader: flat;")
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
      direction.setAttribute('id', data.text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~()?]/g,"").trim().replace(/[ ’]/g, '-') + "_sign")
      let div = document.createElement('div')
      direction.setAttribute('htmlembed', {ppu: 256, styleSheetId: "malloci-style"})
      div.innerHTML = data.text
      direction.classList.add('sign')
      div.classList.add('section')
      direction.setAttribute('position', {x: data.depth - 1, y: 0.1, z: -(data.width/2)})
      direction.setAttribute('rotation', {x: -90, y: -90, z: 0})
      direction.appendChild(div)
      el.appendChild(direction)
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
  },
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
      beam.setAttribute('beam', {length: data.width, width: 0.3, thickness: 0.5, height: data.height - 0.25})
      beam.setAttribute('position', {x: i, y: 0, z: 0})
      beam.setAttribute('rotation', {x: 0, y: data.rotateY, z: 0})
      el.appendChild(beam)
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
     let geomVert = new THREE.BoxBufferGeometry(0.04, data.width, 0.04);
     let geomHor = new THREE.BoxBufferGeometry(0.04, data.height, 0.04);
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
      let texture = new THREE.TextureLoader().load(data.src.src)
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

    let artClassNum =  6

    switch(data.artifact.type)
    {
        case 'image':
            if(data.base64Mode) data.artifact.src = this.decode(data.artifact.src)
            if(data.debug) console.log("img art",data.artifact.src);
            el.setAttribute("id", data.artifact.alt)
            div.className = "vr-img"
            el.className = "img-frame"
            let image = document.createElement('img')
            image.setAttribute('src', data.artifact.src)

            let caption = document.createElement('div')
            caption.className = "caption"
            caption.innerHTML = data.artifact.alt

            div.appendChild(image)
            div.appendChild(caption)

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
      if(data.debug) console.log("audio", data.artifact.audioSrc);
      
      el.classList.add('clickable')                   
      el.setAttribute('sound', {src: `url(${data.artifact.audioSrc})`, on: 'click', maxDistance: 2, autoplay: false})
    }
    
    el.appendChild(div)
    this.htmlembed = el.components.htmlembed
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
      else
      {
        this.el.setAttribute('rectframe', {height: this.htmlembed.height, width: this.htmlembed.width})
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
          cursor.setAttribute("material", "color: #CCC; shader: flat;")
          this._camera.appendChild(cursor)
      }
      
      this._tree = data.tree
      
      if (data.API)
      {
        this.GenerateArtifacts()       
      }
      else
      {
        this.build()
      }

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
        this.build()
      }
    },

    GenerateArtifacts: async function ()
    {
        const response = await fetch(this.data.API, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(this._tree) // body data type must match "Content-Type" header
          })
          if (!response.ok) {
            console.error("bad response, loading user defined tree")
          }
          else
          {
            this._tree = await response.json()
            this.build()
          }
          return
    },

    build: function()
    {
        if(this._tree.theme.floor != null)
          document.getElementById("floorTexture").setAttribute("src", this._tree.theme.floor)
        if(this._tree.theme.walls != null)
          document.getElementById("wallTexture").setAttribute("src", this._tree.theme.walls)
        if(this._tree.theme.ceiling != null)
          document.getElementById("ceilingTexture").setAttribute("src", this._tree.theme.ceiling)

        this.rng = new Utils.seedrandom(this._tree.name)
        let rooms = this._tree.rooms
        this.el.appendChild(this.Wall('north', [], this._roomWidth, 0, 0, 0))

        let xr = 0
        let xl = this._roomWidth
        let zr = 0
        let zl = 0
        let rot = 270
        let left = 0
        let right = 0

        for(let roomNum = 1; roomNum <= rooms.length; roomNum++)
        {
            let room = rooms[roomNum-1]

            let roomDepth = 0

            if(room.subrooms != null && room.subrooms.length != [])
            {
                for( let srn = 1; srn <= room.subrooms.length ; srn++)
                {
                    let subroom = room.subrooms[srn - 1]
                    roomDepth += subroom.artifacts.length * 4 + 3
                }
            }
            else
            {
                roomDepth = room.artifacts.length * 4 + 3
            }

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
            

            let lengthr = 0
            let lengthl = 0
            let floorLength = 0

            if (roomNum == 1)
            {

                if(this.rng() < 0.5) // turn left
                {
                    left++
                    lengthr = roomDepth + (this._roomWidth)
                    lengthl = roomDepth 
                    floorLength = lengthl

                    rightWall = this.Wall(rightId, oddIndexedArtifacts, lengthr, xr, zr, rot, "right")
                    leftWall = this.Wall(leftId, evenIndexedArtifacts, lengthl, xl, zl, rot)

                }
                else // turn right
                {
                    right++
                    lengthr = roomDepth 
                    lengthl = roomDepth + (this._roomWidth)
                    floorLength = lengthr

                    rightWall = this.Wall(rightId, evenIndexedArtifacts, lengthr, xr, zr, rot, "right")
                    leftWall = this.Wall(leftId, oddIndexedArtifacts, lengthl, xl, zl, rot)

                }

                rightWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, 0, rooms[roomNum].name))
                leftWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: lengthl, rotateY: -90})

                this.el.appendChild(rightWall)
                this.el.appendChild(leftWall)

                zr += lengthr
                zl += lengthl

                if(left > 0)
                {
                    rot += 90
                }
                else 
                {
                    rot -= 90
                }

            }
            else if(roomNum != rooms.length)
            {
                if((this.rng() < 0.5 && left < 2) || right == 2) // turn left
                {
                    lengthr = !left ? roomDepth : roomDepth + this._roomWidth*2
                    lengthl = roomDepth
                    floorLength = !left ? lengthl : roomDepth + this._roomWidth
                    left++
                    right = 0

                  rightWall = this.Wall(rightId, evenIndexedArtifacts, lengthr, xr, zr, rot, "right")
                  leftWall = this.Wall(leftId, oddIndexedArtifacts, lengthl, xl, zl, rot)
                }
                else // turn right
                {
                    lengthr = roomDepth
                    lengthl = left > 0 ? roomDepth : roomDepth + this._roomWidth*2
                    floorLength = left > 0 ? lengthr : roomDepth + this._roomWidth
                    right++
                    left = 0

                    rightWall = this.Wall(rightId, oddIndexedArtifacts, lengthr, xr, zr, rot, "right")
                    leftWall = this.Wall(leftId, evenIndexedArtifacts, lengthl, xl, zl, rot)
                }

                if((right == 0 && left < 2) || right >= 2)
                {
                    leftWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, this._roomWidth, 0, rooms[roomNum].name))
                    rightWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: floorLength, rotateY: 90})
                }
                else
                {
                    rightWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, 0, rooms[roomNum].name))
                    leftWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: floorLength, rotateY: -90})
                }

                this.el.appendChild(rightWall)
                this.el.appendChild(leftWall)

                let jx = (xr + xl)/2
                let jz = (zr + zl)/2

                switch(rot)
                {
                    case 90:
                    case 450:
                        zr -= lengthr
                        zl -= lengthl
                        break
                    case 180:
                        xr -= lengthr
                        xl -= lengthl
                        break
                    case 270:
                        zr += lengthr
                        zl += lengthl
                        break
                    case 360:
                    case 0:
                        xr += lengthr
                        xl += lengthl
                        break
                }

                if(left > 0)
                {
                    rot += 90
                }
                else 
                {
                    rot -= 90
                }

            }
            else
            {
                if(left > 0)
                {
                    lengthr = roomDepth + this._roomWidth
                    lengthl = roomDepth

                    rightWall = this.Wall(rightId, evenIndexedArtifacts, lengthr, xr, zr, rot, "right")
                    leftWall = this.Wall(leftId, oddIndexedArtifacts, lengthl, xl, zl, rot)
                }
                else // turn right
                {
                    lengthr = roomDepth
                    lengthl = roomDepth + this._roomWidth

                    rightWall = this.Wall(rightId, oddIndexedArtifacts, lengthr, xr, zr, rot, "right")
                    leftWall = this.Wall(leftId, evenIndexedArtifacts, lengthl, xl, zl, rot)
                }

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

                let lastx = xl
                let lastz = zl

                let jx = (xr + xl)/2
                let jz = (zr + zl)/2

                switch(rot)
                {
                    case 90:
                    case 450:
                        lastz = zl - lengthl
                        break
                    case 180:
                        lastx = xl - lengthl
                        break
                    case 270:
                        lastz = zl + lengthl
                        break
                    case 360:
                    case 0:
                        lastx = xl + lengthl
                        break
                }

                let backWall = this.Wall(leftId, [], this._roomWidth, lastx, lastz, rot - 90)
                backWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, -90))

                if(left > 0)
                {
                    rot += 90
                }
                else 
                {
                    rot -= 90
                }

                // this.CreateJumpTo(room.name, jx, jz, rot)
                this.el.appendChild(backWall)
            }
        }
        if(!this.data.base64Mode)
        {
          this.JumpTo()
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

        // this.CreateJumpTo(nextSection)
        return floor
    },

    JumpTo: function()
    {
      let jumpButton = document.createElement('div')
      let img = document.createElement('img')
      img.setAttribute("src", Utils.Icon)

      jumpButton.appendChild(img)
      jumpButton.setAttribute("class", "jump")
      this.el.sceneEl.parentElement.appendChild(jumpButton)

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
        
        let htags = this.el.sceneEl.parentElement.querySelectorAll("h1, h2, h3, h4, h5, h6")
        let section = null

        for(let i = 0; i < htags.length; i++)
        {
          if(isInViewPort(htags[i]))
          {
            section = htags[i]
            break
          }
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