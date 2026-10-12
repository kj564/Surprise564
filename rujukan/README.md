# Rujukan: Pocket Edition 2013

Folder ini mencatat sumber referensi **Minecraft Pocket Edition 0.6.1 (8 Februari 2013)** dan memuat proyek belajar C++ yang ditulis mandiri.

## Struktur

- pocket-edition-2013/README.md — batasan dan cara membangun proyek clean-room.
- pocket-edition-2013/mcpe-source/ — implementasi orisinal untuk mempelajari arsitektur game voxel, bukan source Minecraft.
- [Sumber referensi upstream](https://github.com/M2noa/MCLCE-Archive/tree/master/pocket-edition-2013)
- [README upstream](https://github.com/M2noa/MCLCE-Archive/blob/master/pocket-edition-2013/README.md)

## Kenapa source upstream tidak disalin?

Repositori upstream tidak menyatakan lisensi redistribusi yang jelas untuk source tersebut dan mengidentifikasikannya sebagai kode bocor. Karena itu, folder ini tidak menyalin source atau aset proprietary. Struktur proyek yang ditambahkan di sini merupakan implementasi mandiri untuk belajar, bukan salinan arsip upstream.

## Build proyek belajar

    cd pocket-edition-2013/mcpe-source
    cmake -S . -B build
    cmake --build build
    ctest --test-dir build --output-on-failure

Untuk instruksi lengkap dan perintah prototipe, baca [README proyek](pocket-edition-2013/mcpe-source/README.md).
