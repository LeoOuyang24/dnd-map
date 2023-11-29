function initBuffer(gl, shaderProgram,array, amount, variable) {
  //pass "array" to a buffer
  //"amount" is the number of numbers we want per vertice
  //"variable" is the variable we are assigning to

  // Create a buffer
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = array

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const loc = gl.getAttribLocation(shaderProgram, variable);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc,
      amount,  
      gl.FLOAT, 
      false,  
      0,   // each value is next to each other
      0);  // starts at start of array


  return positionBuffer;
}

export { initBuffer };