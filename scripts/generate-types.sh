#!/bin/bash
# Supabase TypeScript type üretme betiği
# Kullanım: ./scripts/generate-types.sh

set -e

if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "Hata: SUPABASE_PROJECT_ID env değişkeni ayarlanmamış."
  echo "Kullanım: SUPABASE_PROJECT_ID=xxxxx ./scripts/generate-types.sh"
  exit 1
fi

echo "Supabase TypeScript tipleri üretiliyor..."
npx supabase gen types typescript \
  --project-id "$SUPABASE_PROJECT_ID" \
  --schema public \
  > src/types/database.ts

echo "✓ src/types/database.ts güncellendi."
