import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, ChevronLeft, ChevronRight, Package, Info, X } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../../types';
import api from '../../services/api';

const ProductCard = ({ product, onView, onEdit, onDelete }: { 
  product: any, 
  onView: (p: any) => void, 
  onEdit: (p: any) => void, 
  onDelete: (id: string) => void 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="adm-card group">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--adm-surface2)]">
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevImage} className="adm-collapse-btn" style={{ background: 'rgba(6,15,26,0.6)', backdropFilter: 'blur(4px)' }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextImage} className="adm-collapse-btn" style={{ background: 'rgba(6,15,26,0.6)', backdropFilter: 'blur(4px)' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            {/* Image indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_: any, idx: number) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-[var(--adm-teal-lt)] w-4' : 'bg-white/30'}`} />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--adm-text-sub)]">
            <Package size={40} className="opacity-20 mb-2" />
            <span className="text-xs uppercase tracking-widest opacity-50">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`adm-badge ${product.isActive ? 'active' : 'inactive'}`} style={{ fontSize: '0.65rem' }}>
            {product.isActive ? 'IN STOCK' : 'OUT OF STOCK'}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--adm-text)] leading-tight">{product.name}</h3>
            <p className="text-xs font-medium text-[var(--adm-teal)] uppercase tracking-wider mt-1">{product.type}</p>
          </div>
        </div>
        
        <p className="text-xs text-[var(--adm-text-sub)] line-clamp-2 mb-4 h-8">
          {Array.isArray(product.description) ? product.description.join(', ') : product.description}
        </p>
        
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--adm-border)]">
          <button 
            onClick={() => onView(product)}
            className="adm-action-btn flex-1 py-1.5 h-auto text-xs font-bold gap-1.5" title="View Details"
          >
            <Eye size={14} /> View
          </button>
          <button 
            onClick={() => onEdit(product)}
            className="adm-action-btn flex-1 py-1.5 h-auto text-xs font-bold gap-1.5" title="Edit Product"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="adm-action-btn danger py-1.5 h-auto" title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};


export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    descriptionPoints: [] as string[],
  });
  const [currentFeature, setCurrentFeature] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewImageIndex, setViewImageIndex] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts(1, 100);
      const fetchedProducts = res.data.data.products;
      
      const mappedProducts = fetchedProducts.map((p: any) => ({
        id: p._id,
        name: p.name,
        type: p.category,
        description: Array.isArray(p.description) ? p.description : (p.description ? p.description.split('\n') : []),
        basePrice: p.basePrice,
        minQuantity: 1,
        maxQuantity: 10000,
        images: p.images || [],
        imageUrl: p.images && p.images.length > 0 ? p.images[0] : '',
        isActive: p.isActive !== false,
      }));

      setProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.deleteProduct(productToDelete);
      toast.success('Product removed successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to remove product');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.type,
      descriptionPoints: Array.isArray(product.description) ? product.description : [],
    });
    setExistingImages(product.images || []);
    setSelectedFiles([]);
    setShowEditModal(true);
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setViewImageIndex(0);
    setShowViewModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const uploadedImageUrls: string[] = [...existingImages];
      for (const file of selectedFiles) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        uploadedImageUrls.push(base64);
      }

      await api.updateProduct(selectedProduct.id, {
        name: formData.name,
        category: formData.category,
        description: formData.descriptionPoints,
        images: uploadedImageUrls,
      });

      toast.success('Product updated successfully!');
      setShowEditModal(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const uploadedImageUrls: string[] = [];
      for (const file of selectedFiles) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        uploadedImageUrls.push(base64);
      }

      await api.createProduct({
        name: formData.name,
        category: formData.category,
        basePrice: 0,
        description: formData.descriptionPoints,
        images: uploadedImageUrls,
      });

      toast.success('Product catalog updated!');
      setShowAddModal(false);
      setFormData({ name: '', category: '', descriptionPoints: [] });
      setCurrentFeature('');
      setSelectedFiles([]);
      // Refresh logic would go here
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Browsing product inventory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="adm-page-header flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="adm-page-label">Catalog</div>
          <h1 className="adm-page-title">Product Management</h1>
          <p className="adm-page-sub">Manage your service offerings, custom templates, and product inventory.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="adm-nav-item active px-6 py-2.5 h-auto text-sm font-bold gap-2"
        >
          <Plus size={18} />
          <span>New Offering</span>
        </button>
      </div>

      {/* Search */}
      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search />
          <input
            type="text"
            placeholder="Filter products by name, category, or features..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="adm-toolbar-input"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="adm-empty">
          <Package size={48} className="mx-auto mb-4 opacity-10" />
          <p>Your product catalog is currently empty or no matches found.</p>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#060f1a]/80 backdrop-blur-sm">
          <div className="adm-card w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="adm-card-header">
              <h2 className="adm-card-title flex items-center gap-2">
                <Plus size={18} className="text-[#5cbdb9]" />
                Add New Product Listing
              </h2>
              <button onClick={() => setShowAddModal(false)} className="adm-collapse-btn">
                <X size={18} />
              </button>
            </div>
            
            <form className="adm-card-body space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="adm-page-label" style={{ marginBottom: '0.25rem', fontSize: '0.6rem' }}>Product Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="adm-toolbar-input" placeholder="e.g. Premium Executive Diary 2025" />
                </div>
                <div>
                  <label className="adm-page-label" style={{ marginBottom: '0.25rem', fontSize: '0.6rem' }}>Category</label>
                  <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="adm-toolbar-input" placeholder="e.g. Diary, Calendar..." />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="adm-page-label" style={{ marginBottom: '0.25rem', fontSize: '0.6rem' }}>Add Product Features</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={currentFeature}
                      onChange={e => setCurrentFeature(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (currentFeature.trim()) {
                            setFormData({...formData, descriptionPoints: [...formData.descriptionPoints, currentFeature.trim()]});
                            setCurrentFeature('');
                          }
                        }
                      }}
                      className="adm-toolbar-input flex-1" 
                      placeholder="Type a feature and click '+'..." 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (currentFeature.trim()) {
                          setFormData({...formData, descriptionPoints: [...formData.descriptionPoints, currentFeature.trim()]});
                          setCurrentFeature('');
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--adm-teal)]/10 text-[var(--adm-teal)] hover:bg-[var(--adm-teal)] hover:text-white transition-all shadow-sm"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {formData.descriptionPoints.length > 0 && (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.descriptionPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[var(--adm-surface2)] border border-[var(--adm-border)] animate-in slide-in-from-top-1 duration-200">
                        <span className="text-xs text-[var(--adm-text)]">{point}</span>
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, descriptionPoints: formData.descriptionPoints.filter((_, i) => i !== idx)})}
                          className="text-[#e05c5c] hover:text-[#e05c5c]/80 p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="adm-page-label" style={{ marginBottom: '0.25rem', fontSize: '0.6rem' }}>Visual Assets</label>
                <div className="flex flex-col gap-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#2d8a9e]/20 border-dashed rounded-lg cursor-pointer bg-[#0c1e33]/50 hover:bg-[#0c1e33] transition-colors">
                    <div className="flex flex-col items-center justify-center py-4">
                      <Plus className="text-[#5cbdb9] mb-2" size={24} />
                      <p className="text-xs text-[#7aadba]"><span className="font-bold text-[#5cbdb9]">Upload Images</span> or drag files here</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={e => {
                      if (e.target.files) {
                        setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }} />
                  </label>
                  
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-[#2d8a9e]/10 border border-[#2d8a9e]/30 rounded-full">
                          <span className="text-[10px] text-[#5cbdb9] font-bold truncate max-w-[120px]">{file.name}</span>
                          <button 
                            type="button" 
                            onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-[#e05c5c] hover:text-[#e05c5c]/80"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="adm-logout-btn w-auto px-6" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="adm-nav-item active px-8 py-2 h-auto text-sm font-bold" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}

      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#060f1a]/80 backdrop-blur-sm">
          <div className="adm-card w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="adm-card-header">
              <h2 className="adm-card-title flex items-center gap-2">
                <Edit2 size={18} className="text-[#5cbdb9]" />
                Update Product Offering
              </h2>
              <button onClick={() => setShowEditModal(false)} className="adm-collapse-btn">
                <X size={18} />
              </button>
            </div>
            
            <form className="adm-card-body space-y-5" onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="adm-page-label" style={{ marginBottom: '0.25rem', fontSize: '0.6rem' }}>Product Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="adm-toolbar-input" placeholder="e.g. Premium Executive Diary 2025" />
                </div>
                <div>
                  <label className="adm-page-label" style={{ marginBottom: '0.25rem', fontSize: '0.6rem' }}>Category</label>
                  <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="adm-toolbar-input" placeholder="e.g. Diary, Calendar..." />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="adm-page-label" style={{ marginBottom: '0.25rem', fontSize: '0.6rem' }}>Edit Product Features</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={currentFeature}
                      onChange={e => setCurrentFeature(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (currentFeature.trim()) {
                            setFormData({...formData, descriptionPoints: [...formData.descriptionPoints, currentFeature.trim()]});
                            setCurrentFeature('');
                          }
                        }
                      }}
                      className="adm-toolbar-input flex-1" 
                      placeholder="Add new feature..." 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (currentFeature.trim()) {
                          setFormData({...formData, descriptionPoints: [...formData.descriptionPoints, currentFeature.trim()]});
                          setCurrentFeature('');
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--adm-teal)]/10 text-[var(--adm-teal)] hover:bg-[var(--adm-teal)] hover:text-white transition-all shadow-sm"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {formData.descriptionPoints.length > 0 && (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.descriptionPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[var(--adm-surface2)] border border-[var(--adm-border)] animate-in slide-in-from-top-1 duration-200">
                        <span className="text-xs text-[var(--adm-text)]">{point}</span>
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, descriptionPoints: formData.descriptionPoints.filter((_, i) => i !== idx)})}
                          className="text-[#e05c5c] hover:text-[#e05c5c]/80 p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="adm-page-label" style={{ marginBottom: '0.5rem', fontSize: '0.6rem' }}>Product Imagery</label>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--adm-border)] group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-[#2d8a9e]/20 border-dashed rounded-lg cursor-pointer bg-[#0c1e33]/50 hover:bg-[#0c1e33] transition-colors">
                    <div className="flex flex-col items-center justify-center py-2">
                      <Plus className="text-[#5cbdb9] mb-1" size={20} />
                      <p className="text-[10px] text-[#7aadba]">Upload new images</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={e => {
                      if (e.target.files) {
                        setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }} />
                  </label>
                  
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-[#5cbdb9]/10 border border-[#5cbdb9]/30 rounded-full">
                          <span className="text-[10px] text-[#5cbdb9] font-bold truncate max-w-[120px]">{file.name}</span>
                          <button type="button" onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-400">
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="adm-logout-btn w-auto px-6" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="adm-nav-item active px-8 py-2 h-auto text-sm font-bold" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen View Product Modal */}
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
                  handleEdit(selectedProduct);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--adm-surface2)] text-[var(--adm-text)] hover:bg-[var(--adm-teal)] hover:text-white transition-all text-xs font-bold"
              >
                <Edit2 size={14} /> Edit Product
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
                      <span className="text-lg font-bold text-[var(--adm-text)]">Active Offering</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#060f1a]/80 backdrop-blur-sm">
          <div className="adm-card w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[var(--adm-text)] mb-2">Remove Product?</h3>
              <p className="text-sm text-[var(--adm-text-sub)] mb-8">
                Are you sure you want to delete this offering? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[var(--adm-surface2)] text-[var(--adm-text)] font-bold text-xs hover:bg-[var(--adm-border)] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
