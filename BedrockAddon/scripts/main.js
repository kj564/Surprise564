// VoxelCraft Bedrock Addon — main.js
// Uses @minecraft/server v2.x stable Script API.
// References:
//   https://jaylydev.github.io/scriptapi-docs/
//   https://learn.microsoft.com/en-us/minecraft/creator/reference/?view=minecraft-bedrock-stable
//   https://github.com/MicrosoftDocs/minecraft-creator

import { system, world } from "@minecraft/server";

// ============================================================
//  Player welcome + persistent stats via dynamic properties
// ============================================================

const WELCOME_TITLE = "§a§lVoxelCraft§r";
const STATS_KEY = "voxelcraft:stats";

// Commands that change the world or grant gameplay advantages require this tag.
// Grant it from the server console with: /tag <player> add voxelcraft_admin
const ADMIN_TAG = "voxelcraft_admin";
const ADMIN_COMMANDS = new Set(["give", "fly", "heal", "time", "weather", "tp", "kit"]);

function isVoxelCraftAdmin(player) {
  try { return player.hasTag(ADMIN_TAG); }
  catch { return false; }
}

function loadStats(player) {
  try {
    const raw = world.getDynamicProperty(`${STATS_KEY}:${player.id}`);
    return raw ? JSON.parse(raw) : { coins: 0, blocksBroken: 0, blocksPlaced: 0, mobsKilled: 0, joins: 0 };
  } catch {
    return { coins: 0, blocksBroken: 0, blocksPlaced: 0, mobsKilled: 0, joins: 0 };
  }
}

function saveStats(player, stats) {
  try {
    world.setDynamicProperty(`${STATS_KEY}:${player.id}`, JSON.stringify(stats));
  } catch (err) {
    console.warn(`[VoxelCraft] Failed to save stats for ${player.name}: ${err}`);
  }
}

// ============================================================
//  Welcome on first spawn
// ============================================================

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn) return;
  system.runTimeout(() => {
    const stats = loadStats(player);
    stats.joins = (stats.joins || 0) + 1;
    saveStats(player, stats);
    player.sendMessage(`${WELCOME_TITLE} §fSelamat datang, §e${player.name}§f!`);
    player.sendMessage(`§7  • Kunjungan ke-${stats.joins}`);
    player.sendMessage(`§7  • Koin: §e${stats.coins || 0}§7 | Blok dihancurkan: §f${stats.blocksBroken || 0}`);
    player.sendMessage(`§7  • Ketik §f!help§7 di chat untuk daftar perintah VoxelCraft`);
  }, 20);
});

// ============================================================
//  Action bar HUD — dimension, coords, time, coins
// ============================================================

const TICK_INTERVAL = 10;
system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const p = player.location;
    const dimension = player.dimension.id.replace("minecraft:", "");
    const stats = loadStats(player);
    const timeOfDay = world.getTimeOfDay();
    const hour = Math.floor((timeOfDay / 24000) * 24);
    const minute = Math.floor(((timeOfDay / 24000) * 24 - hour) * 60);
    const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    player.onScreenDisplay.setActionBar(
      `§aVoxelCraft §7| §f${dimension} §8| §fXYZ ${Math.floor(p.x)}, ${Math.floor(p.y)}, ${Math.floor(p.z)} §8| §e${timeStr} §8| §6${stats.coins || 0} koin`
    );
  }
}, TICK_INTERVAL);

// ============================================================
//  Custom chat commands
// ============================================================

const COMMANDS = {
  help: {
    desc: "Tampilkan daftar perintah",
    run: (player) => {
      player.sendMessage(`${WELCOME_TITLE} §fPerintah yang tersedia:`);
      for (const [name, cmd] of Object.entries(COMMANDS)) {
        player.sendMessage(`§e!${name}§7 — ${cmd.desc}`);
      }
    },
  },
  give: {
    desc: "Beri item. Contoh: !give cobblestone 64",
    run: (player, args) => {
      const itemName = args[0] ? `minecraft:${args[0].replace("minecraft:", "")}` : null;
      const count = Math.min(64, Math.max(1, parseInt(args[1] || "1", 10) || 1));
      if (!itemName) { player.sendMessage("§cPenggunaan: !give <item> [jumlah]"); return; }
      try {
        player.runCommand(`give @s ${itemName} ${count}`);
        player.sendMessage(`§aDiberikan §e${count}x ${itemName}§a ke ${player.name}`);
      } catch {
        player.sendMessage(`§cItem §e${itemName}§c tidak valid atau tidak ditemukan.`);
      }
    },
  },
  fly: {
    desc: "Toggle mode terbang",
    run: (player) => {
      const isFlying = player.hasTag("voxelcraft_fly");
      if (isFlying) {
        player.removeTag("voxelcraft_fly");
        try { player.runCommand("ability @s mayfly false"); } catch {}
        player.sendMessage("§eMode terbang §cOFF");
      } else {
        player.addTag("voxelcraft_fly");
        try { player.runCommand("ability @s mayfly true"); } catch {}
        player.sendMessage("§eMode terbang §aON");
      }
    },
  },
  heal: {
    desc: "Pulihkan HP & hunger",
    run: (player) => {
      player.runCommand("effect @s instant_health 1 5");
      player.runCommand("effect @s saturation 1 5");
      player.sendMessage("§aHP & hunger dipulihkan.");
    },
  },
  time: {
    desc: "Atur waktu: !time day|night|noon|midnight|<angka>",
    run: (player, args) => {
      const preset = args[0]?.toLowerCase();
      const named = { day: 1000, noon: 6000, sunset: 12000, night: 13000, midnight: 18000, sunrise: 23000 };
      const t = named[preset] ?? parseInt(preset, 10);
      if (isNaN(t)) { player.sendMessage("§cPenggunaan: !time <day|night|noon|midnight|angka>"); return; }
      world.setTimeOfDay(t);
      player.sendMessage(`§aWaktu diatur ke §e${preset || t}§a (${t})`);
    },
  },
  weather: {
    desc: "Atur cuaca: !weather clear|rain|thunder",
    run: (player, args) => {
      const w = args[0]?.toLowerCase();
      if (!["clear", "rain", "thunder"].includes(w)) { player.sendMessage("§cPenggunaan: !weather <clear|rain|thunder>"); return; }
      world.getDimension("overworld").runCommand(`weather ${w}`);
      player.sendMessage(`§aCuaca diatur ke §e${w}§a.`);
    },
  },
  tp: {
    desc: "Teleport: !tp <x> <y> <z>",
    run: (player, args) => {
      const x = parseFloat(args[0]); const y = parseFloat(args[1]); const z = parseFloat(args[2]);
      if (isNaN(x) || isNaN(y) || isNaN(z)) { player.sendMessage("§cPenggunaan: !tp <x> <y> <z>"); return; }
      player.teleport({ x, y, z }, { dimension: player.dimension });
      player.sendMessage(`§aTeleport ke §e${x}, ${y}, ${z}§a.`);
    },
  },
  kit: {
    desc: "Dapatkan kit starter",
    run: (player) => {
      const kit = [
        "minecraft:stone_pickaxe", "minecraft:stone_axe", "minecraft:stone_sword",
        "minecraft:torch 16", "minecraft:bread 8", "minecraft:cobblestone 32",
      ];
      for (const item of kit) {
        try { player.runCommand(`give @s ${item}`); } catch {}
      }
      player.sendMessage("§aKit starter diberikan! Selamat bertualang.");
    },
  },
  stats: {
    desc: "Lihat statistikmu",
    run: (player) => {
      const s = loadStats(player);
      player.sendMessage(`${WELCOME_TITLE} §fStatistik §e${player.name}§f:`);
      player.sendMessage(`§7  • Koin: §e${s.coins || 0}`);
      player.sendMessage(`§7  • Kunjungan: §f${s.joins || 0}`);
      player.sendMessage(`§7  • Blok dihancurkan: §f${s.blocksBroken || 0}`);
      player.sendMessage(`§7  • Mob dibunuh: §f${s.mobsKilled || 0}`);
    },
  },
};

world.beforeEvents.chatSend.subscribe((event) => {
  const msg = event.message.trim();
  if (!msg.startsWith("!")) return;
  event.cancel = true;
  const parts = msg.slice(1).split(/\s+/);
  const name = parts[0].toLowerCase();
  const args = parts.slice(1);
  const cmd = COMMANDS[name];
  system.run(() => {
    if (!cmd) {
      event.sender.sendMessage(`§cPerintah tidak dikenal: §e!${name}§c. Ketik §e!help§c.`);
      return;
    }
    if (ADMIN_COMMANDS.has(name) && !isVoxelCraftAdmin(event.sender)) {
      event.sender.sendMessage(`§cPerintah ini hanya untuk admin VoxelCraft. Minta admin server memberi tag ${ADMIN_TAG}.`);
      return;
    }
    try { cmd.run(event.sender, args); }
    catch (err) { event.sender.sendMessage(`§cError: ${err.message || err}`); }
  });
});

// ============================================================
//  Block break tracking + coin rewards for ores
// ============================================================

world.afterEvents.blockBreak.subscribe(({ player, brokenBlockPermutation }) => {
  const stats = loadStats(player);
  stats.blocksBroken = (stats.blocksBroken || 0) + 1;
  const id = brokenBlockPermutation.type.id;
  const rewards = {
    "minecraft:coal_ore": 2, "minecraft:iron_ore": 3, "minecraft:gold_ore": 5,
    "minecraft:diamond_ore": 15, "minecraft:emerald_ore": 20, "minecraft:lapis_ore": 4,
    "minecraft:redstone_ore": 3, "minecraft:nether_quartz_ore": 2,
    "minecraft:deepslate_coal_ore": 3, "minecraft:deepslate_iron_ore": 4,
    "minecraft:deepslate_gold_ore": 7, "minecraft:deepslate_diamond_ore": 25,
  };
  if (rewards[id]) {
    stats.coins = (stats.coins || 0) + rewards[id];
    player.onScreenDisplay.setTitle(`§6+${rewards[id]} koin`, { stayDuration: 40, fadeInDuration: 4, fadeOutDuration: 8 });
  }
  saveStats(player, stats);
});

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
  const killer = damageSource.damagingEntity;
  if (!killer || killer.typeId !== "minecraft:player") return;
  const player = world.getEntity(killer.id);
  if (!player) return;
  const stats = loadStats(player);
  stats.mobsKilled = (stats.mobsKilled || 0) + 1;
  stats.coins = (stats.coins || 0) + 1;
  saveStats(player, stats);
});

// ============================================================
//  ActionForm UI menu (uses @minecraft/server-ui)
//  Opens when player uses a writable/written book named "VoxelCraft"
// ============================================================

async function openVoxelCraftMenu(player) {
  if (!isVoxelCraftAdmin(player)) {
    player.sendMessage(`§cMenu admin hanya tersedia untuk admin VoxelCraft. Minta admin server memberi tag ${ADMIN_TAG}.`);
    return;
  }
  try {
    const { ActionFormData } = await import("@minecraft/server-ui");
    const stats = loadStats(player);
    const form = new ActionFormData()
      .title("§lVoxelCraft Menu")
      .body(`§7Halo §f${player.name}§7!\n\n§eKoin: §f${stats.coins || 0}\n§eBlok dihancurkan: §f${stats.blocksBroken || 0}\n§eMob dibunuh: §f${stats.mobsKilled || 0}\n`)
      .button("Kit Starter", "textures/items/book_writable")
      .button("Pulihkan HP", "textures/items/apple")
      .button("Mode Terbang: " + (player.hasTag("voxelcraft_fly") ? "§aON" : "§cOFF"), "textures/items/feather")
      .button("Waktu: Siang", "textures/items/clock_item")
      .button("Waktu: Malam", "textures/items/bed_red")
      .button("Cuaca: Cerah", "textures/items/sunflower")
      .button("Lihat Statistik", "textures/items/paper")
      .button("Tutup Menu", "textures/ui/cancel");

    const response = await form.show(player);
    if (response.canceled) return;
    switch (response.selection) {
      case 0: COMMANDS.kit.run(player); break;
      case 1: COMMANDS.heal.run(player); break;
      case 2: COMMANDS.fly.run(player); break;
      case 3: COMMANDS.time.run(player, ["day"]); break;
      case 4: COMMANDS.time.run(player, ["night"]); break;
      case 5: COMMANDS.weather.run(player, ["clear"]); break;
      case 6: COMMANDS.stats.run(player); break;
      case 7: player.sendMessage("§7Menu ditutup."); break;
    }
  } catch (err) {
    player.sendMessage(`§cMenu UI gagal: ${err.message || err}. Pastikan @minecraft/server-ui terinstal.`);
    console.warn("[VoxelCraft] Menu UI error:", err);
  }
}

world.afterEvents.itemUse.subscribe(({ source: player, itemStack }) => {
  if (!player || player.typeId !== "minecraft:player") return;
  if (itemStack?.typeId === "minecraft:writable_book" || itemStack?.typeId === "minecraft:written_book") {
    const name = itemStack.nameTag || "";
    if (name.toLowerCase().includes("voxelcraft")) {
      openVoxelCraftMenu(player);
    }
  }
});

// ============================================================
//  Periodic auto-save (every 5 minutes)
// ============================================================

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    saveStats(player, loadStats(player));
  }
  // Keep periodic persistence silent to avoid flooding multiplayer chat.
}, 6000);

console.log("[VoxelCraft] Behavior pack loaded — commands: !help | ore rewards | auto-save aktif.");
