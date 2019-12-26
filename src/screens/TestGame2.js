// Librairies
import React, { useEffect } from 'react'

// Styles
import './TestGame2.css'

const TestGame2 = () => {

    const game = () => {

        /* Basics */
        const canvas = document.querySelector('.TestGame2-Canvas')
        const context = canvas.getContext("2d")
        // Will be the interval
        let startRendering
        // Unit for the game
        const block = 32
        // To know if we can move the player
        let left = false
        let right = false
        let up = false

        /* Objects */
        // Player object
        const player = {
            jumping: true,
            height: block,
            width: block,
            posX: canvas.width / 2 - block / 2,
            posY: 0,
            velocityX: 0,
            velocityY: 0
        }
        // Obstacles
        const obstacles = [
            { posX: 0, posY: canvas.height - 2 * block, width: canvas.width, height: 2 * block, color: "chocolate", type: "ground" },
            { posX: canvas.width / 2, posY: canvas.height - 6 * block, width: 4 * block, height: block, color: "chocolate", type:"ground" },
            { posX: 6 * block, posY: canvas.height - 6 * block, width: 4 * block, height: 4 * block, color: "chocolate", type: "ground" }
        ]

        /* Controller */
        const controller = (e) => {
            // To know if we are currently pressing the key
            let keyState = e.type === "keydown" ? true : false
            if ([37, 38, 39].includes(e.keyCode)) {
                e.preventDefault()
            }
            // Change left, right or up values according to the pressed key
            switch (e.keyCode) {
                case 37:
                    left = keyState
                    break
                case 38:
                    up = keyState
                    break
                case 39:
                    right = keyState
                    break
                default:
                    break
            }
        }

        /* Movements */
        const movements = () => {
            // Jump
            if (up && !player.jumping) {
                player.velocityY -= 30
                player.jumping = true
            }
            // Left
            if (left) {
                player.velocityX -= 0.5
            }
            // Right
            if (right) {
                player.velocityX += 0.5
            }
            /* Physics */
            // Gravity
            player.velocityY += 1
            // Position according to the current velocity
            player.posX += player.velocityX
            player.posY += player.velocityY
            // Frictions
            player.velocityX *= 0.9
            player.velocityY *= 0.9

            // Collisions
            for (let i = 0; i < obstacles.length; i++) {
                // Up collision
                if (player.posY + player.height >= obstacles[i].posY && player.posY < obstacles[i].posY && player.posX + player.width > obstacles[i].posX && player.posX < obstacles[i].posX + obstacles[i].width) {
                    player.posY = obstacles[i].posY - player.height
                    player.velocityY = 0
                    player.jumping = false
                }
                // Down collision (if obstacle type is ground)
                if (player.posY <= obstacles[i].posY + obstacles[i].height && player.posY + player.height > obstacles[i].posY + obstacles[i].height && player.posX + player.width > obstacles[i].posX && player.posX < obstacles[i].posX + obstacles[i].width && obstacles[i].type === "ground") {
                    player.posY = obstacles[i].posY + obstacles[i].height
                    player.velocityY = 0
                    player.jumping = true
                }
                // Left side collision
                if (player.posX <= obstacles[i].posX + obstacles[i].width && player.posX > obstacles[i].posX && player.posY < obstacles[i].posY + obstacles[i].height && player.posY + player.height > obstacles[i].posY) {
                    player.posX = obstacles[i].posX + obstacles[i].width
                    player.velocityX = 0
                }
                // Right side collision
                if (player.posX + player.width >= obstacles[i].posX && player.posX < obstacles[i].posX && player.posY < obstacles[i].posY + obstacles[i].height && player.posY + player.height > obstacles[i].posY) {
                    player.posX = obstacles[i].posX - player.width
                    player.velocityX = 0
                }
            }
            
        }

        /* Render the game */
        const rendering = () => {
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height)
            // Background
            context.fillStyle = "rgb(85, 129, 209)"
            context.fillRect(0, 0, canvas.width, canvas.height)
            // Ground
            context.fillStyle = "chocolate"
            context.fillRect(0, canvas.height - 2 * block, canvas.width, 2 * block)
            // Obstacles
            for (let i = 0; i < obstacles.length ; i++) {
                context.fillStyle = obstacles[i].color
                context.fillRect(obstacles[i].posX, obstacles[i].posY, obstacles[i].width, obstacles[i].height)
            }
            // Player
            context.fillStyle = "red"
            context.fillRect(player.posX, player.posY, player.width, player.height)
        }

        const movementsPerRender = () => {
            rendering()
            movements()
        }

        // Start to repeat the rendering function every 10ms
        startRendering = setInterval(movementsPerRender, 10)

        // Events listener
        document.addEventListener("keydown", controller)
        document.addEventListener("keyup", controller)
    }

    useEffect(() => {
        game()
    }, [])

    return (
        <div className="TestGame2">
            <canvas className="TestGame2-Canvas" width={32 * 35} height={32 * 20} />
        </div>
    )
}

export default TestGame2
