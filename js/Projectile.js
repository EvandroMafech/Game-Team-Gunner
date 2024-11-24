const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')

const bulletImage = new Image()
bulletImage.src = "images/SpongeBullet.png"

class Projectile{
            constructor(x,y,direction){
                this.position = {
                    x: x,
                    y: y
                }
                this.speed = 20
                this.image = bulletImage
                this.size = 5
                this.direction = direction
            }

            draw(){
                ctx.drawImage(this.image,this.position.x,this.position.y,3*this.size,1*this.size)
            }

            update(){
                this.position.x += this.speed*this.direction
            }

}

export default Projectile