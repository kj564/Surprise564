# Rujukan: MCLCE Archive

Folder ini menjadi indeks rujukan untuk proyek **MCLCE-Archive**.

## Sumber utama

- Repository upstream: https://github.com/M2noa/MCLCE-Archive
- Dokumentasi Console Edition: https://github.com/M2noa/MCLCE-Archive/blob/master/WIKI_Console_Edition.md
- Dokumentasi dan atribusi: https://github.com/M2noa/MCLCE-Archive/blob/master/WIKI_Credits.md

## Mengambil direktori `pocket-edition-2013`

Jalankan perintah berikut secara berurutan di terminal Git yang mendukung sparse checkout:

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/M2noa/MCLCE-Archive.git
cd MCLCE-Archive
git sparse-checkout set pocket-edition-2013
```

Perintah tersebut mengkloning riwayat secara dangkal, menunda pengambilan blob yang tidak diperlukan, lalu memilih direktori `pocket-edition-2013` saja untuk checkout.

## Struktur rujukan

Arsip upstream mencakup beberapa koleksi besar. Buka repository sumber untuk melihat struktur folder, dokumentasi, dan petunjuk pengambilan tiap bagian. Gunakan indeks ini sebagai titik masuk dan catat ringkasan atau catatan teknis yang memang diperlukan di sini.

## Catatan penggunaan

Periksa hak penggunaan, lisensi, dan status setiap komponen sebelum mengunduh, menyalin, atau mengintegrasikannya ke proyek lain. Hindari mendistribusikan ulang materi yang tidak memiliki izin atau hak penggunaan yang jelas.

## Tata letak yang disarankan

- `README.md` — indeks sumber dan panduan navigasi.
- `notes/` — catatan analisis yang ditulis sendiri, jika diperlukan.
- `references/` — tautan dan metadata rujukan tambahan, jika diperlukan.
