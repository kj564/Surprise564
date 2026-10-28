// §Material.ts — Direct 1:1 translation of C++ Material.h + Material.cpp + subclasses
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/material/
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- Material.h:8-75 — class Material ---
class Material {
  // --- Material.h:10-37 — static Material pointers ---
  static air: Material | null = null;
  static dirt: Material | null = null;
  static wood: Material | null = null;
  static stone: Material | null = null;
  static metal: Material | null = null;
  static water: Material | null = null;
  static lava: Material | null = null;
  static leaves: Material | null = null;
  static plant: Material | null = null;
  static replaceable_plant: Material | null = null;
  static sponge: Material | null = null;
  static cloth: Material | null = null;
  static fire: Material | null = null;
  static sand: Material | null = null;
  static decoration: Material | null = null;
  static glass: Material | null = null;
  static explosive: Material | null = null;
  static coral: Material | null = null;
  static ice: Material | null = null;
  static topSnow: Material | null = null;
  static snow: Material | null = null;
  static cactus: Material | null = null;
  static clay: Material | null = null;
  static vegetable: Material | null = null;
  static portal: Material | null = null;
  static cake: Material | null = null;
  static web: Material | null = null;

  // --- Material.h:70-74 — private fields ---
  private _flammable: boolean;
  private _neverBuildable: boolean;
  private _isAlwaysDestroyable: boolean;
  private _replaceable: boolean;

  // --- Material.h:58-63 — protected constructor ---
  protected constructor() {
    this._flammable = false;
    this._neverBuildable = false;
    this._isAlwaysDestroyable = true;
    this._replaceable = false;
  }

  // --- Material.h:39-41 — isLiquid() ---
  isLiquid(): boolean { return false; }

  // --- Material.h:43-45 — letsWaterThrough() ---
  letsWaterThrough(): boolean { return !this.isLiquid() && !this.isSolid(); }

  // --- Material.h:47-49 — isSolid() ---
  isSolid(): boolean { return true; }

  // --- Material.h:51-53 — blocksLight() ---
  blocksLight(): boolean { return true; }

  // --- Material.h:55-58 — isSolidBlocking() ---
  isSolidBlocking(): boolean {
    if (this._neverBuildable) return false;
    return this.blocksMotion();
  }

  // --- Material.h:60-64 — isAlwaysDestroyable() ---
  isAlwaysDestroyable(): boolean { return this._isAlwaysDestroyable; }

  // --- Material.h:66-68 — blocksMotion() ---
  blocksMotion(): boolean { return true; }

  // --- Material.h:70-72 — isFlammable() ---
  isFlammable(): boolean { return this._flammable; }

  // --- Material.h:74-76 — isReplaceable() ---
  isReplaceable(): boolean { return this._replaceable; }

  // --- Material.h:65-69 — protected setters (return this for chaining) ---
  protected flammable(): this { this._flammable = true; return this; }
  protected neverBuildable(): this { this._neverBuildable = true; return this; }
  protected notAlwaysDestroyable(): this { this._isAlwaysDestroyable = false; return this; }
  protected replaceable(): this { this._replaceable = true; return this; }
}

// --- GasMaterial.h — class GasMaterial : public Material ---
class GasMaterial extends Material {
  constructor() {
    super();
    this.replaceable();  // §GasMaterial.h:10-12
  }
  // §GasMaterial.h:14-16
  isSolid(): boolean { return false; }
  // §GasMaterial.h:18-20
  blocksLight(): boolean { return false; }
  // §GasMaterial.h:22-24
  blocksMotion(): boolean { return false; }
}

// --- LiquidMaterial.h — class LiquidMaterial : public Material ---
class LiquidMaterial extends Material {
  constructor() {
    super();
    this.replaceable();  // §LiquidMaterial.h:10-12
  }
  // §LiquidMaterial.h:14-16
  isLiquid(): boolean { return true; }
  // §LiquidMaterial.h:18-20
  blocksMotion(): boolean { return false; }
  // §LiquidMaterial.h:22-24
  isSolid(): boolean { return false; }
}

// --- DecorationMaterial.h — class DecorationMaterial : public Material ---
class DecorationMaterial extends Material {
  // §DecorationMaterial.h:9-11
  isSolid(): boolean { return false; }
  // §DecorationMaterial.h:13-15
  blocksLight(): boolean { return false; }
  // §DecorationMaterial.h:17-19
  blocksMotion(): boolean { return false; }
}

// --- WebMaterial.h — class WebMaterial : public Material ---
class WebMaterial extends Material {
  constructor() {
    super();
    this.notAlwaysDestroyable();  // §WebMaterial.h:7-9
  }
  // §WebMaterial.h:11-13
  blocksMotion(): boolean { return false; }
}

// --- Material.cpp:32-60 — initMaterials() ---
function initMaterials(): void {
  Material.air = new GasMaterial();
  Material.dirt = new Material();
  Material.wood = (new Material()).flammable();
  Material.stone = (new Material()).notAlwaysDestroyable();
  Material.metal = (new Material()).notAlwaysDestroyable();
  Material.water = new LiquidMaterial();
  Material.lava = new LiquidMaterial();
  Material.leaves = (new Material()).flammable().neverBuildable();
  Material.plant = new DecorationMaterial();
  Material.replaceable_plant = (new DecorationMaterial()).replaceable().flammable();
  Material.sponge = new Material();
  Material.cloth = (new Material()).flammable();
  Material.fire = new GasMaterial();
  Material.sand = new Material();
  Material.decoration = new DecorationMaterial();
  Material.glass = (new Material()).neverBuildable();
  Material.explosive = (new Material()).flammable().neverBuildable();
  Material.coral = new Material();
  Material.ice = (new Material()).neverBuildable();
  Material.topSnow = (new DecorationMaterial()).neverBuildable().notAlwaysDestroyable().replaceable();
  Material.snow = (new Material()).notAlwaysDestroyable();
  Material.cactus = (new Material()).neverBuildable();
  Material.clay = new Material();
  Material.vegetable = new Material();
  Material.portal = new Material();
  Material.cake = new Material();
  Material.web = new WebMaterial();
}

// --- Material.cpp:63-91 — teardownMaterials() ---
function teardownMaterials(): void {
  Material.air = null;
  Material.dirt = null;
  Material.wood = null;
  Material.stone = null;
  Material.metal = null;
  Material.water = null;
  Material.lava = null;
  Material.leaves = null;
  Material.plant = null;
  Material.replaceable_plant = null;
  Material.sponge = null;
  Material.cloth = null;
  Material.fire = null;
  Material.sand = null;
  Material.decoration = null;
  Material.glass = null;
  Material.explosive = null;
  Material.coral = null;
  Material.ice = null;
  Material.topSnow = null;
  Material.snow = null;
  Material.cactus = null;
  Material.clay = null;
  Material.vegetable = null;
  Material.portal = null;
  Material.cake = null;
  Material.web = null;
}

export { Material, GasMaterial, LiquidMaterial, DecorationMaterial, WebMaterial, initMaterials, teardownMaterials };
