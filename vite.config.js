import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

try {
  const src = "C:/Users/Lenovo/.gemini/antigravity/brain/60e98808-09fe-4cd5-a0c4-e368761f8367/media__1784619030944.jpg";
  const dest = "./public/footer-bg.jpg";
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log("Successfully copied background image from vite config");
  }
} catch (err) {
  console.error("Failed to copy background image: ", err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
