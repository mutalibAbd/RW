/**
 * GLB Optimization Script - Asset Curator Pipeline
 * 
 * This script optimizes 3D models for WebAR deployment:
 * - Resizes textures to 1024x1024 (saves VRAM and bandwidth)
 * - Applies Draco compression (quantization: 14/10/8)
 * - Outputs optimized files to public/models/
 * 
 * Usage: npm run optimize
 * 
 * Target Sizes (per Curator Agent spec):
 * - Hard Limit: < 5MB
 * - Ideal: < 2MB
 */

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { 
  dedup, 
  textureCompress,
  draco,
  prune,
  quantize
} from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  inputDir: path.resolve(__dirname, '../raw-assets'),
  outputDir: path.resolve(__dirname, '../public/models'),
  maxTextureSize: 1024,
  // Draco quantization bits (per Curator.md spec)
  draco: {
    quantizePosition: 14,
    quantizeTexcoord: 10,
    quantizeNormal: 8,
  },
  // File size limits (bytes)
  limits: {
    hard: 5 * 1024 * 1024,  // 5MB
    ideal: 2 * 1024 * 1024, // 2MB
  },
};

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file size
 */
async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

/**
 * Optimize a single GLB file
 */
async function optimizeGLB(inputPath, outputPath) {
  const filename = path.basename(inputPath);
  console.log(`\n📦 Processing: ${filename}`);
  
  // Get original size
  const originalSize = await getFileSize(inputPath);
  console.log(`   Original size: ${formatBytes(originalSize)}`);

  // Initialize IO with all extensions
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    });

  // Read the document
  const document = await io.read(inputPath);

  // Apply optimization pipeline
  console.log('   ⚙️  Applying optimizations...');

  // 1. Remove duplicate resources
  await document.transform(dedup());
  console.log('   ✓ Deduplicated resources');

  // 2. Compress and resize textures using sharp
  await document.transform(
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      resize: [CONFIG.maxTextureSize, CONFIG.maxTextureSize],
    })
  );
  console.log(`   ✓ Compressed textures (WebP, max ${CONFIG.maxTextureSize}x${CONFIG.maxTextureSize})`);

  // 3. Quantize vertex attributes (prepares for better compression)
  await document.transform(
    quantize({
      quantizePosition: CONFIG.draco.quantizePosition,
      quantizeTexcoord: CONFIG.draco.quantizeTexcoord,
      quantizeNormal: CONFIG.draco.quantizeNormal,
    })
  );
  console.log('   ✓ Quantized vertex attributes');

  // 4. Apply Draco compression
  await document.transform(
    draco({
      quantizePosition: CONFIG.draco.quantizePosition,
      quantizeTexcoord: CONFIG.draco.quantizeTexcoord,
      quantizeNormal: CONFIG.draco.quantizeNormal,
    })
  );
  console.log('   ✓ Applied Draco compression (14/10/8)');

  // 5. Remove unused resources
  await document.transform(prune());
  console.log('   ✓ Pruned unused resources');

  // Write optimized file
  await io.write(outputPath, document);

  // Get optimized size
  const optimizedSize = await getFileSize(outputPath);
  const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
  
  console.log(`   Optimized size: ${formatBytes(optimizedSize)}`);
  console.log(`   📉 Reduction: ${reduction}%`);

  // Check against limits
  if (optimizedSize > CONFIG.limits.hard) {
    console.log(`   ⚠️  WARNING: Exceeds 5MB hard limit!`);
  } else if (optimizedSize > CONFIG.limits.ideal) {
    console.log(`   ⚡ Note: Exceeds 2MB ideal target`);
  } else {
    console.log(`   ✅ Within ideal target (<2MB)`);
  }

  return { filename, originalSize, optimizedSize, reduction };
}

/**
 * Main optimization pipeline
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║        GLB Optimization Pipeline - Zero-Cost Gallery         ║');
  console.log('║   Curator Agent: Draco Compression + Texture Optimization    ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  // Ensure directories exist
  await fs.mkdir(CONFIG.inputDir, { recursive: true });
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // Find all GLB files in input directory
  const files = await fs.readdir(CONFIG.inputDir);
  const glbFiles = files.filter(f => f.toLowerCase().endsWith('.glb'));

  if (glbFiles.length === 0) {
    console.log('\n⚠️  No GLB files found in raw-assets/');
    console.log('   Place your unoptimized GLB files there and run again.');
    console.log('\n   Recommended sources (CC0 license):');
    console.log('   • Poly Pizza: https://poly.pizza');
    console.log('   • Sketchfab (filter by CC0): https://sketchfab.com');
    console.log('   • Smithsonian Open Access: https://3d.si.edu');
    return;
  }

  console.log(`\n📂 Found ${glbFiles.length} GLB file(s) in raw-assets/`);

  // Process each file
  const results = [];
  for (const file of glbFiles) {
    const inputPath = path.join(CONFIG.inputDir, file);
    const outputPath = path.join(CONFIG.outputDir, file);
    
    try {
      const result = await optimizeGLB(inputPath, outputPath);
      results.push(result);
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error.message);
    }
  }

  // Summary
  if (results.length > 0) {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                        SUMMARY                               ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    
    let totalOriginal = 0;
    let totalOptimized = 0;
    
    for (const r of results) {
      totalOriginal += r.originalSize;
      totalOptimized += r.optimizedSize;
      console.log(`║ ${r.filename.padEnd(30)} ${formatBytes(r.originalSize).padStart(10)} → ${formatBytes(r.optimizedSize).padStart(10)} (${r.reduction}%)`);
    }
    
    const totalReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║ TOTAL: ${formatBytes(totalOriginal)} → ${formatBytes(totalOptimized)} (${totalReduction}% reduction)`);
    console.log('╚══════════════════════════════════════════════════════════════╝');
    
    console.log('\n✅ Optimized files saved to: public/models/');
    console.log('   These are ready to be served via your Next.js app.\n');
  }
}

// Run the pipeline
main().catch(console.error);
