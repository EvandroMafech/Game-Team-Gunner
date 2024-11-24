const spriteAnimation = []
const spriteWidth = 48
const spriteHeigth = 48

const playerAnimationStates = [
    {
        name: "crouch",
        frames: 3
    },
    {
        name: "die",
        frames: 8
    },
    {
        name: "idle",
        frames: 5
    },
    {
        name: "jump",
        frames: 2
    },
    {
        name: "run",
        frames: 6
    },
    {
        name: "shoot",
        frames: 5
    }
]

playerAnimationStates.forEach((state,index) => {
    let frames = {
        loc: [],
    }
    for(let j = 0; j < state.frames; j++ ){
        let positionX = j * spriteWidth
        let positionY = (index) * spriteHeigth
        frames.loc.push({x: positionX, y: positionY})
    }
    spriteAnimation[state.name] = frames
 
})

export default spriteAnimation