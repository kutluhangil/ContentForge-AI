# ContentForge — Manuel Kurulum Rehberi

> Kod tamamen hazir. Senin yapman gereken tek sey: servisleri kurmak, birbirine baglamak ve sunucuya deploy etmek.
> Bu rehber seni bastan sona goturuyor. Her adimi siraya gore yap.

---

## NASIL OKUNMALI

- Her bolumun basinda o bolumde **ne yapacagin** yaziliyor.
- `Bu sekilde yazilan seyler` komut veya deger. Birebir kopyala-yapistir.
- > Bu sekilde yazilan satirlar ek aciklama veya uyari.
- Her bolumun sonunda bir **kontrol noktasi** var — o noktayi gectiginden emin ol.

---

## BOLUM 1 — Supabase (Veritabani + Auth + Storage)

**Bu bolumde ne yapacaksin:** Supabase'de bir proje olusturacak, tablolari kuracak, Google girisini ayarlayacak ve baglanti bilgilerini alacaksin.

---

### Adim 1.1 — Supabase Hesabi Ac ve Proje Olustur

1. Tarayicinda `supabase.com` adresine git.
2. Sag ustten **Start your project** tikla.
3. GitHub hesabinla giris yap (en kolayidir).
4. **New Project** tikla.
5. Formu doldur:
   - **Organization:** Varsayilan kalmasi yeterli.
   - **Project Name:** `contentforge`
   - **Database Password:** Guclu bir sifre gir. **Bu sifreyi bir yere kaydet**, sonra lazim olabilir.
   - **Region:** `Central EU (Frankfurt)` sec (Turkiye'ye en yakin).
6. **Create new project** tikla.
7. 1-2 dakika bekle, proje hazirlaniyor.

> Kontrol: Dashboard acildi mi? Sol menude tablolari, SQL Editor'u gorebiliyor musun? Tamam, devam.

---

### Adim 1.2 — Tablolari Kur (SQL Migrasyonlarini Calistir)

Simdi veritabani tablolarini olusturacaksin. Proje klasorunde `supabase/migrations/` icinde 7 tane SQL dosyasi var. Bunlari **siraya gore** calistiracaksin.

1. Supabase Dashboard'da sol menuden **SQL Editor** tikla.
2. **New query** tikla.
3. Bilgisayarinda proje klasorune git: `supabase/migrations/`
4. Ilk dosyayi ac: `001_create_profiles.sql`
5. Icindeki **tum metni** kopyala (Ctrl+A, Ctrl+C).
6. Supabase SQL Editor'a **yapistir** (Ctrl+V).
7. Sag alttaki **Run** butonuna tikla.
8. "Success" yazisini gor.
9. Editoru temizle, **ayni islemi** siradaki dosya icin tekrarla.

**Siralama (bu siraya uy!):**

| Sira | Dosya | Ne yapiyor |
|------|-------|------------|
| 1 | `001_create_profiles.sql` | Kullanici profilleri tablosu |
| 2 | `002_create_subscriptions.sql` | Abonelik tablosu |
| 3 | `003_create_conversions.sql` | Donusum kayitlari tablosu |
| 4 | `004_create_outputs.sql` | Donusum ciktilari tablosu |
| 5 | `005_create_usage.sql` | Aylik kullanim takibi |
| 6 | `006_rls_policies.sql` | Guvenlik politikalari (RLS) |
| 7 | `007_increment_usage_rpc.sql` | Kullanim sayaci fonksiyonu |

> Uyari: Bir dosyayi calistirmadan digerine gecme. Tablolar birbirine bagimli.
>
> Hata aldiysan: Hata mesajini oku. Genelde "already exists" ise sorun yok, zaten kurulmus demektir. Baska bir hata ise bir onceki dosyanin duzgun calistigini kontrol et.

**Kontrol:** Sol menuden **Table Editor** ac. `profiles`, `subscriptions`, `conversions`, `outputs`, `usage`, `templates` tablolarini goruyor musun? Tamam.

---

### Adim 1.3 — Storage Bucket'larini Kontrol Et

Migration dosyalari bucket'lari otomatik olusturuyor. Kontrol edelim:

1. Sol menuden **Storage** tikla.
2. Su iki bucket var mi bak:
   - `audio-uploads`
   - `pdf-uploads`
3. **Yoksa:** SQL Editor'a geri don, `006_rls_policies.sql` dosyasini tekrar calistir. Hala yoksa, asagidaki SQL'i calistir:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-uploads', 'audio-uploads', false)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('pdf-uploads', 'pdf-uploads', false)
ON CONFLICT DO NOTHING;
```

**Kontrol:** Storage'da iki bucket gorunuyor. Tamam.

---

### Adim 1.4 — Google ile Giris Ayari (OAuth)

Bu adim iki yerde yapiliyor: Google Cloud Console + Supabase.

**Oncelik: Supabase'de Google provider'i ac**

1. Sol menuden **Authentication** tikla.
2. Ust menude **Providers** sekmesine gec.
3. Listede **Google**'i bul, tikla.
4. **Enable Sign in with Google** togglini ac.
5. Altta `Redirect URL` yaziyor — **bunu kopyala**, Google'da lazim olacak.
   - Ornek: `https://abcdefg.supabase.co/auth/v1/callback`
6. Sayfayi kapatma, acik birak. Google tarafini ayarlayinca geri doneceksin.

**Google Cloud Console'da:**

1. `console.cloud.google.com` adresine git, Google hesabinla giris yap.
2. Ust menude proje secici var. **New Project** tikla.
   - Name: `ContentForge` yaz.
   - **Create** tikla.
3. Proje acildiktan sonra sol hamburger menu > **APIs & Services** > **OAuth consent screen** tikla.
4. **User Type:** `External` sec, **Create** tikla.
5. Formu doldur:
   - **App name:** `ContentForge`
   - **User support email:** Kendi e-postan
   - **Developer contact:** Kendi e-postan
   - Geri kalani bos birak.
6. **Save and Continue** tikla. Scopes ve Test users adimlarini gec (Save and Continue).
7. Simdi sol menuden **Credentials** tikla.
8. Ust menude **+ Create Credentials** > **OAuth client ID** tikla.
9. **Application type:** `Web application` sec.
10. **Name:** `ContentForge Web` yaz.
11. **Authorized redirect URIs** bolumunde **+ Add URI** tikla.
12. Supabase'den kopyaladigin Redirect URL'i yapistir.
    - Ornek: `https://abcdefg.supabase.co/auth/v1/callback`
13. **Create** tikla.
14. Karsilastigin popup'ta **Client ID** ve **Client Secret** degerlerini kopyala.

> Bu iki degeri kaybetme! Simdi Supabase'e geri donuyoruz.

**Tekrar Supabase'e don:**

1. Authentication > Providers > Google ayarlarini acik biraktigin sayfaya geri don.
2. **Client ID** alanina Google'dan aldigin Client ID'yi yapistir.
3. **Client Secret** alanina Google'dan aldigin Client Secret'i yapistir.
4. **Save** tikla.

**Kontrol:** Authentication > Providers'da Google'in yaninda yesil tik var mi? Tamam.

---

### Adim 1.5 — Baglanti Bilgilerini Al (Env Degerleri)

Su 3 degeri bir yere not al, ileride `.env` dosyasina yazacaksin.

1. Supabase'de sol menuden **Settings** (disli ikon) tikla.
2. **API** sekmesine gec.
3. Su degerleri kopyala:

| Nerede bulacaksin | Ne olacak |
|---|---|
| **Project URL** (ustte) | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** (API Keys bolumunde) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** (API Keys bolumunde, gizli) | `SUPABASE_SERVICE_ROLE_KEY` |

> `service_role` anahtarini gostermek icin goz ikonuna tikla. Bu anahtari **kimseyle paylasma**, client-side koda koyma. Sadece sunucuda kullanilacak.

**Kontrol:** 3 degeri bir yere kaydettim. Tamam.

---

## BOLUM 2 — OpenAI API Anahtari

**Bu bolumde ne yapacaksin:** GPT-4o ve Whisper (ses→metin) icin OpenAI API anahtari alacaksin.

---

### Adim 2.1 — OpenAI Hesabi ve API Key

1. `platform.openai.com` adresine git.
2. Hesabin yoksa kayit ol.
3. Sol menuden **API Keys** tikla.
4. **+ Create new secret key** tikla.
5. **Name:** `contentforge` yaz.
6. **Create secret key** tikla.
7. Gosterilen anahtari (`sk-proj-...`) **hemen kopyala ve kaydet**.

> Uyari: Bu anahtar sadece bir kez gosterilir. Kaydetmeden sayfayi kapatirsan, yenisini olusturman gerekir.

### Adim 2.2 — Odeme Yontemi Ekle

OpenAI API ucretsiz degil. GPT-4o kullanmak icin hesapta bakiye/odeme yontemi olmasi gerekir.

1. Sol menuden **Settings** > **Billing** tikla.
2. **Add payment method** tikla.
3. Kredi kartini ekle.
4. **Add to balance** ile en az $5 bakiye yukle (baslangic icin yeterli).

> Not: Bir donusum yaklasik $0.01-0.05 arasinda tutuyor. 3 ucretsiz donusum icin bile API maliyeti senin uzerinde.

**Kontrol:** API key'i bir yere kaydettim, bakiye yukledim. Tamam.

| Nerede bulacaksin | Ne olacak |
|---|---|
| API Keys sayfasinda olusturulan anahtar | `OPENAI_API_KEY` |

---

## BOLUM 3 — Lemon Squeezy (Odeme Sistemi)

**Bu bolumde ne yapacaksin:** Lemon Squeezy'de magaza acip, 2 urun (Starter + Pro) olusturacak ve webhook kuracaksin.

---

### Adim 3.1 — Hesap ve Magaza Olustur

1. `lemonsqueezy.com` adresine git.
2. **Get started free** tikla, hesap olustur.
3. Ilk girisinde magaza olusturma ekrani gelecek:
   - **Store name:** `ContentForge`
   - Gereken bilgileri doldur (ulke, para birimi USD sec).
4. Magaza olusturulduktan sonra Dashboard'a yonlendirileceksin.

---

### Adim 3.2 — Urunleri Olustur

4 variant olusturman gerekiyor: Starter Monthly, Starter Yearly, Pro Monthly, Pro Yearly.

**Starter Plan:**

1. Sol menuden **Store** > **Products** tikla.
2. **+ New product** tikla.
3. Formu doldur:
   - **Name:** `ContentForge Starter`
   - **Price:** `$19.00`
   - **Billing period:** `Monthly`
   - **This is a subscription product** secenegini isaretle.
4. **Publish** tikla.
5. Urunu ac, URL'deki veya sayfadaki **Variant ID** numarasini not al.
   → `LEMON_STARTER_MONTHLY_VARIANT_ID`
6. Ayni urunun icinde **Variants** sekmesinden **+ Add variant** tikla:
   - **Name:** `Yearly`
   - **Price:** `$182.40`
   - **Billing period:** `Yearly`
7. Kaydet. Bu variant'in ID'sini de not al.
   → `LEMON_STARTER_YEARLY_VARIANT_ID`

**Pro Plan:**

1. Yeni urun olustur: **+ New product**
   - **Name:** `ContentForge Pro`
   - **Price:** `$49.00` / Monthly (subscription)
2. Variant ID'yi not al → `LEMON_PRO_MONTHLY_VARIANT_ID`
3. Ayni urune yillik variant ekle: `$470.40` / Yearly
4. Variant ID'yi not al → `LEMON_PRO_YEARLY_VARIANT_ID`

**Kontrol:** 4 variant ID'yi bir yere kaydettim. Tamam.

---

### Adim 3.3 — API Key ve Store ID Al

**API Key:**

1. Sag ust profil ikonuna tikla > **Settings** sec.
2. Sol menude **API Keys** tikla (veya **API** sekmesine gec).
3. **+** butonuyla yeni API key olustur.
4. Kopyala → `LEMONSQUEEZY_API_KEY`

**Store ID:**

1. Settings > **General** sekmesinde **Store ID** degerini bul.
2. Kopyala → `LEMONSQUEEZY_STORE_ID`

**Kontrol:** API key ve Store ID kaydedildi. Tamam.

---

### Adim 3.4 — Webhook Kur

Webhook, birisi odeme yaptiginda veya aboneligini iptal ettiginde uygulamanin haberdar olmasini saglar.

1. Settings > **Webhooks** tikla.
2. **+** butonuna tikla (veya **Add endpoint**).
3. Formu doldur:
   - **Callback URL:** `https://SENIN-DOMAININ/api/webhooks/lemonsqueezy`
   - **Signing secret:** Guclu bir sifre olustur.
     - Kolay yontem: Terminalde `openssl rand -hex 32` calistir ve ciktisini kopyala.
     - Veya herhangi bir sifre uretici siteden 32+ karakter al.
   - **Events:** Su eventleri sec:
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `subscription_expired`
     - `subscription_resumed`
     - `subscription_payment_success`
     - `subscription_payment_failed`
4. **Save** tikla.
5. Signing secret'i kaydet → `LEMONSQUEEZY_WEBHOOK_SECRET`

> Not: Domain henuz yoksa webhook URL'ini sonra guncelleyebilirsin. Oncelikle diger adimlara devam et.

**Kontrol:** Webhook olusturuldu, signing secret kaydedildi. Tamam.

---

## BOLUM 4 — Tum Degerleri Topla (Env Checklist)

Buraya kadar toplamis olman gereken degerler:

| Degisken | Nereden Aldin | Ornek |
|----------|---------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API | `https://abcde.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API | `eyJhbGci...` |
| `OPENAI_API_KEY` | OpenAI > API Keys | `sk-proj-...` |
| `LEMONSQUEEZY_API_KEY` | LemonSqueezy > Settings > API | `eyJ...` |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook olustururken girdigin secret | `a3f8b2...` |
| `LEMONSQUEEZY_STORE_ID` | LemonSqueezy > Settings > General | `12345` |
| `LEMON_STARTER_MONTHLY_VARIANT_ID` | Starter urun > Monthly variant | `67890` |
| `LEMON_STARTER_YEARLY_VARIANT_ID` | Starter urun > Yearly variant | `67891` |
| `LEMON_PRO_MONTHLY_VARIANT_ID` | Pro urun > Monthly variant | `67892` |
| `LEMON_PRO_YEARLY_VARIANT_ID` | Pro urun > Yearly variant | `67893` |

> Eksik olan var mi? Eksikse ilgili bolume geri don.

---

## BOLUM 5 — Sunucu Kurulumu ve Deploy

**Bu bolumde ne yapacaksin:** Bir Ubuntu sunucuya Docker kuracak, projeyi deploy edecek ve SSL ile canli hale getireceksin.

---

### Adim 5.1 — Sunucu Edin

Bir VPS (sanal sunucu) lazim. Oneriler:

| Saglayici | Minimum Plan | Fiyat |
|-----------|-------------|-------|
| Hetzner | CX22 (2 vCPU, 4GB RAM) | ~$4.5/ay |
| DigitalOcean | Basic Droplet (2 vCPU, 2GB RAM) | ~$12/ay |
| Linode | Nanode 2GB | ~$12/ay |

**Olusturma adimlari (Hetzner ornegi):**

1. `console.hetzner.cloud` adresine git, hesap ac.
2. **Add Server** tikla.
3. Ayarlar:
   - **Location:** Nuremberg veya Helsinki
   - **Image:** `Ubuntu 24.04`
   - **Type:** `CX22` (veya benzer 2GB+ RAM)
   - **SSH Key:** Varsa ekle, yoksa sifre ile giris sec.
4. **Create & Buy Now** tikla.
5. IP adresini not al.

> Ev sunucun varsa (Ubuntu 22.04+) onu da kullanabilirsin. Minimum 2GB RAM oneriliyor.

---

### Adim 5.2 — Sunucuya Baglan

Kendi bilgisayarinda terminal/komut satirini ac:

**Mac/Linux:**
```bash
ssh root@SUNUCU_IP_ADRESI
```

**Windows:**
- PowerShell veya Windows Terminal ac:
```bash
ssh root@SUNUCU_IP_ADRESI
```
- Veya PuTTY kullan.

Ilk baglantida "Are you sure?" sorusu gelecek — `yes` yaz, Enter.
Sifre sorarsa, sunucu olustururken belirledigin sifreyi gir.

**Kontrol:** `root@sunucu:~#` gibi bir komut satiri goruyorsun. Tamam.

---

### Adim 5.3 — Deploy Scriptini Calistir

Bu script Docker'i kurar, firewall'u ayarlar, repoyu klonlar ve servisleri baslatir.

```bash
apt-get update -qq && apt-get install -y -qq curl git
git clone https://github.com/kutluhangil/ContentForge-AI.git /opt/contentforge
```

> Eger repo private ise, once GitHub'da Personal Access Token olusturup su formatta kullan:
> `git clone https://TOKEN@github.com/kutluhangil/ContentForge-AI.git /opt/contentforge`

Simdi deploy scriptini calistir:

```bash
cd /opt/contentforge
sudo bash scripts/deploy.sh
```

Script surada duracak ve sana hata verecek: **".env.production dosyasi eksik!"**
Bu normal. Simdiki adimda olusturacagiz.

---

### Adim 5.4 — Environment Dosyasini Olustur

```bash
nano /opt/contentforge/.env.production
```

Asagidaki sablonu yapistr ve degerleri BOLUM 4'teki kayitli degerlerinden doldur:

```
# Uygulama
NEXT_PUBLIC_APP_URL=https://SENIN-DOMAININ.com
NEXT_PUBLIC_DEFAULT_LOCALE=tr

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://PROJE_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya-anon-key
SUPABASE_SERVICE_ROLE_KEY=buraya-service-role-key

# OpenAI
OPENAI_API_KEY=sk-proj-buraya-key

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=buraya-ls-api-key
LEMONSQUEEZY_WEBHOOK_SECRET=buraya-webhook-secret
LEMONSQUEEZY_STORE_ID=12345
LEMON_STARTER_MONTHLY_VARIANT_ID=67890
LEMON_STARTER_YEARLY_VARIANT_ID=67891
LEMON_PRO_MONTHLY_VARIANT_ID=67892
LEMON_PRO_YEARLY_VARIANT_ID=67893

# Redis (degistirme, docker-compose icinde otomatik ayarli)
REDIS_URL=redis://redis:6379
```

Kaydetmek icin: `Ctrl+X`, sonra `Y`, sonra `Enter`.

---

### Adim 5.5 — Deploy Scriptini Tekrar Calistir

```bash
sudo bash scripts/deploy.sh
```

Bu sefer env dosyasini bulacak ve devam edecek. Script:
- Docker imajlarini build edecek (5-10 dakika surebilir)
- Redis, App, Worker ve Caddy containerlarini baslatacak
- Health check yapacak

Basarili olursa sunu goreceksin:
```
[  ok  ] ContentForge basariyla deploy edildi!
```

Kontrol etmek icin:
```bash
docker compose -f /opt/contentforge/docker/docker-compose.yml ps
```

4 container gorunmeli: `redis`, `app`, `worker`, `caddy` — hepsi `Up` durumunda.

> Hata aldiysan: `docker compose -f /opt/contentforge/docker/docker-compose.yml logs app` ile loglari kontrol et.

---

### Adim 5.6 — Domain ve DNS Ayari

Bir domain'in olmasi gerekiyor (ornek: `contentforge.app`). Domain saglayicinda (Namecheap, Cloudflare, GoDaddy, vs.):

1. DNS yonetimine gir.
2. **A Record** ekle:

| Tip | Name | Deger | TTL |
|-----|------|-------|-----|
| A | `@` | Sunucunun IP adresi | 3600 |
| A | `www` | Sunucunun IP adresi | 3600 |

> DNS yayilmasi 5-30 dakika surebilir. `ping senin-domainin.com` ile IP adresini dogrulayabilirsin.

---

### Adim 5.7 — Caddyfile'da Domain Guncelle

Caddy otomatik SSL sertifikasi aliyor ama hangi domain icin calisacagini bilmesi gerekiyor.

```bash
nano /opt/contentforge/docker/Caddyfile
```

Dosyada **2 yerde** `contentforge.app` yaziliyor. Ikisini de kendi domainle degistir:

```
contentforge.app {        ←  BUNU DEGISTIR
    ...
}

www.contentforge.app {    ←  BUNU DA DEGISTIR
    redir https://contentforge.app{uri} permanent    ←  BURADAKINI DE
}
```

Kaydet: `Ctrl+X`, `Y`, `Enter`.

Caddy'yi yeniden baslat:
```bash
docker compose -f /opt/contentforge/docker/docker-compose.yml restart caddy
```

1-2 dakika bekle. Caddy otomatik olarak Let's Encrypt'ten SSL sertifikasi alacak.

**Kontrol:** Tarayicida `https://senin-domainin.com` adresine git. Sayfa aciliyor mu? Kilit ikonu var mi (SSL)? Tamam.

---

## BOLUM 6 — Webhook URL'ini Guncelle

Domain artik hazir. Lemon Squeezy webhook'una gercek URL'i girmemiz gerekiyor.

1. `lemonsqueezy.com` > Settings > Webhooks'a git.
2. Olusturdugum webhook'u tikla (duzenle).
3. **Callback URL**'i guncelle:
   ```
   https://SENIN-DOMAININ.com/api/webhooks/lemonsqueezy
   ```
4. **Save** tikla.

**Kontrol:** Webhook ayarlarinda dogru URL gorunuyor. Tamam.

---

## BOLUM 7 — Test Et

### 7.1 — Health Check

Tarayicida su adrese git:
```
https://SENIN-DOMAININ.com/api/health
```

`{"status":"ok"}` donuyorsa uygulama calisiyor.

---

### 7.2 — Kayit ve Giris Testi

1. `https://SENIN-DOMAININ.com/tr/register` adresine git.
2. E-posta + sifre ile kayit ol, **veya** "Google ile devam et" tikla.
3. Dashboard acildiysa her sey calisiyor.

---

### 7.3 — Donusum Testi

1. Dashboard'da **Yeni Donusum** (veya sol menude **Donustur**) tikla.
2. Kaynak olarak **Metin Yapistir** sec.
3. Herhangi bir blog yazisi metni yapistir (2-3 paragraf yeterli).
4. Format olarak **LinkedIn Post** sec.
5. Ton: **Profesyonel** kalsin.
6. **Donustur** tikla.
7. 15-30 saniye bekle. Sonuc gorunecek.

> Hata aldiysan: OpenAI API key'ini ve bakiyeni kontrol et. Sunucuda loglari incele:
> ```bash
> docker compose -f /opt/contentforge/docker/docker-compose.yml logs -f worker
> ```

---

### 7.4 — Webhook Testi

1. Lemon Squeezy > Settings > Webhooks'a git.
2. Webhook'un yanindaki **...** menusunden **Send test webhook** sec.
3. Sunucuda logu kontrol et:
   ```bash
   docker compose -f /opt/contentforge/docker/docker-compose.yml logs app | grep -i webhook
   ```
4. Log'da webhook alindi mesaji goruyorsan tamam.

---

## BOLUM 8 — GitHub Actions ile Otomatik Deploy (Opsiyonel)

**Bu bolumde ne yapacaksin:** Kod push ettiginde sunucuya otomatik deploy icin CI/CD pipeline kuracaksin. **Bu adim zorunlu degil**, ama her kod degisikliginde sunucuya baglanip elle deploy yapmak istemiyorsan cok faydali.

---

### Adim 8.1 — SSH Key Olustur (CI/CD icin)

Kendi bilgisayarinda terminal ac:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/contentforge_deploy
```

Sifre sorarsa **bos birak** (Enter, Enter).

Iki dosya olusacak:
- `~/.ssh/contentforge_deploy` — Private key (gizli, GitHub'a eklenecek)
- `~/.ssh/contentforge_deploy.pub` — Public key (sunucuya eklenecek)

**Public key'i sunucuya ekle:**

```bash
# Kendi bilgisayarinda:
cat ~/.ssh/contentforge_deploy.pub
```

Ciktinin tamamini kopyala. Sunucuya baglan ve:

```bash
# Sunucuda:
echo "BURAYA-PUBLIC-KEY-YAPISTIR" >> ~/.ssh/authorized_keys
```

---

### Adim 8.2 — GitHub Secrets Ekle

GitHub'da reponun sayfasina git > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

Her bir secret icin **ayri ayri** "New repository secret" tikla:

| Secret Adi | Degeri | Aciklama |
|---|---|---|
| `SERVER_HOST` | `123.45.67.89` | Sunucunun IP adresi |
| `SERVER_USER` | `root` | SSH kullanici adi |
| `SERVER_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | `cat ~/.ssh/contentforge_deploy` ciktisinin **tamami** (BEGIN ve END satirlari dahil) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcde.supabase.co` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon key |

> `SERVER_PORT` secimi: Eger SSH farkli portta ise ekle, standart 22 ise ekleme.

---

### Adim 8.3 — Test Et

1. Kodda kucuk bir degisiklik yap (ornek: README'ye bir satir ekle).
2. Commit et ve `main` branch'ine push et:
   ```bash
   git add -A && git commit -m "test: CI/CD pipeline" && git push
   ```
3. GitHub'da reponun **Actions** sekmesine git.
4. Calisma basladiysa ve yesil tik aldiysa CI/CD calisiyor.

> Basarisiz olursa: Actions'da ilgili run'i tikla, hangi adimda hata aldigini oku.

---

## BOLUM 9 — Uptime Kuma ile Izleme (Opsiyonel)

**Bu bolumde ne yapacaksin:** Uygulama cokerse seni bilgilendirecek bir monitoring sistemi kuracaksin.

docker-compose.yml'de Uptime Kuma zaten tanimli. Ayri bir container olarak da kurabilirsin:

```bash
docker run -d \
  --restart=always \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma-data:/app/data \
  louislam/uptime-kuma:1
```

1. Tarayicida `http://SUNUCU_IP:3001` adresine git.
2. Ilk acilista kullanici adi + sifre olustur.
3. **Add New Monitor** tikla:
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `ContentForge`
   - **URL:** `https://SENIN-DOMAININ.com/api/health`
   - **Heartbeat Interval:** `60` (saniye)
4. **Save** tikla.

Bildirim icin (uygulama duserse haber versin):
1. Sol menude **Settings** > **Notifications** tikla.
2. **Setup Notification** tikla.
3. Telegram, Discord, E-posta gibi seceneklerden birini ayarla.

---

## SON KONTROL LISTESI

Her adimi tamamlayinca isaretleyebilirsin:

```
SUPABASE
  [ ] Proje olusturuldu
  [ ] 7 SQL migrasyonu siraya gore calistirildi
  [ ] Storage bucket'lari kontrol edildi (audio-uploads, pdf-uploads)
  [ ] Google OAuth ayarlandi (Google Console + Supabase)
  [ ] 3 baglanti bilgisi kaydedildi (URL, anon key, service role key)

OPENAI
  [ ] API key olusturuldu ve kaydedildi
  [ ] Odeme yontemi / bakiye eklendi

LEMON SQUEEZY
  [ ] Magaza olusturuldu
  [ ] Starter urunu olusturuldu (monthly + yearly variant)
  [ ] Pro urunu olusturuldu (monthly + yearly variant)
  [ ] 4 variant ID kaydedildi
  [ ] API key ve Store ID kaydedildi
  [ ] Webhook olusturuldu, signing secret kaydedildi

SUNUCU
  [ ] VPS / sunucu edinildi (Ubuntu 22.04+)
  [ ] Repo klonlandi (/opt/contentforge)
  [ ] .env.production dosyasi olusturuldu ve tum degerler dolduruldu
  [ ] deploy.sh calistirildi, 4 container Up durumunda

DOMAIN & SSL
  [ ] DNS A Record ayarlandi (@ ve www)
  [ ] Caddyfile'da domain guncellendi
  [ ] Caddy yeniden baslatildi, SSL sertifikasi alindi
  [ ] https://domain.com aciliyor ve kilit ikonu var

WEBHOOK
  [ ] Lemon Squeezy webhook URL'i gercek domain ile guncellendi

TEST
  [ ] /api/health → {"status":"ok"} donuyor
  [ ] Kayit olunabiliyor (e-posta veya Google)
  [ ] Dashboard aciliyor
  [ ] Donusum yapilabiliyor (metin → LinkedIn post)
  [ ] Webhook test event'i aliniyor

OPSIYONEL
  [ ] GitHub Actions secrets eklendi (CI/CD icin)
  [ ] CI/CD pipeline test edildi
  [ ] Uptime Kuma kuruldu ve monitor eklendi
```

---

## SIKCA KARSILASILAN SORUNLAR

### "502 Bad Gateway" alirsam?

App container'i henuz hazir degil veya cokmus olabilir:
```bash
docker compose -f /opt/contentforge/docker/docker-compose.yml logs app
```

### Donusum baslatiyorum ama sonuc gelmiyor?

Worker container'ini kontrol et:
```bash
docker compose -f /opt/contentforge/docker/docker-compose.yml logs -f worker
```
OpenAI API key'inin dogru oldugunu ve bakiyenin oldugunu kontrol et.

### Google ile giris calismiyor?

1. Supabase > Authentication > Providers > Google'da Client ID ve Secret dogru mu?
2. Google Console'da Redirect URI dogru mu? (`https://PROJE_ID.supabase.co/auth/v1/callback`)
3. OAuth consent screen'de uygulama durumu "Testing" ise, sadece test kullanicilari giris yapabilir. **Publish** tikla.

### SSL sertifikasi alinmiyor?

1. DNS propagation tamamlandi mi? `ping domain.com` ile kontrol et.
2. 80 ve 443 portlari acik mi? `ufw status` ile kontrol et.
3. Caddy loglarini incele:
```bash
docker compose -f /opt/contentforge/docker/docker-compose.yml logs caddy
```

### Container'lari yeniden baslatmak istiyorum?

```bash
cd /opt/contentforge
docker compose -f docker/docker-compose.yml restart
```

### Sifirdan build etmek istiyorum?

```bash
cd /opt/contentforge
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml up -d --build
```

---

## YARDIM LINKLERI

| Konu | Dokumantasyon |
|------|---------------|
| Supabase | `supabase.com/docs` |
| OpenAI API | `platform.openai.com/docs` |
| Lemon Squeezy | `docs.lemonsqueezy.com` |
| Docker | `docs.docker.com` |
| Caddy | `caddyserver.com/docs` |
| Hetzner | `docs.hetzner.com` |
