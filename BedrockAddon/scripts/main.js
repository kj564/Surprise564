import { system, world } from "@minecraft/server";

const TICK_INTERVAL = 20;

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn) return;
  system.runTimeout(() => {
    player.sendMessage("§a[ VoxelCraft ] §fSelamat datang! Script API aktif.");
    player.sendMessage("§7Behavior pack ini adalah fondasi fitur Bedrock, terpisah dari game browser.");
  }, 20);
});

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const p = player.location;
    const dimension = player.dimension.id.replace("minecraft:", "");
    player.onScreenDisplay.setActionBar("§aVoxelCraft §7| §f" + dimension + " §8| §fXYZ " + Math.floor(p.x) + ", " + Math.floor(p.y) + ", " + Math.floor(p.z));
  }
}, TICK_INTERVAL);
