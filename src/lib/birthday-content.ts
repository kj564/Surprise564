/**
 * Konten web surprise ulang tahun untuk Nia.
 *
 * Repo https://github.com/kj564/Surprise564 dipakai sebagai BLUEPRINT.
 * Konten (teks, foto mapping, fonts) dipelajari dari repo Imi,
 * lalu di-build native sebagai web ucapan ulang tahun yang interaktif.
 *
 * MAPPING FOTO ASLI (dari VLM analysis atas tiap file di folder HTML/Materi/data):
 * - img10.png/webp → Polaroid foto Nia di area terbuka malam (slide 2)
 * - img12.jpg/webp → Selfie Nia berhijab hitam di cermin (slide 2, di dalam ID card)
 * - img19.jpg/webp → Foto XD Class (slide 4 - milestone 1)
 * - img20.png/webp → Foto First Date (slide 4 - milestone 2, selfie couple)
 * - img21.jpg/webp → Foto Graduation (slide 4 - milestone 3, 2 orang di pagar)
 * - img23.jpg/webp → Foto LDR (slide 4 - milestone 4, video call dengan filter)
 * - img26.png/webp → Foto couple di photobooth (slide 3 + slide 5 dalam kamera)
 *
 * DEKORASI/GRAFIS:
 * - img0.jpg/webp → Background gingham merah-putih
 * - img7.png/webp → HAPPY BIRTHDAY text graphic (slide 1)
 * - img14.png/webp → Kertas catatan bergaris (slide 3 & 5)
 * - img15.png/webp → Gingham biru-putih (background XD Class)
 * - img16.png/webp → Gingham pink-putih (background First Date)
 * - img17.png/webp → Gingham oranye-putih (background Graduation)
 * - img18.png/webp → Gingham biru-putih alternatif (background LDR)
 * - img25.png/webp → Kamera digital (slide 5)
 * - img29.png/webp → Apel besar dengan "Tamat" (slide 6)
 * - img30.png/webp → Bunga hijau button (slide 6)
 * - img31.png/webp → Bintang kuning button (slide 6)
 */

export const birthdayContent = {
  /** Nama panggilan pacar */
  partnerName: "Nia",

  /** Nama lengkap pacar (untuk subjudul & meta) */
  partnerFullName: "Aulia Rizky Ramadhaniati",

  /** Nama kamu sebagai pengirim surat */
  yourName: "Imi",

  /** Tanggal lahir (format display) */
  birthdayDate: "08 Oktober 2007",

  /** Usia ulang tahun */
  birthdayAge: 19,

  /** Subjudul di hero section — diambil EXACT dari slide 3 Materi.pdf ("Harapan dan Doa") */
  heroSubtitle:
    "Selamat ulang tahun yang ke-19, Nia sayang. Imi berharap di usia baru ini semua cita-cita Nia bisa tergapai, dan Nia diberikan kemudahan serta kesehatan untuk beradaptasi dengan padatnya dunia perkuliahan.",

  /** Pesan kecil di tombol buka hadiah */
  openGiftHint: "Klik kado di bawah untuk membuka kejutan dari Imi",

  /** Pesan ketika lilin belum ditiup — tone casual kayak Imi, singular (1 lilin) */
  cakeHint:
    "tiup aja lilinnya, terus sereh satu permohonan buat tahun ke-19 ini...",

  /** Pesan ketika lilin sudah ditiup — tone casual kayak Imi, singular */
  cakeDoneMessage:
    "udah aku kirim ke semesta permohonannya. semoga semua yang kamu harap taun ini beneran kekabul, terutama yang kita doain bareng.",

  /** Path ke gambar-gambar penting — di-mapped dari slide asli, pakai webp */
  images: {
    // Foto asli
    niaPolaroidMalam: "/surprise/html/img10.webp", // slide 2 polaroid
    niaSelfieCermin: "/surprise/html/img12.webp", // slide 2 ID card selfie
    fotoXdClass: "/surprise/html/img19.webp",
    fotoFirstDate: "/surprise/html/img20.webp",
    fotoGraduation: "/surprise/html/img21.webp",
    fotoLdr: "/surprise/html/img23.webp",
    couplePhotobooth: "/surprise/html/img26.webp", // slide 3 + 5 (dalam kamera)
    // Dekorasi
    ginghamMerahPutih: "/surprise/html/img0.webp",
    ginghamKuning: "/surprise/html/img1.webp",
    happyBirthdayText: "/surprise/html/img7.webp",
    idCardAnime: "/surprise/html/img11.webp",
    kertasCatatan: "/surprise/html/img14.webp",
    ginghamBiru1: "/surprise/html/img15.webp",
    ginghamPink: "/surprise/html/img16.webp",
    ginghamOranye: "/surprise/html/img17.webp",
    ginghamBiru2: "/surprise/html/img18.webp",
    kameraDigital: "/surprise/html/img25.webp",
    apelTamat: "/surprise/html/img29.webp",
    bungaHijau: "/surprise/html/img30.webp",
    bintangKuning: "/surprise/html/img31.webp",
  },

  /** Slide "Siapa Aku?" — diambil dari slide 2 Materi.pdf */
  siapaAku: {
    title: "Siapa Aku?",
    name: "Aulia Rizky Ramadhaniati",
    birthday: "08 Oktober 2007",
    /** Sifat asli dari slide 2 Imi */
    traits: ["Marah", "Bermalas-malasan"],
    /** Imi tidak menulis intro di slide aslinya — field dikosongkan biar tidak ada text buatan */
    intro: "",
  },

  /** Timeline hubungan — diambil dari slide 4 Materi.pdf.
   *  Slide asli Imi hanya menampilkan 4 label milestone dengan foto, tanpa deskripsi.
   *  Field note dikosongkan agar tidak ada text buatan aku. */
  timeline: [
    {
      milestone: "XD Class",
      note: "",
      emoji: "🎒",
      photo: "/surprise/html/img19.webp",
      bg: "/surprise/html/img15.webp",
    },
    {
      milestone: "First Date",
      note: "",
      emoji: "💫",
      photo: "/surprise/html/img20.webp",
      bg: "/surprise/html/img16.webp",
    },
    {
      milestone: "Graduation",
      note: "",
      emoji: "🎓",
      photo: "/surprise/html/img21.webp",
      bg: "/surprise/html/img17.webp",
    },
    {
      milestone: "LDR",
      note: "",
      emoji: "🌍",
      photo: "/surprise/html/img23.webp",
      bg: "/surprise/html/img18.webp",
    },
  ],

  /** Sifat Nia di mata Imi — EXACT dari slide 5 Materi.pdf.
   *  Kapitalisasi asli Imi dipertahankan (imi lowercase),
   *  termasuk emphasis extra letters ("pemalass sikhb", "kegemasshhhann", "senanggg"). */
  traits: [
    {
      title: "Wanita Kuat",
      description:
        "Selama 19 tahun ini Nia hebat banget sudah berjuang melewati banyak jatuh bangun kehidupan nia.",
      emoji: "💪",
    },
    {
      title: "Cewe Pintar dan Dewasa",
      description:
        "Nia itu orangnya pintar banget dan dewasa tauu, walaupun pemalass sikhb... awokawok",
      emoji: "📚",
    },
    {
      title: "Orangnya Ternyata Lucu",
      description:
        "Di balik sisi tangguh dan dewasanya, Nia selalu punya cara tersendiri yang selalu bikin imi kegemasshhhann dan senanggg",
      emoji: "🌸",
    },
  ],

  /** Surat ucapan ASLI dari Imi ke Nia — diambil EXACT dari Ucapan.pdf.
   *  Untuk surat ucapan yang ditampilkan ke Nia, pakai PNG render dari Ucapan.pdf asli
   *  (lihat src/components/birthday/love-letter.tsx — pakai /public/bahan/ucapan_asli-1.png).
   *  Field letter ini dipertahankan untuk referensi saja. */
  letter: {
    salutation: "",
    paragraphs: [
      "Halo sayang, Selamat ulang tahun ya yang ke-19. Semoga di umur nia yang ke-19 tahun ini semua harapan dan cita-cita nia dapat tergapai, dan juga semoga nia dapat beradaptasi terhadap dunia perkuliahan yang sangat padat ini.",
      "Terimakasih sudah menemani imi selama ini, semoga hubungan kita dapat terus berjalan dengan baik dan kita selalu mendapatkan kemudahan semasa LDR ini yaa",
      "Aku harap aku dapat menjumpai mu di akhir tahun ini, di libur semester ini. Doa kan semoga ada rezekinya yaa.",
      "Selama 19 tahun kehidupan nia pasti ada jatuh bangunnya, imi harap dengan adanya imi bisa membantu nia selalu. Anggap saja imi sebagai sahabat, kakak, adik, ataupun sahabat buat nia. Selama 19 tahun nia sudah berjuang jatuh bangun, nia orang yang hebat, nia itu wanita kuat. Tapi jangan sampai berlebihan menjalani semuanya sendiri, karena ada imi. Minta aja tolong ke imi, imi bakal selalu ada buat nia.",
    ],
    closing: "-Imi",
  },

  /** 5 manifesto "Semoga..." — EXACT dari Ucapan.pdf, kapitalisasi asli Imi dipertahankan */
  wishes: [
    "Semoga imi bisa selalu menemani perjalanan hidup nia",
    "Semoga semua harapan kita dapat terwujud",
    "Semoga kita dapat saling membantu",
    "Semoga kita bisa saling melengkapi",
    "dan Semoga kita dapat bersama selamanya",
  ],
}

export type BirthdayContent = typeof birthdayContent
