export default class VRMD
{
    constructor(VSCode = null, debug = false)
    {
        this.VSCode = VSCode
        this.debug = debug
        this.tree = null
        this.cleanedMD = null
    }

    parseList(mdListString)
    {
        
        let exJSON = {}
        exJSON.rooms = []
        exJSON.theme = {floor: null, walls: null, ceiling: null}

        let subJSON = {}
        let artifacts = []

        let level = ""
        let text = ""

        let block_quote = ""
        let code_block = ""

        let in_code = false

        let hidden_block = false

        let mdLines = mdListString.split(',')


        for(let i = 0; i < mdLines.length; i++)
        {      
            let line = mdLines[i]
            let words = line.split(" ")            

            // Headings
            if (words[0].charAt(0) === "#" && !in_code)
            {
                // if(words[0].includes("###")) 
                //     continue

                level = words.shift()

                if(subJSON.name !== null)
                {
                    subJSON.text = text
                    subJSON.artifacts = artifacts
            
                    text = ""
                    artifacts = []

                    // if(level === "#" || level === "##")
                    // {
                    exJSON.rooms.push(subJSON)
                    subJSON = {}
                    // }
                }
                else if (text !== "")
                {
                    exJSON.text = text
                    exJSON.artifact = artifacts

                    text = ""
                    artifacts = []
                }
                if (level === "#")
                {
                    exJSON.name = words.join(" ")
                }
                subJSON.name = words.join(" ")
            }

            // Block Quotes
            if (words[0].charAt(0) === ">" && !in_code)
            {
                block_quote += words.join(" ").replace(">", "").replace(/(^[\s]+|[\s]+$)/, "\n")                                
            }
            else if (block_quote !== "")
            {
            artifacts.push(this.parseArtifact(block_quote, "block quote"))
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
            else if (code_block === "" && words[0].charAt(0) === "`")
            {
                code_block += line + '\n'
                artifacts.push(this.parseArtifact(code_block, "code"))
                code_block = ""
            }
            else if ( !in_code && code_block !== "")
            {
                artifacts.push(this.parseArtifact(code_block, "code block"))
                code_block = ""
            }            

            // Images
            if (words[0].charAt(0) === "!" && !in_code)
            {
                artifacts.push(this.parseArtifact(line, "image"))
            }

            // VRMD EXTENDED SYNTAX
            // Theme
            if (words[0].charAt(0) === "$" && !in_code)
            {
                let field = line.substring(line.lastIndexOf("[") + 1, line.lastIndexOf("]"))
                let textureSrc = line.substring(line.lastIndexOf("(") + 1, line.lastIndexOf(")"))

                switch (field) {
                    default:
                        break
                    case 'floor':
                        exJSON.theme.floor = textureSrc
                        break
                    case 'walls':
                        exJSON.theme.walls = textureSrc
                        break
                    case 'ceiling':
                        exJSON.theme.ceiling = textureSrc
                        break
                }
                mdLines.splice(i, 1)
                --i
            }
            //3D models (.GLTF)
            if (words[0].charAt(0) === "&" && !in_code)
            {
                artifacts.push(this.parseArtifact(line, "3D"))
                mdLines.splice(i, 1)
                --i
            }
            // Audio
            if (words[0].charAt(0) === "^" && !in_code)
            {
                this.addAudio(artifacts, line)
                mdLines.splice(i, 1)
                --i
            }
            // Hidden Artifact
            if (words[0] === "~" && !in_code)
            {
                hidden_block = !hidden_block
            }

            if (hidden_block || (words[0] === "~" && !in_code))
            {
                mdLines.splice(i, 1)
                --i
            }

            if(this.debug)
            {
                console.log(artifacts);
            }

            text += line + '\n'
        }

        if(subJSON.name !== null)
        {
            subJSON.text = text
            subJSON.artifacts = artifacts

            text = ""
            artifacts = []

            exJSON.rooms.push(subJSON)
            subJSON = {}
        }        
        this.tree = exJSON
        this.cleanedMD = mdLines.join('\n')
        
        return this.tree
    }

    parse(markDown)
    {
        console.log("parsing");        
        
        let exJSON = {}
        exJSON.rooms = []
        exJSON.theme = {floor: null, walls: null, ceiling: null}

        let subJSON = {}
        let artifacts = []

        let level = ""
        let text = ""

        let block_quote = ""
        let code_block = ""

        let in_code = false

        let hidden_block = false

        let mdLines = markDown.split('\n')

        for(let i = 0; i < mdLines.length; i++)
        {      
            let line = mdLines[i]
            let words = line.split(" ")                        

            // Headings
            if (words[0].charAt(0) === "#" && !in_code)
            {
                // if(words[0].includes("###")) 
                //     continue

                level = words.shift()

                if(subJSON.name !== null)
                {
                    subJSON.text = text
                    subJSON.artifacts = artifacts
            
                    text = ""
                    artifacts = []

                    // if(level === "#" || level === "##")
                    // {
                        exJSON.rooms.push(subJSON)
                        subJSON = {}
                    // }
                }
                else if (text !== "")
                {
                    exJSON.text = text
                    exJSON.artifact = artifacts

                    text = ""
                    artifacts = []
                }
                if (level === "#")
                {
                    exJSON.name = words.join(" ")
                }
                subJSON.name = words.join(" ")
            }            

            // Block Quotes
            if (words[0].charAt(0) === ">" && !in_code)
            {                
                block_quote += words.join(" ").replace(">", "").replace(/(^[\s]+|[\s]+$)/, "\n")                                
            }
            else if (block_quote !== "")
            {
                artifacts.push(this.parseArtifact(block_quote, "block quote"))
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
            else if (code_block === "" && words[0].charAt(0) === "`")
            {
                code_block += line + '\n'
                artifacts.push(this.parseArtifact(code_block, "code"))
                code_block = ""
            }
            else if ( !in_code && code_block !== "")
            {
                artifacts.push(this.parseArtifact(code_block, "code block"))
                code_block = ""
            }            

            // Images
            if (words[0].charAt(0) === "!" && !in_code)
            {
                artifacts.push(this.parseArtifact(line, "image"))
            }

            // VRMD EXTENDED SYNTAX
            // Theme
            if (words[0].charAt(0) === "$" && !in_code)
            {
                let field = line.substring(line.lastIndexOf("[") + 1, line.lastIndexOf("]"))
                let textureSrc = line.substring(line.lastIndexOf("(") + 1, line.lastIndexOf(")"))

                if(this.VSCode && !(/^(?:\/|[a-z]+:\/\/)/.test(textureSrc)))
                { 
                    textureSrc = this.VSCode + textureSrc
                }

                switch (field) {
                    default:
                        break
                    case 'floor':
                        exJSON.theme.floor = textureSrc
                        break
                    case 'walls':
                        exJSON.theme.walls = textureSrc
                        break
                    case 'ceiling':
                        exJSON.theme.ceiling = textureSrc
                        break
                }
                mdLines.splice(i, 1)
                --i
            }
            //3D models (.GLTF)
            if (words[0].charAt(0) === "&" && !in_code)
            {
                artifacts.push(this.parseArtifact(line, "3D"))
                mdLines.splice(i, 1)
                --i
            }
            // Audio
            if (words[0].charAt(0) === "^" && !in_code)
            {
                this.addAudio(artifacts, line)
                mdLines.splice(i, 1)
                --i
            }
            // Hidden Artifact
            if (words[0] === "~" && !in_code)
            {
                hidden_block = !hidden_block
            }

            if (hidden_block || (words[0] === "~" && !in_code))
            {
                mdLines.splice(i, 1)
                --i
            }

            text += line + '\n'
        }

        if(subJSON.name !== null)
        {
            if (block_quote !== "")
            {
                artifacts.push(this.parseArtifact(block_quote, "block quote"))
                block_quote = ""
            }
            if (code_block !== "")
            {
                artifacts.push(this.parseArtifact(code_block, "code block"))
                code_block = ""
            }
            subJSON.text = text
            subJSON.artifacts = artifacts

            text = ""
            artifacts = []

            exJSON.rooms.push(subJSON)
            subJSON = {}
        }        
        this.tree = exJSON
        this.cleanedMD = mdLines.join('\n')
        
        return this.tree
    }

    parseArtifact(text, type)
    {        
        let artifact = {}
        artifact.type = type
        artifact.audioSrc = null

        switch(type)
        {
            default:
                break
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
            case '3D':
                artifact.src = text.substring(text.lastIndexOf("(") + 1, text.lastIndexOf(")"))
                artifact.name = text.substring(text.lastIndexOf("[") + 1, text.lastIndexOf("]"))
                break
        }

        if(this.VSCode && artifact.src && !(/^(?:\/|[a-z]+:\/\/)/.test(artifact.src)))
        {             
            artifact.src = this.VSCode + artifact.src
        }
        return artifact
    }

    addAudio(artifacts, audio)
    {
        artifacts[artifacts.length - 1].audioSrc = audio.substring(audio.lastIndexOf("(") + 1, audio.lastIndexOf(")"))

        if(this.VSCode && !(/^(?:\/|[a-z]+:\/\/)/.test(artifacts[artifacts.length - 1].audioSrc)))
        {
            artifacts[artifacts.length - 1].audioSrc = this.VSCode + artifacts[artifacts.length - 1].audioSrc
        }
    }
}

