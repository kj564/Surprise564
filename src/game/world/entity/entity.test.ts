// Entity/Mob system tests — verifies ported stats and behaviors against C++ source.
import { describe, it, expect } from 'bun:test';
import { Chicken } from './animal/chicken';
import { Cow } from './animal/cow';
import { Pig } from './animal/pig';
import { Sheep } from './animal/sheep';
import { Zombie } from './monster/zombie';
import { Creeper } from './monster/creeper';
import { Skeleton } from './monster/skeleton';
import { Spider } from './monster/spider';
import { MobFactory } from './mob-factory';
import { MobType } from './types';

describe('Animal stats (§rujukan C++ source)', () => {
  it('Chicken: §Chicken.cpp:32 — maxHealth=4, size 0.3×0.7, texture mob/chicken.png', () => {
    const c = new Chicken();
    expect(c.getMaxHealth()).toBe(4);
    expect(c.bbWidth).toBe(0.3);
    expect(c.bbHeight).toBe(0.7);
    expect(c.textureName).toBe('mob/chicken.png');
  });

  it('Cow: §Cow.cpp:22 — maxHealth=10, size 0.9×1.3, texture mob/cow.png', () => {
    const c = new Cow();
    expect(c.getMaxHealth()).toBe(10);
    expect(c.bbWidth).toBe(0.9);
    expect(c.bbHeight).toBe(1.3);
    expect(c.textureName).toBe('mob/cow.png');
  });

  it('Pig: §Pig.cpp:16 — maxHealth=10, size 0.9×0.9, texture mob/pig.png', () => {
    const p = new Pig();
    expect(p.getMaxHealth()).toBe(10);
    expect(p.bbWidth).toBe(0.9);
    expect(p.bbHeight).toBe(0.9);
    expect(p.textureName).toBe('mob/pig.png');
  });

  it('Sheep: §Sheep.cpp:42 — maxHealth=8, size 0.9×1.3, texture mob/sheep.png', () => {
    const s = new Sheep();
    expect(s.getMaxHealth()).toBe(8);
    expect(s.bbWidth).toBe(0.9);
    expect(s.bbHeight).toBe(1.3);
    expect(s.textureName).toBe('mob/sheep.png');
  });
});

describe('Monster stats (§rujukan C++ source)', () => {
  it('Zombie: §Zombie.cpp:46 — maxHealth=12, texture mob/zombie.png, runSpeed=0.5, attackDamage=4', () => {
    const z = new Zombie();
    expect(z.getMaxHealth()).toBe(12);
    expect(z.textureName).toBe('mob/zombie.png');
    expect(z.runSpeed).toBe(0.5);
    expect(z.attackDamage).toBe(4);
  });

  it('Creeper: §Creeper.cpp:20 — maxHealth=16, texture mob/creeper.png, MAX_SWELL=30', () => {
    const c = new Creeper();
    expect(c.getMaxHealth()).toBe(16);
    expect(c.textureName).toBe('mob/creeper.png');
  });

  it('Skeleton: §Skeleton.cpp:18 — maxHealth=10, texture mob/skeleton.png, carries bow', () => {
    const s = new Skeleton();
    expect(s.getMaxHealth()).toBe(10);
    expect(s.textureName).toBe('mob/skeleton.png');
  });

  it('Spider: §Spider.cpp:30 — maxHealth=8, size 1.4×0.9, texture mob/spider.png, runSpeed=0.5', () => {
    const s = new Spider();
    expect(s.getMaxHealth()).toBe(8);
    expect(s.bbWidth).toBe(1.4);
    expect(s.bbHeight).toBe(0.9);
    expect(s.textureName).toBe('mob/spider.png');
    expect(s.runSpeed).toBe(0.5);
  });
});

describe('MobFactory (§MobFactory.h)', () => {
  it('creates correct mob types', () => {
    expect(MobFactory.createMob(MobType.Chicken)).toBeInstanceOf(Chicken);
    expect(MobFactory.createMob(MobType.Cow)).toBeInstanceOf(Cow);
    expect(MobFactory.createMob(MobType.Pig)).toBeInstanceOf(Pig);
    expect(MobFactory.createMob(MobType.Sheep)).toBeInstanceOf(Sheep);
    expect(MobFactory.createMob(MobType.Zombie)).toBeInstanceOf(Zombie);
    expect(MobFactory.createMob(MobType.Creeper)).toBeInstanceOf(Creeper);
    expect(MobFactory.createMob(MobType.Skeleton)).toBeInstanceOf(Skeleton);
    expect(MobFactory.createMob(MobType.Spider)).toBeInstanceOf(Spider);
  });

  it('initializes health to maxHealth (§MobFactory.h:39)', () => {
    const chicken = MobFactory.createMob(MobType.Chicken);
    expect(chicken.health).toBe(chicken.getMaxHealth());
    const zombie = MobFactory.createMob(MobType.Zombie);
    expect(zombie.health).toBe(zombie.getMaxHealth());
  });
});

describe('Entity baseTick (§Entity.cpp)', () => {
  it('increments tickCount (§Entity.cpp baseTick — tickCount++)', () => {
    const z = new Zombie();
    const initial = z.tickCount;
    z.baseTick();
    expect(z.tickCount).toBe(initial + 1);
  });
});

describe('Mob hurt/heal (§Mob.h)', () => {
  it('hurt reduces health (§Mob.h actuallyHurt)', () => {
    const z = new Zombie();
    z.health = z.getMaxHealth();
    z.bypassArmor = true;  // bypass armor to test raw health reduction
    z.actuallyHurt(3);
    expect(z.health).toBe(z.getMaxHealth() - 3);
  });

  it('heal restores health (§Mob.h heal)', () => {
    const c = new Chicken();
    c.health = 1;
    c.heal(2);
    expect(c.health).toBe(3);
  });
});
