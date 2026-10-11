import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoxelCraft — Minecraft di Browser",
  description: "Jelajahi dunia voxel 3D langsung di browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
