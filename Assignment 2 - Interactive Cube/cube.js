"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var transVec = 0;
var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
]; 

var matBlank = mat4();
var dragging = false;
var matrixLocation;

//mouse stuff
var dX;
var dY;
var oldx;
var oldy;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLocation = gl.getUniformLocation( program, "u_matrix" );


    //event listeners
    window.onmousedown = function(event) {
        dragging = true;
        oldx = event.clientX;
        oldy = event.clientY;
    }


    window.onmousemove = function(event) {
        dY = -(event.clientX-oldx)*2*Math.PI/canvas.width*50;
        dX = -(event.clientY-oldy)*2*Math.PI/canvas.height*50;
        oldx = event.clientX;
        oldy = event.clientY;
        event.preventDefault();
    }

    window.onmouseup = function(event) {
        dragging = false;
    }
    
    window.onkeydown = function(event) {
        console.log(event.key);
        switch(event.key) {
            case 'ArrowLeft': //left
                transVec = translate(vec3(-0.1,0.0,0.0));
                break;

            case 'ArrowRight': //right
                transVec = translate(vec3(0.1,0.0,0.0));
                break;

            case 'ArrowUp': //up
                transVec = translate(vec3(0.0,0.1,0.0));
                break;

            case 'ArrowDown': //down
                transVec = translate(vec3(0.0,-0.1,0.0));
                break;

            case 'PageUp': //PgUp
                transVec = translate(vec3(0.0,0.0,-0.1));
                break;

            case 'PageDown': //PgDown
                transVec = translate(vec3(0.0,0.0,0.1));
                break;

            case 'r': //r
                transVec = rotateY(-2.0);
                break;
            
            case 'R': //R
                transVec = rotateY(2.0);
                break;

            case 's': //r
                transVec = mat4(
                    1.05, 0.0, 0.0, 0.0,
                    0.0, 1.05, 0.0, 0.0, 
                    0.0, 0.0, 1.05, 0.0,
                    0.0, 0.0, 0.0, 1.0);
                break;
            
            case 'S': //R
                transVec = mat4(
                    0.95, 0.0, 0.0, 0.0,
                    0.0, 0.95, 0.0, 0.0, 
                    0.0, 0.0, 0.95, 0.0,
                    0.0, 0.0, 0.0, 1.0);
                break;
            case 'B': //B
                matBlank = mat4();
                transVec = rotateX(-2.0);
                break;

        }
    }

    // to move it down a little
    transVec = rotateX(-2.0);

    render();
}

function colorCube()
{
    points = [];
    colors = [];
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (transVec != 0) {
        matBlank = mult(matBlank, transVec);
        transVec = 0;
    }

    if (dragging == true) {
        matBlank = mult(matBlank, rotateX(dX));
        matBlank = mult(matBlank, rotateY(dY));
    }

    gl.uniformMatrix4fv(matrixLocation, false, flatten(matBlank));
    
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    requestAnimFrame(render);
}
