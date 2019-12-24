// Import librairies
import React, { useEffect } from 'react'

// Import styles
import './Pong.css'

const Pong = () => {

    const createGame = () => {

        // Settings canvas' context
        const canvas = document.querySelector('#Pong-Canvas')
        const context = canvas.getContext("2d")

        // Function creating rectangles
        const drawRect = (x, y, w, h, color) => {
            context.fillStyle = color
            context.fillRect(x, y, w, h)
        }

        // Function creating circle
        const drawCircle = (x, y, r, color) => {
            context.fillStyle = color
            context.beginPath()
            context.arc(x, y, r, 0, Math.PI * 2, false)
            context.closePath()
            context.fill()
        }

        // Function creating text
        const drawText = (text, x, y, color) => {
            context.fillStyle = color
            context.font = "75px fantasy"
            context.fillText(text, x, y)
        }

        // Function creating the net
        const drawNet = () => {
            for (let i = 0; i <= canvas.height; i += 15) {
                drawRect(net.posX, net.posY + i, net.width, net.height, net.color)
            }
        }

        // Objects (players, balls and net)

        const user = {
            posX: 0,
            posY: canvas.height / 2 - 35,
            width: 20,
            height: 70,
            color: "white",
            score: 0
        }
        const computer = {
            posX: canvas.width - 20,
            posY: canvas.height / 2 - 35,
            width: 20,
            height: 70,
            color: "white",
            score: 0,
            level: 0.1
        }
        const net = {
            posX: canvas.width / 2 - 1,
            posY: 0,
            width: 2,
            height: 10,
            color: "white"
        }
        const ball = {
            posX: canvas.width / 2,
            posY: canvas.height / 2,
            radius: 10,
            speed: 5,
            velocityX: 5,
            velocityY: 5,
            color: "red"
        }

        // Rendering game //
        const render = () => {
            // Game background
            drawRect(0, 0, canvas.width, canvas.height, "black")
            // User's score
            drawText(user.score, canvas.width / 4, canvas.height / 5, "white")
            // Computer's score
            drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, "white")
            // Net (line in the center)
            drawNet()
            // User paddle
            drawRect(user.posX, user.posY, user.width, user.height, user.color)
            // Computer paddle
            drawRect(computer.posX, computer.posY, computer.width, computer.height, computer.color)
            // Ball
            drawCircle(ball.posX, ball.posY, ball.radius, ball.color)
        }

        // Collision detection
        const collision = (b, p) => {
            // Player params
            p.top = p.posY
            p.bottom = p.posY + p.height
            p.left = p.posX
            p.right = p.posX + p.width
            // Ball params
            b.top = b.posY - b.radius
            b.bottom = b.posY + b.radius
            b.left = b.posX - b.radius
            b.right = b.posX + b.radius
            // Return true if there's a collision
            return b.right >= p.left && b.bottom >= p.top && b.left <= p.right && b.top <= p.bottom
        }

        // Updating game //
        const update = () => {
            // Moving ball
            ball.posX += ball.velocityX
            ball.posY += ball.velocityY
            // Ball boucing on walls
            if (ball.posY + ball.radius > canvas.height || ball.posY - ball.radius < 0) {
                ball.velocityY = -ball.velocityY
            }
            // Defining which player touch the ball
            let player = (ball.posX < canvas.height / 2) ? user : computer
            // Do the collision between player and ball
            if (collision(ball, player)) {
                // Collision point
                let collisionPoint = (ball.posY - (player.posY + player.height / 2)) / (player.height / 2)
                // Angle
                let angleRad = collisionPoint * (Math.PI / 4)

                // Current direction of the ball
                let direction = (ball.posX < canvas.width / 2) ? 1 : -1
                // Giving new velocity to the ball
                ball.velocityX = direction * ball.speed * Math.cos(angleRad)
                ball.velocityY = direction * ball.speed * Math.sin(angleRad)
                ball.speed += 0.5
            }

            // Update scores
            if (ball.posX - ball.radius < 0) {
                computer.score++
                resetBall()
            }
            else if (ball.posX + ball.radius > canvas.width) {
                user.score++
                resetBall()
            }
            // If a player reach a score of 10, display the reset button and stop the current game
            switch (5) {
                case user.score:
                    clearInterval(gameInterval)
                    drawText('You win !', canvas.width/2, canvas.height/2, 'green')
                    canvas.style.display = 'none'
                    document.querySelector('#Pong-Start').style.display = 'block'
                    break
                case computer.score:
                    clearInterval(gameInterval)
                    drawText('Computer win !', canvas.width/2, canvas.height/2, 'green')
                    canvas.style.display = 'none'
                    document.querySelector('#Pong-Start').style.display = 'block'
                    break
                default:
                    break;
            }

            // Computer AI
            computer.posY += (ball.posY-(computer.posY + computer.height / 2)) * computer.level
            // For testing only !
            // user.posY += (ball.posY-(user.posY + user.height / 2)) * computerLevel
        }

        // Reset the ball whenever a player score
        const resetBall = () => {
            ball.posX = canvas.width / 2
            ball.posY = canvas.height / 2
            ball.speed = 5
            ball.velocityX = -ball.velocityX
        }

        // User's control
        const movePaddle = (e) => {
            let rect = canvas.getBoundingClientRect()
            user.posY = (e.clientY - rect.top) - (user.height/2)
        }
        canvas.addEventListener("mousemove", movePaddle)

        // Rendering game every 20ms
        const game = () => {
            update() // Collisions, movements, score
            render() // Creation of paddles, ball, score text and background
        }

        // Give the interval an ID
        let gameInterval

        // Function reseting the game
        const startGame = () => {
            canvas.style.display = 'block'
            // Reset the score
            user.score = 0
            computer.score = 0
            // Set the interval again
            gameInterval = setInterval(game, 20)
            // Remove the "play again" button
            document.querySelector('#Pong-Start').style.display = 'none'
        }
        // Add an eventListener to the "Play again" button
        document.querySelector('#Pong-Start').addEventListener('click', startGame)
    }

    useEffect(() => {
        createGame()
    }, [])

    return (

        <div className="Pong">
            <h3 className="Pong-Title">P<span className="Pong-o">o</span>ng, the <span className="Pong-o">o</span>riginal game</h3>
            <input id="Pong-Start" type="button" value="Start" />
            <canvas id="Pong-Canvas" width="800" height="500" />
        </div>
    )
}

export default Pong