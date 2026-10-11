# VoxelCraft — Minecraft di Browser

Repository ini difokuskan pada proyek Minecraft saja.

## Main game

- `public/minecraft.html` — game voxel 3D yang dimainkan langsung di browser.
- `public/VoxelCraft/textures/blocks/` — tekstur blok yang digunakan oleh game browser.
- `VoxelCraft/` — aset/resource-pack Minecraft Bedrock yang dipertahankan untuk pengembangan Minecraft selanjutnya.
- `src/app/` — shell Next.js minimal yang menampilkan game sebagai halaman utama.
- `.github/workflows/static.yml` — build dan deploy GitHub Pages.

## Jalankan lokal

Persyaratan: Bun dan Node.js versi modern.

```bash
bun install --frozen-lockfile
bun run dev
```

Buka `http://localhost:3000/Surprise564/`. Untuk membuka game secara langsung, gunakan `http://localhost:3000/Surprise564/minecraft.html`.

## GitHub Pages

Workflow membangun static export Next.js lalu menerbitkan folder `out/`. File `minecraft.html` dan tekstur di `public/VoxelCraft/` harus tetap tersedia setelah build.

## Minecraft Bedrock Script API

Aset di `VoxelCraft/` dipertahankan sebagai aset Minecraft. Jangan menganggapnya sebagai behavior pack Script API lengkap tanpa manifest dan entry point script yang sesuai.

Referensi:
- [Jayly Script API Docs](https://jaylydev.github.io/scriptapi-docs/)
- [Bedrock.dev](https://bedrock.dev/)
- [Minecraft Creator Reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/?view=minecraft-bedrock-stable)
- [MicrosoftDocs/minecraft-creator](https://github.com/MicrosoftDocs/minecraft-creator)
