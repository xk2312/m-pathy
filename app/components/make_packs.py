#!/usr/bin/env python3
import os, sys, io, hashlib, json, mimetypes, shutil, tempfile, subprocess, zipfile

# ========= Einstellungen =========
# Wohin sollen die Bundles? (Ordner wird frisch angelegt)
DEST_DIR = os.path.join(os.path.expanduser("~"), "Desktop", "staging-packs")

# Welche Top-Level-Ordner bündeln wir explizit?
PACK_MAP = {
    "app": "bundle_app.txt",
    "components": "bundle_components.txt",
    "lib": "bundle_lib.txt",
    "public": "bundle_public.txt",
    "pages": "bundle_pages.txt",
    "src": "bundle_src.txt",
    "scripts": "bundle_scripts.txt",
    "styles": "bundle_styles.txt",
    "test": "bundle_tests.txt",
    "tests": "bundle_tests.txt",
    "assets": "bundle_assets.txt",
}

# Alles, was nicht gemappt ist:
BUNDLE_MISC = "bundle_misc.txt"     # unbekannte Top-Level
BUNDLE_ROOT = "bundle_root.txt"     # Dateien direkt im Repo-Root
BUNDLE_INVENTORY = "bundle_inventory.txt"  # Meta/Inventar

# Diese Ordner werden beim Scannen komplett übersprungen:
SKIP_DIRS = {".git", "node_modules", ".next", DEST_DIR.split(os.sep)[-1]}

# ========= Helpers =========
def run(cmd):
    try:
        out = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, check=False)
        return out.stdout
    except Exception:
        return ""

def is_text_file(path, sample_bytes=4096):
    try:
        with open(path, "rb") as f:
            chunk = f.read(sample_bytes)
        if b"\x00" in chunk:
            return False
        # UTF-8 Versuch; wenn’s scheitert, trotzdem als Text behandeln (latin-1 etc.)
        try:
            chunk.decode("utf-8")
            return True
        except UnicodeDecodeError:
            return True
    except Exception:
        return True

def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1024 * 1024), b""):
            h.update(b)
    return h.hexdigest()

def read_text_normalized(path):
    # Nur Zeilenenden normalisieren (CRLF -> LF, CR -> LF), Encoding tolerant
    with open(path, "rb") as f:
        data = f.read()
    data = data.replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        return data.decode("latin-1", errors="replace")

def write_section_header(fh, path_rel, size, sha, kind):
    fh.write(f"=== FILE: {path_rel}\n")
    fh.write(f"--- SIZE: {size}\n")
    fh.write(f"--- SHA256: {sha}\n")
    fh.write(f"--- KIND: {kind}\n")
    fh.write(f"--- START\n")

def write_section_footer(fh):
    fh.write("\n--- END\n\n")

def ensure_clean_dir(path):
    if os.path.isdir(path):
        shutil.rmtree(path, ignore_errors=True)
    os.makedirs(path, exist_ok=True)

def assign_bundle(relpath):
    parts = relpath.split(os.sep)
    if len(parts) == 1:
        return BUNDLE_ROOT
    top = parts[0]
    return PACK_MAP.get(top, BUNDLE_MISC)

# ========= Start =========
def main():
    repo = os.getcwd()
    print(f"➡️  Repo: {repo}")

    # Zielordner frisch anlegen
    ensure_clean_dir(DEST_DIR)
    print(f"➡️  Ziel: {DEST_DIR}")

    # Alle Dateien einsammeln (ohne Build/VCS/Output)
    files = []
    for root, dirs, filenames in os.walk(repo):
        # prune
        rel_root = os.path.relpath(root, repo)
        if rel_root == ".":
            # Top-Level prunen
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        else:
            # auch tiefer skippen
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for name in filenames:
            # Eigene Ausgabedateien (falls im Repo) überspringen
            if root.startswith(DEST_DIR):
                continue
            abspath = os.path.join(root, name)
            rel = os.path.relpath(abspath, repo)
            # Skip: versteckte .DS_Store etc. optional
            files.append(rel)

    files.sort()

    # Writer-Cache pro Bundle (Append im UTF-8)
    writers = {}

    def get_writer(bundle_name):
        if bundle_name not in writers:
            fh = open(os.path.join(DEST_DIR, bundle_name), "w", encoding="utf-8", newline="\n")
            # Bundle-Header
            fh.write(f"# BUNDLE: {bundle_name}\n")
            fh.write("# FORMAT: sections with === FILE / --- START / --- END\n\n")
            writers[bundle_name] = fh
        return writers[bundle_name]

    # Mirror als Bundles
    print("➡️  Erzeuge Bundles …")
    for rel in files:
        src = os.path.join(repo, rel)
        try:
            st = os.stat(src)
            size = st.st_size
        except Exception:
            size = "?"
        kind = "text" if is_text_file(src) else "binary"
        sha = sha256_of(src) if kind == "binary" else hashlib.sha256(open(src, "rb").read()).hexdigest()

        bundle = assign_bundle(rel)
        fh = get_writer(bundle)

        write_section_header(fh, rel, size, sha, kind)
        try:
            if kind == "text":
                content = read_text_normalized(src)
                fh.write(content)
            else:
                mime = mimetypes.guess_type(src)[0] or "application/octet-stream"
                fh.write("BINARY FILE PLACEHOLDER\n")
                fh.write(f"path: {rel}\n")
                fh.write(f"size: {size} bytes\n")
                fh.write(f"mime: {mime}\n")
                fh.write(f"sha256: {sha}\n")
                fh.write("note: retrieve the original binary from the repository.\n")
        except Exception as e:
            fh.write(f"\n<<ERROR reading {rel}: {e}>>\n")
        write_section_footer(fh)

    # Inventar erzeugen (einmal pro Run)
    print("➡️  Schreibe Inventar …")
    inv_path = os.path.join(DEST_DIR, BUNDLE_INVENTORY)
    with open(inv_path, "w", encoding="utf-8", newline="\n") as inv:
        inv.write("# BUNDLE: bundle_inventory.txt\n\n")

        # files_all
        inv.write("=== INVENTORY: files_all.txt\n--- START\n")
        inv.write("\n".join(files) + ("\n" if files else ""))
        inv.write("\n--- END\n\n")

        # tree_all: (hier identisch mit files; strukturell getrennt belassen)
        inv.write("=== INVENTORY: tree_all.txt\n--- START\n")
        inv.write("\n".join(files) + ("\n" if files else ""))
        inv.write("\n--- END\n\n")

        # sizes: du -hd 2 (best effort)
        du_out = run(["du", "-hd", "2", "."])
        inv.write("=== INVENTORY: sizes.txt\n--- START\n")
        inv.write(du_out)
        inv.write("\n--- END\n\n")

        # hotspots (leichter Textscan)
        patterns = ("visualViewport","m-input-dock","StickyFab","MobileOverlay","OnboardingWatcher","Saeule","useMobileViewport","chat","scroll","overflow","safe-area","--dock-h")
        inv.write("=== INVENTORY: hotspots.txt\n--- START\n")
        for rel in files:
            p = os.path.join(repo, rel)
            try:
                if is_text_file(p):
                    with open(p, "r", encoding="utf-8", errors="ignore") as f:
                        for i, line in enumerate(f, 1):
                            if any(k in line for k in patterns):
                                inv.write(f"{rel}:{i}:{line.rstrip()}\n")
            except Exception:
                pass
        inv.write("--- END\n\n")

        # git status / log / diffstat / branch / commit
        inv.write("=== INVENTORY: git_status.txt\n--- START\n")
        inv.write(run(["git", "status", "--porcelain=v1"]))
        inv.write("\n--- END\n\n")

        inv.write("=== INVENTORY: git_ignored.txt\n--- START\n")
        inv.write(run(["git", "status", "--ignored", "-s"]))
        inv.write("\n--- END\n\n")

        inv.write("=== INVENTORY: git_log.txt\n--- START\n")
        inv.write(run(["git","--no-pager","log","-n","20","--pretty=format:%h %ad %d %s (%an)","--date=iso"]))
        inv.write("\n--- END\n\n")

        inv.write("=== INVENTORY: git_diffstat.txt\n--- START\n")
        inv.write(run(["git", "diff", "--stat"]))
        inv.write("\n--- END\n\n")

        inv.write("=== INVENTORY: branch.txt\n--- START\n")
        inv.write(run(["git", "rev-parse", "--abbrev-ref", "HEAD"]).strip())
        inv.write("\n--- END\n\n")

        inv.write("=== INVENTORY: commit.txt\n--- START\n")
        inv.write(run(["git", "rev-parse", "--short", "HEAD"]).strip())
        inv.write("\n--- END\n\n")

        # package.json meta
        pkg_json = os.path.join(repo, "package.json")
        if os.path.isfile(pkg_json):
            try:
                with open(pkg_json, "r", encoding="utf-8") as f:
                    d = json.load(f)
                out = {
                    "name": d.get("name"),
                    "version": d.get("version"),
                    "dependencies": d.get("dependencies", {}),
                    "devDependencies": d.get("devDependencies", {}),
                }
                inv.write("=== INVENTORY: pkg_meta.json\n--- START\n")
                inv.write(json.dumps(out, indent=2, sort_keys=True))
                inv.write("\n--- END\n\n")
            except Exception:
                pass

        # README / Formatbeschreibung
        inv.write("=== INVENTORY: PACKS_README.txt\n--- START\n")
        inv.write(
            "FORMAT\n"
            "Each bundle is a plain text container with repeated sections:\n"
            "  === FILE: <relative/path>\n"
            "  --- SIZE: <bytes>\n"
            "  --- SHA256: <sha256>\n"
            "  --- KIND: text|binary\n"
            "  --- START\n"
            "  <content or binary placeholder>\n"
            "  --- END\n\n"
            "Binary files are represented by a placeholder with mime/size/sha256.\n"
            "Text files are normalized to LF line endings.\n"
        )
        inv.write("\n--- END\n")

    # Writer schließen
    for fh in writers.values():
        try:
            fh.close()
        except Exception:
            pass

    # Ergebnis zusammenfassen
    produced = sorted(os.listdir(DEST_DIR))
    print("✅ Fertig. Erzeugte Bundles in:", DEST_DIR)
    for name in produced:
        print("  -", name)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nAbgebrochen.")
        sys.exit(1)
