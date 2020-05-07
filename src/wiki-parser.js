/* 

let wiki = new WikiParser()

// Search wiki pages
wiki.search("Memory", 10, function(response){
  console.log(response);
}) 

// Parse wiki page into markdown
wiki.parse("University_of_California,_Berkeley", function(markDown){
  console.log(markDown);
}) 


*/

class WikiParser {
  constructor() {
    this.api = "https://en.wikipedia.org/w/api.php";
    this.fetchUrl = this.api + "?origin=*&action=parse&prop=text&format=json&page="
  }
    
  search(query, limit, onready) {
    var params = {
      action: "opensearch",
      list: "search",
      search: query,
      format: "json",
      limit: limit
    };

    var url = this.api + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    fetch(url)
      .then(function(response){return response.json();})
      .then(function(response) {
        // console.log(response);
        onready(response)
      })
      .catch(function(error){console.log(error);});
  }
  
  parse(page, onready) {
    var self = this;
    fetch(this.fetchUrl+page)
      .then(function(resp) { return resp.json();})
      .then(function(data) {

      var html = '<body>' + data.parse.text['*'] + '</body>'
      var md = ["# " + data.parse.title]
      md = md.concat(self.htmlToMd(html))
      md = md.join("\n\n")

      onready(md);
    });
  }
  
  cleanText(text) {
    // remove citations eg: [10], [1][2]
    text = text.replace(/ *\[[^\]]*\]/g, '')
    
    // remove extra spaces
    text = text.replace(/\s+/, ' ')
    text = text.replace(/^\s+|\s+$/g, '')
    
    return text
  }
  
  htmlToMd(html) {
    // Input: HTML string
    // Returns: array of markdown strings
    
    var md = []
    
    var parser = new DOMParser();
    var document = parser.parseFromString(html,"text/xml");
    
    var content = document.getElementsByClassName("mw-parser-output")
    var children = content[0].childNodes
    for (var i = 0; i < children.length; i++)  {
      var node = children[i];
      
      if (node.className == "mw-empty-elt") {
        continue
      }
      // plain text
      if (node.nodeName == "p") {
        md.push(this.cleanText(node.textContent))
      }
      
      // headers
      else if (node.nodeName.startsWith("h")) {
        var header = this.cleanText(node.textContent)
        // if reached References - time to peace out
        if (header == "References") {
            break;
        }
        var pref = "#".repeat(parseInt(node.nodeName.charAt(1)))
        md.push(pref + " " + header)
      }
      
      // images
      else if (node.nodeName === "div" && node.className.includes("thumb")) {
        var images = node.getElementsByTagName("img")
        var captions = node.getElementsByClassName("thumbcaption")
        
        for (var j = 0; j < images.length; j++) {
          var w = images[j].getAttribute('data-file-width') // max width of image
          var src = "https:" + images[j].getAttribute('src').replace(/\d+px/, w+'px')
          md.push("!["+this.cleanText(captions[j].textContent)+"]("+src+")")
        }
      }
      
      // lists
      else if (node.nodeName == "ol" || node.nodeName == "ul") {
        var isOrdered = node.nodeName == "ol"
        var items = node.getElementsByTagName("li")
        var listMD = []
        for (var l = 0; l < items.length; l++ ){
          var bullet = isOrdered ? ((l+1)+".") : "*";
          listMD.push(bullet + " " + this.cleanText(items[l].textContent))
        }
        md.push(listMD.join("\n"))
      }
      
    }
    
    return md
  }
}