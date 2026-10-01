import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "rafaai-new-logo.png");
const outputDir = path.join(root, "public");

await sharp(source)
  .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(outputDir, "rafaai-pwa-192.png"));

await sharp(source)
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(outputDir, "rafaai-pwa-512.png"));

console.log("Generated square RafaAi PWA icons.");
