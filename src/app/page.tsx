export default function Home() {
  return (
    <main style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#87ceeb" }}>
      <iframe
        src={"./" + "minecraft.html"}
        title="VoxelCraft Minecraft browser game"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        allow="fullscreen; gamepad; pointer-lock"
      />
    </main>
  );
}
