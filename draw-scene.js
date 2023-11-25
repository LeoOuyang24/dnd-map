function drawScene(gl, program) {
  // Tell WebGL to use our program when drawing
  gl.useProgram(program);

  const offset = 0;
  const vertexCount = 1;
  gl.drawArrays(gl.POINTS, offset, vertexCount);
}

export { drawScene };
