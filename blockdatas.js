function blockObject(title, content, bgColor, childBlockObjects) {
    this.title = title;
    this.bgColor = bgColor;
    
    //Array of children contained in here..
    this.childBlockObjects = childBlockObjects;
    if (childBlockObjects == null) {
        this.childBlockObjects = [];
    }
    
    this.content = content;
    if (content == null) {
        this.content = [];
    }
    //These fields are generated by the code in visualizer and injected back
    //into this node object. Don't change them!
    this.posX = 0;
    this.posY = 0;
    this.width = 25;
    this.height = 0;
    
}