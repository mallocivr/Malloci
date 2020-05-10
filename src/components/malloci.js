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

    build: function(start = 0, end = 5)
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

        for(let roomNum = start; roomNum <= end; roomNum++)
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
                rot = rot <= 360 ? rot : rot - 360

                switch(rot)
                {
                    case 90:
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

                rot = rot <= 360 ? rot : rot - 360

                switch(rot)
                {
                    case 90:
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