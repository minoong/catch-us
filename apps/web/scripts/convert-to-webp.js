import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir = "apps/web/public/trips/jeonju-2026/loader-gifs";
const files = ["monogatari-gold.gif", "monogatari-purple.gif", "tour-cat.gif"];

async function convert() {
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace(".gif", ".webp"));

    console.log(`Converting ${file}...`);
    try {
      await sharp(inputPath, { animated: true })
        .webp({ effort: 6, quality: 70 })
        .toFile(outputPath);

      const oldSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      console.log(`Successfully converted ${file}!`);
      console.log(
        `Size: ${(oldSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB (${((1 - newSize / oldSize) * 100).toFixed(1)}% saved)`,
      );
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err);
    }
  }
}

convert();
