import urllib.request
import os
import time

items = {
    # 12 Capsule Items
    "blazer.jpg": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    "cardigan.jpg": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80",
    "shirt.jpg": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    "blouse.jpg": "https://images.unsplash.com/photo-1564257631407-4deb129965a2?w=800&auto=format&fit=crop&q=80",
    "tshirt.jpg": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    "knitwear.jpg": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80",
    "trousers.jpg": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
    "denim.jpg": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    "chinos.jpg": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    "sneakers.jpg": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    "loafers.jpg": "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&auto=format&fit=crop&q=80",
    "bag.jpg": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    "scarf.jpg": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80",

    # Hero Items
    "broken-white-shirt.jpg": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    "espresso-trousers.jpg": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
    "navy-blazer.jpg": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    "crisp-oxford-shirt.jpg": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    "charcoal-pants.jpg": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80",
    "graphite-blazer.jpg": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80",
    "ecru-heavy-tee.jpg": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
    "taupe-chinos.jpg": "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80",
}

looks = {
    # Kantor (Office)
    "outfit-kantor-1.jpg": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    "outfit-kantor-2.jpg": "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80",
    "outfit-kantor-3.jpg": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
    "outfit-kantor-4.jpg": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    "outfit-kantor-5.jpg": "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80",
    "outfit-kantor-6.jpg": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",

    # Meeting
    "outfit-meeting-1.jpg": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    "outfit-meeting-2.jpg": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    "outfit-meeting-3.jpg": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    "outfit-meeting-4.jpg": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80",
    "outfit-meeting-5.jpg": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",

    # Kampus
    "outfit-kampus-1.jpg": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80",
    "outfit-kampus-2.jpg": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    "outfit-kampus-3.jpg": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    "outfit-kampus-4.jpg": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80",
    "outfit-kampus-5.jpg": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80",

    # Hangout
    "outfit-hangout-1.jpg": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    "outfit-hangout-2.jpg": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=80",
    "outfit-hangout-3.jpg": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
    "outfit-hangout-4.jpg": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80",
    "outfit-hangout-5.jpg": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80",
    "outfit-hangout-6.jpg": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",

    # Santai
    "outfit-santai-1.jpg": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    "outfit-santai-2.jpg": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80",
    "outfit-santai-3.jpg": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    "outfit-santai-4.jpg": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    "outfit-santai-5.jpg": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",

    # Formal
    "outfit-formal-1.jpg": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    "outfit-formal-2.jpg": "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=80",
    "outfit-formal-3.jpg": "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=800&auto=format&fit=crop&q=80",
    "outfit-formal-4.jpg": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80",
    "outfit-formal-5.jpg": "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?w=800&auto=format&fit=crop&q=80",
}

def download_files(dict_data, target_dir):
    os.makedirs(target_dir, exist_ok=True)
    for filename, url in dict_data.items():
        filepath = os.path.join(target_dir, filename)
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            print(f"Skipping {filename}, already exists ({os.path.getsize(filepath)} bytes)")
            continue
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64)"})
            with urllib.request.urlopen(req, timeout=15) as resp, open(filepath, "wb") as f:
                f.write(resp.read())
            print(f"Downloaded {filename} ({os.path.getsize(filepath)} bytes)")
            time.sleep(0.1)
        except Exception as e:
            print(f"Failed {filename}: {e}")

print("Downloading items...")
download_files(items, "static/images/real/items")
print("Downloading looks...")
download_files(looks, "static/images/real/looks")
print("Done!")
