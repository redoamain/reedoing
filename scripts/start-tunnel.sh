#!/usr/bin/env bash
# Script untuk menjalankan Cloudflare Quick Tunnel untuk testing lokal/mobile

PORT=5173

# Cek apakah port 5173 (dev) atau port 3303 (prod) aktif
if ss -tulpn 2>/dev/null | grep -q ":3303 "; then
    PORT=3303
elif ss -tulpn 2>/dev/null | grep -q ":5173 "; then
    PORT=5173
fi

echo "======================================================="
echo " Meluncurkan Cloudflare Tunnel untuk http://localhost:${PORT}"
echo "======================================================="
cloudflared tunnel --url "http://localhost:${PORT}"
