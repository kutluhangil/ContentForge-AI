# ContentForge — Manuel Kurulum Adımları

> Bu kılavuz, uygulamayı ayağa kaldırmak için **senin yapman gereken** adımları içeriyor.
> Kod zaten hazır. Sadece bu servisleri kurman ve birbirine bağlaman gerekiyor.

---

## BÖLÜM 1 — Supabase Kurulumu

### 1.1 Supabase Projesi Oluştur

1. Tarayıcında `supabase.com` adresine git.
2. **Sign Up** ile ücretsiz hesap aç (GitHub ile bağlanabilirsin).
3. **New Project** butonuna tıkla.
4. Şunları doldur:
   - **Name:** `contentforge`
   - **Database Password:** Güçlü bir şifre yaz — bir yere kaydet, sonra lazım olacak.
   - **Region:** Sana en yakın bölgeyi seç (örn. `Frankfurt (EU Central)`)
5. **Create new project** tıkla. Proje hazırlanması 1-2 dakika sürer.

---

### 1.2 Veritabanı Tablolarını Kur (Migrasyonları Çalıştır)

Proje hazır olunca:

1. Sol menüden **SQL Editor** aç.
2. `New query` tıkla.
3. Aşağıdaki sırayla, her dosyanın içeriğini SQL editörüne yapıştır ve **Run** tıkla:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_templates_seed.sql
supabase/migrations/004_usage_tracking.sql
supabase/migrations/005_update_profile_trigger.sql
supabase/migrations/006_storage_buckets.sql
supabase/migrations/007_increment_usage_rpc.sql
```

> Her SQL dosyasını sırayla çalıştır. Bir önceki bitmeden bir sonrakine geçme.

**Dosyaları açmak için:** Proje klasöründe `supabase/migrations/` klasörünü aç. Her `.sql` dosyasını bir metin editörüyle aç (Notepad, VS Code, vs.), tümünü kopyala, SQL Editor'a yapıştır, Run tıkla.

---

### 1.3 Storage Bucket Kontrolü

1. Sol menüden **Storage** aç.
2. Şu bucket'ların otomatik oluştuğunu kontrol et:
   - `audio-uploads`
   - `pdf-uploads`
3. Eğer yoksa, `006_storage_buckets.sql` dosyasını tekrar çalıştır.

---

### 1.4 Google OAuth Ayarları

**Supabase'de:**

1. Sol menüden **Authentication** → **Providers** aç.
2. **Google** provider'ını bul ve **Enable** tıkla.
3. Şimdilik boş bırak, Google tarafını ayarlayınca geri geleceksin.

**Google Cloud Console'da:**

1. `console.cloud.google.com` adresine git.
2. Yeni bir proje oluştur (veya mevcut bir projeyi seç).
3. Sol menüden **APIs & Services** → **Credentials** aç.
4. **+ Create Credentials** → **OAuth client ID** seç.
5. Application type: **Web application** seç.
6. **Authorized redirect URIs** kısmına şunu ekle:
   ```
   https://[SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback
   ```
   > `SUPABASE_PROJECT_ID` nedir? Supabase'de **Settings** → **General** → **Reference ID** kısmında yazar.
7. **Create** tıkla.
8. Sana verilen `Client ID` ve `Client Secret`i kopyala.

**Tekrar Supabase'e dön:**

1. Google provider ayarına gir.
2. `Client ID` ve `Client Secret`i yapıştır.
3. **Save** tıkla.

---

### 1.5 Supabase Bağlantı Bilgilerini Al

1. Supabase'de sol menüden **Settings** → **API** aç.
2. Şu değerleri not al:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` olacak
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` olacak
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` olacak (bunu kimseyle paylaşma!)

---

## BÖLÜM 2 — OpenAI API Anahtarı

1. `platform.openai.com` adresine git.
2. Hesabın yoksa kayıt ol.
3. Sol menüden **API Keys** aç.
4. **+ Create new secret key** tıkla.
5. Bir isim ver (örn. `contentforge`) ve **Create** tıkla.
6. Verilen anahtarı (sk-...) kopyala — **sadece bir kez gösterilir, kaydet**.
7. Bu değer → `OPENAI_API_KEY` olacak.

> **Not:** GPT-4o kullanmak için OpenAI hesabında kredi/ödeme yöntemi tanımlı olması gerekir.

---

## BÖLÜM 3 — Lemon Squeezy (Ödeme Sistemi)

### 3.1 Hesap ve Mağaza Oluştur

1. `lemonsqueezy.com` adresine git.
2. Hesap aç ve **Create a store** ile yeni mağaza oluştur.
3. Mağaza adını yaz (örn. `ContentForge`).

---

### 3.2 Ürünleri ve Fiyatları Oluştur

**Starter Plan (Aylık) için:**

1. Sol menüden **Products** → **New product** tıkla.
2. Şunları doldur:
   - **Name:** `ContentForge Starter`
   - **Description:** İstediğin gibi yaz
   - **Pricing:** `$19.00 USD` / Monthly (Recurring)
3. **Save** tıkla.
4. Ürünü aç → **Variants** sekmesinde aylık variant'ın ID'sini not al (URL'de veya sayfada görünür).
   → Bu değer = `LEMON_STARTER_MONTHLY_VARIANT_ID`

**Starter Plan (Yıllık) için:**

1. Aynı ürünün içinde **Add variant** tıkla.
2. Fiyat: `$182.40 USD` / Yearly (Recurring)
3. Variant ID'yi not al → `LEMON_STARTER_YEARLY_VARIANT_ID`

**Pro Plan (Aylık) için:**

1. Yeni ürün oluştur: `ContentForge Pro` / `$49.00 USD` / Monthly
2. Variant ID'yi not al → `LEMON_PRO_MONTHLY_VARIANT_ID`

**Pro Plan (Yıllık) için:**

1. Aynı ürüne yeni variant: `$470.40 USD` / Yearly
2. Variant ID'yi not al → `LEMON_PRO_YEARLY_VARIANT_ID`

---

### 3.3 API Anahtarını Al

1. Lemon Squeezy'de sağ üst profiline tıkla → **Settings** → **API** aç.
2. **New API key** oluştur.
3. Kopyala → `LEMON_SQUEEZY_API_KEY` olacak.

---

### 3.4 Store ID'yi Al

1. Sol menüden **Settings** → **General** aç.
2. **Store ID** değerini not al → `LEMON_SQUEEZY_STORE_ID` olacak.

---

### 3.5 Webhook Kur (Abonelik Takibi İçin)

1. Sol menüden **Settings** → **Webhooks** aç.
2. **Add webhook** tıkla.
3. Şunları doldur:
   - **URL:** `https://SENIN-DOMAININ.com/api/webhooks/lemonsqueezy`
   - **Events:** Tüm `subscription_*` ve `order_*` event'leri seç
   - **Signing secret:** Güçlü bir şifre oluştur (örn. 32 karakter rastgele) — kaydet
4. **Save** tıkla.
5. Bu signing secret → `LEMON_WEBHOOK_SECRET` olacak.

> **Not:** Domain henüz yoksa, deploy sonrası bu URL'i güncelleyebilirsin.

---

## BÖLÜM 4 — Sunucu Kurulumu

### 4.1 Sunucu Gereksinimleri

Bir Ubuntu sunucuna ihtiyacın var. Önerilen:
- **DigitalOcean Droplet**, **Hetzner VPS**, veya **Linode** (en az 2GB RAM, 2 CPU)
- Ubuntu 22.04 veya 24.04

---

### 4.2 Sunucuya İlk Bağlantı ve Hazırlık

SSH ile sunucuya bağlan:
```bash
ssh root@SUNUCU_IP_ADRESI
```

Kurulum scriptini çalıştır (Docker ve temel ayarları yapar):
```bash
bash <(curl -s https://raw.githubusercontent.com/KULLANICI_ADIN/ContentForge-AI/main/scripts/deploy.sh)
```

> Script şunları yapar: UFW firewall açar (80, 443, 22), Docker kurar, repoyu klonlar.

---

### 4.3 Environment Dosyasını Oluştur

Sunucuda projenin bulunduğu klasöre git:
```bash
cd /opt/contentforge
```

`.env.production` dosyası oluştur:
```bash
nano .env.production
```

Aşağıdaki şablonu yapıştır ve değerleri doldur:

```env
# Uygulama URL'i (domainin)
NEXT_PUBLIC_APP_URL=https://senin-domainin.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://PROJE_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...

# Lemon Squeezy
LEMON_SQUEEZY_API_KEY=...
LEMON_SQUEEZY_STORE_ID=...
LEMON_WEBHOOK_SECRET=...
LEMON_STARTER_MONTHLY_VARIANT_ID=...
LEMON_STARTER_YEARLY_VARIANT_ID=...
LEMON_PRO_MONTHLY_VARIANT_ID=...
LEMON_PRO_YEARLY_VARIANT_ID=...

# Redis (docker-compose içinde otomatik ayarlanır)
REDIS_URL=redis://redis:6379
```

Kaydet: `Ctrl+X`, sonra `Y`, sonra `Enter`.

---

### 4.4 Uygulamayı Başlat

```bash
cd /opt/contentforge
docker compose -f docker/docker-compose.yml up -d
```

Çalışıyor mu kontrol et:
```bash
docker compose -f docker/docker-compose.yml ps
```

Tüm container'lar `Up` durumunda olmalı (`app`, `worker`, `redis`, `caddy`).

Logları izlemek için:
```bash
docker compose -f docker/docker-compose.yml logs -f app
```

---

## BÖLÜM 5 — Domain ve SSL Ayarları

### 5.1 DNS Ayarı

Domain sağlayıcında (GoDaddy, Namecheap, Cloudflare, vs.):

1. DNS yönetimine gir.
2. **A Record** ekle:
   - **Name:** `@` (veya `contentforge`)
   - **Value:** Sunucunun IP adresi
   - **TTL:** 3600 (veya Auto)
3. **www** için de aynı A Record ekle (isteğe bağlı).

> DNS yayılması 5-30 dakika sürebilir.

---

### 5.2 Caddy SSL

Caddy, SSL sertifikasını **otomatik olarak** Let's Encrypt'ten alır. Tek yapman gereken şey:

`docker/Caddyfile` dosyasında `yourdomain.com` yazan yerleri kendi domaininle değiştirmiş olmak.

Dosyayı düzenlemek için:
```bash
nano /opt/contentforge/docker/Caddyfile
```

`yourdomain.com` yerine kendi domaini yaz, kaydet.

Sonra Caddy'yi yeniden başlat:
```bash
docker compose -f docker/docker-compose.yml restart caddy
```

Birkaç dakika sonra `https://senin-domainin.com` adresine gittiğinde uygulama açılmalı.

---

## BÖLÜM 6 — GitHub Actions (Otomatik Deploy)

Kod push ettiğinde sunucuya otomatik deploy için:

### 6.1 GitHub Secrets Ekle

GitHub'da reponun sayfasına git → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

Aşağıdaki secret'ları ekle (her biri için ayrı ayrı):

| Secret Adı | Değer |
|------------|-------|
| `DEPLOY_HOST` | Sunucunun IP adresi |
| `DEPLOY_USER` | `root` (veya sunucu kullanıcı adın) |
| `DEPLOY_KEY` | SSH private key (aşağıda anlatılıyor) |
| `GHCR_TOKEN` | GitHub Personal Access Token |
| `NEXT_PUBLIC_APP_URL` | `https://senin-domainin.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

---

### 6.2 SSH Key Oluştur (CI/CD için)

Yerelde (kendi bilgisayarında) terminali aç:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/contentforge_deploy
```

Şifre sorduğunda boş bırak (Enter).

**Public key'i sunucuya ekle:**
```bash
cat ~/.ssh/contentforge_deploy.pub
```
Çıktıyı kopyala. Sunucuda:
```bash
echo "BURAYA_PUBLIC_KEY_YAPISTIR" >> ~/.ssh/authorized_keys
```

**Private key'i GitHub Secret olarak ekle:**
```bash
cat ~/.ssh/contentforge_deploy
```
Çıktının tamamını kopyala (-----BEGIN ile -----END satırları dahil). GitHub'da `DEPLOY_KEY` secret'ına yapıştır.

---

### 6.3 GitHub Container Registry Token

1. GitHub'da sağ üst profil → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. **Generate new token (classic)** tıkla.
3. Şu izni seç: `write:packages`
4. **Generate** tıkla, tokeni kopyala.
5. GitHub repo secret'larına `GHCR_TOKEN` olarak ekle.

---

## BÖLÜM 7 — Test ve Kontrol

### 7.1 Uygulama Çalışıyor mu?

```
https://senin-domainin.com/api/health
```
Bu adrese git. `{"status":"ok"}` dönüyorsa uygulama çalışıyor.

---

### 7.2 İlk Kullanıcı Testi

1. `https://senin-domainin.com/tr/register` adresine git.
2. Kayıt ol (Google veya e-posta ile).
3. Dashboard açılıyorsa her şey çalışıyor.
4. Bir dönüşüm dene: Blog URL yapıştır, format seç, dönüştür.

---

### 7.3 Webhook Testi (Lemon Squeezy)

1. Lemon Squeezy → Webhook ayarlarına gir.
2. **Send test** ile test event gönder.
3. Sunucuda logu kontrol et:
   ```bash
   docker compose -f docker/docker-compose.yml logs app | grep webhook
   ```

---

## BÖLÜM 8 — İzleme (Opsiyonel ama Önerilen)

### Uptime Kuma ile Anlık Durum Takibi

1. Sunucuda Uptime Kuma kur:
   ```bash
   docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
   ```
2. `http://SUNUCU_IP:3001` adresine git.
3. İlk kurulumda kullanıcı adı ve şifre oluştur.
4. **Add New Monitor** tıkla:
   - Type: `HTTP(s)`
   - URL: `https://senin-domainin.com/api/health`
   - Interval: `60 seconds`
5. E-posta veya Telegram bildirimi ayarlayabilirsin.

---

## ÖZET — Kontrol Listesi

Sıraya göre yap, her birini tamamlayınca işaretle:

- [ ] Supabase projesi oluşturuldu
- [ ] SQL migrasyonları çalıştırıldı (001 → 007)
- [ ] Storage bucket'ları kontrol edildi
- [ ] Google OAuth ayarlandı
- [ ] Supabase bağlantı bilgileri not alındı
- [ ] OpenAI API anahtarı oluşturuldu
- [ ] Lemon Squeezy mağazası açıldı
- [ ] 4 ürün/variant oluşturuldu (Starter Monthly/Yearly, Pro Monthly/Yearly)
- [ ] Lemon Squeezy webhook ayarlandı
- [ ] Sunucu kuruldu (Ubuntu 22.04+)
- [ ] `.env.production` dosyası oluşturuldu ve dolduruldu
- [ ] `docker compose up -d` çalıştırıldı
- [ ] Domain DNS ayarı yapıldı
- [ ] Caddyfile'da domain adı güncellendi
- [ ] SSL sertifikası otomatik alındı (Caddy)
- [ ] `/api/health` endpoint'i `ok` dönüyor
- [ ] İlk kullanıcı kaydı ve dönüşüm testi yapıldı
- [ ] GitHub Actions secrets eklendi (opsiyonel — otomatik deploy için)
- [ ] Uptime Kuma kuruldu (opsiyonel — izleme için)

---

## YARDIM

Bir adımda takılırsan:

- **Supabase:** `supabase.com/docs`
- **Lemon Squeezy:** `docs.lemonsqueezy.com`
- **Docker:** `docs.docker.com`
- **Caddy:** `caddyserver.com/docs`

Hata mesajı alırsan, tam mesajı bir yere not al ve çözüme göre ilerle.
