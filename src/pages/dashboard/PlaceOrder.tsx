import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Truck, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Package,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

export default function PlaceOrder() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Form State
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [notes, setNotes] = useState('');
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProductById(productId!);
        const p = response.data.data;
        setProduct({
          id: p._id,
          name: p.name,
          type: p.category,
          description: p.description,
          images: p.images || [],
          imageUrl: p.images && p.images.length > 0 ? p.images[0] : null
        });
      } catch (error) {
        console.error('Failed to fetch product', error);
        toast.error('Product not found');
        navigate('/dashboard/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.email || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.pincode) {
      toast.error('Please fill all required contact and shipping fields');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: [{
          productId: product.id,
          variantId: 'default', // For now
          productName: product.name,
          quantity: quantity,
        }],
        shippingAddress,
        notes,
        requestedDeliveryDate: requestedDeliveryDate || undefined
      };


      const response = await api.createOrder(orderData);
      toast.success('Order placed successfully!');
      navigate('/dashboard/orders');
    } catch (error: any) {
      console.error('Order submission failed', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Preparing your order studio...</span>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--adm-text-sub)] hover:text-[var(--adm-teal)] transition-colors text-sm font-bold group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Visualization (Lg: 7/12) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="adm-card overflow-hidden border-[var(--adm-border)]">
            <div className="relative aspect-[16/10] bg-[var(--adm-surface2)] group">
              {product.images?.length > 0 ? (
                <>
                  <img 
                    src={product.images[currentImageIndex]} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                  {product.images.length > 1 && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[var(--adm-teal)] transition-colors backdrop-blur-md"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
                          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[var(--adm-teal)] transition-colors backdrop-blur-md"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm">
                        {product.images.map((_: any, idx: number) => (
                          <div 
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentImageIndex === idx ? 'bg-[var(--adm-teal)] w-6' : 'bg-white/30 hover:bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--adm-text-dim)]">
                  <Package size={64} className="opacity-10 mb-4" />
                  <p>Preview Unavailable</p>
                </div>
              )}
            </div>
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="adm-page-label">{product.type}</div>
                  <h1 className="text-3xl font-serif font-black text-[var(--adm-text)]">{product.name}</h1>
                </div>
              </div>
              <p className="text-[var(--adm-text-sub)] leading-relaxed">{product.description}</p>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[var(--adm-surface)] border border-[var(--adm-border)] flex flex-col items-center text-center">
                  <ShieldCheck className="text-[var(--adm-teal)] mb-2" size={24} />
                  <span className="text-[10px] uppercase font-black text-[var(--adm-text-dim)]">Quality Assured</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--adm-surface)] border border-[var(--adm-border)] flex flex-col items-center text-center">
                  <Truck className="text-[var(--adm-teal)] mb-2" size={24} />
                  <span className="text-[10px] uppercase font-black text-[var(--adm-text-dim)]">Fast Delivery</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--adm-surface)] border border-[var(--adm-border)] flex flex-col items-center text-center">
                  <CreditCard className="text-[var(--adm-teal)] mb-2" size={24} />
                  <span className="text-[10px] uppercase font-black text-[var(--adm-text-dim)]">Secure Order</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Form (Lg: 5/12) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="adm-card border-[var(--adm-border)] p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-[var(--adm-teal)]/10 flex items-center justify-center text-[var(--adm-teal)]">
                <ShoppingBag size={20} />
              </div>
              <h2 className="text-xl font-bold text-[var(--adm-text)]">Order Configuration</h2>
            </div>

            <div className="space-y-6">
              {/* Quantity */}
              <div>
                <label className="adm-page-label block mb-3">Quantity Selection</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-[var(--adm-surface2)] rounded-lg border border-[var(--adm-border)] p-1">
                    <button 
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center text-[var(--adm-text-sub)] hover:text-[var(--adm-text)] transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 bg-transparent border-none text-center font-black text-[var(--adm-text)] focus:ring-0"
                    />
                    <button 
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-[var(--adm-text-sub)] hover:text-[var(--adm-text)] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-[var(--adm-text-dim)] font-medium">Units to be printed</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-[var(--adm-teal)]" />
                  <span className="text-xs uppercase font-black tracking-widest text-[var(--adm-text-dim)]">Shipping Destination</span>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Full Name *"
                  required
                  className="adm-toolbar-input w-full"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                />
                
                <input 
                  type="tel" 
                  placeholder="Phone Number *"
                  required
                  className="adm-toolbar-input w-full"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                />

                <input 
                  type="email" 
                  placeholder="Email Address *"
                  required
                  className="adm-toolbar-input w-full"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                />

                <div className="grid grid-cols-1 gap-4">
                  <input 
                    type="text" 
                    placeholder="Address Line 1 (Street/Building) *"
                    required
                    className="adm-toolbar-input w-full"
                    value={shippingAddress.line1}
                    onChange={(e) => setShippingAddress({...shippingAddress, line1: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Address Line 2 (Optional)"
                    className="adm-toolbar-input w-full"
                    value={shippingAddress.line2}
                    onChange={(e) => setShippingAddress({...shippingAddress, line2: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City *"
                    required
                    className="adm-toolbar-input"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="State *"
                    required
                    className="adm-toolbar-input"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                  />
                </div>
                
                <input 
                  type="text" 
                  placeholder="Pincode *"
                  required
                  className="adm-toolbar-input w-full"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                />
              </div>

              {/* Notes and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="adm-page-label block mb-3">Special Instructions</label>
                  <textarea 
                    rows={2}
                    className="adm-toolbar-input w-full py-3"
                    placeholder="Any specific requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div>
                  <label className="adm-page-label block mb-3">Requested Delivery Date</label>
                  <input 
                    type="date"
                    className="adm-toolbar-input w-full py-3 h-[62px]"
                    value={requestedDeliveryDate}
                    onChange={(e) => setRequestedDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="mt-8 pt-8 border-t border-[var(--adm-border)] space-y-4">
              <div className="bg-[var(--adm-teal)]/5 p-6 rounded-xl flex gap-4 mt-2">
                <AlertCircle className="text-[var(--adm-teal)] shrink-0" size={24} />
                <div>
                  <p className="text-xs font-bold text-[var(--adm-teal)] uppercase tracking-widest mb-1">Price on Inquiry</p>
                  <p className="text-[11px] text-[var(--adm-text-sub)] leading-relaxed">
                    Our team will review your quantity and requirements. We will share a customized quotation and payment details within 24 hours.
                  </p>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-4 bg-[var(--adm-teal)] hover:bg-[var(--adm-teal-lt)] disabled:bg-[var(--adm-border)] text-white font-black text-lg rounded-xl shadow-xl shadow-teal-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Confirm Order Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
