'use client'

/**
 * VoxelCraft — MCPE 2013 compiled to WebAssembly
 *
 * This page loads the compiled Minecraft: Pocket Edition (2013) C++ source
 * as a WebAssembly module running inside a WebGL2 canvas. The game runs
 * fully in the browser — no server, no cloud.
 *
 * How it works:
 *  - 344 MCPE .cpp files compiled with Emscripten (-O1) into a single .wasm
 *  - GLES1 → WebGL2 translation layer bridges legacy GL1 calls to modern WebGL2
 *  - Textures (terrain.png, gui.png, etc.) pre-loaded async via fetch + canvas
 *  - Mouse + touch input forwarded into C++ via EMSCRIPTEN_KEEPALIVE exports
 *
 * Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/ (350 files)
 * Build:  wasm/build.sh
 */

export default function Home() {
  return (
    <main className="fixed inset-0 bg-black">
      <iframe
        src={`/mcpe-wasm/minecraft-wasm.html?v=${process.env.NEXT_PUBLIC_BUILD_ID || Date.now()}`}
        title="VoxelCraft — MCPE 2013 WASM"
        className="h-screen w-screen border-0"
        allow="fullscreen; autoplay; gamepad; pointer-lock"
      />
    </main>
  )
}
