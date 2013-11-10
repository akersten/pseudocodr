function visualizerObject() {
//Name of the canvas element in our HTML markup.
var canvasName = 'mainCanvas';

//Context for the main canvas, Should be safe to draw to since we call
//initCanvas right away.
var context;

//The width and height will be determined by reading their HTML attributes.
var canvasWidth, canvasHeight, centerX, centerY;

//Local mouse positions within the canvas.
var mouseX = 0, mouseY = 0;

//Setup yet?
var inited = false;

//The root node that we'll be drawing from.
var rootN;

//X and Y offsets for dragging...
var xOff = 0;
var yOff = 0;

/**
 * Creates the canvas context and assigns it to the 'global' variable context.
 * Call once only once per page load please.
 *
 * Also loads our images into memory.
 */
function initEverything() {
    var element = document.getElementById(canvasName);

    if (element.getContext) {
        context = element.getContext('2d');

        //Determine width and height for local use.
        canvasWidth = element.getAttribute('width');
        canvasHeight = element.getAttribute('height');

        centerX = canvasWidth / 2;
        centerY = canvasHeight / 2;

        //Load the images.
        //imgBorderNormal = new Image();
        //imgBorderNormal.src = "res/border_normal.png";
        repaint();
        inited = true;
    } else {
        alert('This browser doesn\'t support HTML5, sorry!');
    }
}

/**
 * Fills the background considering current circumstances.
 */
function paintBackground() {
    //Default. Paint the background black.
    context.fillStyle = "#010101";
    
    context.beginPath();
    context.rect(0, 0, canvasWidth, canvasHeight);
    context.closePath();
    context.fill();
}

/**
 * What we'll probably be calling every update.
 *
 */
function repaint() {
    //Clear the background first, don't want any remnants left in places we
    //forgot to repaint.
    paintBackground();

    //Draw logic here...
    if (rootN != null) {
        rootN.posX = 0;
        rootN.posY = 0;
        //Need to calculate sizes!
        //And draw from there...
        drawNodeRecurse(rootN);
    }
}

/**
 * Called by the onmousemove attribute of the canvas - keeps the local mouse
 * position up to date, and then repaints the screen to reflect any changes.
 */
function updateMousePosition(event) {
    if (!inited) {
        return;
    }

    //From stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
    if (event.offsetX) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    } else if(event.layerX) {
        mouseX = event.layerX;
        mouseY = event.layerY;
    }
    //End from ----------------------------------------------------------------

    repaint();

    context.fillStyle = "#696900";
    context.beginPath();
    context.rect(mouseX - 5, mouseY - 5, 10, 10);
    context.closePath();
    context.fill();
}


function mouseClicked() {

}

/**
 * Sets the root node and recursively draws its children...
 * @returns {undefined}
 */
function setRootNode(rootnode) {
    rootN = rootnode;
 //   thereWasANodeUpdate();
}

/**
 * Call when you change a node so the entire tree is recalculated starting from the
 * root node...
 * @returns {undefined}
 */
function thereWasANodeUpdate() {
     //Calculate node positions...
     calculateNodeSizesAndPositions(rootN);
    //and rewdraw everything!
    repaint();
}

var CHILD_INDENT = 24;
var INTERNODE_SPACING = 12;
var FONT_SIZE = 12;

function calculateNodeSizesAndPositions(node) {
    /*
     * philosophy: starting from the root, we don't know how big the container
     * has to be. traverse its children until hitting a node with no children
     * and calculate back up the sizes by setting them
     */
    
    if (node.childBlockObjects.length != 0) {
        //Reset this node's height since it's getting recalculated.
        node.height = INTERNODE_SPACING;
        
        for (var i = 0; i < node.childBlockObjects.length; i++) {
            //We know that the child will have to be indented from the parent.
            node.childBlockObjects[i].posX = node.posX + CHILD_INDENT;
            
            if (i === 0) {
                //Set the first node to start at the Y of this node and down a bit...
                node.childBlockObjects[i].posY = node.posY + INTERNODE_SPACING;
            }
            
            //Have the node find its height and width...
            calculateNodeSizesAndPositions(node.childBlockObjects[i]);
           
           
           if (i + 1 < node.childBlockObjects.length) {
               //Set the next child's height to start after this one...
               node.childBlockObjects[i+1].posY = node.childBlockObjects[i].posY + node.childBlockObjects[i].height + INTERNODE_SPACING;
           }
           
           //Coming up from the child, let's recalculate our own height...
           node.height += node.childBlockObjects[i].height + INTERNODE_SPACING;
        }
    } else {
        //Base case, need to tell the parent how big we are..
        //Calculate the width as the widest line in our content...
        var max = 0;
        for (var i = 0; i < node.content.length; i++) {
            if (node.content[i].length > max) {
                max = node.content[i].length;
            }
        }
        
        //multiply by width and height of the font...
        node.width = max * FONT_SIZE;
        
        //Height is the number of lines...
        node.height = node.content.length * FONT_SIZE;
    }    
    
}

/**
 * The sizes of these nodes have already been calculated by calculateNodeSizesAndPositions(),
 * so be sure to call thereWasANodeUpdate() whenever stuff changes!
 * 
 * @param {type} node
 * @returns {undefined}
 */
function drawNodeRecurse(node) {
    //draw each node
    context.fillStyle = node.bgColor;

    context.beginPath();
    context.rect(node.posX, node.posY, node.width, node.height);
    context.closePath();
    context.fill();
    
    //and all of its children inside
    if (node.childBlockObjects != null) {
        for (var i = 0; i < node.childBlockObjects.length; i++) {
           drawNodeRecurse(node.childBlockObjects[i]);
        }
    }
}


//Object function prototyping.
this.mouseClicked = mouseClicked;
this.updateMousePosition = updateMousePosition;
this.repaint = repaint;
this.paintBackground = paintBackground;
this.initEverything = initEverything;
this.setRootNode = setRootNode;
this.thereWasANodeUpdate = thereWasANodeUpdate;

}

var visualizer = new visualizerObject();