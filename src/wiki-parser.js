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

// To include linked images in markdown use parseFull
wiki.parseFull("Spain", 10, function(markDown){
  // do something with the markdown
  console.log(markDown);
})


*/

class WikiParser {
  constructor() {
    this.api = "https://en.wikipedia.org/w/api.php";
    this.fetchUrl = this.api + "?origin=*&action=parse&prop=text&format=json&page="
    
    this.redirectCount = 0;
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
    console.log(url)
    fetch(url)
      .then(function(response){return response.json();})
      .then(function(response) {
        // console.log(response);
        onready(response)
      })
      .catch(function(error){console.log(error);});
  }
  
  parse(page, maxRooms, maxImages, onready) {
    var self = this;
    fetch(this.fetchUrl+page)
      .then(function(resp) { return resp.json();})
      .then(function(data) {

      var html = '<body>' + data.parse.text['*'] + '</body>'
      
      self.htmlToMd(data.parse.title, html, maxRooms, false, maxImages)
      onready(self.md.join("\n\n"));
    });
  }
  
  parseFull(page, maxRooms, maxImages, onready) {
    var self = this;
    fetch(this.fetchUrl+page)
      .then(function(resp) { return resp.json();})
      .then(function(data) {

      var html = '<body>' + data.parse.text['*'] + '</body>'
      var redirectPage = self.check_redirect(html);
      if (redirectPage == null) {
        self.htmlToMd(data.parse.title, html, maxRooms, true, maxImages)
        self.waitForImages(10, onready) // wait up to 10 seconds for Images
      }else{
        if (redirectPage != page && self.redirectCount<5) { // don't get stuck ininfinite redirect loop
          self.redirectCount++;
          self.parseFull(redirectPage, maxRooms, maxImages, onready);
        } else {
          onready("") // got nothing to do here
        }
      }
    });
  }
  
  check_redirect(html) {
    var parser = new DOMParser();
    var document = parser.parseFromString(html,"text/xml");
    
    // check for redirects
    try {
      var div = document.getElementsByClassName("redirectMsg")
      if (div.length > 0) {
        div = div[0]
        var link = div.getElementsByTagName("a")
        var redirectPage = link[0].getAttribute('href').replace('/wiki/', '')
        console.log("found redirect wiki page: " + redirectPage) 
        return redirectPage;
      }
     } catch(err){
      return null;
     }
  }
  
  page_summary(pageName, onready) {
    if (pageName==null){return {}}
    var url = "https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(pageName.replace(/ /g, '_'));
    //console.log(url)
    fetch(url)
      .then(function(response){return response.json();})
      .then(function(response) {
        // console.log(response);
        onready(response)
      })
      .catch(function(error){console.log(error);});
  }
  
  cleanText(text) {
    // remove citations eg: [10], [1][2]
    text = text.replace(/ *\[[^\]]*\]/g, '')
    
    // remove extra spaces
    text = text.replace(/\s+/, ' ')
    text = text.replace(/^\s+|\s+$/g, '')
    
    return text
  }
  
 htmlToMd(title, html, maxRooms, parseImages, maxImages) {
    // Input: HTML string
    // Returns: array of markdown strings
    
    var numRooms = 1; // control the number of rooms in the exhibit
    
    var numImages = 0;
    if (maxImages == null) {maxImages = 500;}
    
    
    this.waitForImage = 0;
    this.imgPlaceholder = {};
    var md = ["# " +title]
    this.md = md;
    
    var parser = new DOMParser();
    var document = parser.parseFromString(html,"text/xml");
    
    var content = document.getElementsByClassName("mw-parser-output")

    // check number of images in article
    // if find less than maImages - can insert some linked images
    var articleImgs = content[0].getElementsByClassName("thumbcaption")
    var extraImages = maxImages - articleImgs.length
    console.log("can get "+extraImages + " extra images");
    
    
    var children = content[0].childNodes
    for (var i = 0; i < children.length; i++)  {
            
      var node = children[i];
      
      if (node.className == "mw-empty-elt") {
        continue
      }
      // plain text
      if (node.nodeName == "p") {
        // watch for stupid coordinates
        if (node.textContent.startsWith("Coordinates: ")){continue;}
        
        md.push(this.cleanText(node.textContent))
        
        if (!parseImages) { continue; }
        
        // look for links with images
        var links = node.getElementsByTagName("a");
        for (var linkId = 0; linkId < links.length; linkId++) {
          // dont fecth more images if already maxed out
          if (numImages >= maxImages){break;}
          
          var el = links[linkId]
          var pageName = el.getAttribute("title");
          
          // Get out before its too late!
          // (to escape with prob 0.5 can use || Math.random() < 0.5)
          if (pageName == null || el.className == "new" || pageName == "Geographic coordinate system") {continue}
          
          // Grab an image, if possible
          // - push placeholder to the md array
          // - once the image comes back from wiki- will replace the placeholder entry
          // - if there is an error - the placeholder will be removed in waitForImages
          var imgIdx = md.length;
          if (pageName in this.imgPlaceholder) {
            // already got this image earlier!
            continue
          }
          this.imgPlaceholder[pageName] = imgIdx;
          //console.log('placeholder for ' + pageName + ' at idx ' + imgIdx)
          this.waitForImage++;
          md.push("~\n!["+pageName+"](placeholder)\n~")

          // ask Wiki for image please
          var self = this;
          this.page_summary(pageName, function(response){
            //console.log(response);
            if ('originalimage' in response) {
              //console.log('updating artifact ' + response.title + ' ' + self.imgPlaceholder[response.title])
              
              var size = Math.min(response.originalimage.height, response.originalimage.width);
              if (size > 400) { // only want large images
              
                var caption = response.title;

                if ('extract' in response) {
                  // make caption the first sentese of the description
                  caption = response.extract
                  caption = caption.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")[0]
                }                
                self.md[self.imgPlaceholder[response.title]] = "~\n!["+caption+"]("+response.originalimage.source+"){"+(extraImages > 0 ? 1 : 2)+"}\n~";
                delete self.imgPlaceholder[response.title]; // remove from queue
                extraImages--;
              }
              
            }
            self.waitForImage--; // remove from queue
          }); 
          
          numImages++;
        }
        
      }
      
      // headers
      else if (node.nodeName.startsWith("h")) {
        var header = this.cleanText(node.textContent)
        // if reached References - time to peace out
        // TODO also "see also" and "notes"
        if (header == "References" ||
            header == "See also" ||
            header == "Notes") {
            break;
        }
        
        // also if parsed too many images already - 
        // don't parse any new rooms
        /* if (numImages >= maxImages){break;} */
        numImages = 0 // reset image count
        
        // dont parse more than maxRooms
        numRooms++;
        if (maxRooms != null && numRooms > maxRooms) {
          break;
        }
        
        var pref = "#".repeat(parseInt(node.nodeName.charAt(1)))
        md.push(pref + " " + header)
      }
      
      // images
      else if (node.nodeName === "div" && node.className.includes("thumb")) {
      
        // dont fecth more images if already maxed out
        if (numImages >= maxImages){continue;}
          
        var images = node.getElementsByTagName("img")
        var captions = node.getElementsByClassName("thumbcaption")
        
        for (var j = 0; j < images.length; j++) {
          var w = images[j].getAttribute('data-file-width') // max width of image
          var src = "https:" + images[j].getAttribute('src').replace(/\d+px/, w+'px')
          //md.push("!["+this.cleanText(captions[j].textContent)+"]("+src+")")
          md.push("!["+this.cleanText(captions[j] ? captions[j].textContent : "") +"]("+src+"){1}")
          numImages++;
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
  
  waitForImages(limit, onready) {
    /*
      Waits for the image queue to empty before
      returning parsed MarkDown to client.
      
      LIMIT: max time in seconds to wait
      ONREADY: claccback to trigger once everything id ready
    */
    var self = this
    console.log("waiting: " + limit)
    if (this.waitForImage > 0 && limit > 0){
      // waaaait for ittttttt
      setTimeout(function(){self.waitForImages(limit-2, onready)}, 2000);
    }
    else {
      // delete all remaining placeholders
      var removeIdx =[]
      for (const key in this.imgPlaceholder) {
        removeIdx.push(this.imgPlaceholder[key])
      }
      removeIdx.sort(function(a,b){ return b - a; });
      console.log(removeIdx)
      for (var i = 0; i < removeIdx.length; i++) {
        this.md.splice(removeIdx[i],1);
      }
      
      onready(this.md.join("\n\n"));
    }
  }
}