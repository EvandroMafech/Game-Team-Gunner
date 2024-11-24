import Wall from "./Wall.js";


const walls = []

function createWall(x, y, width, height) {
  const platform = new Wall(x, y, width, height);
  walls.push(platform);
}

//x, y, width, height
createWall(48.1*2+2,48*10+4, 44, 50) 
createWall(48*34+2,48*10+4, 44, 50) 
createWall(48*32+2,48*6, 44, 50) 
createWall(48*28+2,48*4-12, 44,50) 
createWall(48*6+2,48*6, 44, 50) 
createWall(48*6+2,48*15-15, 44, 50) 
createWall(48*3+2,48*15-15, 44, 50) 
createWall(48*26+2,48*15-15, 44, 50) 
createWall(48*33+2,48*15-15, 44, 50) 
createWall(48*11-1,48*15-15, 44, 50) 
createWall(48*9+2,48*14, 44, 50) 
createWall(48*8+2,48*14, 44, 50) 
createWall(48*31,48*14, 44, 50) 
createWall(48*28+2,48*14, 44, 50) 
createWall(0,0, 4, 800) 
createWall(1795,0, 4, 800) 

export default walls
