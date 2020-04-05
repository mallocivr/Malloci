class Malloci 
{
    constructor(markDown, exWidth)
    {
        this._tree = this.MDtoJSON(markDown)
        this._roomWidth = exWidth
        this._scene = document.querySelector("a-scene")
        this._rig = document.getElementById("rig")
        this._camera = document.getElementById("camera")
        this._assets = new Assets(null)
        this.rng = new Math.seedrandom(this._tree.name);
    }

    GetDevice()
    {
        if(AFRAME.utils.device.isMobile())
        {
            this._rig.setAttribute("movement-controls", "controls: checkpoint")
            this._rig.setAttribute("checkpoint-controls", "mode: teleport")
            let cursor = document.createElement("a-entity")
            cursor.setAttribute("cursor", "fuse: true; fuseTimeout: 500")
            cursor.setAttribute("position", {x: 0, y: 0, z: -1})
            cursor.setAttribute("geometry", "primitive: ring; radiusInner: 0.01; radiusOuter: 0.02;")
            cursor.setAttribute("material", "color: #CCC; shader: flat;")
            this._camera.appendChild(cursor)
        }
    }

    MDtoJSON(markDown)
    {
        let exJSON = {}
        exJSON.rooms = []

        let subJSON = {}
        let artifacts = []

        let level = ""
        let text = ""

        let block_quote = ""
        let code_block = ""

        let in_code = false

        let mdLines = markDown.split('\n')

        mdLines.forEach(line => {
            
            let words = line.split(" ")

            // Headings
            if (words[0].charAt(0) == "#" && !in_code)
            {
                if(words[0] == "###") 
                    return

                level = words.shift()

                if(subJSON.name != null)
                {
                    subJSON.text = text
                    subJSON.artifacts = artifacts
            
                    text = ""
                    artifacts = []

                    if(level == "#" || level == "##")
                    {
                        exJSON.rooms.push(subJSON)
                        subJSON = {}
                    }
                }
                else if (text != "")
                {
                    exJSON.text = text
                    exJSON.artifact = artifacts

                    text = ""
                    artifacts = []
                }
                if (level == "#")
                {
                    exJSON.name = words.join(" ")
                }
                subJSON.name = words.join(" ")
            }

            // Block Quotes
            if (words[0].charAt(0) == ">" && !in_code)
            {
                block_quote += words.join(" ").replace(">", "").replace(/(^[\s]+|[\s]+$)/, "\n")                                
            }
            else if (block_quote != "")
            {
                artifacts.push(this.ParseArtifact(block_quote, "block quote"))
                block_quote = ""
            }

            // Code Blocks
            if (words[0].includes("```") && !in_code)
            {
                code_block += line + "\n"
                in_code = true
            }
            else if(in_code)
            {
                if(line.includes("```"))
                    in_code = false
                code_block += line + "\n"
            }
            else if (code_block == "" && words[0].charAt(0) == "`")
            {
                code_block += line + '\n'
                artifacts.push(this.ParseArtifact(code_block, "code"))
                code_block = ""
            }
            else if ( !in_code && code_block != "")
            {
                artifacts.push(this.ParseArtifact(code_block, "code block"))
                code_block = ""
            }            

            // Images
            if (words[0].charAt(0) == "!" && !in_code)
            {
                artifacts.push(this.ParseArtifact(line, "image"))
            }


            text += line + '\n'
        })

        if(subJSON.name != null)
        {
            subJSON.text = text
            subJSON.artifacts = artifacts

            text = ""
            artifacts = []

            exJSON.rooms.push(subJSON)
            subJSON = {}
        }        
        return exJSON
    }

    ParseArtifact(text, type)
    {
        let artifact = {}
        artifact.type = type

        switch(type)
        {
            case 'image':
                artifact.src = text.substring(text.lastIndexOf("(") + 1, text.lastIndexOf(")"))
                artifact.alt = text.substring(text.lastIndexOf("[") + 1, text.lastIndexOf("]"))
                break
            case 'block quote':
                artifact.text = text
                break
            case 'code':
                artifact.code = text.replace(/`/g, "").replace('\n', '')
                break
            case 'code block':
                let cleaned = text.replace(/`/g, "")
                artifact.lang = cleaned.split("\n")[0]
                artifact.code = cleaned.replace(artifact.lang + '\n', '')
                break
        }
        return artifact
    }

    async GetArtifacts(url)
    {
        const response = await fetch(url, {
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
          });
          this._tree = await response.json()          
          return this._tree
    }

    InstantiateArt(artObj, width)
    {
        let artifact = document.createElement('a-entity')
        let canvas = document.createElement('a-box')

        let artHeight = width < 2.75 ? width : 2.75            

        canvas.setAttribute("height", artHeight)
        canvas.setAttribute("width", width)
        canvas.setAttribute("depth", 0.1)
        canvas.setAttribute("color", "#e4e0d5")
        canvas.setAttribute('material', 'shader: flat; src: url(textures/canvas.jpeg)')
        artifact.appendChild(canvas)

        let htmlEmbed = document.createElement('a-entity')
        htmlEmbed.className = "frame"
        htmlEmbed.setAttribute("htmlembed", "PPU:256")
        htmlEmbed.setAttribute("position", {x: 0, y: 0, z: 0.055})
        let div = document.createElement('div')
        let pre = document.createElement("pre")
        let code = document.createElement("code")

        let artClassNum =  6 - Math.floor(width)

        switch(artObj.type)
        {
            case 'image':
                htmlEmbed.classList.add("img-frame")
                htmlEmbed.setAttribute("id", artObj.alt)
                div.className = "vr-img"
                htmlEmbed.className = "img-frame"
                let image = document.createElement('img')
                image.setAttribute('src', artObj.src)
                div.appendChild(image)
                break
            case 'word art':                    
                div.className = "vr-col-" + artClassNum
                div.innerHTML += artObj.html
                break
            case 'block quote':
                div.className = "vr-col-" + artClassNum
                div.innerHTML += artObj.text
                break
            case 'code':
                div.className = "code"
                code.innerHTML += artObj.code
                pre.appendChild(code)
                div.appendChild(pre)
                break
            case 'code block':
                div.className = "code"
                code.className = "language-" + artObj.lang
                code.innerHTML += artObj.code
                pre.appendChild(code)
                div.appendChild(pre)
                break
        }

        if(AFRAME.utils.device.isMobile())
        {
            let checkpoint = this.InitCheckPoint({x: 0, y: -2, z: 2})
            artifact.appendChild(checkpoint)
        }

        artifact.addEventListener('rendered', () =>{
            let box = new THREE.Box3().setFromObject(htmlEmbed.object3D);
            canvas.setAttribute("height", box.getSize().y)
            canvas.setAttribute("width", Math.floor(box.getSize().z) != 0 ? box.getSize().z : box.getSize().x)
        })

        htmlEmbed.appendChild(div)
        artifact.appendChild(htmlEmbed)

        return artifact

    }

    HangArt(leftWallEntity, rightWallEntity, artifacts)
    {
        let divisor = artifacts.length/2  > 3 ? artifacts.length/2 : 3

        let leftLength = leftWallEntity.getAttribute("width")
        let rightLength = rightWallEntity.getAttribute("width")

        let artWidthLeft = leftLength/divisor
        let artWidthRight = rightLength/divisor

        for (let i = 1; i <= artifacts.length; i++)
        {
            let artObj = artifacts[i-1]
            if (i <= artifacts.length / 2)
            {
                let artifact = this.InstantiateArt(artObj, artWidthLeft)
                leftWallEntity.appendChild(artifact)
                artifact.setAttribute("position",{x:  artWidthLeft * i, y: 2, z: 0.2})
            }
            else
            {
                let artifact = this.InstantiateArt(artObj, artWidthRight)
                rightWallEntity.appendChild(artifact)
                artifact.setAttribute("position",{x:  artWidthRight * (i - artifacts.length/2), y: 2, z: -0.2})
                artifact.setAttribute("rotation", {x: 0, y: 180, z: 0})
            }
        }
    }

    SpiralMuseum(radius)
    {
        this._museum = document.createElement('a-entity')
        this._museum.setAttribute('id', 'museum')
        let pi = Math.PI.toFixed(20)

        let iterator = 0.5
        let divider = iterator * 4.04

        for(let r = 2; r < radius; r+=iterator)
        {
            let r2 = r+iterator

            let radiansA = ((pi/divider)*r).toFixed(20)
            let degreesA = (radiansA * (180/pi)).toFixed(20)
            
            let radiansA2 = ((pi/divider)*r2).toFixed(20)
            let degreesA2 = (radiansA2 * (180/pi)).toFixed(20)

            let x = r * Math.cos(degreesA).toFixed(3)
            let y = r * Math.sin(degreesA).toFixed(3)

            let x2 = r2 * Math.cos(degreesA2).toFixed(3)
            let y2 = r2 * Math.sin(degreesA2).toFixed(3)

            let length = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2))
            let radiansB = -1*Math.atan2(y2 - y, x2 - x)
            let degreesB = radiansB * (180/pi)

            let wall = this.Wall('wall_' + r, length, x, y, degreesB)
            this._museum.appendChild(wall)
        }
        this._scene.appendChild(this._museum)
    }

    build()
    {
        this._museum = document.createElement('a-entity')
        this._museum.setAttribute('id', 'museum')
        this._scene.appendChild(this._museum)
        let rooms = this._tree.rooms
        this._museum.appendChild(this.Wall('north', this._roomWidth, 0, 0, 0))

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
                    roomDepth += (subroom.artifacts.length % 2 ? subroom.artifacts.length - 1: subroom.artifacts.length) * 3
                }
            }
            else
            {
                roomDepth =  room.artifacts.length * 3
            }

            if(roomDepth < this._roomWidth)
            {
                roomDepth += this._roomWidth
            }

            let leftId = 'left_' + roomNum
            let rightId = 'right_' + roomNum
            let leftWall = null
            let rightWall = null

            let lengthr = 0
            let lengthl = 0
            let floorLength = 0

            if (roomNum == 1)
            {
                this.CreateJumpTo(room.name, this._roomWidth/2, 1, 180)                

                if(this.rng() < 0.5) // turn left
                {
                    left++
                    lengthr = roomDepth + (this._roomWidth/2)
                    lengthl = roomDepth - (this._roomWidth/2)
                    floorLength = lengthl
                }
                else // turn right
                {
                    right++
                    lengthr = roomDepth - (this._roomWidth/2)
                    lengthl = roomDepth + (this._roomWidth/2)
                    floorLength = lengthr
                }

                rightWall = this.Wall(rightId, lengthr, xr, zr, rot, "right")
                leftWall = this.Wall(leftId, lengthl, xl, zl, rot)

                rightWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, 0))

                this._museum.appendChild(rightWall)
                this._museum.appendChild(leftWall)

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

                rightWall = this.Wall(rightId, lengthr, xr, zr, rot, "right")
                leftWall = this.Wall(leftId, lengthl, xl, zl, rot)

                if((right == 0 && left < 2) || right >= 2)
                {
                    leftWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, this._roomWidth, 0))
                }
                else
                {
                    rightWall.appendChild(this.floor("floor" + roomNum, this._roomWidth, floorLength, 0, 0, 0))
                }

                this._museum.appendChild(rightWall)
                this._museum.appendChild(leftWall)

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

                this.CreateJumpTo(room.name, jx, jz, rot)
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
                rightWall = this.Wall(rightId, lengthr, xr, zr, rot, "right")
                leftWall = this.Wall(leftId, lengthl, xl, zl, rot)

                this._museum.appendChild(rightWall)
                this._museum.appendChild(leftWall)

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

                let backWall = this.Wall(leftId, this._roomWidth, lastx, lastz, rot - 90)
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
                this._museum.appendChild(backWall)
            }
            this.HangArt(leftWall, rightWall, room.artifacts)
        }
    }

    Wall(id, length, x, z, rotation, leftOrRight = "left")
    {
        let wall = document.createElement('a-entity')
        wall.setAttribute('wall', `length: ${length}; orientation: ${leftOrRight}`)
        wall.setAttribute('id', id)
        wall.setAttribute('width', length)
        wall.setAttribute('position', {x: x, y: 0, z: z})
        wall.setAttribute('rotation', {x: 0, y: rotation, z: 0})
        return wall
    }

    Seperator(id, wallNum, doorWidth, length, x, z, rotation)
    {
        let plaster = document.createElement('a-box')
        let wall = document.createElement('a-entity')

        let doorWay = length - doorWidth

        let doorPos = length

        if (wallNum % 2)
        {
            doorPos += doorWidth
        }
        else
        {
            doorPos -= doorWidth
        }

        plaster.setAttribute('depth', 0.1)
        plaster.setAttribute('height', 3.5)
        plaster.setAttribute('width', doorWay)
        plaster.setAttribute('position', {x: doorPos/2, y: 1.75, z: 0})
        plaster.setAttribute('color', '#f4f2d7')
        plaster.setAttribute('material', 'shader: flat; src: url(textures/wood_sep1.jpg)')
        plaster.setAttribute("shadow", '')
        plaster.setAttribute("class", 'scenery')

        wall.appendChild(plaster)

        wall.setAttribute('id', id)
        wall.setAttribute('position', {x: x, y: 0, z: z})
        wall.setAttribute('rotation', {x: 0, y: rotation, z: 0})

        return wall
    }

    floor(id, width, depth, x, z, rotation)
    {
        let floor = document.createElement('a-entity')
        floor.setAttribute("id", id)
        floor.setAttribute('class', 'scenery')
        floor.setAttribute('floor', `width: ${width}; depth: ${depth}`)

        floor.setAttribute('position', {x: x, y: 0, z: z})
        floor.setAttribute('rotation', {x: 0, y: rotation, z: 0})
        return floor
    }

    ceiling(type = null)
    {
        let ceiling = document.createElement('a-entity')
        ceiling.setAttribute('position', {x: 0, y: 4, z: 0})

        switch(type)
        {
            case null:
                return ceiling
            case 'vaulted':
                let beam_seperation = this._depth / 7
                for(let i = 1; i < 7; i++)
                {
                    let beam = document.createElement('a-box')
                    beam.setAttribute('height', 0.5)
                    beam.setAttribute('depth', 0.2)
                    beam.setAttribute('width', this._width)
                    beam.setAttribute('color', '#d7bd98')
                    beam.setAttribute('material', 'shader: flat; src: url(textures/concrete_floor.jpg)')
                    beam.setAttribute('position', {x: this._width/2, y: -0.25, z: beam_seperation * i})
                    ceiling.appendChild(beam)
                }
                return ceiling
        }  
    }

    InitCheckPoint(position)
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
    }

    CreateJumpTo(roomName, x, z, rotation)
    {
        console.log(roomName, roomName.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g, '-'));
        
        let title = document.getElementById(roomName.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").replace(/ /g, '-'))

        let jumpButton = document.createElement('img')
        jumpButton.setAttribute("src", "img/logo.svg")
        jumpButton.setAttribute("class", "jump")

        jumpButton.addEventListener('click', () => {
            this._rig.setAttribute('position', {x: x, y: 0, z: z})
            this._rig.setAttribute('rotation', {x: 0, y: rotation, z: 0})
            this._scene.enterVR()
        })
        title.appendChild(jumpButton)
    }
}