
class Camera
{
  mouseDown = false
  camera = [0,0]

  constructor(startingPos) {
    // bind causes a fixed `this` context to be assigned to `onclick2`
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this)

    this.camera = startingPos
  }
  handleMouseDown(event) {
    this.mouseDown = true; // 'Something Good', as `this` is bound to the Something instance
    //this.camera[0] += 0.1
    //this.camera[1] += 0.1
  }
  handleMouseUp(event){
  	this.mouseDown = false;
  }
  handleMouseMove(event){
  	if (this.mouseDown)
  	{
  		this.camera[0] -= event.movementX
  		this.camera[1] -= event.movementY
  	}
  }
}

export {Camera}