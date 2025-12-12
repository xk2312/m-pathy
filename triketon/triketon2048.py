#!/usr/bin/env python3

import hashlib
import os
import time
import uuid
import socket
import platform
import random
import json
from datetime import datetime

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


def triketon_seal(text: str, *, deterministic: bool = False, seed: int | None = None) -> TriketonSeal:
    """
    STEP 01 skeleton:
    - Signature is fixed (deterministic/seed reserved for later steps)
    - Uses existing Phase-1 engine for a provisional truth_hash
    - public_key is reserved (filled in Step 04)
    """
    core = TRIKETONCore()
    truth_hash = core.run_cycle(text)
    ts = datetime.utcnow().isoformat() + "Z"
    return TriketonSeal(public_key="", truth_hash=truth_hash, timestamp=ts)

# ==========================
# TRIKETON: PHASE 1 - CORE
# ==========================


class TRIKETONCore:
    def __init__(self):
        self.nodeA = hashlib.sha256()
        self.nodeB = hashlib.sha256()
        self.nodeC = hashlib.sha256()
        self.salt_matrix = self.generate_salt_matrix()
        self.timestamp = str(datetime.utcnow().timestamp())
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
    parser.add_argument("-s", "--string", help="Hash a single string")
    parser.add_argument("-f", "--file", help="Batch hash a file with one string per line")
    parser.add_argument("-i", "--interactive", action="store_true", help="Start in interactive mode")
    parser.add_argument("-o", "--output", help="Output file for batch mode results")
    return parser.parse_args()

def main():
    args = parse_args()

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
