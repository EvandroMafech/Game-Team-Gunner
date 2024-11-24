import Platform from "./Platform.js" 

const obstacles = []

function createPlatform(x, y, width, height) {
  const platform = new Platform(x, y, width, height);
  obstacles.push(platform);
}

//base
createPlatform(0, 736, 1800, 10) //x, y, width, height

createPlatform(0, 736, 1800, 10);
createPlatform(0, 702, 192, 10);
createPlatform(288, 702, 288, 10);
createPlatform(384, 668, 96, 10);
createPlatform(1536, 328, 96, 10);
createPlatform(1248, 702, 96, 10);
createPlatform(1536, 702, 96, 10);
createPlatform(1344, 668, 192, 10);
createPlatform(672, 226, 192, 10);
createPlatform(1248, 226, 192, 10);
createPlatform(1248, 417.8, 192, 10);
createPlatform(0, 511, 384, 10);
createPlatform(96, 328, 384, 10);
createPlatform(960, 328, 192, 10);
createPlatform(672, 511, 288, 10);
createPlatform(1536, 511, 288, 10);
createPlatform(1632, 477, 48, 10);
createPlatform(96, 477, 48, 10);
createPlatform(288, 254.5, 48, 10);
createPlatform(1344, 158.5, 48, 10);
createPlatform(1536, 254.5, 48, 10);

export default obstacles
