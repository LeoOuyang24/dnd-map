import { initBuffer } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { loadSprite, renderSprite} from "./load-sprite.js"
import { Camera } from "./controls.js"


import { mat4 } from 'gl-matrix';

main();

//
// start here
//

function init(gl, canvas)
{
   // Initialize the GL context

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Vertex shader program
  const vsSource = `
    attribute vec3 spritePosition;  // position and dimensions of sprite
    attribute float size;
    uniform vec2 screenSize;        // width/height of screen
    uniform mat4 projection;
    uniform mat4 view;

    void main() {
      //vec4 screenTransform = vec4(2.0 / screenSize.x, -2.0 / screenSize.y, -1.0, 1.0);
      //vec4 newPosition = vec4(spritePosition.xy*screenTransform.xy + screenTransform.zw, spritePosition.z, 1.0);
      //gl_Position = vec4(0.0,0.0,0.0,1.0);
      gl_Position = projection*view*vec4(spritePosition,1);
      gl_PointSize = size;
    }
`;

  const fsSource = `
uniform sampler2D spriteTexture;  // texture we are drawing

void main() {
  gl_FragColor = texture2D(spriteTexture, gl_PointCoord);
}
`;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const viewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  // Set uniform
  gl.useProgram(shaderProgram);
  gl.uniform2f(gl.getUniformLocation(shaderProgram, 'screenSize'), canvas.width, canvas.height);
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram,'projection'),false,mat4.ortho(projectionMatrix,0,640,640,0,-10,10))//getPerspective(Math.pi/4,canvas.width/canvas.height,1,100));
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram,'view'),false,mat4.lookAt(viewMatrix,[0,0,10],[0,0,0],[0,1,0]));

  return shaderProgram
}

function render(gl, canvas, shaderProgram, camera){

  gl.clearDepth(1.0); // Clear everything
  gl.clear(gl.COLOR_BUFFER_BIT);

  const img = document.getElementById('icon');

  let text = loadSprite(gl,img)
  let dinosaur = loadSprite(gl,document.getElementById('dinosaur'))
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram,'view'),false,mat4.lookAt(mat4.create(),[camera.camera[0],camera.camera[1],10],[camera.camera[0],camera.camera[1],0],[0,1,0]));

  renderSprite(gl,shaderProgram,text,{"pos": [320,320,0],"size": [640.0]})
  renderSprite(gl,shaderProgram,dinosaur,{"pos": [640,640,1],"size": [64.0]})
}

function main() {

const canvas = document.getElementById("glcanvas");

const gl = canvas.getContext("webgl");


 
let shaderProgram = init(gl,canvas)

let camera = new Camera([0,0])
document.addEventListener("mousedown", camera.handleMouseDown);
document.addEventListener("mouseup",camera.handleMouseUp)
document.addEventListener("mousemove",(event) => {
                                        camera.handleMouseMove(event); 
                                        //gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram,'view'),false,mat4.lookAt(viewMatrix,[camera.camera[0],camera.camera[1],10],[camera.camera[0],camera.camera[1],0],[0,1,0]));
                                        const start = new Date()

                                        render(gl, canvas,shaderProgram, camera)
                                        const lag = new Date() - start
                                        console.log(`Lag: \t${lag} ms. `)
                                        console.log(camera.camera)

                                      })

const start = new Date()
setTimeout(() => {
  const lag = new Date() - start
  console.log(`Lag: \t${lag} ms`)
})
  // Draw the scene
render(gl,canvas, shaderProgram, camera)
  //drawScene(gl, shaderProgram);
}















//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}