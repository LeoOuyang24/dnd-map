import { initBuffer } from "./init-buffers.js";

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function loadSprite(gl, sprite)
{
	const glTexture = gl.createTexture();
	//gl.activeTexture(gl.TEXTURE0);  // this is the 0th texture
	gl.bindTexture(gl.TEXTURE_2D, glTexture);

	// actually upload bytes
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sprite);

	// generates a version for different resolutions, needed to draw
	//gl.generateMipmap(gl.TEXTURE_2D);
  if (isPowerOf2(sprite.width) && isPowerOf2(sprite.height)) {
     // Yes, it's a power of 2. Generate mips.
     gl.generateMipmap(gl.TEXTURE_2D);
  } else {
     // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
	//gl.bindTexture(gl.TEXTURE_2D,0);
	return glTexture;
}

function renderSprite(gl, shaderProgram, texture, info)
{
	gl.bindTexture(gl.TEXTURE_2D, texture)
  	initBuffer(gl,shaderProgram,info.pos,3,"spritePosition");
  	initBuffer(gl,shaderProgram,info.size,1,"size");
	gl.useProgram(shaderProgram)
	 gl.drawArrays(gl.POINTS, 0, 1);

}

export {loadSprite, renderSprite}
