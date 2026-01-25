# Optimized 3D Models

This folder contains optimized GLB files ready for WebAR deployment.

**Do not manually add files here.** Use the optimization pipeline:

```bash
npm run optimize
```

Files are automatically placed here after processing from `raw-assets/`.

## Optimization Applied

- Textures resized to max 1024x1024
- Draco compression (quantization: 14/10/8)
- Deduplicated and pruned resources
