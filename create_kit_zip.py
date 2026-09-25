import zipfile
import os
import shutil

zip_name = "BizIA_Kit_de_Test_Fata_Nexus.zip"

files_to_pack = [
    ("test_data/ETAPES_DE_TEST_BIZIA.txt", "ETAPES_DE_TEST_BIZIA.txt"),
    ("test_data/catalogue_import_test.csv", "catalogue_import_test.csv"),
    ("test_data/facture_test_fournisseur.jpg", "facture_test_fournisseur.jpg"),
    ("test_data/facture_test_fournisseur.png", "facture_test_fournisseur.png"),
    ("BizIA_Presentation_Officielle.pdf", "BizIA_Presentation_Officielle.pdf"),
]

with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
    for src, arcname in files_to_pack:
        if os.path.exists(src):
            zipf.write(src, arcname)
            print(f"Added to zip: {src} -> {arcname}")
        else:
            print(f"Warning: {src} not found!")

# Copy to frontend/public for direct online access
os.makedirs("frontend/public", exist_ok=True)
public_zip = os.path.join("frontend", "public", zip_name)
shutil.copyfile(zip_name, public_zip)

# Also copy ETAPES_DE_TEST_BIZIA.txt to root and public
shutil.copyfile("test_data/ETAPES_DE_TEST_BIZIA.txt", "ETAPES_DE_TEST_BIZIA.txt")
shutil.copyfile("test_data/ETAPES_DE_TEST_BIZIA.txt", "frontend/public/ETAPES_DE_TEST_BIZIA.txt")

print(f"\nZIP file created successfully: {zip_name} ({os.path.getsize(zip_name)} bytes)")
print(f"Public download: {public_zip}")
