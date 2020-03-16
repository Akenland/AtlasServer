"use strict";

/**
 * Represents a Minecraft Chunk - a 16x256x16 section of blocks.
 */
class Chunk {

    constructor(chunkX, chunkZ) {
        /** The chunk x-coordinate of this chunk. Not a block coordinate. */
        this.chunkX = chunkX;
        /** The chunk z-coordinate of this chunk. Not a block coordinate. */
        this.chunkZ = chunkZ;

        /** The world x-coordinate where this chunk begins, where the local chunk x-coordinate is 0. */
        this.startX = chunkX * 16;
        /** The world z-coordinate where this chunk begins, where the local chunk z-coordinate is 0. */
        this.startZ = chunkZ * 16;

        /** The blocks in this chunk. */
        this.blocks = {};

        /** The mesh for this chunk. */
        //this.mesh = {};
    }

    /**
     * Gets a block in this chunk, using local chunk coordinates (x and z: 0-15, y: 0-255).
     */
    getBlock(localX, y, localZ) {
        if (isValidLocalCoordinates(localX, y, localZ)) {
            return this.blocks[`${localX},${y},${localZ}`];
        } else {
            logMessage(`Invalid getBlock coordinates: ${localX} ${y} ${localZ} in ${this.chunkX} ${this.chunkZ}`);
        }
    }

    /**
     * Sets a block in this chunk, using local chunk coordinates (x and z: 0-15, y: 0-255).
     */
    setBlock(localX, y, localZ, blockData) {
        if (isValidLocalCoordinates(localX, y, localZ)) {
            this.blocks[`${localX},${y},${localZ}`] = blockData;
            this.updateGeometry();
        } else {
            logMessage(`Invalid setBlock coordinates: ${localX} ${y} ${localZ} in ${this.chunkX} ${this.chunkZ}`);
        }
    }

    /**
     * Generates geometry data for this chunk.
     */
    generateGeometryData() {
        const positions = [];
        const normals = [];
        const indices = [];

        for (let localX = 0; localX < 16; ++localX) {
            const x = this.startX + localX;
            for (let localZ = 0; localZ < 16; ++localZ) {
                const z = this.startZ + localZ;
                for (let y = 0; y < 256; ++y) {

                    // Get every block in this chunk
                    const block = this.getBlock(localX, y, localZ);

                    // If block exists
                    if (block && block !== 0) {
                        for (const { side, corners } of Block.faces) {

                            // Get neighboring block, may be in another chunk
                            const neighbor = world.getBlock(x + side[0], Math.max(y + side[1], 0), z + side[2]);

                            // If no neighbor exists (block is exposed to air on this side)
                            if (!neighbor) {
                                // Generate mesh data
                                const ndx = positions.length / 3;
                                for (const pos of corners) {
                                    positions.push(pos[0] + localX, pos[1] + y, pos[2] + localZ);
                                    normals.push(...side);
                                }
                                indices.push(
                                    ndx, ndx + 1, ndx + 2,
                                    ndx + 2, ndx + 1, ndx + 3,
                                );
                            }
                        }
                    }
                }
            }
        }

        return { positions, normals, indices };
    }

    /**
     * Updates the geometry for the 3D map scene.
     */
    updateGeometry() {
        const geometry = this.mesh ? this.mesh.geometry : new THREE.BufferGeometry();

        const { positions, normals, indices } = this.generateGeometryData();

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        geometry.setIndex(indices);

        if (!this.mesh) {
            const texture = new THREE.TextureLoader().load("assets\\stone.png");
            // Prevent anti-aliasing to preserve pixelated look
            texture.magFilter = THREE.NearestFilter;
            //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            //texture.repeat.set(16, 16);

            const material = new THREE.MeshLambertMaterial({ map: texture });

            this.mesh = new THREE.Mesh(geometry, material);

            this.mesh.name = `${this.chunkX},${this.chunkZ}`;

            this.mesh.position.set(this.startX, 0, this.startZ);

            scene.add(this.mesh);
        }
    }

}

/**
 * Verifies that a set of local chunk coordinates are valid.
 */
function isValidLocalCoordinates(localX, y, localZ) {
    return !(localX < 0 || localX > 15 || y < 0 || y > 255 || localZ < 0 || localZ > 15);
}