import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to copy a directory recursively
function copyDir(src, dest) {
  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Copy directories recursively, files directly
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy the views and public directories
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

console.log('Copying views directory...');
copyDir(path.join(srcDir, 'views'), path.join(distDir, 'views'));

console.log('Copying public directory...');
copyDir(path.join(srcDir, 'public'), path.join(distDir, 'public'));

console.log('Assets copied successfully!'); 