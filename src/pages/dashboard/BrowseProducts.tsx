import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Filter, Eye, Box, ShoppingBag, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { Product } from '../../types';


const ProductCard = ({ product }: { product: any }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="adm-card group overflow-hidden flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-[var(--adm-surface2)]">
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            {images.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={prevImage} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-[var(--adm-teal)] transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={nextImage} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-[var(--adm-teal)] transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
                {/* Image indicator - Exact same as Admin */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm z-20">
                  {images.map((_: any, idx: number) => (
                    <div 
                      key={idx} 
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                      className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${currentImageIndex === idx ? 'bg-[var(--adm-teal-lt)] w-4' : 'bg-white/30 hover:bg-white/60'}`} 
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--adm-text-dim)]">
            <Box size={48} className="opacity-20 mb-2" />
            <span className="text-xs uppercase tracking-widest opacity-50">Image Unavailable</span>
          </div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <span className="adm-badge processing" style={{ fontSize: '0.65rem' }}>
            {product.type.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-serif text-lg font-bold text-[var(--adm-text)] leading-tight line-clamp-1">{product.name}</h3>
        </div>
        
        <p className="text-xs text-[var(--adm-text-sub)] line-clamp-2 mb-4 h-8">{product.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between pt-4 border-t border-[var(--adm-border)] mb-4">
            <div className="text-right w-full flex justify-between items-center">
              <span className="text-[10px] text-[var(--adm-text-sub)] uppercase tracking-widest font-bold">Base Price</span>
              <span className="text-lg font-black text-[var(--adm-teal-lt)]">₹{product.basePrice}</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate(`/dashboard/place-order/${product.id}`)}
            className="w-full py-2.5 bg-[var(--adm-teal)] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--adm-teal-lt)] transition-all shadow-lg shadow-teal-900/20 active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            <span>Place Order</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default function BrowseProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getProducts(1, 50);
        if (response.data && response.data.data && response.data.data.products) {
          const mapped = response.data.data.products.map((p: any) => ({
            id: p._id,
            name: p.name,
            type: p.category,
            basePrice: p.basePrice,
            description: p.description,
            images: p.images || [],
            imageUrl: p.images && p.images.length > 0 ? p.images[0] : null
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Opening our catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="adm-page-header">
        <div className="adm-page-label">Product Catalog</div>
        <h1 className="adm-page-title">Premium Print Solutions</h1>
        <p className="adm-page-sub">Browse our range of high-quality customizable print products for your brand.</p>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search />
          <input 
            type="text" 
            placeholder="Search by product name or category..." 
            className="adm-toolbar-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="adm-icon-btn"><Filter size={16} /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      
      {filteredProducts.length === 0 && (
        <div className="adm-empty">
          <Box size={48} className="mx-auto mb-4 opacity-20" />
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
