#!/usr/bin/env node

/**
 * Generate Brand Pages Script
 * Creates consistent brand pages for all brands using the Caterpillar template
 */

const fs = require('fs');
const path = require('path');

const BRANDS = [
  'caterpillar', 'volvo', 'komatsu', 'hitachi', 'liebherr', 
  'jcb', 'kubota', 'takeuchi', 'yanmar', 'doosan', 
  'case', 'hyundai', 'kobelco', 'sany', 'wacker-neuson'
];

const TEMPLATE_PATH = path.join(__dirname, '../web/kraanbakken/caterpillar/index.html');
const KRAANBAKKEN_DIR = path.join(__dirname, '../web/kraanbakken');

// Read the template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

console.log('🚀 Generating brand pages from template...\n');

BRANDS.forEach(brand => {
  const brandDir = path.join(KRAANBAKKEN_DIR, brand);
  const brandFile = path.join(brandDir, 'index.html');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
    console.log(`📁 Created directory: ${brand}/`);
  }
  
  // Replace data-brand attribute
  let brandPage = template.replace(
    'data-brand="caterpillar"',
    `data-brand="${brand}"`
  );
  
  // Write the file
  fs.writeFileSync(brandFile, brandPage, 'utf-8');
  console.log(`✅ Generated: ${brand}/index.html`);
});

console.log('\n✨ All brand pages generated successfully!');
console.log('📝 Note: Content will be dynamically loaded via brand-template.js');
