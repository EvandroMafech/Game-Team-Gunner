import ProjectileWalls from "./projectileWallFabric.js"
import Player from "./Player.js"
import obstacles from "./platformFabric.js"
import walls from "./wallFabric.js"

const instructions = document.querySelector(".instructions")
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')

const canvasWidth = canvas.width = 1800
const canvasHeight = canvas.height = 800

ctx.imageSmoothingEnabled = false

const playerOneImage = new Image()
playerOneImage.src = "images/RED_AND_GREEN_SPRITESHEET.png"
const playerTwoImage = new Image()
playerTwoImage.src = "images/RED_AND_GREEN_SPRITESHEET.png"
const background = new Image()
background.src = "images/background2.png"
const bulletImage = new Image()
bulletImage.src = "images/SpongeBullet.png"

const fire = new Audio('sounds/Fire.wav')
const hit = new Audio('sounds/Hit.wav')
const backgroundSound = new Audio('sounds/background.ogg')
export const jump = new Audio('sounds/Jump2.wav')

let bgMusicIsPlaying = false
let blockPlayerTwoMovement = false
let blockPlayerOneMovement = false
let frameCountOne = 0
let frameCountTwo = 0
let resetingGame = false

const playerOne = new Player(ctx, playerOneImage,0,0,0,"right")    //(context, image,x,y)
const playerTwo = new Player(ctx, playerTwoImage,1650,0,6,"left") //(context, image,x,y)
const playerProjectiles = []

console.log(playerOne)

const playBgMusic = () => {
    if(bgMusicIsPlaying == false)
    {
    bgMusicIsPlaying = true    
    backgroundSound.loop = true
    backgroundSound.play()
    backgroundSound.volume = 0.3
    }
}

const drawPlayerProjectiles = () => {
    playerProjectiles.forEach((projectile) => {
        projectile.draw()
        projectile.update()
    })
}

const resetGame = () => {
 
if(!resetingGame)
{
 
 resetingGame = true
 bgMusicIsPlaying = false
 blockPlayerTwoMovement = false
 blockPlayerOneMovement = false

 playerOne.position.x = 0
 playerOne.position.y = 0

 playerTwo.position.x = 1650
 playerTwo.position.y = 0

 playerOne.playerState = "idle"
 playerTwo.playerState = "idle"

 playerOne.win = false 
 playerTwo.win = false
 
 playerOne.die = false
 playerTwo.die = false
 
 playerOne.isOnGround = false
 playerTwo.isOnGround = false

 playerOne.isJumping = false
 playerTwo.isJumping = false


 instructions.style.display = "block"   
}
} 


const gameLoop = () => {
    ctx.clearRect(0,0, canvasWidth,canvasHeight)
    ctx.drawImage(background,0,0)
  
  //  obstacles.forEach(platform => (platform.draw(ctx)))    // desenha as areas de colisão na tela
  // walls.forEach(wall => (wall.draw(ctx)))    // desenha as areas de colisão na tela
  //  ProjectileWalls.forEach(Pwall => (Pwall.draw(ctx)))    // desenha as areas de colisão na tela
    
    if(playerOne.action.shoot == true && playerOne.isShooting == false && frameCountOne > 30){
        playerOne.shoot(playerProjectiles)
        fire.currentTime = 0; // Reinicia o áudio
        fire.play()
        playerOne.playerState = "shoot"
        playerOne.isShooting = true
        frameCountOne = 0
    }
    if(playerTwo.action.shoot == true && playerTwo.isShooting == false && frameCountTwo > 30){
        playerTwo.shoot(playerProjectiles)
        fire.currentTime = 0; // Reinicia o áudio
        fire.play()
        playerTwo.playerState = "shoot"
        playerTwo.isShooting = true
        frameCountTwo = 0
    }
  
    drawPlayerProjectiles()

    playerOne.checkBulletHit(playerProjectiles,ProjectileWalls,playerTwo.position.x,playerTwo.position.y)
    if(playerOne.win){
        blockPlayerTwoMovement = true
        if(playerTwo.playerState != "die") hit.play()
            resetingGame = false
        playerTwo.action.shoot = false
        playerTwo.direction.left = false
        playerTwo.direction.right = false
        playerTwo.action.jump = false
        playerTwo.playerState = "die"
      
        setTimeout(() => {
            resetGame()
        },2000)
    } 
    playerTwo.checkBulletHit(playerProjectiles,ProjectileWalls,playerOne.position.x,playerOne.position.y)
    if(playerTwo.win){
        blockPlayerOneMovement = true
        if(playerOne.playerState != "die") hit.play()
        
            resetingGame = false
        playerOne.action.shoot = false
        playerOne.direction.left = false
        playerOne.direction.right = false
        playerOne.action.jump = false
        playerOne.playerState = "die"
      
        setTimeout(() => {
            resetGame()   
        },2000)
         
    } 

    playerOne.applyGravity()
    playerTwo.applyGravity()

    if(playerOne.direction.left || playerOne.direction.right) playerOne.move()
    if(playerTwo.direction.left || playerTwo.direction.right) playerTwo.move()

    if(playerOne.action.jump  && playerOne.isJumping == false) playerOne.jump()
    if(playerTwo.action.jump && playerTwo.isJumping == false)  playerTwo.jump()

    playerOne.animate()
    playerTwo.animate()
 
    frameCountOne++
    frameCountTwo++

    
    requestAnimationFrame(gameLoop)
}


gameLoop();



window.addEventListener("keydown", (event) => {
    const key = event.key.toLocaleLowerCase() 
    playBgMusic()
    if(blockPlayerOneMovement == false){
    if(key === "arrowleft")  playerOne.direction.left = true
    if(key === "arrowright") playerOne.direction.right = true
    if(key === "arrowdown")  playerOne.playerState = "crouch"
    if(key === "arrowup") playerOne.action.jump = true
    if(key === "enter") playerOne.action.shoot = true
    }    

    if(blockPlayerTwoMovement == false){
    if(key === "a") playerTwo.direction.left = true
    if(key === "d") playerTwo.direction.right = true
    if(key === "s") playerTwo.playerState = "crouch"
    if(key === "w") playerTwo.action.jump = true
    if(key === " ") playerTwo.action.shoot = true
    }
})

window.addEventListener("keyup", (event) => {
    const key = event.key.toLocaleLowerCase() 
 
    if(blockPlayerOneMovement == false){
    if(key === "arrowleft")  {
        playerOne.direction.left = false
        playerOne.playerState = "idle"
        instructions.style.display = "none"
    }
    if(key === "arrowright") {
        playerOne.direction.right = false
        playerOne.playerState = "idle"
        instructions.style.display = "none"
    }
    if(key === "arrowdown") {
        playerOne.playerState = "idle"
    }
    if(key === "arrowup") playerOne.action.jump = false
    if(key === "enter") {
        playerOne.action.shoot = false
        playerOne.playerState = "idle"
        playerOne.isShooting = false 
        playerOne.stopShootAnimation = false
    }
    }

    if(blockPlayerTwoMovement == false){
    if(key === "a") { 
        playerTwo.direction.left = false
        playerTwo.playerState = "idle"
        instructions.style.display = "none"
    }
    if(key === "d") {
        playerTwo.direction.right = false
        playerTwo.playerState = "idle"
        instructions.style.display = "none"
    }
    if(key === "s") {
        playerTwo.playerState = "idle"
    }
    if(key === "w") playerTwo.action.jump = false
    if(key === " "){ 
        playerTwo.action.shoot = false 
        playerTwo.playerState = "idle"
        playerTwo.isShooting = false
        playerTwo.stopShootAnimation = false
    }
}
})
