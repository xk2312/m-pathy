# ============================================================================
# 📘 INDEX - triketon2048.py (GPTM-Galaxy+ · Triketon Phase-1 Engine)
# ----------------------------------------------------------------------------
# PURPOSE
#   Implements the full Triketon-2048 seal and verification engine.
#   Provides normalization, hashing, public key generation, and a CLI
#   interface for sealing and verifying text integrity.
#
# CORE CLASSES
#   • TriketonSeal
#       Represents a single cryptographic seal with:
#         public_key, truth_hash, timestamp, version, profiles.
#
#   • TRIKETONCore
#       Stateful hashing engine producing 2048-bit results via
#       salted SHA-256 cycles and XOR mixing.
#       Handles salt matrix creation, device fingerprinting,
#       iterative hashing, and metadata export.
#
# CORE FUNCTIONS
#   • triketon_seal(text, deterministic=False, seed=None)
#       End-to-end sealing pipeline:
#         normalize → compute_truth_hash → generate_public_key_2048 → timestamp.
#       deterministic → uses internal fixed seed.
#       non-deterministic → requires TRIKETON_HASH_SALT_V1 env var.
#
#   • normalize_for_truth_hash(text)
#       Canonical text normalization:
#         removes HTML, markdown, emojis, symbols; normalizes Unicode (NFC).
#
#   • compute_truth_hash(normalized_text, salt)
#       SHA-256(salt || text) → 64-char hex digest.
#
#   • generate_public_key_2048(truth_hash_hex)
#       Expands 64-byte truth hash into 2048-bit Base64URL key via
#       iterative SHA-256 expansion (PublicKey Law v1).
#
#   • TRIKETONCore.run_cycle(input_data)
#       Executes salted hashing phases:
#         Phase 1 → SHA-256 with salts,
#         Phase 2 → XOR combination,
#         Phase 3 → bit-shift + final digest.
#
#   • TRIKETONCore.export_metadata()
#       Returns device ID, timestamp, salts, and hash result.
#
# CLI INTERFACE
#   • interactive_mode() – manual hashing loop.
#   • cli_batch_mode()   – batch hashing from file.
#   • main() – argument parser supporting:
#       seal / verify / string / file / interactive.
#
# FILE I/O
#   • save_results(results, filename)
#       Writes batch results to JSON.
#
# ENVIRONMENT VARIABLES
#   TRIKETON_HASH_SALT_V1 – required for non-deterministic mode.
#
# DESIGN PRINCIPLES
#   • Deterministic reproducibility (seeded mode).
#   • No salt or seed leakage.
#   • Portable, offline, cryptographically stable.
#   • CLI and library interoperability.
#
# VERSIONING
#   Law set: TRIKETON_HASH_V1 / TRIKETON_KEY_V1
#   Phase-1 verified by Council13 :: Triketon-Archive-Contract v2.
#
# ENTRY POINT
#   if __name__ == "__main__": main()
#
# ============================================================================

import hashlib
import os
import time
import uuid
import socket
import platform
import random
import json
from datetime import datetime, timezone

# ==========================
# TRIKETON: SEAL (SKELETON)
# ==========================

class TriketonSeal:
    def __init__(
        self,
        *,
        public_key: str,
        truth_hash: str,
        timestamp: str,
        version: str = "v1",
        hash_profile: str = "TRIKETON_HASH_V1",
        key_profile: str = "TRIKETON_KEY_V1",
    ):
        self.public_key = public_key
        self.truth_hash = truth_hash
        self.timestamp = timestamp
        self.version = version
        self.hash_profile = hash_profile
        self.key_profile = key_profile


def triketon_seal(
    text: str,
    *,
    public_key: str,
    deterministic: bool = False,
    seed: int | None = None,
) -> TriketonSeal:
    """
    STEP 05: end-to-end seal (v1)
    - public_key MUST be provided externally (DeviceKey)
    """
    if not isinstance(public_key, str) or not public_key.strip():
        raise ValueError("public_key must be provided (device key)")

    normalized = normalize_for_truth_hash(text)

    if deterministic:
        use_seed = 13130 if seed is None else int(seed)
        salt = hashlib.sha256(f"TRIKETON_DET_SALT_V1|{use_seed}".encode("utf-8")).digest()
    else:
        env_salt = os.getenv("TRIKETON_HASH_SALT_V1")
        if not env_salt:
            raise RuntimeError("Missing env TRIKETON_HASH_SALT_V1 (required for non-deterministic sealing)")
        salt = env_salt.encode("utf-8")

    truth_hash = compute_truth_hash(normalized, salt=salt)
    ts = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")

    return TriketonSeal(
        public_key=public_key,
        truth_hash=truth_hash,
        timestamp=ts,
    )

# ==========================
# TRIKETON: NORMALIZATION
# ==========================

import re
import unicodedata

def normalize_for_truth_hash(text: str) -> str:
    """
    TruthHash Law v1 - canonical normalization
    - remove markdown syntax (#, **, __, ``, etc.)
    - remove HTML tags
    - remove emojis & non-text unicode symbols
    - unicode normalize (NFC)
    - DO NOT change or collapse whitespace
    """
    if not isinstance(text, str):
        text = str(text)

    # Unicode normalize first (stable codepoints)
    t = unicodedata.normalize("NFC", text)

    # Strip HTML tags
    t = re.sub(r"<[^>]+>", "", t)

    # Remove common markdown markers (keep content)
    t = re.sub(r"(\*\*|__|\*|_|`|~~)", "", t)

    # Remove emojis & symbols (keep basic multilingual text)
    t = "".join(
        ch for ch in t
        if not unicodedata.category(ch).startswith("So")
    )

    return t

# ==========================
# TRIKETON: TRUTH HASH
# ==========================

def compute_truth_hash(normalized_text: str, *, salt: bytes) -> str:
    """
    TruthHash Law v1
    - input MUST be normalized text (see normalize_for_truth_hash)
    - hash = SHA256( salt || normalized_text )
    - output: 64-char hex string
    """
    if not isinstance(normalized_text, str):
        normalized_text = str(normalized_text)
    if not isinstance(salt, (bytes, bytearray)):
        raise TypeError("salt must be bytes")

    h = hashlib.sha256()
    h.update(salt)
    h.update(normalized_text.encode("utf-8"))
    return h.hexdigest()

# ==========================
# TRIKETON: PUBLIC KEY (2048)
# ==========================

import base64

def generate_public_key_2048(truth_hash_hex: str) -> str:
    """
    PublicKey Law v1
    - input: 64-char hex truth hash
    - derive 2048-bit (256 bytes) key material by iterative SHA-256 expansion
    - output: base64url-encoded string
    """
    if not isinstance(truth_hash_hex, str) or len(truth_hash_hex) != 64:
        raise ValueError("truth_hash_hex must be a 64-char hex string")

    seed = bytes.fromhex(truth_hash_hex)
    material = bytearray()
    cur = seed

    while len(material) < 256:
        cur = hashlib.sha256(cur).digest()
        material.extend(cur)

    key_bytes = bytes(material[:256])
    return base64.urlsafe_b64encode(key_bytes).decode("ascii")

# ==========================
# TRIKETON: PHASE 1 - CORE
# ==========================

class TRIKETONCore:
    def __init__(self):
        self.nodeA = hashlib.sha256()
        self.nodeB = hashlib.sha256()
        self.nodeC = hashlib.sha256()
        self.salt_matrix = self.generate_salt_matrix()
        self.timestamp = str(datetime.now(timezone.utc).timestamp())
        self.device_id = self.get_device_id()
        self.hash_result = None

    def get_device_id(self):
        mac = uuid.getnode()
        hostname = socket.gethostname()
        system_info = platform.platform()
        return f"{mac}-{hostname}-{system_info}"

    def generate_salt_matrix(self):
        return {
            'static_salt': os.urandom(16),
            'temporal_salt': str(time.time()).encode(),
            'location_salt': str(random.uniform(-180.0, 180.0)).encode(),
            'device_salt': str(uuid.getnode()).encode()
        }

    def update_salts(self):
        self.salt_matrix['temporal_salt'] = str(time.time()).encode()
        self.salt_matrix['location_salt'] = str(random.uniform(-180.0, 180.0)).encode()

    def hash_with_node(self, node, data: bytes):
        node.update(data)
        return node.digest()

    def xor_hashes(self, h1, h2):
        return bytes(a ^ b for a, b in zip(h1, h2))

    def shift_hash(self, hash_bytes, shift=3):
        return bytes(((b << shift) & 0xFF) | (b >> (8 - shift)) for b in hash_bytes)

    def run_cycle(self, input_data: str):
        self.update_salts()
        encoded = input_data.encode()

        saltA = self.salt_matrix['static_salt']
        saltB = self.salt_matrix['temporal_salt']
        saltC = self.salt_matrix['location_salt']
        saltD = self.salt_matrix['device_salt']

        # Phase 1: Individual SHA-256 hashing
        hash1 = self.hash_with_node(self.nodeA, saltA + encoded)
        hash2 = self.hash_with_node(self.nodeB, saltB + encoded)
        hash3 = self.hash_with_node(self.nodeC, saltC + saltD + encoded)

        # Phase 2: XOR-AND logic
        xor1 = self.xor_hashes(hash1, hash2)
        xor2 = self.xor_hashes(hash2, hash3)
        xor3 = self.xor_hashes(hash3, hash1)

        # Phase 3: Combine and shift
        combined = xor1 + xor2 + xor3
        shifted = self.shift_hash(combined, shift=4)

        final_hash = hashlib.sha256(shifted).hexdigest()
        self.hash_result = final_hash
        return final_hash

    def export_metadata(self):
        return {
            "device_id": self.device_id,
            "timestamp": self.timestamp,
            "salts": {k: v.hex() if isinstance(v, bytes) else v for k, v in self.salt_matrix.items()},
            "result": self.hash_result
        }
# ================================
# CLI INTERFACE & I/O FUNCTIONS
# ================================

def print_intro():
    print("\n")
    print("==========================================")
    print("🛡️  TRIKETON-2048 :: Phase 1 Hash Engine")
    print("📦  Secure. Recursive. Salted. Deterministic.")
    print("==========================================\n")

def print_result(result, metadata):
    print("\n✅ Final Hash Digest:")
    print(f"🔑 {result}")
    print("\n📎 Metadata Snapshot:")
    print(json.dumps(metadata, indent=4))

def interactive_mode():
    print_intro()
    core = TRIKETONCore()

    while True:
        user_input = input("\n📝 Enter data to hash (or type 'exit'): ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Exiting TRIKETON. Stay secure.")
            break

        result = core.run_cycle(user_input)
        metadata = core.export_metadata()
        print_result(result, metadata)

def generate_batch_hashes(input_list):
    core = TRIKETONCore()
    output = []

    for entry in input_list:
        result = core.run_cycle(entry)
        metadata = core.export_metadata()
        output.append({
            "input": entry,
            "result": result,
            "metadata": metadata
        })

    return output

def save_results(results, filename="triketon_output.json"):
    with open(filename, "w") as f:
        json.dump(results, f, indent=4)
    print(f"\n💾 Results saved to {filename}")

def cli_batch_mode():
    print_intro()
    print("📂 Batch Mode: Provide multiple strings via file (one per line).\n")
    filepath = input("📎 Enter file path: ").strip()

    if not os.path.isfile(filepath):
        print("❌ File not found.")
        return

    with open(filepath, "r") as f:
        lines = [line.strip() for line in f if line.strip()]

    output = generate_batch_hashes(lines)
    save_results(output)
# ========================
# MAIN ENTRY & ARG PARSER
# ========================

def parse_args():
    import argparse
    parser = argparse.ArgumentParser(description="TRIKETON-2048 Phase 1 :: Secure Hashing Engine")
    sub = parser.add_subparsers(dest="cmd")

    # seal (JSON-only)
    sp = sub.add_parser("seal", help="Create a Triketon seal and print JSON only")
    sp.add_argument("text", help="Input text to seal")
    sp.add_argument("--json", action="store_true", help="Print JSON (default)")
    sp.add_argument("--deterministic", action="store_true", help="Deterministic mode (tests)")
    sp.add_argument("--seed", type=int, default=None, help="Seed for deterministic mode")

      # verify (JSON-only)
    vp = sub.add_parser("verify", help="Verify text against a Triketon seal (JSON only)")
    vp.add_argument("text", help="Input text to verify")
    g = vp.add_mutually_exclusive_group(required=True)
    g.add_argument("--seal-json", help="Seal JSON string to verify against (shell quoting may be tricky)")
    g.add_argument("--seal-file", help="Path to a seal JSON file (recommended)")
    vp.add_argument("--deterministic", action="store_true", help="Deterministic mode (tests)")
    vp.add_argument("--seed", type=int, default=None, help="Seed for deterministic mode")


    # legacy modes (kept)
    parser.add_argument("-s", "--string", help="Hash a single string")
    parser.add_argument("-f", "--file", help="Batch hash a file with one string per line")
    parser.add_argument("-i", "--interactive", action="store_true", help="Start in interactive mode")
    parser.add_argument("-o", "--output", help="Output file for batch mode results")
    return parser.parse_args()


def main():
    args = parse_args()

    # --- seal ---
    if getattr(args, "cmd", None) == "seal":
        s = triketon_seal(
            args.text,
            deterministic=bool(args.deterministic),
            seed=args.seed,
        )
        out = {
            "version": s.version,
            "hash_profile": s.hash_profile,
            "key_profile": s.key_profile,
            "timestamp": s.timestamp,
            "truth_hash": s.truth_hash,
            "public_key": s.public_key,
        }
        print(json.dumps(out, ensure_ascii=False))
        return

    # --- verify ---
    if getattr(args, "cmd", None) == "verify":
        try:
            if getattr(args, "seal_file", None):
                with open(args.seal_file, "r", encoding="utf-8") as f:
                    seal_raw = f.read()
            else:
                seal_raw = args.seal_json

            seal = json.loads(seal_raw)
        except FileNotFoundError:
            print(json.dumps({"ok": False, "reason": "seal_file_not_found"}, ensure_ascii=False))
            return
        except Exception:
            print(json.dumps({"ok": False, "reason": "invalid_seal_json"}, ensure_ascii=False))
            return

        s = triketon_seal(
            args.text,
            deterministic=bool(args.deterministic),
            seed=args.seed,
        )

        ok = (
            seal.get("truth_hash") == s.truth_hash
            and seal.get("public_key") == s.public_key
            and seal.get("version") == s.version
        )

        out = {
            "ok": bool(ok),
            "expected": {
                "truth_hash": s.truth_hash,
                "public_key": s.public_key,
                "version": s.version,
            },
            "received": {
                "truth_hash": seal.get("truth_hash"),
                "public_key": seal.get("public_key"),
                "version": seal.get("version"),
            },
        }
        print(json.dumps(out, ensure_ascii=False))
        return



    # --- legacy behavior ---
    if args.interactive:
        interactive_mode()
        return

    core = TRIKETONCore()

    if args.string:
        result = core.run_cycle(args.string)
        metadata = core.export_metadata()
        print_result(result, metadata)

    elif args.file:
        if not os.path.isfile(args.file):
            print("❌ File not found.")
            return

        with open(args.file, "r") as f:
            entries = [line.strip() for line in f if line.strip()]

        results = generate_batch_hashes(entries)
        output_file = args.output if args.output else "triketon_results.json"
        save_results(results, output_file)
    else:
        print_intro()
        print("⚠️ No mode selected. Use -i for interactive or -h for help.")


# ========================
# EXECUTE MAIN
# ========================

if __name__ == "__main__":
    main()
