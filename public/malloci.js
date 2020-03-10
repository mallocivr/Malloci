class Malloci 
{
    constructor(markDown, depth, exWidth)
    {
        this._tree = this.MDtoJSON(markDown)
        //this.GetArtifacts()
        this._width = exWidth * this._tree.rooms.length
        this._depth = depth
        this._scene = document.querySelector("a-scene")
        this._rig = document.getElementById("rig")
        this._camera = document.getElementById("camera")

    }

    GetDevice()
    {
        if(AFRAME.utils.device.isMobile())
        {
            this._rig.setAttribute("movement-controls", "controls: checkpoint")
            this._rig.setAttribute("checkpoint-controls", "mode: teleport")
            let cursor = document.createElement("a-entity")
            cursor.setAttribute("cursor", '')
            cursor.setAttribute("position", {x: 0, y: 0, z: -1})
            cursor.setAttribute("geometry", "primitive: ring; radiusInner: 0.01; radiusOuter: 0.02;")
            cursor.setAttribute("material", "color: #CCC; shader: flat;")
            this._camera.appendChild(cursor)
        }
    }

    MDtoJSON(markDown)
    {
        let exJSON = {}
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
            if (words[0].charAt(0) == "#")
            {
                if(subJSON.name != null)
                {
                    subJSON.text = text
                    subJSON.artifacts = artifacts
            
                    text = ""
                    artifacts = []

                    if(level == "##")
                    {
                        exJSON.rooms.push(subJSON)
                        subJSON = {}
                    }
                    if(level == "###")
                    {
                        exJSON.rooms[exJSON.rooms.length - 1].subRooms.push(subJSON)
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
                level = words.shift()
                if (level == "#")
                {
                    exJSON.name = words.join(" ")
                    exJSON.rooms = []
                }
                if (level == "##")
                {
                    subJSON.name = words.join(" ")
                    subJSON.subRooms = []
                }
                if (level == "###")
                {
                    subJSON.name = words.join(" ")
                }
            }

            // Block Quotes
            if (words[0].charAt(0) == ">")
            {
                block_quote += words.join(" ").replace(">", "").replace(/(^[\s]+|[\s]+$)/, "\n")
                console.log(block_quote);
                                
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
            if (words[0].charAt(0) == "!")
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

            if(level == "##")
            {
                exJSON.rooms.push(subJSON)
                subJSON = {}
            }
            if(level == "###")
            {
                exJSON.rooms[exJSON.rooms.length - 1].subRooms.push(subJSON)
                subJSON = {}
            }
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

    GetArtifacts()
    {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            this._tree = xmlhttp.responseText;
            console.log(this._tree)
        };
        xmlhttp.open("POST","http://127.0.0.1:5000/generate",false);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(this._tree));

    }
    
    InstantiateArtifacts(roomNum, numOfRooms, artifactsArray, roomWidth, roomDepth)
    {

        let room = document.createElement("a-entity")
        room.setAttribute('id', "room_" + roomNum)


        if(roomNum % 2)
        {
            room.setAttribute('position', {x: roomWidth * (roomNum - 1), y: 0, z: 0})
        }
        else
        {
            room.setAttribute('position', {x: roomWidth * roomNum, y: 0, z: roomDepth})
            room.setAttribute('rotation', {x: 0, y: 180, z: 0})
        }
        
        for(let i = 1; i <= artifactsArray.length; i++)
        {
            let artifactObject = artifactsArray[i-1]
            let artifact = document.createElement('a-entity')
            let canvas = document.createElement('a-box')

            let divisor = artifactsArray.length >= 2 ? artifactsArray.length : 2
            let wall_x = 0.1
            let wall_z = 0
            let rot_y = 90

            
            if(i == 1 & roomNum % 2 && roomNum != 1)
            {
                wall_x = roomWidth/2
                wall_z = 0.1
                rot_y = 0
            }
            else if(i == 2 & !(roomNum % 2))
            {
                wall_x = roomWidth/2
                wall_z = 0.1
                rot_y = 0
            }
            else if (i == artifactsArray.length & roomNum % 2)
            {
                wall_x = roomWidth/2
                wall_z = roomDepth - 0.1
                rot_y = 180
            }
            else if (i == artifactsArray.length - 1 & !(roomNum % 2) & roomNum != numOfRooms)
            {
                wall_x = roomWidth/2
                wall_z = roomDepth - 0.1
                rot_y = 180
            }
            else if(i % 2)
            {
                divisor = divisor % 2 ? divisor + 1 : divisor
                wall_z = (roomDepth)/divisor * i
            }
            else
            {
                divisor = divisor % 2 ? divisor - 1 : divisor
                wall_x = roomWidth - 0.1
                wall_z = (roomDepth)/divisor * (i - 1)
                rot_y = -90
            }
            
            let artWidth = roomDepth/divisor <= roomDepth/2 ? roomDepth/divisor : roomDepth/2
            let artHeight = artWidth < 2.75 ? artWidth : 2.75

            artifact.setAttribute("position", {x: wall_x, y: artHeight/2 + 0.5, z: wall_z})
            artifact.setAttribute("rotation", {x: 0, y: rot_y, z: 0})

            canvas.setAttribute("height", artHeight)
            canvas.setAttribute("width", artWidth)
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

            switch(artifactObject.type)
            {
                case 'image':
                    htmlEmbed.classList.add("img-frame")
                    htmlEmbed.setAttribute("id", artifactObject.alt)
                    div.className = "vr-img"
                    htmlEmbed.className = "img-frame"
                    let image = document.createElement('img')
                    image.setAttribute('src', artifactObject.src)
                    div.appendChild(image)
                    break
                case 'block quote':
                    div.className = "vr-col-" + (7 - Math.floor(artWidth))
                    htmlEmbed.setAttribute("id", "block_quote")
                    div.innerHTML += artifactObject.text
                    break
                case 'code':
                    div.className = "vr-col-" + (7 - Math.floor(artWidth))
                    code.innerHTML += artifactObject.code
                    pre.appendChild(code)
                    div.appendChild(pre)
                    break
                case 'code block':
                    div.className = "vr-col-" + (7 - Math.floor(artWidth))
                    code.className = "language-" + artifactObject.lang
                    code.innerHTML += artifactObject.code
                    pre.appendChild(code)
                    div.appendChild(pre)
                    break
            }

            if(AFRAME.utils.device.isMobile())
            {
                let checkpoint = this.InitCheckPoint({x: 0, y: -(artHeight/2 + 0.5), z: 2})
                artifact.appendChild(checkpoint)
            }

            htmlEmbed.addEventListener('rendered', () =>{
                let box = new THREE.Box3().setFromObject(htmlEmbed.object3D);
                canvas.setAttribute("height", box.getSize().y)
                canvas.setAttribute("width", box.getSize().z != 0 ? box.getSize().z : box.getSize().x)
            })

            htmlEmbed.appendChild(div)
            artifact.appendChild(htmlEmbed)

            room.appendChild(artifact)
        }

        this._museum.appendChild(room)
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

    SquareMuseum()
    {
        this._museum = document.createElement('a-entity')
        this._museum.setAttribute('id', 'museum')

        // Build north wall
        this._museum.appendChild(this.Wall('north', this._width, 0, 0, 0))

        // build south wall
        this._museum.appendChild(this.Wall('south', this._width, this._width, this._depth, 180))

        // build west wall
        this._museum.appendChild(this.Wall('west', this._depth, this._width, 0, 270))

        // build east wall
        this._museum.appendChild(this.Wall('east', this._depth, 0, this._depth, 90))

        this._museum.appendChild(this.ceiling('vaulted'))

        this.Partition()

        this._scene.appendChild(this._museum)
    }

    Wall(id, length, x, z, rotation)
    {
        let plaster = document.createElement('a-box')
        let wall = document.createElement('a-entity')

        plaster.setAttribute('depth', 0.1)
        plaster.setAttribute('height', 4)
        plaster.setAttribute('width', length)
        plaster.setAttribute('position', {x: length/2, y: 2, z: 0})
        plaster.setAttribute('color', '#f4f2d7')
        plaster.setAttribute('material', 'shader: flat; src: url(textures/wall2.jpg)')
        plaster.setAttribute("shadow", '')
        wall.appendChild(plaster)

        let beam = document.createElement('a-box')
        beam.setAttribute('height', 0.5)
        beam.setAttribute('depth', 0.3)
        beam.setAttribute('width', length + 0.2)
        beam.setAttribute('color', '#d7bd98')
        beam.setAttribute('material', 'shader: flat; src: url(textures/concrete_floor.jpg)')
        beam.setAttribute('position', {x: length/2, y: 3.75, z: 0})
        wall.appendChild(beam)

        wall.setAttribute('id', id)
        wall.setAttribute('position', {x: x, y: 0, z: z})
        wall.setAttribute('rotation', {x: 0, y: rotation, z: 0})

        return wall
    }

    WallWithDoorWay(id, wallNum, doorWidth, length, x, z, rotation)
    {
        let plaster = document.createElement('a-box')
        let wall = document.createElement('a-entity')

        let doorWay = length - doorWidth

        let doorPos = length

        if (wallNum % 2)
        {
            doorPos -= doorWidth
        }
        else
        {
            doorPos += doorWidth
        }

        plaster.setAttribute('depth', 0.1)
        plaster.setAttribute('height', 4)
        plaster.setAttribute('width', doorWay)
        plaster.setAttribute('position', {x: doorPos/2, y: 2, z: 0})
        plaster.setAttribute('color', '#f4f2d7')
        plaster.setAttribute('material', 'shader: flat; src: url(textures/wall2.jpg)')
        plaster.setAttribute("shadow", '')

        let beam = document.createElement('a-box')
        beam.setAttribute('height', 0.5)
        beam.setAttribute('depth', 0.3)
        beam.setAttribute('width', this._depth)
        beam.setAttribute('color', '#d7bd98')
        beam.setAttribute('material', 'shader: flat; src: url(textures/concrete_floor.jpg)')
        beam.setAttribute('position', {x: this._depth /2, y: 3.75, z: 0})


        wall.appendChild(plaster)
        wall.appendChild(beam)

        wall.setAttribute('id', id)
        wall.setAttribute('position', {x: x, y: 0, z: z})
        wall.setAttribute('rotation', {x: 0, y: rotation, z: 0})

        return wall
    }

    BuildSeperator(id, wallNum, doorWidth, length, x, z, rotation)
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

        wall.appendChild(plaster)

        wall.setAttribute('id', id)
        wall.setAttribute('position', {x: x, y: 0, z: z})
        wall.setAttribute('rotation', {x: 0, y: rotation, z: 0})

        return wall
    }

    floor(width, depth, roomNum)
    {
        let floor = document.createElement('a-plane')
        roomNum--

        floor.setAttribute('position', {x: width/2 + width * roomNum, y: 0, z: depth/2})
        floor.setAttribute('rotation', {x: -90, y: 0, z: 0})
        floor.setAttribute('color', '#d7bd98')
        floor.setAttribute('material', 'shader: flat; src: url(textures/concrete_floor.jpg)')
        floor.setAttribute('width', width)
        floor.setAttribute('height', depth)
        floor.setAttribute('class', 'collidable')
        floor.setAttribute("shadow", '')

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

    initWalkWay(width, depth, roomNum, checkPointsPerRoom)
    {
        roomNum--
        for(let i = 1; i <= checkPointsPerRoom; i++)
        {
            this._museum.appendChild(this.InitCheckPoint({x: width/2 + width * roomNum, y: 0, z: ((depth)/(checkPointsPerRoom * 2)) * i}))
        }
    }

    InitCheckPoint(position)
    {
        let checkpoint = document.createElement('a-cylinder')
        checkpoint.setAttribute("checkpoint", '')
        checkpoint.setAttribute("height", 0.01)
        checkpoint.setAttribute("radius", 0.4)
        checkpoint.setAttribute('position', position)
        return checkpoint
    }

    Partition()
    {
        let rooms = this._tree.rooms
        let cor_width = this._width / rooms.length        

        for(let roomNum = 1; roomNum <= rooms.length; roomNum++)
        {
            let room = rooms[roomNum-1]
            let subrooms = room.subRooms
            let cor_depth = this._depth / subrooms.length

            if (roomNum < rooms.length)
            {
                let wallID = room.name.replace(" ", '_') + "_west_wall"
                let roomWall = this.WallWithDoorWay(wallID, roomNum, 4, this._depth, cor_width * roomNum, 0, 270)
                this._museum.appendChild(roomWall)
            }

            this.InstantiateArtifacts(roomNum, rooms.length, room.artifacts, cor_width, this._depth)
            
            let roomFloor = this.floor(cor_width, this._depth, roomNum)
            this._museum.appendChild(roomFloor)

            if(AFRAME.utils.device.isMobile())
            {
                this.initWalkWay(cor_width, this._depth, roomNum, 2)
            }
            for(let subRoomNum = 1; subRoomNum < subrooms.length; subRoomNum++)
            {
                let subroom = subrooms[subRoomNum-1]

                let subWallID = subroom.name.replace(" ", '_') + "_south_wall"
                let subRoomWall = this.BuildSeperator(subWallID, subRoomNum, 3, cor_width, cor_width * roomNum, cor_depth * subRoomNum, 180)
                this._museum.appendChild(subRoomWall)
            }

        }
        
    }
}