
function addVectors(vec1,vec2)
{
  return vec1.map((n1,i) => vec1[i] + vec2[i])
}

function multVectorByScalar(vec1, scalar)
{
  return vec1.map(n => n*scalar)
}

function length(vec1)
{
  return Math.sqrt(vec1.reduce((a,b) => Math.pow(a + b,2)))
}

function dot(vec1, vec2)
{
  return vec1.map((n1,i) => vec1[i] * vec2[i]).reduce((a,b) => a + b, 0)
}

function normalize(vec1)
{
  let mag = length(vec1);
  return vec1.map((n) => n/mag)
}

function cross(vec1, vec2)
{[0,0,1] [0,1,0]
  return [vec1[1]*vec2[2] - vec2[1]*vec1[2], 
          vec1[2]*vec2[0] - vec2[2]*vec1[0],
          vec1[0]*vec2[1] - vec2[0]*vec1[1]]

}

function getOrtho(left, right, up, down, near, far)
{
  return [2/(right - left), 0, 0, 0, 
          0, 2/(up - down), 0, 0, 
          0, 0, -2/(far - near), 0,
          -(right + left)/(right - left), -(up + down)/(up - down), (far + near)/(far - near), 1]
}


function getPerspective( //currently untested
  fieldOfViewInRadians,
  aspectRatio,
  near,
  far,
) {
  const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
  const rangeInv = 1 / (near - far);

  return [
    f / aspectRatio, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0,
  ];
};

function getView(cameraPos,targetPos,upVector) {
  //https://learnopengl.com/Getting-started/Camera
  let dirVector = normalize(addVectors(cameraPos, multVectorByScalar(targetPos,-1))) //camera direction
  console.log(dirVector)
  let rightVector = normalize(cross(upVector,dirVector)) //"right" vector, also known as the x axis relative to our camera direction
    console.log(rightVector)

  let cameraUpVector = cross(dirVector,rightVector)
  console.log(cameraUpVector)

  return [rightVector[0],rightVector[1],rightVector[2],1*(dot(rightVector,cameraPos)),
          cameraUpVector[0],cameraUpVector[1],cameraUpVector[2],1*(dot(upVector,cameraPos)),
          dirVector[0],dirVector[1],dirVector[2],1*(dot(dirVector,cameraPos)),
          0,0,0,1]

};


export {getPerspective, getView, getOrtho}
