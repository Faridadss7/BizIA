import subprocess
import os
import time

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

os.makedirs("presentation_assets", exist_ok=True)

targets = [
    ("screen_home.png", "https://bizia.vercel.app/"),
    ("screen_simulator.png", "https://bizia.vercel.app/simulateur"),
    ("screen_scanner.png", "https://bizia.vercel.app/scanner"),
    ("screen_import.png", "https://bizia.vercel.app/import"),
]

for filename, url in targets:
    out_path = os.path.abspath(os.path.join("presentation_assets", filename))
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1440,900",
        f"--screenshot={out_path}",
        url
    ]
    print(f"Capturing {url} -> {out_path}...")
    try:
        subprocess.run(cmd, timeout=20, check=True)
        if os.path.exists(out_path):
            print(f"Captured {filename}: {os.path.getsize(out_path)} bytes")
    except Exception as e:
        print(f"Error: {e}")

print("Assets ready:", os.listdir("presentation_assets"))
