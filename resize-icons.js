const sharp = require('sharp');
const fs = require('fs');

async function resizeIcons() {
  try {
    const sourceImage = 'public/icon-192.jpg'; // This is actually 1024x1024

    console.log('Resizing to 192x192...');
    await sharp(sourceImage)
      .resize(192, 192)
      .toFormat('png')
      .toFile('public/icon-192.png');
      
    console.log('Resizing to 512x512...');
    await sharp(sourceImage)
      .resize(512, 512)
      .toFormat('png')
      .toFile('public/icon-512.png');

    console.log('Successfully generated true PNG icons at exact dimensions!');
  } catch (err) {
    console.error('Error resizing images:', err);
  }
}

resizeIcons();
