import obstacles from "./platformFabric.js"
import Projectile from "./Projectile.js"
import { jump } from "./script.js"
import spriteAnimation from "./spriteAnimation.js"
import walls from "./wallFabric.js"

class Player {
    constructor(ctx,image,x,y,sheetPosition){
        this.position = {
        x: x,
        y: y
        }
        this.direction = {
        left: false,
        right: false
        }
        this.spriteWidth = 48
        this.spriteHeigth = 48
        this.size = 3
        this.image = image
        this.ctx = ctx
        //
        this.velocityY = 0
        this.jumpStrength = -19
        this.gravity = 1
        this.speed = 8
        //
        this.staggerFrames = 6
        this.gameFrame = 0
        this.sheetPosition = sheetPosition //usado para pular colunas no spritesheet
        //
        this.isOnGround = false
        this.isJumping
        this.isShooting = false
        this.initXposition
        this.stopShootAnimation = false
        this.currentDirection = "right"
        this.playerState = "idle"
        //
        this.offsetImage = 19
        this.offSetBotton = 9
        this.offSetTop = 9
        //
        this.win = false
        this.die = false
        this.action = {
            jump: false,
            crouch: false,
            shoot: false
        }
    }
   

    checkBulletHit(projectiles,projectileWalls,enemyX,enemyY){
        projectiles.forEach((projectile,index) => {
           const bulletX = projectile.position.x
           const bulletY = projectile.position.y

           projectileWalls.forEach(wall => {
            const platformRightEdge = wall.position.x + wall.width
            const platformLeftEdge = wall.position.x
            const platformTopEdge = wall.position.y
            const platformBottomEdge = wall.position.y + wall.height
    
            if(bulletY >= platformTopEdge &&
                bulletY <= platformBottomEdge &&
                bulletX >= platformLeftEdge &&
                bulletX <= platformRightEdge 
             ){
              projectiles.pop()
             } 
        })

        if(bulletY >= enemyY + this.offSetTop*this.size &&
              bulletY <= enemyY + this.spriteHeigth*this.size - this.offSetBotton &&
              bulletX >= enemyX +this.offsetImage*this.size &&
              bulletX <= enemyX +this.spriteWidth*this.size - this.offsetImage*this.size 
           ){
            projectiles.pop()
            this.win = true      
           } 

        })
    }

    shoot(projectiles){
        let direction
        let bulletX = this.position.x + this.spriteWidth*this.size
        let bulletY = this.position.y+(this.spriteHeigth*this.size)/2.33
        if(this.currentDirection == "right"){ 
            direction = 1
        }else {
            direction = -1
            bulletX -= this.spriteWidth*this.size 
        }
        const bullet = new Projectile(bulletX,bulletY,direction)

        projectiles.push(bullet)
        
    }

    applyGravity() {
       if(!this.isOnGround){
        this.velocityY += this.gravity  
        this.position.y += this.velocityY
        }
        this.checkFloor()
    }


    checkFloor(){
      obstacles.forEach(platform => {
                const platformRightEdge = platform.position.x + platform.width 
                const platformLeftEdge = platform.position.x  
                const platformTopEdge = platform.position.y 

                const playerLeftOffset = this.position.x + (this.spriteWidth*this.size - this.offsetImage*this.size)
                const playerRightOffset = this.position.x + this.offsetImage*this.size
                const playerTopOffset =  this.position.y + (this.spriteHeigth-this.offSetBotton)*this.size

               if (playerTopOffset >= platformTopEdge   &&
                  playerLeftOffset > platformLeftEdge   &&
                  playerRightOffset < platformRightEdge && 
                  this.velocityY > 0  && 
                  playerTopOffset - this.velocityY <= platform.position.y 
                   ){                  
                 this.isOnGround = true
                 this.velocityY  = 0
                 this.position.y = platformTopEdge - (this.spriteHeigth-this.offSetBotton)*this.size
                 this.isJumping = false 
 
               }this.isOnGround = false
           })
    }
   
    jump(){
        jump.currentTime = 0; // Reinicia o áudio
        jump.play()
        if(!this.isJumping)  {
            this.velocityY = this.jumpStrength
            this.isOnGround = false 
        } 
        this.isJumping = true
        
    }

    animate(){
        const image = this.image
        let position = Math.floor(this.gameFrame/this.staggerFrames) % spriteAnimation[this.playerState].loc.length
        let frameX = position*this.spriteWidth
        let frameY = spriteAnimation[this.playerState].loc[position].y
        const ctx = this.ctx        

                if (this.direction.left || this.currentDirection == "left") {
                    ctx.save(); // Salva o estado original do contexto
                    ctx.translate(this.position.x + this.spriteWidth * this.size, this.position.y) // Ajusta o ponto de origem
                    ctx.scale(-1, 1) // Inverte a escala horizontal
                    ctx.drawImage(image, frameX, frameY + (this.spriteWidth * this.sheetPosition), this.spriteWidth, this.spriteHeigth, 0, 0, this.spriteWidth * this.size, this.spriteHeigth * this.size) 
                    ctx.restore() // Restaura o estado original
                } else if(this.currentDirection == "right" || this.direction.right){
                    ctx.drawImage(image, frameX, frameY + (this.spriteWidth * this.sheetPosition), this.spriteWidth, this.spriteHeigth, this.position.x, this.position.y, this.spriteWidth * this.size, this.spriteHeigth * this.size)
                }
      
                if(this.playerState == "crouch" && this.action.crouch == false){
                   this.gameFrame = 0
                   this.action.crouch = true
                }else if(this.playerState != "crouch" && this.isShooting == false && this.die == false){ 
                 this.gameFrame++
                 this.action.crouch = false   
                }else if(this.playerState == "crouch" && this.gameFrame < 12) {
                    this.gameFrame++
                    this.gameFrame++
                }
                
                
                if(this.isShooting == true && this.stopShootAnimation == false){
                    this.gameFrame = 0
                    this.stopShootAnimation = true
                 }else if(this.stopShootAnimation == true && this.gameFrame < 30){
                    this.gameFrame++
                 }

                 if(this.playerState == "die" && this.die == false){
                    this.gameFrame = 0
                    this.die = true
                 }else if(this.die == true && this.gameFrame < 47){
                    this.gameFrame++
                 }
         
    }
    
    move() {
        let canMoveLeft = true
        let canMoveRight = true
 
        walls.forEach(wall => {
            const platformRightEdge = wall.position.x + wall.width
            const platformLeftEdge = wall.position.x
            const platformTopEdge = wall.position.y
            const platformBottomEdge = wall.position.y + wall.height
    
            const playerLeftEdge = this.offsetImage * this.size
            const playerRightEdge = this.spriteWidth * this.size - this.offsetImage * this.size
            const playerBottomEdge = this.spriteHeigth * this.size - this.offSetBotton * this.size
    
            // Verifica colisão do jogador com a parede
            const leftColisison = 
                (this.position.x + playerLeftEdge <= platformRightEdge && 
                 this.position.x + playerRightEdge >= platformLeftEdge)
        
            const RightColisison = 
                (this.position.x + playerRightEdge >= platformLeftEdge && 
                 this.position.x + playerLeftEdge <= platformRightEdge)
    
            const VerticalCollision = 
                (this.position.y + playerBottomEdge >= platformTopEdge && 
                 this.position.y + playerBottomEdge <= platformBottomEdge)
    
            const movingLeft = this.initXposition > this.position.x         
            const movingRight = this.initXposition < this.position.x         

               
                // Verifica se está tentando mover para a esquerda
                if (this.direction.left && leftColisison && VerticalCollision && movingLeft) {
                   
                    canMoveLeft = false
                    this.playerState = "idle"
                }
    
                // Verifica se está tentando mover para a direita
                if (this.direction.right && RightColisison && VerticalCollision && movingRight) {
                   
                    canMoveRight = false
                    this.playerState = "idle"
                }
            
        })
    
        // Move o jogador apenas se não houver bloqueio na direção
        if (this.direction.left && canMoveLeft) {
            this.initXposition = this.position.x
            this.position.x -= this.speed
            this.currentDirection = "left"
            this.playerState = "run"

        } else if (this.direction.right && canMoveRight) {
            this.initXposition = this.position.x
            this.position.x += this.speed
            this.currentDirection = "right"
            this.playerState = "run"
        }

        
     

    }
}

export default Player