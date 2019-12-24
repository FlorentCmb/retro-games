// Import librairies
import React, { useEffect } from 'react'

// Import styles
import './Snake.css'

const FlappyBird = () => {

    const createGame = () => {

        // Canvas' settings
        const canvas = document.querySelector('#Snake-Canvas')
        const context = canvas.getContext("2d")

        // Constant size we'll use to create the game (in px)
        const box = 32

        // Snake init
        let snake = [
            {
                posX: 9 * box,
                posY: 10 * box
            }
        ]

        // Create food
        let food = {
            posX: Math.floor(Math.random() * 18 + 1) * box,
            posY: Math.floor(Math.random() * 16 + 3) * box
        }

        // Score init
        let score = 0

        // Control the snake
        let d
        const direction = (event) => {
            if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
                event.preventDefault()
            }
            if (event.keyCode === 37 && d !== 'RIGHT') {
                d = 'LEFT'
            }
            else if (event.keyCode === 38 && d !== 'DOWN') {
                d = 'UP'
            }
            else if (event.keyCode === 39 && d !== 'LEFT') {
                d = 'RIGHT'
            }
            else if (event.keyCode === 40 && d !== 'UP') {
                d = 'DOWN'
            }
        }

        // Draw function (creation of entities)
        const draw = () => {
            // Field where Snake will move
            context.fillStyle = 'green'
            context.fillRect(box, 3 * box, 18 * box, 16 * box)
            // Score display field
            context.fillStyle = 'darkgrey'
            context.fillRect(0, 0, canvas.width, 2 * box)
            // Score text
            context.fillStyle = 'red'
            context.font = "32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
            context.fillText(score, box, box)

            // Creating the snake
            for (let i = 0; i < snake.length; i++) {
                context.fillStyle = (i === 0) ? 'darkgreen' : 'white'
                context.fillRect(snake[i].posX, snake[i].posY, box, box)
                context.strokeStyle = 'red'
                context.strokeRect(snake[i].posX, snake[i].posY, box, box)
            }
            // Create the food
            context.fillStyle = 'red'
            context.fillRect(food.posX, food.posY, box, box)

            // Old head position
            let snakeX = snake[0].posX
            let snakeY = snake[0].posY

            // Movement according to the direction d
            if (d === 'LEFT') snakeX -= box
            if (d === 'UP') snakeY -= box
            if (d === 'RIGHT') snakeX += box
            if (d === 'DOWN') snakeY += box

            // Increse snake's size when he eats
            if (snakeX === food.posX && snakeY === food.posY) {
                score++
                food = {
                    posX: Math.floor(Math.random() * 18 + 1) * box,
                    posY: Math.floor(Math.random() * 16 + 3) * box
                }
                // We don't remove the tail because the snake get bigger
            }
            else {
                // Remove the tail everytime he walks
                snake.pop()
            }

            // Add a new head
            let newHead = {
                posX: snakeX,
                posY: snakeY
            }

            // Test if new head touch snake's body
            const collision = (head, array) => {
                for (let i = 0; i < array.length; i++) {
                    if (head.posX === array[i].posX && head.posY === array[i].posY) {
                        return true
                    }
                }
                return false
            }
            
            // Game over (the snake touch a wall or its tail)
            if (snakeX < box || snakeX > 18 * box || snakeY < 3 * box || snakeY > 18 * box || collision(newHead, snake)) {
                clearInterval(game)
            }
            snake.unshift(newHead)
        }

        let game
        // Function starting the game
        const startGame = () => {
            canvas.style.display = 'block'
            score = 0
            game = setInterval(draw, 80)
            document.querySelector('#Snake-Start').style.display = 'none'
            document.addEventListener('keydown', direction)
        }
        document.querySelector('#Snake-Start').addEventListener('click', startGame)
    }

    useEffect(() => {
        createGame()
    }, [])

    return (
        <div className="Snake">
            <h3 className="Snake-Title"><span className="Snake-s">S</span>nake, the original game</h3>
            <input type="button" id="Snake-Start" value="Start" />
            <canvas id="Snake-Canvas" width="640" height="640" />
        </div>
    )
}

export default FlappyBird
