class Malloci 
{
    constructor(markDown, depth)
    {
        this._tree = this.MDtoJSON(markDown)
        this._width = 5 * this._tree.rooms.length
        this._depth = depth
        this._scene = document.querySelector("a-scene")

    }

    MDtoJSON(markDown)
    {
        console.log(markDown);

        let exJSON = {}
        let subJSON = {}
        let level = ""
        let text = ""

        let mdLines = markDown.split('\n')

        mdLines.forEach(line => {
            
            let words = line.split(" ")

            if (words[0].charAt(0) == "#")
            {
                if(subJSON.name != null)
                {
                    subJSON.text = text
                    text = ""
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
                    text = ""
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
                text += line + '\n'
        })

        if(subJSON.name != null)
        {
            subJSON.text = text
            text = ""
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

        let floor = document.createElement('a-plane')

        floor.setAttribute('position', {x: this._width/2, y: 0, z: this._depth/2})
        floor.setAttribute('rotation', {x: -90, y: 0, z: 0})
        floor.setAttribute('color', '#7BC8A4')
        floor.setAttribute('width', this._width)
        floor.setAttribute('height', this._depth)
        floor.setAttribute('class', 'collidable')

        this._scene.appendChild(floor)

        this.Partition()

        this._scene.appendChild(this._museum)
    }

    Wall(id, length, x, z, rotation)
    {
        let plaster = document.createElement('a-box')
        let wall = document.createElement('a-entity')

        plaster.setAttribute('depth', 0.1)
        plaster.setAttribute('height', 3)
        plaster.setAttribute('width', length)
        plaster.setAttribute('position', {x: length/2, y: 1.5, z: 0})
        plaster.setAttribute('color', '#EDEDED')

        wall.appendChild(plaster)

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
        plaster.setAttribute('height', 3)
        plaster.setAttribute('width', doorWay)
        plaster.setAttribute('position', {x: doorPos/2, y: 1.5, z: 0})

        wall.appendChild(plaster)

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
        plaster.setAttribute('height', 3)
        plaster.setAttribute('width', doorWay)
        plaster.setAttribute('position', {x: doorPos/2, y: 1.5, z: 0})

        wall.appendChild(plaster)

        wall.setAttribute('id', id)
        wall.setAttribute('position', {x: x, y: 0, z: z})
        wall.setAttribute('rotation', {x: 0, y: rotation, z: 0})

        return wall
    }

    JumpTo(sectionHeader)
    {

    }

    Partition()
    {
        let rooms = this._tree.rooms
        let cor_width = this._width / rooms.length
        console.log("Hall width: " + cor_width);
        

        for(let roomNum = 1; roomNum < rooms.length; roomNum++)
        {
            let room = rooms[roomNum-1]
            let subrooms = room.subRooms
            let cor_depth = this._depth / subrooms.length

            let wallID = room.name.replace(" ", '_') + "_west_wall"
            let roomWall = this.WallWithDoorWay(wallID, roomNum, 2, this._depth, cor_width * roomNum, 0, 270)

            this._museum.appendChild(roomWall)

            for(let subRoomNum = 1; subRoomNum < subrooms.length; subRoomNum++)
            {
                let subroom = subrooms[subRoomNum-1]

                let subWallID = subroom.name.replace(" ", '_') + "_south_wall"
                let subRoomWall = this.BuildSeperator(subWallID, subRoomNum, 2, cor_width, cor_width * roomNum, cor_depth * subRoomNum, 180)
                this._museum.appendChild(subRoomWall)
            }

        }
        
    }
}