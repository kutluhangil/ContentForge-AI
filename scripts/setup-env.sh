#!/usr/bin/env bash
#
# ContentForge — Environment Setup Script
# Copies .env.example to .env.local and prompts for required values.
#

set -euo pipefail

ENV_EXAMPLE=".env.example"
ENV_LOCAL=".env.local"

echo ""
echo "  ContentForge — Environment Setup"
echo "  ================================"
echo ""

# Check we're in the project root
if [ ! -f "$ENV_EXAMPLE" ]; then
  echo "ERROR: $ENV_EXAMPLE not found. Run this script from the project root."
  exit 1
fi

# Don't overwrite existing .env.local
if [ -f "$ENV_LOCAL" ]; then
  echo "WARNING: $ENV_LOCAL already exists."
  read -rp "Overwrite? (y/N) " answer
  if [[ ! "$answer" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

cp "$ENV_EXAMPLE" "$ENV_LOCAL"
echo "Created $ENV_LOCAL from $ENV_EXAMPLE"
echo ""

# Helper to prompt and replace a value
prompt_replace() {
  local key="$1"
  local description="$2"
  local current
  current=$(grep "^${key}=" "$ENV_LOCAL" | cut -d'=' -f2-)

  read -rp "  $description [$current]: " value
  if [ -n "$value" ]; then
    # Escape special sed characters
    local escaped_value
    escaped_value=$(printf '%s\n' "$value" | sed 's/[&/\]/\\&/g')
    sed -i.bak "s|^${key}=.*|${key}=${escaped_value}|" "$ENV_LOCAL"
  fi
}

echo "Enter your credentials (press Enter to keep defaults):"
echo ""

echo "── Supabase ──"
prompt_replace "NEXT_PUBLIC_SUPABASE_URL" "Supabase Project URL"
prompt_replace "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase Anon Key"
prompt_replace "SUPABASE_SERVICE_ROLE_KEY" "Supabase Service Role Key"
echo ""

echo "── OpenAI ──"
prompt_replace "OPENAI_API_KEY" "OpenAI API Key"
echo ""

echo "── Lemon Squeezy ──"
prompt_replace "LEMONSQUEEZY_API_KEY" "Lemon Squeezy API Key"
prompt_replace "LEMONSQUEEZY_WEBHOOK_SECRET" "Lemon Squeezy Webhook Secret"
prompt_replace "LEMONSQUEEZY_STORE_ID" "Lemon Squeezy Store ID"
echo ""

echo "── Redis ──"
prompt_replace "REDIS_URL" "Redis URL"
echo ""

echo "── App ──"
prompt_replace "NEXT_PUBLIC_APP_URL" "App URL (e.g. https://contentforge.app)"
echo ""

# Cleanup sed backup
rm -f "${ENV_LOCAL}.bak"

echo "Done! $ENV_LOCAL has been configured."
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. npm run dev"
echo ""
