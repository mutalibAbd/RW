import ModelViewer from '@/components/ModelViewer';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import type { Product } from '@/types/database.types';

/**
 * Fallback product data for development/empty database
 * Will be used if Supabase returns no products
 */
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    name: 'Sample House',
    description: 'Optimized 3D model ready for WebAR',
    glb_url: '/models/small-house.glb', // kebab-case, no spaces
    poster_url: null,
    file_size_bytes: 23000, // ~23KB after optimization
    draco_compressed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: { tags: ['demo', 'architecture'] },
  },
];

/**
 * Fetch products from Supabase with SWR-style caching
 * Uses Next.js built-in caching with revalidation
 */
async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error.message);
      return FALLBACK_PRODUCTS;
    }
    
    // Return fallback if no products in database
    if (!data || data.length === 0) {
      console.log('No products in database, using fallback');
      return FALLBACK_PRODUCTS;
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Product Card Component
 * Apple-style card with soft shadows and generous whitespace
 */
function ProductCard({ product }: { product: Product }) {
  // Extract tags from metadata safely
  const tags = (product.metadata as { tags?: string[] })?.tags ?? [];
  
  return (
    <article className="group card-apple p-0 overflow-hidden">
      {/* 3D Model Viewer */}
      <div className="aspect-square bg-apple-offwhite">
        <ModelViewer
          src={product.glb_url}
          poster={product.poster_url ?? undefined}
          alt={product.name}
          enableAR={true}
          enableControls={false} // Disabled in grid view per frontend.md
          autoRotate={false}
          aspectRatio={1}
        />
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-apple-gray-800 tracking-tight">
          {product.name}
        </h3>
        <p className="text-sm text-apple-gray-500 leading-relaxed">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="
                text-xs text-apple-gray-500 
                bg-apple-gray-100 
                px-3 py-1 
                rounded-full
              "
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/**
 * Navigation Bar - Glassmorphism Style
 */
function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-apple-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-apple-blue flex items-center justify-center">
            <span className="text-white font-bold text-sm">ZC</span>
          </div>
          <span className="font-semibold text-apple-gray-800 tracking-tight">
            Zero-Cost Gallery
          </span>
        </div>

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-colors duration-fast"
          >
            Browse
          </a>
          <a
            href="#"
            className="text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-colors duration-fast"
          >
            About
          </a>
          <a
            href="#"
            className="text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-colors duration-fast"
          >
            GitHub
          </a>
        </div>

        {/* CTA Button */}
        <button className="btn-apple text-sm">
          Explore in AR
        </button>
      </div>
    </nav>
  );
}

/**
 * Hero Section - Clean, minimal
 */
function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Headline */}
        <h1 className="text-apple-gray-800">
          Experience Products in{' '}
          <span className="text-apple-blue">Augmented Reality</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-apple-gray-500 max-w-2xl mx-auto leading-relaxed">
          Explore our curated collection of 3D models. View them in your space
          using WebAR — no app required.
        </p>

        {/* CTA */}
        <div className="pt-4">
          <button className="btn-apple px-8 py-4 text-base">
            Browse Collection
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * Product Grid Section
 */
function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-apple-gray-800 mb-4">Featured Collection</h2>
          <p className="text-apple-gray-500 max-w-xl mx-auto">
            Each model is optimized for WebAR and available under CC0 license.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Footer - Minimal
 */
function Footer() {
  return (
    <footer className="border-t border-apple-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-apple-gray-400">
          © 2026 Zero-Cost Gallery. Built for the free tier.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/mutalibAbd/RW"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-colors"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-colors"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}

/**
 * Home Page - Apple Retail Style
 * Server Component that fetches products from Supabase
 */
export default async function HomePage() {
  // Fetch products from Supabase (or fallback data)
  const products = await getProducts();
  
  return (
    <>
      <NavBar />
      <HeroSection />
      <ProductGrid products={products} />
      <Footer />
    </>
  );
}
