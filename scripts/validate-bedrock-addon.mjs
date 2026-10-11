import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const fail = (message) => {
  console.error(`[bedrock-addon] FAIL: ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`[bedrock-addon] PASS: ${message}`);

const bpDir = "BedrockAddon";
const rpDir = "VoxelCraftResourcePack";
const bp = readJson(`${bpDir}/manifest.json`);
const rp = readJson(`${rpDir}/manifest.json`);
const bpUuid = bp.header?.uuid;
const rpUuid = rp.header?.uuid;

if (!bpUuid || !rpUuid || bpUuid === rpUuid) fail("BP and RP must have distinct header UUIDs.");
else pass("Behavior Pack and Resource Pack have distinct header UUIDs.");

const rpDependency = (bp.dependencies || []).find((dependency) => dependency.uuid === rpUuid);
if (!rpDependency) {
  fail("Behavior Pack manifest must depend on the VoxelCraft Resource Pack so Bedrock can enable both together.");
} else if (JSON.stringify(rpDependency.version) !== JSON.stringify(rp.header.version)) {
  fail("Behavior Pack's Resource Pack dependency version must match the Resource Pack header version.");
} else {
  pass("Behavior Pack declares the matching Resource Pack dependency.");
}

for (const module of bp.modules || []) {
  if (!module.uuid) fail(`Behavior Pack module "${module.type}" has no UUID.`);
}
const scriptModule = (bp.modules || []).find((module) => module.type === "script");
if (!scriptModule?.entry) fail("Behavior Pack must declare a script entry point.");
else if (!fs.existsSync(path.join(root, bpDir, scriptModule.entry))) fail(`Missing BP script entry: ${scriptModule.entry}`);
else pass("Behavior Pack script entry exists.");

const uiDefs = readJson(`${rpDir}/ui/_ui_defs.json`);
if (!Array.isArray(uiDefs.ui_defs) || uiDefs.ui_defs.length === 0) {
  fail("Resource Pack ui/_ui_defs.json must register UI definition files.");
} else {
  for (const uiFile of uiDefs.ui_defs) {
    if (!fs.existsSync(path.join(root, rpDir, uiFile))) fail(`Missing registered UI definition: ${uiFile}`);
  }
  pass(`All ${uiDefs.ui_defs.length} registered Resource Pack UI definitions exist.`);
}

readJson(`${rpDir}/ui/main_menu.json`);
pass("Custom main-menu JSON parses successfully.");

const startScreen = fs.readFileSync(path.join(root, rpDir, "ui/start_screen.json"), "utf8");
if (!startScreen.includes("start_screen_content") || !startScreen.includes("branding_overlay@voxelcraft_branding.branding_overlay")) {
  fail("Vanilla start screen must retain its main content and include the VoxelCraft branding overlay.");
} else {
  pass("Vanilla Bedrock start screen content is retained with the VoxelCraft branding overlay.");
}

const source = fs.readFileSync(path.join(root, bpDir, scriptModule?.entry || "scripts/main.js"), "utf8");
for (const required of ["@minecraft/server", "@minecraft/server-ui", "ActionFormData", "world.afterEvents.itemUse"]) {
  if (!source.includes(required)) fail(`Native BP feature check missing: ${required}`);
}
const menuIsCommand = source.includes('menu: {') &&
  source.includes('desc: "Buka menu interaktif VoxelCraft"') &&
  source.includes('new Set(["give", "fly", "heal", "time", "weather", "tp", "kit", "menu"])') &&
  source.includes("openVoxelCraftMenu(player)");
if (!menuIsCommand) fail("Native !menu command must open the ActionForm UI and remain admin-gated.");
else pass("Native !menu command opens the ActionForm UI and is admin-gated.");

if (!process.exitCode) pass("Native Bedrock Script API and ActionForm menu hooks are present.");
