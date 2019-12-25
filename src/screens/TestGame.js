// Librairies
import React, { useEffect } from 'react'

// Styles
import './TestGame.css'

const TestGame = () => {

    const game = () => {
        // Canvas init
        const canvas = document.querySelector('#TestGame-Canvas')
        const context = canvas.getContext("2d")

        /* Basics settings */
        // Unit for the game (px)
        const unit = 32
        // Player object
        const player = {
            movementAuth: true,
            posX: 4.5 * unit,
            posY: 4.5 * unit,
            width: unit,
            height: unit,
            hp: 100,
            attack: 25,
            slotNb: 10,
            inventory: [
                {
                    name: "Silver Sword"
                }
            ]
        }
        const map1 = {
            obstacles: [
                { posX: 0, posY: 0, width: 3 * unit, height: canvas.height, color: 'darkgreen' },
                { posX: 3 * unit, posY: canvas.height - 3 * unit, width: 29 * unit, height: 3 * unit, color: 'darkgreen' },
                { posX: 3 * unit, posY: 0, width: 29 * unit, height: 3 * unit, color: 'darkgreen' },
                { posX: canvas.width - 3 * unit, posY: 3 * unit, width: 3 * unit, height: 8 * unit, color: 'darkgreen' }
            ],
            paths: [
                { posX: 4 * unit, posY: 4 * unit, width: 2 * unit, height: canvas.height - 8 * unit, color: 'rgb(245, 187, 111)' },
                { posX: 6 * unit, posY: canvas.height - 6 * unit, width: canvas.width - 6 * unit, height: 2 * unit, color: 'rgb(245, 187, 111)' },
                { posX: 6 * unit, posY: 4 * unit, width: 22 * unit, height: 2 * unit, color: 'rgb(245, 187, 111)' },
                { posX: canvas.width - 6 * unit, posY: 6 * unit, width: 2 * unit, height: 6 * unit, color: 'rgb(245, 187, 111)' }
            ],
            npc: [
                { posX: 7 * unit, posY: 11 * unit, width: unit, height: unit, color: 'yellow', name: 'Jean', text: 'Hey, watcha doin\' ?' },
                { posX: canvas.width - 7 * unit, posY: 6 * unit, width: unit, height: unit, color: 'yellow', name: 'Mom', text: 'Hello son, we\'ll live here now.\n I\'ve taken your stuff to your room, fell free to explore !' }
            ]
        }

        /* Render the game */
        const render = () => {
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height)
            // Draw the map
            context.fillStyle = 'green'
            context.fillRect(0, 0, canvas.width, canvas.height)
            // Draw the obstacles
            for (let i = 0; i < map1.obstacles.length; i++) {
                context.fillStyle = map1.obstacles[i].color
                context.fillRect(map1.obstacles[i].posX, map1.obstacles[i].posY, map1.obstacles[i].width, map1.obstacles[i].height)
            }
            // Draw the path
            for (let i = 0; i < map1.paths.length; i++) {
                context.fillStyle = map1.paths[i].color
                context.fillRect(map1.paths[i].posX, map1.paths[i].posY, map1.paths[i].width, map1.paths[i].height)
            }
            // Draw the npcs
            for (let i = 0; i < map1.npc.length; i++) {
                context.fillStyle = map1.npc[i].color
                context.fillRect(map1.npc[i].posX, map1.npc[i].posY, map1.npc[i].width, map1.npc[i].height)
            }
            // Draw the player
            context.fillStyle = 'red'
            context.fillRect(player.posX, player.posY, player.width, player.height)
        }

        /* Collisions */
        const collision = (direction) => {
            switch (direction) {
                case 'right':
                    // With map
                    if (player.posX + player.width >= canvas.width) {
                        return true
                    }
                    // With map obstacles
                    for (let i = 0; i < map1.obstacles.length; i++) {
                        if (((player.posX + player.width) === map1.obstacles[i].posX) && (player.posY < (map1.obstacles[i].posY + map1.obstacles[i].height)) && ((player.posY + player.height) > map1.obstacles[i].posY)) {
                            return true
                        }
                    }
                    // With npcs
                    for (let i = 0; i < map1.npc.length; i++) {
                        if (((player.posX + player.width) === map1.npc[i].posX) && (player.posY < (map1.npc[i].posY + map1.npc[i].height)) && ((player.posY + player.height) > map1.npc[i].posY)) {
                            return true
                        }
                    }
                    break
                case 'left':
                    // With map
                    if (player.posX <= 0) {
                        return true
                    }
                    // With map obstacles
                    for (let i = 0; i < map1.obstacles.length; i++) {
                        if ((player.posX === (map1.obstacles[i].posX + map1.obstacles[i].width)) && (player.posY < (map1.obstacles[i].posY + map1.obstacles[i].height)) && ((player.posY + player.height) > map1.obstacles[i].posY)) {
                            return true
                        }
                    }
                    // With npc
                    for (let i = 0; i < map1.npc.length; i++) {
                        if ((player.posX === (map1.npc[i].posX + map1.npc[i].width)) && (player.posY < (map1.npc[i].posY + map1.npc[i].height)) && ((player.posY + player.height) > map1.npc[i].posY)) {
                            return true
                        }
                    }
                    break
                case 'up':
                    // With map
                    if (player.posY <= 0) {
                        return true
                    }
                    // With map obstacles
                    for (let i = 0; i < map1.obstacles.length; i++) {
                        if ((player.posY === (map1.obstacles[i].posY + map1.obstacles[i].height)) && (player.posX < (map1.obstacles[i].posX + map1.obstacles[i].width)) && ((player.posX + player.width) > map1.obstacles[i].posX)) {
                            return true
                        }
                    }
                    // With npc
                    for (let i = 0; i < map1.npc.length; i++) {
                        if ((player.posY === (map1.npc[i].posY + map1.npc[i].height)) && (player.posX < (map1.npc[i].posX + map1.npc[i].width)) && ((player.posX + player.width) > map1.npc[i].posX)) {
                            return true
                        }
                    }
                    break
                case 'down':
                    // With map
                    if (player.posY + player.height >= canvas.height) {
                        return true
                    }
                    // With map obstacles
                    for (let i = 0; i < map1.obstacles.length; i++) {
                        if (((player.posY + player.height) === map1.obstacles[i].posY) && (player.posX < (map1.obstacles[i].posX + map1.obstacles[i].width)) && ((player.posX + player.width) > map1.obstacles[i].posX)) {
                            return true
                        }
                    }
                    // With npc
                    for (let i = 0; i < map1.npc.length; i++) {
                        if (((player.posY + player.height) === map1.npc[i].posY) && (player.posX < (map1.npc[i].posX + map1.npc[i].width)) && ((player.posX + player.width) > map1.npc[i].posX)) {
                            return true
                        }
                    }
                    break
                default:
                    break
            }
        }

        /* Interaction */
        const interact = () => {
            // NPC interactions
            for (let i = 0; i < map1.npc.length; i++) {
                // If there's a collision with a npc during interacton
                if ((player.posY + player.height >= map1.npc[i].posY) && (player.posY <= map1.npc[i].posY + map1.npc[i].height) && (player.posX + player.width >= map1.npc[i].posX) && (player.posX <= map1.npc[i].posX + map1.npc[i].width)) {
                    if (player.movementAuth) {
                        player.movementAuth = false
                        clearInterval(start)
                        // Text box
                        context.fillStyle = 'black'
                        context.fillRect(0, canvas.height - 3 * unit, canvas.width, 3 * unit)
                        // Text
                        context.fillStyle = 'white'
                        context.font = '20px fantasy'
                        context.fillText(`${map1.npc[i].name} : ${map1.npc[i].text}`, unit, canvas.height - unit)
                    }
                    else {
                        start = setInterval(render, 10)
                        player.movementAuth = true
                    }
                }
            }
        }

        /* Display inventory */
        const displayInventory = () => {
            if (player.movementAuth) {
                // Remove movement ability && current game
                player.movementAuth = false
                clearInterval(start)
                // Inventory box
                context.fillStyle = "grey"
                context.fillRect(unit, unit, canvas.width / 2 - unit, canvas.height - 2 * unit)
                // Inventory title
                context.fillStyle = 'brown'
                context.font = '30px fantasy'
                context.fillText("Inventory", 2 * unit, 2 * unit)
                // Inventory slots
                let nbCol = 4
                let nbRow = Math.ceil(player.slotNb / nbCol)
                // Me.exe has ceased to function :
                for (let i = 0; i < player.slotNb; i++) {
                    for (let j = 0; j < nbRow; j++) {
                        // If the current slot is between the current row * the current column
                        if (i < nbCol * (j + 1) && i >= nbCol * j) {
                            context.strokeStyle = "black"
                            // "3 * unit" to create a margin, "3 * (i - (nbCol * j)) * unit" to create the space between the previous slot (I use j because I want all slots to be ordered, but if I don't reduce the i value, the slots will be further)
                            let currentXPos = 3 * unit + 3 * (i - (nbCol * j)) * unit
                            // Define the y pos of the slot according to its row
                            let currentYPos = 3 * (j + 1) * unit
                            // The slot is a square, so its width and height will be equal
                            let slotDimension = 2 * unit
                            context.strokeRect(currentXPos, currentYPos, slotDimension, slotDimension)
                        }
                    }
                }
            }
            else {
                start = setInterval(render, 10)
                player.movementAuth = true
            }
        }

        /* Controls */
        const controls = (e) => {
            const pressedKey = e.keyCode
            if ([37, 38, 39, 40, 69, 9].includes(pressedKey)) {
                e.preventDefault()
            }
            // If I press left arrow and there's no collision
            if (pressedKey === 37 && !collision('left') && player.movementAuth) {
                player.posX -= unit / 2
            }
            // If I press right arrow and there's no collision
            else if (pressedKey === 39 && !collision('right') && player.movementAuth) {
                player.posX += unit / 2
            }
            // If I press down arrow and there's no collision
            else if (pressedKey === 40 && !collision('down') && player.movementAuth) {
                player.posY += unit / 2
            }
            // If I press up arrow and there's no collision
            else if (pressedKey === 38 && !collision('up') && player.movementAuth) {
                player.posY -= unit / 2
            }
            else if (pressedKey === 69) {
                interact()
            }
            else if (pressedKey === 9) {
                displayInventory()
            }
        }
        // Will add keydown listener
        document.addEventListener('keydown', controls)

        // Start the game
        let start = setInterval(render, 10)
    }

    // Will do game function only when the component is done
    useEffect(() => {
        game()
    }, [])

    return (
        <div className="TestGame">
            <h3>Test game</h3>
            <canvas id="TestGame-Canvas" width="1024px" height="576px" />
        </div>
    )
}

export default TestGame