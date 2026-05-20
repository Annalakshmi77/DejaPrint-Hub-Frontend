import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Box,
  Palette,
  Eye,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShoppingBag,
  Package,
  X,
  Info
} from 'lucide-react';
import api from '../../services/api';
import { Product } from '../../types';

const ProductCard = ({ product, onView }: { product: any; onView: (p: any) => void }) => {
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
    <div className="adm-card group overflow-hidden border-[var(--adm-border)] hover:border-[var(--adm-teal)] transition-all flex flex-col h-full shadow-sm hover:shadow-xl">
      <div className="relative aspect-[5/6] overflow-hidden bg-[var(--adm-surface2)]">
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            {images.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={prevImage} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-[var(--adm-teal)] transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={nextImage} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-[var(--adm-teal)] transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
                {/* Image indicator */}
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
            <Box size={40} className="opacity-10 mb-2" />
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-bold text-[var(--adm-text)] group-hover:text-[var(--adm-teal-lt)] transition-colors line-clamp-1 leading-tight">{product.name}</h3>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--adm-teal)]">{product.type}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); onView(product); }}
                className="w-6 h-6 rounded-lg bg-[var(--adm-teal)]/10 text-[var(--adm-teal)] flex items-center justify-center hover:bg-[var(--adm-teal)] hover:text-white transition-all shadow-sm"
                title="View Details"
              >
                <Eye size={12} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-[var(--adm-border)]">
          <button 
            onClick={() => navigate(`/dashboard/place-order/${product.id}`)}
            className="w-full py-2.5 bg-[var(--adm-teal)] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--adm-teal-lt)] transition-all shadow-lg shadow-teal-900/10 active:scale-[0.98]"
          >
            <ShoppingBag size={16} />
            <span>Place Order</span>
          </button>
        </div>

      </div>
    </div>
  );
};


export default function CustomerDesigns() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewImageIndex, setViewImageIndex] = useState(0);

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setViewImageIndex(0);
    setShowViewModal(true);
  };

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
        console.error('Failed to fetch product collection', error);
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
        <span>Opening the Design Studio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="adm-page-header">
        <div className="adm-page-label">Creative Studio</div>
        <h1 className="adm-page-title">Available Designs</h1>
        <p className="adm-page-sub">Select from our premium product templates to begin your custom design.</p>
      </div>

      {/* Search & Filter */}
      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search />
          <input 
            type="text" 
            placeholder="Search products to design..." 
            className="adm-toolbar-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="adm-icon-btn"><Filter size={16} /></button>
      </div>

      {/* Products Grid as Designs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onView={handleViewProduct} 
          />
        ))}
      </div>




      {filteredProducts.length === 0 && (
        <div className="adm-empty py-20">
          <Box size={48} className="mx-auto mb-4 opacity-10" />
          <p className="text-[var(--adm-text-sub)]">No templates found matching your search.</p>
        </div>
      )}

      {/* Full Screen View Product Modal (Customer View) */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[var(--adm-bg)] animate-in fade-in duration-300">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-[var(--adm-border)] bg-[var(--adm-surface)]/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--adm-teal)]/10 flex items-center justify-center text-[var(--adm-teal)]">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--adm-text)] leading-none">{selectedProduct.name}</h2>
                <p className="text-[10px] text-[var(--adm-teal)] font-black uppercase tracking-widest mt-1">{selectedProduct.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/dashboard/place-order/${selectedProduct.id}`);
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--adm-teal)] text-white hover:bg-[var(--adm-teal-lt)] transition-all text-xs font-bold shadow-lg shadow-teal-900/20"
              >
                <ShoppingBag size={14} /> Place Order Now
              </button>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Image Section (Left) */}
            <div className="flex-1 relative bg-[var(--adm-bg)]/40 flex items-center justify-center group">
              {selectedProduct.images?.length > 0 ? (
                <>
                  <img 
                    src={selectedProduct.images[viewImageIndex]} 
                    alt="" 
                    className="max-w-full max-h-full object-contain p-8 transition-all duration-700" 
                  />
                  
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setViewImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)}
                        className="absolute left-8 w-12 h-12 rounded-full bg-[var(--adm-surface)]/80 text-[var(--adm-text)] flex items-center justify-center hover:bg-[var(--adm-teal)] hover:text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-xl"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={() => setViewImageIndex((prev) => (prev + 1) % selectedProduct.images.length)}
                        className="absolute right-8 w-12 h-12 rounded-full bg-[var(--adm-surface)]/80 text-[var(--adm-text)] flex items-center justify-center hover:bg-[var(--adm-teal)] hover:text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-xl"
                      >
                        <ChevronRight size={24} />
                      </button>
                      
                      {/* Thumbnails at bottom */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-2 rounded-2xl bg-[var(--adm-surface)]/40 backdrop-blur-xl border border-[var(--adm-border)] shadow-2xl">
                        {selectedProduct.images.map((img: string, i: number) => (
                          <div 
                            key={i}
                            onClick={() => setViewImageIndex(i)}
                            className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${viewImageIndex === i ? 'border-[var(--adm-teal)] scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                          >
                            <img src={img} className="w-full h-full object-cover" alt="" />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center opacity-10">
                  <Package size={120} className="text-[var(--adm-text)]" />
                  <p className="text-xl font-black uppercase tracking-widest mt-4 text-[var(--adm-text)]">No Assets Available</p>
                </div>
              )}
            </div>

            {/* Details Section (Right) */}
            <div className="w-[400px] bg-[var(--adm-surface)] border-l border-[var(--adm-border)] p-10 overflow-y-auto overflow-x-hidden">
              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--adm-teal)] mb-6 flex items-center gap-3">
                    <Info size={14} />
                    Specifications & Features
                  </h4>
                  <div className="space-y-3">
                    {Array.isArray(selectedProduct.description) && selectedProduct.description.length > 0 ? selectedProduct.description.map((point: string, i: number) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--adm-surface2)] border border-[var(--adm-border)] hover:border-[var(--adm-teal)]/30 transition-all group">
                        <div className="w-2 h-2 rounded-full bg-[var(--adm-teal)] mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                        <p className="text-sm text-[var(--adm-text-sub)] leading-relaxed">{point}</p>
                      </div>
                    )) : (
                      <p className="text-xs text-[var(--adm-text-dim)] italic">No features documented for this item.</p>
                    )}
                  </div>
                </div>

                <div className="pt-10 border-t border-[var(--adm-border)]">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--adm-teal)]/5 to-transparent border border-[var(--adm-teal)]/10">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--adm-text-dim)] mb-2">Inventory Status</h5>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[var(--adm-teal)] animate-pulse" />
                      <span className="text-lg font-bold text-[var(--adm-text)]">Available for Customization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
