"use strict";

/**
 * Represents a Minecraft block.
 */
class Block {

    constructor(material) {
        this.material = material;
    }

}

Block.faces = [
    // X - 1 = West
    {
        side: [-1, 0, 0],
        corners: [
            [0, 1, 0],
            [0, 0, 0],
            [0, 1, 1],
            [0, 0, 1]
        ]
    },
    // X + 1 = East
    {
        side: [1, 0, 0],
        corners: [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 0],
            [1, 0, 0]
        ]
    },
    // Y - 1 = Down
    {
        side: [0, -1, 0],
        corners: [
            [1, 0, 1],
            [0, 0, 1],
            [1, 0, 0],
            [0, 0, 0]
        ]
    },
    // Y + 1 = Up
    {
        side: [0, 1, 0],
        corners: [
            [0, 1, 1],
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 0]
        ]
    },
    // Z - 1 = North
    {
        side: [0, 0, -1],
        corners: [
            [1, 0, 0],
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]
    },
    // Z + 1 = South
    {
        side: [0, 0, 1],
        corners: [
            [0, 0, 1],
            [1, 0, 1],
            [0, 1, 1],
            [1, 1, 1]
        ]
    }
]