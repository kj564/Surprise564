#![no_std]

/// Deterministic height sample shared with the TypeScript fallback.
/// Coordinates and seeds use the same 32-bit wrapping rules as JavaScript Math.imul/bitwise ops.
#[no_mangle]
pub extern "C" fn terrain_height(
    x: i32,
    z: i32,
    seed: i32,
    base_height: f64,
    amplitude: f64,
    world_height: i32,
    _sea_level: i32,
) -> i32 {
    if world_height < 3 || !base_height.is_finite() || !amplitude.is_finite() || amplitude < 0.0 {
        return 1;
    }
    let broad = value_noise(x as f64 / 28.0, z as f64 / 28.0, seed);
    let detail = value_noise(x as f64 / 9.0, z as f64 / 9.0, seed ^ 0x5f35_6495);
    let raw = (base_height + broad * amplitude + detail * amplitude * 0.35).round() as i32;
    raw.max(1).min(world_height - 2)
}

fn value_noise(x: f64, z: f64, seed: i32) -> f64 {
    let x0 = x.floor();
    let z0 = z.floor();
    let tx = smooth(x - x0);
    let tz = smooth(z - z0);
    let a = lattice(x0 as i32, z0 as i32, seed);
    let b = lattice(x0 as i32 + 1, z0 as i32, seed);
    let c = lattice(x0 as i32, z0 as i32 + 1, seed);
    let d = lattice(x0 as i32 + 1, z0 as i32 + 1, seed);
    lerp(lerp(a, b, tx), lerp(c, d, tx), tz)
}

fn lattice(x: i32, z: i32, seed: i32) -> f64 {
    let signed = x.wrapping_mul(374_761_393)
        .wrapping_add(z.wrapping_mul(668_265_263))
        .wrapping_add(seed.wrapping_mul(1_442_695_041));
    let mut n = signed as u32;
    n = (n ^ (n >> 13)).wrapping_mul(1_274_126_177);
    n ^= n >> 16;
    (n as f64 / 4_294_967_295.0) * 2.0 - 1.0
}

fn smooth(t: f64) -> f64 { t * t * (3.0 - 2.0 * t) }
fn lerp(a: f64, b: f64, t: f64) -> f64 { a + (b - a) * t }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn heights_are_bounded_and_deterministic() {
        let a = terrain_height(-13, 44, 564, 9.0, 5.0, 32, 7);
        assert_eq!(a, terrain_height(-13, 44, 564, 9.0, 5.0, 32, 7));
        assert!((1..30).contains(&a));
    }

    #[test]
    fn seed_changes_at_least_some_samples() {
        let same = terrain_height(25, -17, 564, 9.0, 5.0, 32, 7);
        let different = terrain_height(25, -17, 565, 9.0, 5.0, 32, 7);
        assert_ne!(same, different);
    }
}
