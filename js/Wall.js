class Wall{

    constructor(x,y,width,height){
        this.position = {
            x: x,
            y: y
        }
        this.width = width
        this.height = height
    }

    draw(ctx){
        ctx.fillStyle = "yellow"
        ctx.fillRect(this.position.x,this.position.y, this.width,this.height) //fillRect(x, y, width, height): Desenha um retângulo preenchido.
   }
}

export default Wall  //exporta a classe para onde o new é chamado