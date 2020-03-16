"use strict";

/**
 * Represents a Minecraft world.
 */
class World {

    constructor(name) {
        /** The unique name of this world. */
        this.name = name;
        /** The chunks in this world. */
        this.chunks = {};
    }

    /**
     * Gets a chunk, using chunk coordinates.
     */
    getChunk(chunkX, chunkZ) {
        let chunk = this.chunks[`${chunkX},${chunkZ}`];
        if (!chunk) {
            chunk = new Chunk(chunkX, chunkZ);
            this.chunks[`${chunkX},${chunkZ}`] = chunk;
        }
        return chunk;
    }

    /**
     * Sets a chunk, using chunk coordinates, to the specified value.
     */
    setChunk(chunkX, chunkZ, chunkData) {
        this.chunks[`${chunkX},${chunkZ}`] = chunkData;
    }

    /**
     * Gets a chunk, using world block coordinates.
     */
    getChunkByBlock(x, z) {
        const chunkX = Math.floor(x / 16);
        const chunkZ = Math.floor(z / 16);
        //logMessage(`Chunk: ${x}->${chunkX} ${z}->${chunkZ}`);

        return this.getChunk(chunkX, chunkZ);
    }

    /**
     * Gets a block in this world, using world block coordinates.
     */
    getBlock(x, y, z) {
        const chunk = this.getChunkByBlock(x, z);

        const localX = ((x % 16) + 16) % 16;
        const localZ = ((z % 16) + 16) % 16;
        //logMessage(`Local: ${x}->${localX} ${z}->${localZ}`);

        chunk.getBlock(localX, y, localZ);
    }

    /**
     * Sets a block in this world, using world block coordinates.
     */
    setBlock(x, y, z, blockData) {
        const chunk = this.getChunkByBlock(x, z);

        const localX = ((x % 16) + 16) % 16;
        const localZ = ((z % 16) + 16) % 16;
        //logMessage(`Local: ${x}->${localX} ${z}->${localZ}`);

        chunk.setBlock(localX, y, localZ, blockData);
    }

}