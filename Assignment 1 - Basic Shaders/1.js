"use strict";

var gl;

var points = [];
var program;

var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;

var squareVertexPositionBuffer;
var squareVertexColorBufferG;
var squareVertexColorBufferB;

var circlePoints = [];
var circleVertexColorBuffer;
var circleVertexPositionBuffer;


var lockedLoc;
var thetaLoc;
var theta = 0.0;

window.onload = function init()
{

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
   
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    program.vertexPositionAttribute = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);

    program.vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
    gl.enableVertexAttribArray(program.vertexColorAttribute);

    lockedLoc = gl.getUniformLocation(program, "locked");
    gl.uniform1f(lockedLoc, 0.0);

    thetaLoc = gl.getUniformLocation(program, "theta");
    gl.uniform1f(thetaLoc, theta);

    gl.clearColor(0.0, 0.0, 0.0, 1.0 );


    render();
}


function initTriangleBuffers() {

    var vertices = [
        -0.5,  -0.4,
        -0.7, -0.8,
        -0.3, -0.8
    ];

    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];

    // create triangle buffer
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 2;
    triangleVertexPositionBuffer.numItems = 3;

    // create color data
    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = 3;

}


function initSquareBuffers() {

    var vertices = [
        -0.34,  0.37,
        0.33, 0.37,
        -0.34, -0.3,
        0.33, -0.3
    ];

    var colorsG = [
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ];
    var colorsB = [
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0
    ];

    var colorVar = 0;

    //create the position buffer
    squareVertexPositionBuffer = gl.createBuffer();

    // create color data Green
    squareVertexColorBufferG = gl.createBuffer();

    // create color data Black
    squareVertexColorBufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferB);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsB), gl.DYNAMIC_DRAW);
    squareVertexColorBufferB.itemSize = 4;
    squareVertexColorBufferB.numItems = 4;


    for (var i = 0; i < 20; i++) {
        // change the position buffer each time
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);
        squareVertexPositionBuffer.itemSize = 2;
        squareVertexPositionBuffer.numItems = 4;

        gl.vertexAttribPointer(program.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // change color buffer each time
        if (colorVar == 0) {
            gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferG);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsG), gl.DYNAMIC_DRAW);
            squareVertexColorBufferG.itemSize = 4;
            squareVertexColorBufferG.numItems = 4;
            gl.vertexAttribPointer(program.vertexColorAttribute, squareVertexColorBufferG.itemSize, gl.FLOAT, false, 0, 0);    

            colorsG[1] -= 0.08;
            colorsG[5] -= 0.08;
            colorsG[9] -= 0.08;
            colorsG[13] -= 0.08;

            colorVar = 1;
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferB);
            gl.vertexAttribPointer(program.vertexColorAttribute, squareVertexColorBufferB.itemSize, gl.FLOAT, false, 0, 0);    

            colorVar = 0;
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);

        vertices[0] += 0.0165;
        vertices[1] -= 0.0165;
        vertices[2] -= 0.0165;
        vertices[3] -= 0.0165;
        vertices[4] += 0.0165;
        vertices[5] += 0.0165;
        vertices[6] -= 0.0165;
        vertices[7] += 0.0165;

    }
}

function initCircleBuffers () {

    var colors = [];

    var numDivides = 723;
    var centerX = 0.6;
    var centerY = 0.6;
    var radius = 0.28;
    var X;
    var Y;

    for (var i = 1; i <= numDivides; i++) {

        X = (radius * Math.sin((i * Math.PI/180.0)));
        Y = (radius * Math.cos((i * Math.PI/180.0)));
        circlePoints.push(X+centerX, Y+centerY);
        circlePoints.push(centerX, centerY);

    }

    // set up color
    var colorVar = 0;
    for (var i = 0; i < numDivides; i++) {
        if (i < numDivides/2) {
            colors.push((0.0 + (i/(numDivides/2))));
        } else {
            colorVar += 1;
            colors.push(1.0 - (colorVar/(numDivides/2)));
        }

        colors.push(0.0);
        colors.push(0.0);
        colors.push(1.0);
    }

    // color
    circleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    circleVertexColorBuffer.itemSize = 4;
    circleVertexColorBuffer.numItems = numDivides;
    gl.vertexAttribPointer(program.vertexColorAttribute, circleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);    

    // position
    circleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(circlePoints), gl.STATIC_DRAW);
    circleVertexPositionBuffer.itemSize = 2;
    circleVertexPositionBuffer.numItems = numDivides;// + (numDivides/2);
    gl.vertexAttribPointer(program.vertexPositionAttribute, circleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);    

    // draw array
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, circleVertexPositionBuffer.numItems);

}

function render()
{
        gl.clear( gl.COLOR_BUFFER_BIT );

        //animation stuff
        gl.enableVertexAttribArray(program.vertexAttribPointer);

        // Triangle stuff
        gl.uniform1f(lockedLoc, 0.0);
        initTriangleBuffers();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.vertexAttribPointer(program.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        gl.vertexAttribPointer(program.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

        // square stuff
        theta += 0.04;
        gl.uniform1f(lockedLoc, 1.0);
        gl.uniform1f(thetaLoc, theta);
        initSquareBuffers();

        // circle stuff
        gl.uniform1f(lockedLoc, 0.0);
        initCircleBuffers();


        // call animation frame
        window.requestAnimFrame(render);
}