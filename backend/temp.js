// backend/hash.js
import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "user123";
  const hash = await bcrypt.hash(password, 10);
}

generateHash();
