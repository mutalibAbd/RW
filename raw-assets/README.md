# Raw Assets Folder

Place your unoptimized GLB/GLTF files here.

## Optimization Pipeline

Run the optimization script to process all files:

```bash
npm run optimize
```

This will:
1. Resize textures to max 1024x1024
2. Apply Draco compression (14/10/8 quantization)
3. Remove duplicate/unused resources
4. Output optimized files to `public/models/`

## Sourcing Guidelines

Use only **CC0 (Public Domain)** licensed assets:

- **Poly Pizza**: https://poly.pizza
- **Sketchfab** (filter by CC0): https://sketchfab.com
- **Smithsonian Open Access**: https://3d.si.edu

## File Size Targets

| Limit | Size |
|-------|------|
| **Hard Limit** | < 5MB |
| **Ideal Target** | < 2MB |
