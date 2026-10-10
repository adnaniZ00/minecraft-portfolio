// Define all walls, hills, and climbable blocks here!
export const WORLD_OBJECTS = [
  // --- THE 4 GIANT WORLD EDGES ---
  { name: "North Edge", minX: -1000, maxX: 1000, minZ: -1000, maxZ: -187, groundHeight: 1000 },
  { name: "South Edge", minX: -1000, maxX: 1000, minZ: 60, maxZ: 1000, groundHeight: 1000 },
  { name: "West Edge", minX: -1000, maxX: -179, minZ: -1000, maxZ: 1000, groundHeight: 1000 },
  { name: "East Edge", minX: 104, maxX: 1000, minZ: -1000, maxZ: 1000, groundHeight: 1000 },

  // --- THE SMALL JAGGY HILL BOXES ---
  { name: "Hill Segment (Z: -187 to -180)", minX: -250, maxX: -147, minZ: -187, maxZ: -185, groundHeight: 1000 },
  { name: "Hill Segment (Z: -180 to -178)", minX: -250, maxX: -152, minZ: -185, maxZ: -182, groundHeight: 1000 },
  { name: "Hill Segment (Z: -178 to -172)", minX: -250, maxX: -156, minZ: -182, maxZ: -180, groundHeight: 1000 },
  { name: "Hill Segment (Z: -172 to -168)", minX: -250, maxX: -158, minZ: -180, maxZ: -173, groundHeight: 1000 },
  { name: "Hill Segment (Z: -168 to -159)", minX: -250, maxX: -161, minZ: -173, maxZ: -171, groundHeight: 1000 },
  { name: "Hill Segment (Z: -159 to -144)", minX: -250, maxX: -164, minZ: -171, maxZ: -162, groundHeight: 1000 },
  { name: "Hill Segment (Z: -144 to -136)", minX: -250, maxX: -168, minZ: -162, maxZ: -147, groundHeight: 1000 },
  { name: "Hill Segment (Z: -136 to -130)", minX: -250, maxX: -171, minZ: -147, maxZ: -138, groundHeight: 1000 },
  { name: "Hill Segment (Z: -130 to -120)", minX: -250, maxX: -174, minZ: -138, maxZ: -132, groundHeight: 1000 },
  { name: "Hill Segment (Z: -130 to -120)", minX: -250, maxX: -177, minZ: -132, maxZ: -129, groundHeight: 1000 },

  // --- SAND BOUNDARIES ---
  { name: "Sand Boundary (Z: 24)", minX: -250, maxX: -178, minZ: 24, maxZ: 26, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 27)", minX: -250, maxX: -176, minZ: 26, maxZ: 27, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 28)", minX: -250, maxX: -171, minZ: 27, maxZ: 30, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 32 updated)", minX: -250, maxX: -162, minZ: 30, maxZ: 33, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 32 updated)", minX: -250, maxX: -147, minZ: 33, maxZ: 36, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 32 updated)", minX: -250, maxX: -135, minZ: 36, maxZ: 39, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 35)", minX: -250, maxX: -126, minZ: 39, maxZ: 42, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 35)", minX: -250, maxX: -120, minZ: 42, maxZ: 44, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 35)", minX: -250, maxX: -117, minZ: 44, maxZ: 51, groundHeight: 1000 },
  { name: "Sand Boundary (Z: 35)", minX: -250, maxX: -114, minZ: 51, maxZ: 60, groundHeight: 1000 },

  // --- FOREST BOUNDARIES (South-East Corner) ---
  { name: "Forest (X: 64-68)", minX: 64, maxX: 68, minZ: 50, maxZ: 1000, groundHeight: 1000 },
  { name: "Forest (X: 68-72)", minX: 68, maxX: 72, minZ: 48, maxZ: 1000, groundHeight: 1000 },
  { name: "Forest (X: 72-85)", minX: 72, maxX: 85, minZ: 44, maxZ: 1000, groundHeight: 1000 },
  { name: "Forest (X: 85-98)", minX: 85, maxX: 98, minZ: 40, maxZ: 1000, groundHeight: 1000 },
  { name: "Forest (X: 98-104)", minX: 98, maxX: 104, minZ: 34, maxZ: 1000, groundHeight: 1000 },
  { name: "Forest Jut (Z: 13-16)", minX: 100, maxX: 104, minZ: 13, maxZ: 16, groundHeight: 1000 },

  // --- LAVA & STONE STRUCTURES (Base Layer Y: 9.0) ---
  { name: "Stone Strip 1", minX: 66, maxX: 69, minZ: -33, maxZ: -30, groundHeight: 9.0 },
  { name: "Stone Strip 2", minX: 60, maxX: 71.9, minZ: -36, maxZ: -33, groundHeight: 9.0 },
  { name: "Stone Strip 3", minX: 57, maxX: 66, minZ: -42, maxZ: -36, groundHeight: 9.0 },
  { name: "Stone Strip 4", minX: 54, maxX: 63, minZ: -44, maxZ: -42, groundHeight: 9.0 },
  { name: "Stone Strip 5", minX: 56, maxX: 63, minZ: -47.5, maxZ: -44, groundHeight: 9.0 },
  { name: "Stone Strip 6", minX: 60, maxX: 63, minZ: -51, maxZ: -47.5, groundHeight: 9.0 },

  // --- SECOND LAYER (Y: 12.0) ---
  { name: "Stone L2 Strip 1", minX: 60, maxX: 63, minZ: -42, maxZ: -39, groundHeight: 12.0 },
  { name: "Stone L2 Strip 2", minX: 57, maxX: 63, minZ: -44.5, maxZ: -42, groundHeight: 12.0 },

  // --- LAVA BARRIER (Y: 1000) ---
  { name: "Lava Strip 1", minX: 77, maxX: 90, minZ: -36, maxZ: -33, groundHeight: 1000 },
  { name: "Lava Strip 2", minX: 74, maxX: 93, minZ: -39, maxZ: -36, groundHeight: 1000 },
  { name: "Lava Strip 3", minX: 68, maxX: 96, minZ: -42, maxZ: -39, groundHeight: 1000 },
  { name: "Lava Strip 4", minX: 66, maxX: 96, minZ: -45, maxZ: -42, groundHeight: 1000 },
  { name: "Lava Strip 5", minX: 63, maxX: 93, minZ: -54, maxZ: -45, groundHeight: 1000 },
  { name: "Lava Strip 6", minX: 66, maxX: 90, minZ: -57, maxZ: -54, groundHeight: 1000 },
  { name: "Lava Strip 7", minX: 72, maxX: 90, minZ: -60, maxZ: -57, groundHeight: 1000 },
  { name: "Lava Strip 8", minX: 78, maxX: 87, minZ: -63, maxZ: -60, groundHeight: 1000 },
  { name: "Lava Strip 9", minX: 81, maxX: 84, minZ: -66, maxZ: -63, groundHeight: 1000 },

  // --- WATER BARRIER (Y: 1000) ---
  { name: "Water Strip 1", minX: -39, maxX: -33, minZ: 15, maxZ: 18, groundHeight: 1000 },
  { name: "Water Strip 2", minX: -42, maxX: -30, minZ: 18, maxZ: 21, groundHeight: 1000 },
  { name: "Water Strip 3", minX: -45, maxX: -30, minZ: 21, maxZ: 27, groundHeight: 1000 },
  { name: "Water Strip 4", minX: -45, maxX: -33, minZ: 27, maxZ: 30, groundHeight: 1000 },
  { name: "Water Strip 5", minX: -45, maxX: -42, minZ: 30, maxZ: 42, groundHeight: 1000 },
  { name: "Water Strip 6", minX: -48, maxX: -42, minZ: 42, maxZ: 45, groundHeight: 1000 },
  { name: "Water Strip 7", minX: -51, maxX: -42, minZ: 45, maxZ: 48, groundHeight: 1000 },
  { name: "Water Strip 8", minX: -48, maxX: -45, minZ: 48, maxZ: 51, groundHeight: 1000 },

  // --- WATER HILLS (Base Layer Y: 9.0) ---
  { name: "Water Hill Strip 1", minX: -51, maxX: -45, minZ: 23, maxZ: 26, groundHeight: 9.0 },
  { name: "Water Hill Strip 2", minX: -57, maxX: -45, minZ: 26, maxZ: 29, groundHeight: 9.0 },
  { name: "Water Hill Strip 3", minX: -63, maxX: -45, minZ: 29, maxZ: 33, groundHeight: 9.0 },
  { name: "Water Hill Strip 3", minX: -42, maxX: -36, minZ: 30, maxZ: 33, groundHeight: 9.0 },
  { name: "Water Hill Strip 4", minX: -65, maxX: -45, minZ: 33, maxZ: 35.5, groundHeight: 9.0 },
  { name: "Water Hill Strip 4", minX: -42, maxX: -30, minZ: 33, maxZ: 35.5, groundHeight: 9.0 },
  { name: "Water Hill Strip 5", minX: -72, maxX: -45, minZ: 35.5, maxZ: 39, groundHeight: 9.0 },
  { name: "Water Hill Strip 5", minX: -42, maxX: -27, minZ: 35.5, maxZ: 39, groundHeight: 9.0 },
  { name: "Water Hill Strip 6", minX: -75, maxX: -45, minZ: 39, maxZ: 42, groundHeight: 9.0 },
  { name: "Water Hill Strip 6", minX: -42, maxX: -24, minZ: 39, maxZ: 42, groundHeight: 9.0 },
  { name: "Water Hill Strip 7", minX: -78, maxX: -48, minZ: 42, maxZ: 45, groundHeight: 9.0 },
  { name: "Water Hill Strip 7", minX: -42, maxX: -18, minZ: 42, maxZ: 48, groundHeight: 9.0 },
  { name: "Water Hill Strip 8", minX: -78, maxX: -51, minZ: 45, maxZ: 48, groundHeight: 9.0 },
  { name: "Water Hill Strip 8", minX: -45, maxX: -51, minZ: 45, maxZ: 48, groundHeight: 9.0 },
  { name: "Water Hill Strip 9", minX: -75, maxX: -48, minZ: 48, maxZ: 51, groundHeight: 9.0 },
  { name: "Water Hill Strip 9", minX: -45, maxX: -21, minZ: 48, maxZ: 51, groundHeight: 9.0 },
  { name: "Water Hill Strip 10", minX: -72, maxX: -21, minZ: 51, maxZ: 54, groundHeight: 9.0 },
  { name: "Water Hill Strip 11", minX: -69, maxX: -24, minZ: 54, maxZ: 57, groundHeight: 9.0 },
  { name: "Water Hill Strip 12", minX: -63, maxX: -33, minZ: 57, maxZ: 60, groundHeight: 9.0 },

  // --- WATER HILLS (Second Layer Y: 12.0) ---
  { name: "Water Hill L2 Strip 1", minX: -54, maxX: -48, minZ: 30, maxZ: 33, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 2", minX: -54, maxX: -45, minZ: 33, maxZ: 35.5, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 3", minX: -57, maxX: -45, minZ: 35.5, maxZ: 39, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 4", minX: -60, maxX: -45, minZ: 39, maxZ: 42, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 4", minX: -42, maxX: -36, minZ: 39, maxZ: 42, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 5", minX: -66, maxX: -48, minZ: 42, maxZ: 45, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 5 Tree", minX: -57, maxX: -54, minZ: 41, maxZ: 45, groundHeight: 1000 },
  { name: "Water Hill L2 Strip 5", minX: -42, maxX: -33, minZ: 42, maxZ: 45, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 6", minX: -63, maxX: -51, minZ: 45, maxZ: 48, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 6", minX: -42, maxX: -30, minZ: 45, maxZ: 48, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 7", minX: -59.5, maxX: -48, minZ: 48, maxZ: 51, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 7", minX: -45, maxX: -30, minZ: 48, maxZ: 51, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 8", minX: -57, maxX: -33, minZ: 51, maxZ: 54, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 9", minX: -57, maxX: -42, minZ: 54, maxZ: 57, groundHeight: 12.0 },
  { name: "Water Hill L2 Strip 10", minX: -54, maxX: -48, minZ: 57, maxZ: 60, groundHeight: 12.0 },

  // --- HOUSE BOUNDARY ---
  { name: "House Barrier 5", minX: -49, maxX: -12, minZ: -178, maxZ: -174, groundHeight: 1000 },
  { name: "House Barrier 4", minX: -49, maxX: -7.5, minZ: -174, maxZ: -162, groundHeight: 1000 },
  { name: "House Barrier 3", minX: -49, maxX: -12, minZ: -162, maxZ: -149, groundHeight: 1000 },
  { name: "House Barrier 2", minX: -49, maxX: -12, minZ: -149, maxZ: -141, groundHeight: 10 },
  { name: "House Barrier 1", minX: -49, maxX: -12, minZ: -141, maxZ: -137, groundHeight: 8 },
  { name: "Chest and iron", minX: -40, maxX: -33, minZ: -149, maxZ: -145, groundHeight: 14 },
  { name: "Chair", minX: -20.5, maxX: -16, minZ: -149, maxZ: -145, groundHeight: 14 },

  // Example of a Stone Block you can jump on
  { name: "Test Stone Block", minX: -1000, maxX: -1000, minZ: 1000, maxZ: 1000, groundHeight: 7.5 },
];
