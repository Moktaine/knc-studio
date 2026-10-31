// Planner modules. Day ranges come from KNC Studio's delivered tour-platform quote
// (Yapılanlar.pdf), regrouped for any client. Prices are deliberately absent.
//
// `days` is [min, max] working days. `base: true` rows are always in the plan; Keşif and
// Teslim match the ~1 week each shown in Süreç, so both sections tell the same story.

export const CONTACT_EMAIL = 'kaancanolcay@gmail.com';
// WhatsApp number in international form without + or spaces, e.g. '905xxxxxxxxx'.
// While null, the "WhatsApp’tan gönder" button stays hidden.
export const WHATSAPP = null;

// Rows run in this order on the schedule; groups are the planner's subsections.
export const groups = [
  { id: 'start', name: 'Başlangıç' },
  { id: 'sales', name: 'Satış ve ödeme' },
  { id: 'ops', name: 'Operasyon ve otomasyon' },
  { id: 'reach', name: 'Büyüme ve erişim' },
  { id: 'launch', name: 'Yayın' },
];

export const modules = [
  { id: 'discovery', group: 'start', name: 'Keşif', desc: 'Hedefleri, kitleyi ve kapsamı birlikte netleştiriyoruz.', days: [5, 5], base: true },
  { id: 'base', group: 'start', name: 'Temel site ve altyapı', desc: 'Tasarım, yönetim paneli ve veritabanı.', days: [12, 20], base: true },
  { id: 'pay', group: 'sales', name: 'Online ödeme', desc: 'Sanal POS; peşin, kapora, kapıda ya da havale ile ödeme.', days: [6, 10] },
  { id: 'booking', group: 'sales', name: 'Rezervasyon ve randevu', desc: 'Kişi ve yaş seçimi, kurallar, alış noktası ya da saat seçimi.', days: [3, 5] },
  { id: 'cart', group: 'sales', name: 'Sepet, paket ve indirimler', desc: 'Çakışma kontrolü, paketler, öneriler, artan indirim.', days: [10, 16] },
  { id: 'members', group: 'sales', name: 'Üyelik ve favoriler', desc: 'Kişisel hesap, sadakat indirimi, favori listesi.', days: [7, 11] },
  { id: 'notify', group: 'ops', name: 'WhatsApp ve e-posta bildirimleri', desc: 'Onaylar ve hatırlatmalar kendiliğinden gider.', days: [6, 10] },
  { id: 'ops', group: 'ops', name: 'Operasyon paneli', desc: 'Doluluk, iptal ve iade takibi, müşteri listeleri.', days: [4, 7] },
  { id: 'analytics', group: 'ops', name: 'Analitik ve raporlar', desc: 'Ülke, terk oranı, en çok satan ürün ve paketler.', days: [5, 8] },
  { id: 'search', group: 'reach', name: 'Akıllı arama ve video', desc: 'Yazım hatasına rağmen doğru sonuç; ürünlere video.', days: [2, 4] },
  { id: 'lang', group: 'reach', name: 'Çok dilli site', desc: '2–3 dil, Kiril alfabesi ve uzun metne dayanıklı arayüz.', days: [9, 16] },
  { id: 'seo', group: 'reach', name: 'SEO ve görünürlük', desc: 'Temiz adresler, şema etiketleri, arama motoruna görünen içerik.', days: [8, 13] },
  { id: 'handover', group: 'launch', name: 'Teslim ve eğitim', desc: 'Yayına alma, ekibinize yönetim paneli eğitimi.', days: [5, 5], base: true },
];

