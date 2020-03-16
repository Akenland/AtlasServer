"use strict";

class World {

    constructor() {
        this.chunks = {};
        this.chunkMeshes = {};
    }

    getChunkId(x, z) {
        const chunkX = Math.floor(x / 16);
        const chunkZ = Math.floor(z / 16);
        return `${chunkX},${chunkZ}`;
    }

    getChunkFromBlock(x, z) {
        const chunkId = this.getChunkId(x, z);
        let chunk = this.chunks[chunkId];
        if (!chunk) {
            chunk = this.createChunk();
            this.chunks[chunkId] = chunk;
        }
        return chunk;
    }

    createChunk() {
        return new Array(65536);
    }

    getChunkOffset(x, y, z) {
        const chunk = this.getChunkFromBlock(x, z);

        const localX = x % 16;
        const localZ = z % 16;

        const offset = y * 256 + localZ * 16 + localX;

        return offset;
    }

    getBlock(x, y, z) {
        let chunk = this.getChunkFromBlock(x, z);
        return chunk[this.getChunkOffset(x, y, z)];
    }

    setBlock(x, y, z, material) {
        let chunk = this.getChunkFromBlock(x, z);
        chunk[this.getChunkOffset(x, y, z)] = material;

        this.updateBlockGeometry(x, y, z);
    }

    generateChunkGeometryData(chunkX, chunkZ) {
        const positions = [];
        const normals = [];
        const indices = [];

        const startX = chunkX * 16;
        const startZ = chunkZ * 16;

        for (let localX = 0; localX < 16; ++localX) {
            const x = startX + localX;
            for (let localZ = 0; localZ < 16; ++localZ) {
                const z = startZ + localZ;
                for (let y = 0; y < 256; ++y) {

                    const block = this.getBlock(x, y, z);

                    if (block) {
                        for (const { side, corners } of World.faces) {
                            const neighbor = this.getBlock(x + side[0], y + side[1], z + side[2]);
                            if (!neighbor) {
                                // Block is exposed to air on this side
                                const ndx = positions.length / 3;
                                for (const pos of corners) {
                                    positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
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


    updateBlockGeometry(x, y, z) {
        const neighborOffsets = [
            // Self
            [0, 0, 0],
            // West
            [-1, 0, 0],
            // East
            [1, 0, 0],
            // Down
            [0, -1, 0],
            // Up
            [0, 1, 0],
            // North
            [0, 0, -1],
            // South
            [0, 0, 1]
        ];

        const updatedChunks = {};

        for (const offset of neighborOffsets) {
            const neighborX = x + offset[0];
            const neighborZ = z + offset[2];
            const neighborChunkId = world.getChunkId(neighborX, neighborZ);
            if (!updatedChunks[neighborChunkId]) {
                updatedChunks[neighborChunkId] = true;
                this.updateChunkGeometry(neighborX, neighborZ);
            }
        }
    }

    updateChunkGeometry(x, z) {
        const chunkX = Math.floor(x / 16);
        const chunkZ = Math.floor(z / 16);
        const chunkId = world.getChunkId(x, z);

        let mesh = this.chunkMeshes[chunkId];

        const geometry = mesh ? mesh.geometry : new THREE.BufferGeometry();

        const { positions, normals, indices } = this.generateChunkGeometryData(chunkX, chunkZ);

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        geometry.setIndex(indices);

        if (!mesh) {
            const material = new THREE.MeshLambertMaterial({ color: 'gray' });

            mesh = new THREE.Mesh(geometry, material);

            mesh.name = chunkId;
            this.chunkMeshes[chunkId] = mesh;

            mesh.position.set(chunkX * 16, 0, chunkZ * 16);

            scene.add(mesh);
        }
    }

}

World.faces = [
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