'use client';

/**
 * ModelViewer Component - Apple-style 3D Model Viewer with WebAR
 * 
 * Uses Google's <model-viewer> web component for:
 * - 3D model rendering
 * - AR Quick Look (iOS)
 * - Scene Viewer (Android)
 * - WebXR fallback
 * 
 * Design: Matches Apple Retail aesthetic with subtle loading states.
 */

import { useEffect, useState } from 'react';

// Extend JSX types for model-viewer custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes;
    }
  }
}

interface ModelViewerAttributes extends React.HTMLAttributes<HTMLElement> {
  src: string;
  poster?: string;
  alt?: string;
  ar?: boolean;
  'ar-modes'?: string;
  'ar-scale'?: string;
  'camera-controls'?: boolean;
  'disable-zoom'?: boolean;
  'disable-pan'?: boolean;
  'touch-action'?: string;
  'auto-rotate'?: boolean;
  'rotation-per-second'?: string;
  'interaction-prompt'?: string;
  'shadow-intensity'?: string;
  'shadow-softness'?: string;
  'environment-image'?: string;
  exposure?: string;
  loading?: 'auto' | 'lazy' | 'eager';
  reveal?: 'auto' | 'interaction' | 'manual';
  'quick-look-browsers'?: string;
  'ios-src'?: string;
}

interface ModelViewerProps {
  /** URL to the GLB/GLTF model file */
  src: string;
  /** URL to the poster image shown while loading */
  poster?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Enable AR mode */
  enableAR?: boolean;
  /** Enable camera controls (orbit, zoom, pan) */
  enableControls?: boolean;
  /** Enable auto-rotation */
  autoRotate?: boolean;
  /** Additional className for the container */
  className?: string;
  /** Aspect ratio of the viewer (default: 1) */
  aspectRatio?: number;
}

/**
 * Apple-style loading spinner
 */
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-apple-offwhite/80 backdrop-blur-sm rounded-apple-xl transition-opacity duration-slow">
      {/* Circular spinner matching Apple's style */}
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-apple-gray-200" />
        {/* Spinning segment */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-apple-blue animate-spin" />
      </div>
    </div>
  );
}

/**
 * AR Button - Touch-friendly, Apple-style
 */
function ARButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        absolute bottom-4 right-4 z-10
        flex items-center gap-2
        bg-white/90 backdrop-blur-sm
        text-apple-gray-800 text-sm font-medium
        px-4 py-3 min-h-[44px]
        rounded-full shadow-apple
        transition-all duration-fast ease-apple
        hover:bg-white hover:shadow-apple-md
        active:scale-95
      "
      aria-label="View in AR"
    >
      {/* AR Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3L2 8l10 5 10-5-10-5z" />
        <path d="M2 12l10 5 10-5" />
        <path d="M2 17l10 5 10-5" />
      </svg>
      <span>View in AR</span>
    </button>
  );
}

export default function ModelViewer({
  src,
  poster,
  alt = '3D Model',
  enableAR = true,
  enableControls = true,
  autoRotate = false,
  className = '',
  aspectRatio = 1,
}: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);

  // Load model-viewer script
  useEffect(() => {
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      script.onload = () => setIsModelViewerLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsModelViewerLoaded(true);
    }
  }, []);

  // Handle model load event
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className={`relative overflow-hidden bg-apple-offwhite rounded-apple-xl ${className}`}
      style={{ aspectRatio }}
    >
      {/* Poster image as background fallback */}
      {poster && isLoading && (
        <img
          src={poster}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain"
          loading="lazy"
        />
      )}

      {/* Model Viewer */}
      {isModelViewerLoaded && (
        <model-viewer
          src={src}
          poster={poster}
          alt={alt}
          // AR Configuration - Universal WebAR
          ar={enableAR}
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          // iOS Quick Look - Safari & supported browsers
          quick-look-browsers="safari chrome"
          // Camera Controls
          camera-controls={enableControls}
          disable-zoom={!enableControls}
          disable-pan={!enableControls}
          touch-action={enableControls ? 'pan-y' : 'none'}
          // Auto Rotate
          auto-rotate={autoRotate}
          rotation-per-second="30deg"
          // Interaction
          interaction-prompt="none"
          // Lighting & Shadows
          shadow-intensity="0.5"
          shadow-softness="1"
          exposure="0.9"
          // Loading
          loading="lazy"
          reveal="auto"
          // Event handlers
          onLoad={handleLoad}
          // Styling
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
        />
      )}

      {/* Loading State */}
      {isLoading && <LoadingSpinner />}

      {/* Custom AR Button (shown when AR is available) */}
      {enableAR && !isLoading && (
        <ARButton />
      )}
    </div>
  );
}
