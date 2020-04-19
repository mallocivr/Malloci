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

    let texture = new THREE.TextureLoader().load(data.src.src)
    let geometry = new THREE.BoxBufferGeometry(data.length, data.thickness, data.width)
    let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}))

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
    let divisor = artifacts.length + 1
    let artWidth = this.data.length/divisor

    for (let i = 1; i <= artifacts.length; i++)
    {
        let artObj = artifacts[i-1]

        let artifact = document.createElement('a-entity')
        artifact.setAttribute('wall-art', {artifact: JSON.stringify(artObj), width: artWidth, debug: this.data.debug, base64Mode: this.data.base64Mode})
        this.el.appendChild(artifact)
        artifact.setAttribute("position", {x:  artWidth * i, y: 1.52, z: 0.2})
        if(this.data.orientation == "right")
        {
          artifact.setAttribute("position", {x:  artWidth * i, y: 1.52, z: -0.2})
          artifact.setAttribute('rotation', {x: 0, y: 180, z: 0})

          if(AFRAME.utils.device.isMobile())
          {
              this.el.appendChild(this.initCheckPoint({x: artWidth * i, y: 0.1, z: -2}))
          }
        }
        else
        {
          if(AFRAME.utils.device.isMobile())
          {
              this.el.appendChild(this.initCheckPoint({x: artWidth * i, y: 0.1, z: 2}))
          }
        }
    }
  },

  initCheckPoint: function (position)
  {
      let checkpoint = document.createElement("a-plane")
      checkpoint.setAttribute("checkpoint", '')
      checkpoint.setAttribute("class", "clickable")
      checkpoint.setAttribute("geometry", "primitive: ring; radiusInner: 0.6; radiusOuter: .8;")
      checkpoint.setAttribute("material", "color: #CCC; shader: flat;")
      checkpoint.setAttribute("position", position)
      checkpoint.setAttribute("rotation", {x: -90, y:0, z:0})

      return checkpoint
  }
});

AFRAME.registerComponent('floor', {
  schema: {
    width: {type: 'number'},
    depth: {type: 'number'},
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
    src: {type: 'map', default: '#floorTexture'},    
  },

 init: function() {
     let obj = this.el.object3D;
     let data = this.data;
     let texture = new THREE.TextureLoader().load(data.src.src)

     // create two geometries, one for vert, one for hor
     let geomVert = new THREE.BoxBufferGeometry(0.04, data.width, 0.04);
     let geomHor = new THREE.BoxBufferGeometry(0.04, data.height, 0.04);

     // duplicate the geometries twice
     let frameTop = new THREE.Mesh(geomHor, new THREE.MeshStandardMaterial({map: texture}));
     let frameBottom = new THREE.Mesh(geomHor, new THREE.MeshStandardMaterial({map: texture}));
     let frameRight = new THREE.Mesh(geomVert, new THREE.MeshStandardMaterial({map: texture}));
     let frameLeft = new THREE.Mesh(geomVert, new THREE.MeshStandardMaterial({map: texture}));

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
    let pre = document.createElement("pre")
    let code = document.createElement("code")

    el.className = "frame"
    el.setAttribute("htmlembed", "")

    let artClassNum =  6

    switch(data.artifact.type)
    {
        case 'image':
            if(data.base64Mode) data.artifact.src = this.decode(data.artifact.src)
            if(data.debug) console.log(data.artifact.src);
            el.setAttribute("id", data.artifact.alt)
            div.className = "vr-img"
            el.className = "img-frame"
            let image = document.createElement('img')
            image.setAttribute('src', data.artifact.src)
            div.appendChild(image)
            break
        case 'block quote':
            div.className = "vr-col-" + artClassNum
            el.classList.add('block-quote')                   
            div.innerHTML += data.artifact.text
            break
        case 'word art':
            el.classList.add('word-art')                   
            div.className = "vr-col-" + artClassNum
            div.innerHTML += data.artifact.html
            break
        case 'code':
            div.className = "code"
            code.innerHTML += data.artifact.code
            pre.appendChild(code)
            div.appendChild(pre)
            hljs.highlightBlock(code);
            break
        case 'code block':
            div.className = "code"
            code.className = "language-" + data.artifact.lang
            code.innerHTML += data.artifact.code
            pre.appendChild(code)
            div.appendChild(pre)
            hljs.highlightBlock(code);
            break
    }
    
    if(data.artifact.audioSrc != null)
    {
      if(data.debug) console.log(data.artifact.audioSrc);
      
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

    newSrc = 'data:image/jpeg;base64,' + window.btoa(localStorage.getItem(src));

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
    if (this.el.classList.contains('word-art'))
    {
      this.frame = true
    }
    if (!this.frame && this.htmlembed.width > 0) 
    {
      this.el.setAttribute('rectframe', {height: this.htmlembed.height, width: this.htmlembed.width})
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
      API: {type: 'string', default: ''},
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
      
      
      this._tree = data.tree
      
      if (data.API != '')
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
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(this._tree) // body data type must match "Content-Type" header
          })
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          else
          {
            this._tree = await response.json()
            localStorage.setItem(this._tree.name + '_museumTree', JSON.stringify(this._tree))
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

        this.rng = new seedrandom(this._tree.name)
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
                    roomDepth += subroom.artifacts.length * 3.2

                }
            }
            else
            {
                roomDepth =  room.artifacts.length * 3.2
            }

            if(roomDepth < this._roomWidth)
            {
                roomDepth += this._roomWidth
            }

            let leftId = 'left_' + roomNum
            let rightId = 'right_' + roomNum
            let leftWall = null
            let rightWall = null

            let split = Math.floor(room.artifacts.length/2)

            let leftArtifacts = room.artifacts.slice(0, split)
            let rightArtifacts = room.artifacts.slice(split)

            let lengthr = 0
            let lengthl = 0
            let floorLength = 0

            if (roomNum == 1)
            {
                this.CreateJumpTo(room.name, this._roomWidth/2, 1, 180)                

                if(this.rng() < 0.5) // turn left
                {
                    left++
                    lengthr = roomDepth + (this._roomWidth)
                    lengthl = roomDepth 
                    floorLength = lengthl
                }
                else // turn right
                {
                    right++
                    lengthr = roomDepth 
                    lengthl = roomDepth + (this._roomWidth)
                    floorLength = lengthr
                }

                rightWall = this.Wall(rightId, rightArtifacts, lengthr, xr, zr, rot, "right")
                leftWall = this.Wall(leftId, leftArtifacts, lengthl, xl, zl, rot)

                rightWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, 0))
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
                }
                else // turn right
                {
                    lengthr = roomDepth
                    lengthl = left > 0 ? roomDepth : roomDepth + this._roomWidth*2
                    floorLength = left > 0 ? lengthr : roomDepth + this._roomWidth
                    right++
                    left = 0
                }

                rightWall = this.Wall(rightId, rightArtifacts, lengthr, xr, zr, rot, "right")
                leftWall = this.Wall(leftId, leftArtifacts, lengthl, xl, zl, rot)

                if((right == 0 && left < 2) || right >= 2)
                {
                    leftWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, this._roomWidth, 0))
                    rightWall.setAttribute('ceiling', {width: this._roomWidth, roomLength: floorLength, rotateY: 90})
                }
                else
                {
                    rightWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, 0))
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
                this.CreateJumpTo(room.name, jx, jz, rot)

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
                }
                else // turn right
                {
                    lengthr = roomDepth
                    lengthl = roomDepth + this._roomWidth
                }

                floorLength = roomDepth + this._roomWidth
                rightWall = this.Wall(rightId, rightArtifacts, lengthr, xr, zr, rot, "right")
                leftWall = this.Wall(leftId, leftArtifacts, lengthl, xl, zl, rot)

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

                this.CreateJumpTo(room.name, jx, jz, rot)
                this.el.appendChild(backWall)
            }
        }
        localStorage.setItem(this._tree.name + '_museumTree', JSON.stringify(this._tree))
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

    floor: function (id, width, depth, x, z, rotation)
    {
        let floor = document.createElement('a-entity')
        floor.setAttribute("id", id)
        floor.setAttribute('class', 'scenery')
        floor.setAttribute('floor', {width: width, depth: depth})

        floor.setAttribute('position', {x: x, y: 0, z: z})
        floor.setAttribute('rotation', {x: 0, y: rotation, z: 0})
        return floor
    },

    InitCheckPoint: function(position)
    {
        let checkpoint = document.createElement("a-sphere")
        checkpoint.setAttribute("checkpoint", '')
        checkpoint.setAttribute("position", position)
        checkpoint.setAttribute("opacity", 0.0)

        let ring = document.createElement("a-entity")
        ring.setAttribute("geometry", "primitive: ring; radiusInner: 0.6; radiusOuter: .8;")
        ring.setAttribute("material", "color: #CCC; shader: flat;")
        ring.setAttribute("rotation", {x: -90, y:0, z:0})
        checkpoint.appendChild(ring)

        return checkpoint
    },

    CreateJumpTo: function(roomName, x, z, rotation)
    {
      if(!roomName) return   
      console.log(roomName.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~()?]/g,"").replace(/ /g, '-'));
          
        let title = document.getElementById(roomName.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~()?]/g,"").replace(/ /g, '-'))

        if(title == undefined) return;

        let jumpButton = document.createElement('img')
        jumpButton.setAttribute("src", Icon)
        jumpButton.setAttribute("class", "jump")

        jumpButton.addEventListener('click', () => {
            this._rig.setAttribute('position', {x: x, y: 0, z: z})
            this._camera.setAttribute('rotation', {x: 0, y: rotation, z: 0})
            this.el.sceneEl.enterVR()
        })
        title.appendChild(jumpButton)
        this.el.emit('done')
    }
  });