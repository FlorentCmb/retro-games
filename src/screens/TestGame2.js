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
        let spawnAsteroids
        // Unit for the game
        const block = 32
        // To know if we can move the player
        let left = false
        let right = false
        let up = false
        let down = false
        let shoot = false

        /* Objects */
        // Player object
        const player = {
            height: block,
            width: block,
            posX: canvas.width / 2 - block / 2,
            posY: 0,
            velocityX: 0,
            velocityY: 0,
            color: 'white',
            maxLifes: 3,
            lifes: 3,
            score: 0
        }
        const missiles = []
        const asteroidArray = []

        /* Controller */
        const controller = (e) => {
            // To know if we are currently pressing the key
            let keyState = e.type === "keydown" ? true : false
            if ([37, 38, 39, 40, 32].includes(e.keyCode)) {
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
                case 40:
                    down = keyState
                    break
                case 32:
                    shoot = keyState
                    break
                default:
                    break
            }
        }

        /* Asteroids */
        const asteroids = () => {
            asteroidArray.push({
                posX: Math.floor(Math.random() * canvas.width),
                posY: Math.floor(Math.random() * canvas.height),
                velocityX: Math.floor(Math.random() * 4) - 2,
                velocityY: Math.floor(Math.random() * 4) - 2,
                dimensions: Math.floor(Math.random() * 3) * block,
                color: 'white'
            })
            for (let i = 0; i < asteroidArray.length; i++) {
                asteroidArray[i].hp = asteroidArray[i].dimensions / block
            }
        }

        /* Movements */
        const movements = () => {
            // Up
            if (up) {
                player.velocityY -= 0.5
            }
            // Down
            if (down) {
                player.velocityY += 0.5
            }
            // Left
            if (left) {
                player.velocityX -= 0.5
            }
            // Right
            if (right) {
                player.velocityX += 0.5
            }
            if (shoot) {
                missiles.push({
                    posX: player.posX + player.width / 2,
                    posY: player.posY + player.height / 2,
                    velocityX: (player.velocityX > 0.5 || player.velocityX < -0.5 ? Math.sign(player.velocityX) * 10 : 0),
                    velocityY: (player.velocityY > 0.5 || player.velocityY < -0.5 ? Math.sign(player.velocityY) * 10 : 0)
                })
                shoot = false
            }
            /* Physics */
            // Position according to the current velocity
            player.posX += player.velocityX
            player.posY += player.velocityY
            // Frictions
            player.velocityX *= 0.9
            player.velocityY *= 0.9

            /* Inifinite map */
            // For player
            if (player.posX + player.width < 0) {
                player.posX = canvas.width
            }
            else if (player.posX > canvas.width) {
                player.posX = 0 - player.width
            }
            else if (player.posY > canvas.height) {
                player.posY = 0
            }
            else if (player.posY + player.height < 0) {
                player.posY = canvas.height - player.height
            }
            // For asteroids
            for (let i = 0; i < asteroidArray.length; i++) {
                if (asteroidArray[i].posX + asteroidArray[i].dimensions < 0) {
                    asteroidArray[i].posX = canvas.width - asteroidArray[i].dimensions
                }
                else if (asteroidArray[i].posX > canvas.width) {
                    asteroidArray[i].posX = 0
                }
                else if (asteroidArray[i].posY > canvas.height) {
                    asteroidArray[i].posY = 0
                }
                else if (asteroidArray[i].posY + asteroidArray[i].height < 0) {
                    asteroidArray[i].posY = canvas.height - asteroidArray[i].height
                }
            }

            /* Missiles movements */
            for (let i = 0; i < missiles.length; i++) {
                missiles[i].posX += missiles[i].velocityX
                missiles[i].posY += missiles[i].velocityY
            }
            // Missile removing
            for (let i = 0; i < missiles.length; i++) {
                if (missiles[i].posX > canvas.width || missiles[i].posX < 0 || missiles[i].posY > canvas.height || missiles[i].posY < 0) {
                    // Index of the current missile
                    const index = missiles.indexOf(missiles[i])
                    missiles.splice(index, 1)
                }
                else if (missiles[i].velocityX === 0 && missiles[i].velocityY === 0) {
                    // Index of the current missile
                    const index = missiles.indexOf(missiles[i])
                    missiles.splice(index, 1)
                }
            }
            // Missile collision
            for (let i = 0; i < missiles.length; i++) {
                for (let j = 0; j < asteroidArray.length; j++) {
                    if (missiles.length > 0 && missiles[i].posX <= asteroidArray[j].posX + asteroidArray[j].dimensions && missiles[i].posX + 5 >= asteroidArray[j].posX && missiles[i].posY <= asteroidArray[j].posY + asteroidArray[j].dimensions && missiles[i].posY + 5 >= asteroidArray[j].posY) {
                        player.score += 10
                        asteroidArray[j].hp--
                        missiles.splice(missiles.indexOf(missiles[i]), 1)
                    }
                }
            }


            /* Asteroids movements, death and collision with player */
            for (let i = 0; i < asteroidArray.length; i++) {
                asteroidArray[i].posX += asteroidArray[i].velocityX
                asteroidArray[i].posY += asteroidArray[i].velocityY
                if (asteroidArray[i].hp ===0) {
                    const index = asteroidArray.indexOf(asteroidArray[i])
                    asteroidArray.splice(index, 1)
                }
                if (asteroidArray.length > 0 && asteroidArray[i].posX <= player.posX + player.width && asteroidArray[i].posX + asteroidArray[i].dimensions >= player.posX && asteroidArray[i].posY <= player.posY + player.height && asteroidArray[i].posY + asteroidArray[i].dimensions >= player.posY) {
                    player.lifes--
                }
            }
        }

        /* Render the game */
        const rendering = () => {
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height)
            // Background
            context.fillStyle = "rgb(0, 0, 0)"
            context.fillRect(0, 0, canvas.width, canvas.height)
            // Player
            context.fillStyle = player.color
            context.fillRect(player.posX, player.posY, player.width, player.height)
            // Player HP
            // Empty life slots
            for (let i = 0; i < player.maxLifes; i++) {
                context.fillStyle = 'brown'
                context.fillRect(block + 2 * i * block, block, 1.5 * block, 1.5 * block)
            }
            // Full life slots (current hps)
            for (let i = 0; i < player.lifes; i++) {
                context.fillStyle = 'red'
                context.fillRect(block + 2 * i * block, block, 1.5 * block, 1.5 * block)
            }
            // Score
            context.font = '40px serif'
            context.fillText(player.score, 8 * block, 2 * block)
            // Missiles
            for (let i = 0; i < missiles.length; i++) {
                context.fillStyle = "white"
                context.fillRect(missiles[i].posX, missiles[i].posY, 5, 5)
            }
            // Asteroids
            for (let i = 0; i < asteroidArray.length; i++) {
                context.fillStyle = asteroidArray[i].color
                context.fillRect(asteroidArray[i].posX, asteroidArray[i].posY, asteroidArray[i].dimensions, asteroidArray[i].dimensions)
            }
        }

        const movementsPerRender = () => {
            rendering()
            movements()
        }

        // Start to repeat the rendering function every 10ms
        startRendering = setInterval(movementsPerRender, 10)
        spawnAsteroids = setInterval(asteroids, 5000)

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
