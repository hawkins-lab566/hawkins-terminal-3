const encoder = new TextEncoder();
const decoder = new TextDecoder();

const EXPECTED_RETURN_CODE_HASH = "98b7d6e81d8c304fd21d3ef9a42d20b92c43bb00eb38d17e3945fe92312dfb18";

const ENCRYPTED_FINAL_FRAGMENT = {
  iv: "Wq5ErIu7mQwjgCOd",
  ciphertext: "x9nedrlHn8gXUpp1jxKMUWkm7tFTm7qviVttGs3IFQ=="
};

export function normalizeTerminalCode(value) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sha256(value) {
  return crypto.subtle.digest("SHA-256", encoder.encode(value));
}

async function getAesKeyFromCode(normalizedCode) {
  const digest = await sha256(normalizedCode);

  return crypto.subtle.importKey(
    "raw",
    digest,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
}

export async function unlockFinalFragment(returnCode) {
  const normalizedCode = normalizeTerminalCode(returnCode);
  const digest = await sha256(normalizedCode);
  const hash = bytesToHex(digest);

  if (hash !== EXPECTED_RETURN_CODE_HASH) {
    throw new Error("INVALID_RETURN_CODE");
  }

  const key = await getAesKeyFromCode(normalizedCode);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(ENCRYPTED_FINAL_FRAGMENT.iv) },
    key,
    base64ToBytes(ENCRYPTED_FINAL_FRAGMENT.ciphertext)
  );

  return decoder.decode(decrypted);
}
