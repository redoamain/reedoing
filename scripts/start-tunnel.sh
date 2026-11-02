#!/usr/bin/env bash
# Script untuk menjalankan Cloudflare Quick Tunnel untuk testing lokal/mobile

PORT=5174

# Cek port mana yang aktif (5174, 5173, atau 3303)
if ss -tulpn 2>/dev/null | grep -q ":5174 "; then
    PORT=5174
elif ss -tulpn 2>/dev/null | grep -q ":5173 "; then
    PORT=5173
elif ss -tulpn 2>/dev/null | grep -q ":3303 "; then
    PORT=3303
fi

echo "======================================================="
echo " Meluncurkan Cloudflare Tunnel untuk http://localhost:${PORT}"
echo "======================================================="
cloudflared tunnel --url "http://localhost:${PORT}" --http-host-header "localhost:${PORT}"
