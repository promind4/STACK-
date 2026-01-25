import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../ui/Button';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { Loader2, ShieldCheck, Plus, CheckCircle, AlertTriangle, LogOut, Edit, Trash2, Save, X, Image as ImageIcon, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Category, Product, ProductOffer } from '../../types/database';

interface AdminPageProps {
    onNavigate: (page: string) => void;
}

// Complete Product Type for Editing (with offers)
type ProductWithOffers = Product & {
    product_offers: ProductOffer[];
};

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
    // --- AUTH & GLOBAL STATE ---
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form'>('list');

    // --- DATA STATE ---
    const [products, setProducts] = useState<ProductWithOffers[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // --- FORM STATE ---
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial Form Data
    const initialFormData = {
        name: '',
        slug: '',
        brand: '',
        category_id: '',
        description: '',
        image_url: '',
        is_active: true,
        rating: 5,
        review_count: 0,
        pros: [] as string[],
        cons: [] as string[],
        gallery_images: [] as string[],
        offers: [] as { merchant_name: string; price: number; affiliate_link: string; in_stock: boolean }[] // Dynamic Offers
    };

    const [formData, setFormData] = useState(initialFormData);

    // --- AUTH LOGIN STATE ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(false);

    // --- INITIALIZATION ---
    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (session) {
            fetchCategories();
            fetchProducts();
        }
    }, [session, refreshTrigger]);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*').order('name');
        if (data) setCategories(data as any);
    };

    const fetchProducts = async () => {
        // Fetch products with their offers
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_offers (*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data as any);
        }
    };

    // --- AUTH HANDLERS ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError(null);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAuthError(error.message);
        else setSession(data.session);
        setAuthLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    // --- CRUD HANDLERS ---

    // 1. OPEN FORM (CREATE)
    const handleCreateNew = () => {
        setFormData(initialFormData);
        setIsEditing(false);
        setCurrentId(null);
        setFormMessage(null);
        setView('form');
    };

    // 2. OPEN FORM (EDIT)
    const handleEdit = (product: ProductWithOffers) => {
        setFormData({
            name: product.name,
            slug: product.slug,
            brand: product.brand || '',
            category_id: product.category_id,
            description: product.description || '',
            image_url: product.image_url || '',
            is_active: product.is_active || true,
            rating: product.rating || 5, // Default to 5 if missing
            review_count: (product as any).review_count ?? product.reviews ?? 0, // Fallback chain
            pros: product.pros || [],
            cons: product.cons || [],
            gallery_images: product.gallery_images || [],
            offers: product.product_offers.map(o => ({
                merchant_name: o.merchant_name,
                price: o.price,
                affiliate_link: o.affiliate_link,
                in_stock: o.in_stock ?? true
            }))
        });
        setIsEditing(true);
        setCurrentId(product.id);
        setFormMessage(null);
        setView('form');
    };

    // 3. DELETE
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ? \nCette action est irréversible.`)) return;

        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            alert("Erreur lors de la suppression : " + error.message);
        } else {
            setRefreshTrigger(prev => prev + 1); // Refresh list
        }
    };

    // 4. SAVE (CREATE OR UPDATE)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormMessage(null);

        try {
            let productId = currentId;

            // PREPARE PRODUCT DATA
            const productPayload = {
                name: formData.name,
                slug: formData.slug,
                brand: formData.brand,
                category_id: formData.category_id,
                description: formData.description,
                image_url: formData.image_url,
                is_active: formData.is_active,
                rating: formData.rating,
                review_count: formData.review_count,
                pros: formData.pros,
                cons: formData.cons,
                gallery_images: formData.gallery_images
            };

            if (isEditing && productId) {
                // --- UPDATE MODE ---
                const { error: prodError } = await (supabase
                    .from('products') as any)
                    .update(productPayload)
                    .eq('id', productId);

                if (prodError) throw prodError;

                // Sync Offers: Delete all existing and re-insert (Simple Strategy)
                // Note: 'product_id' is implied in delete
                await supabase.from('product_offers').delete().eq('product_id', productId);

            } else {
                // --- CREATE MODE ---
                const { data: newProduct, error: prodError } = await (supabase
                    .from('products') as any)
                    .insert(productPayload)
                    .select()
                    .single();

                if (prodError || !newProduct) throw prodError || new Error("Failed to create product");
                productId = newProduct.id;
            }

            // --- OFFERS INSERTION ---
            if (formData.offers.length > 0 && productId) {
                const offersPayload = formData.offers.map(offer => ({
                    product_id: productId,
                    merchant_name: offer.merchant_name,
                    price: offer.price,
                    affiliate_link: offer.affiliate_link,
                    in_stock: offer.in_stock,
                    currency: 'EUR'
                }));

                const { error: offersError } = await supabase
                    .from('product_offers')
                    .insert(offersPayload as any); // Cast as any because of strict type checks

                if (offersError) throw offersError;
            }

            setFormMessage({ type: 'success', text: isEditing ? "Produit mis à jour avec succès !" : "Produit créé avec succès !" });

            // If create, reset form. If edit, stay on form but marked success.
            if (!isEditing) {
                setFormData(initialFormData);
                setTimeout(() => setView('list'), 1500); // Return to list after short delay
                setRefreshTrigger(prev => prev + 1);
            } else {
                setRefreshTrigger(prev => prev + 1);
            }

        } catch (error: any) {
            console.error("Save error:", error);
            setFormMessage({ type: 'error', text: error.message || "Une erreur est survenue." });
        } finally {
            setFormLoading(false);
        }
    };

    // --- FORM HELPERS ---
    const handleOfferChange = (index: number, field: string, value: any) => {
        const newOffers: any = [...formData.offers];
        newOffers[index][field] = value;
        setFormData({ ...formData, offers: newOffers });
    };

    const addOffer = () => {
        setFormData({
            ...formData,
            offers: [...formData.offers, { merchant_name: 'amazon', price: 0, affiliate_link: '', in_stock: true }]
        });
    };

    const removeOffer = (index: number) => {
        setFormData({
            ...formData,
            offers: formData.offers.filter((_, i) => i !== index)
        });
    };

    // --- PROS & CONS HANDLERS ---
    const handleListChange = (type: 'pros' | 'cons', index: number, value: string) => {
        const newList = [...formData[type]];
        newList[index] = value;
        setFormData({ ...formData, [type]: newList });
    };

    const addListItem = (type: 'pros' | 'cons') => {
        setFormData({ ...formData, [type]: [...formData[type], ''] });
    };

    const removeListItem = (type: 'pros' | 'cons', index: number) => {
        const newList = [...formData[type]];
        newList.splice(index, 1);
        setFormData({ ...formData, [type]: newList });
    };

    // --- GALLERY HANDLERS ---
    const handleGalleryChange = (index: number, value: string) => {
        const newGallery = [...formData.gallery_images];
        newGallery[index] = value;
        setFormData({ ...formData, gallery_images: newGallery });
    };

    const addGalleryImage = () => {
        setFormData({ ...formData, gallery_images: [...formData.gallery_images, ''] });
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = [...formData.gallery_images];
        newGallery.splice(index, 1);
        setFormData({ ...formData, gallery_images: newGallery });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        // Only auto-generate slug given name change IF we are creating, not editing (unless user wants to)
        if (!isEditing) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, name, slug }));
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    // --- RENDER HELPERS ---
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    if (!session) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-border">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2">Administration</h1>
                    <p className="text-muted-foreground text-center mb-8">Connectez-vous pour gérer le catalogue.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {authError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex gap-2"><AlertTriangle className="w-4 h-4" /> {authError}</div>}
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Mot de passe</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <Button type="submit" variant="primary" className="w-full" disabled={authLoading}>
                            {authLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Se connecter
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar onNavigate={onNavigate} />

            <main className="flex-1 container mx-auto px-6 py-24 max-w-[1400px]">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-serif">Tableau de Bord</h1>
                        <p className="text-muted-foreground">Gérez votre catalogue produits et vos offres.</p>
                    </div>
                    <div className="flex gap-4">
                        {view === 'list' ? (
                            <Button onClick={handleCreateNew} variant="primary">
                                <Plus className="w-4 h-4 mr-2" /> Nouveau Produit
                            </Button>
                        ) : (
                            <Button onClick={() => setView('list')} variant="ghost">
                                <X className="w-4 h-4 mr-2" /> Annuler
                            </Button>
                        )}
                        <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:bg-red-50 border-red-200">
                            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                        </Button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                {view === 'list' ? (
                    // --- LIST VIEW ---
                    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/30 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Produit</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Marque</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Offres</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden p-1">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt="" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-foreground">{product.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{product.slug}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground">{product.brand}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.product_offers.map((offer, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-secondary border border-border font-medium">
                                                            {offer.merchant_name}
                                                        </span>
                                                    ))}
                                                    {product.product_offers.length === 0 && <span className="text-xs text-muted-foreground italic">Aucune offre</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(product)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id, product.name)} className="p-2 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                                                Aucun produit trouvé. Commencez par en ajouter un !
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    // --- FORM VIEW ---
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
                            <div className="mb-8 pb-4 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    {isEditing ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                                    {isEditing ? `Modifier "${formData.name}"` : "Nouveau Produit"}
                                </h2>
                                {formMessage && (
                                    <div className={`text-sm font-bold flex items-center gap-2 ${formMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {formMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        {formMessage.text}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* SECTION 1: INFOS DE BASE */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold mb-2">Nom du produit <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleNameChange}
                                            className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Ex: Shure SM7B"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2">Slug (URL) <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.slug}
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-border font-mono text-sm bg-neutral-50"
                                            placeholder="shure-sm7b"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2">Marque</label>
                                        <input
                                            type="text"
                                            value={formData.brand}
                                            onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50"
                                            placeholder="Ex: Shure"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2">Catégorie <span className="text-red-500">*</span></label>
                                        <select
                                            required
                                            value={formData.category_id}
                                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50"
                                        >
                                            <option value="">Sélectionner...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2">Image URL</label>
                                        <input
                                            type="url"
                                            value={formData.image_url}
                                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* GALLERY SECTION */}
                                    <div className="col-span-2 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-bold">Galerie d'Images</label>
                                            <Button type="button" onClick={addGalleryImage} size="sm" variant="outline">
                                                <Plus className="w-4 h-4 mr-2" /> Ajouter une image
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* MAIN IMAGE PREVIEW */}
                                            {formData.image_url && (
                                                <div className="relative group aspect-square bg-white border border-border rounded-xl p-2 flex items-center justify-center">
                                                    <img src={formData.image_url} className="w-full h-full object-contain" alt="Main" />
                                                    <span className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded">PRINCIPALE</span>
                                                </div>
                                            )}

                                            {/* GALLERY IMAGES */}
                                            {formData.gallery_images.map((img, idx) => (
                                                <div key={idx} className="relative group aspect-square bg-white border border-border rounded-xl p-2 flex items-center justify-center">
                                                    {img ? (
                                                        <img src={img} className="w-full h-full object-contain" alt={`Galerie ${idx}`} />
                                                    ) : (
                                                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(idx)}
                                                        className="absolute top-2 right-2 p-1.5 bg-white shadow-md rounded-full text-red-500 hover:bg-red-50 border border-red-100 transition-colors"
                                                        title="Supprimer l'image"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>

                                                    <input
                                                        type="text"
                                                        value={img}
                                                        onChange={(e) => handleGalleryChange(idx, e.target.value)}
                                                        className="absolute bottom-2 left-2 right-2 text-[10px] px-2 py-1 border border-border rounded bg-white/90 backdrop-blur shadow-sm outline-none focus:border-primary"
                                                        placeholder="URL de l'image..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {formData.gallery_images.length === 0 && !formData.image_url && (
                                            <p className="text-sm text-muted-foreground italic">Aucune image. Ajoutez une URL principale ou des images de galerie.</p>
                                        )}
                                    </div>

                                    {/* NEW: RATING & REVIEW COUNT */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Note (Rating 0-5)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={formData.rating}
                                            onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2">Nombre d'avis</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.review_count}
                                            onChange={e => setFormData({ ...formData, review_count: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50 h-24 resize-none"
                                            placeholder="Courte description du produit..."
                                        />
                                    </div>
                                </div>

                                {/* SECTION 2: PROS & CONS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
                                    {/* PROS */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-green-700">
                                                <ThumbsUp className="w-5 h-5" /> On aime (Pros)
                                            </h3>
                                            <Button type="button" onClick={() => addListItem('pros')} size="sm" variant="outline">
                                                <Plus className="w-4 h-4 mr-2" /> Ajouter un point
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.pros.map((item, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-3 py-2 rounded-lg border border-green-200 bg-green-50/20 focus:ring-1 focus:ring-green-500 outline-none text-sm"
                                                        placeholder="Ex: Excellente qualité audio"
                                                        value={item}
                                                        onChange={e => handleListChange('pros', idx, e.target.value)}
                                                    />
                                                    <button type="button" onClick={() => removeListItem('pros', idx)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.pros.length === 0 && (
                                                <p className="text-center text-sm text-muted-foreground italic py-2 bg-green-50/10 rounded-lg border border-dashed border-green-200">
                                                    Aucun point fort ajouté.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* CONS */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-red-700">
                                                <ThumbsDown className="w-5 h-5" /> On aime moins (Cons)
                                            </h3>
                                            <Button type="button" onClick={() => addListItem('cons')} size="sm" variant="outline">
                                                <Plus className="w-4 h-4 mr-2" /> Ajouter un point
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.cons.map((item, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-3 py-2 rounded-lg border border-red-200 bg-red-50/20 focus:ring-1 focus:ring-red-500 outline-none text-sm"
                                                        placeholder="Ex: Prix élevé"
                                                        value={item}
                                                        onChange={e => handleListChange('cons', idx, e.target.value)}
                                                    />
                                                    <button type="button" onClick={() => removeListItem('cons', idx)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.cons.length === 0 && (
                                                <p className="text-center text-sm text-muted-foreground italic py-2 bg-red-50/10 rounded-lg border border-dashed border-red-200">
                                                    Aucun point faible ajouté.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3: OFFRES MULTI-MARCHANDS */}
                                <div className="border-t border-border pt-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold">Offres & Prix</h3>
                                        <Button type="button" onClick={addOffer} size="sm" variant="outline">
                                            <Plus className="w-4 h-4 mr-2" /> Ajouter une offre
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.offers.map((offer, index) => (
                                            <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-secondary/10 rounded-xl border border-border/50 relative group">

                                                <div className="flex-1 w-full md:w-auto">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Marchand</label>
                                                    <select
                                                        value={offer.merchant_name}
                                                        onChange={(e) => handleOfferChange(index, 'merchant_name', e.target.value)}
                                                        className="w-full px-3 py-1.5 rounded-md border border-border text-sm"
                                                    >
                                                        <option value="amazon">Amazon</option>
                                                        <option value="thomann">Thomann</option>
                                                        <option value="woodbrass">Woodbrass</option>
                                                        <option value="ldlc">LDLC</option>
                                                        <option value="bhphoto">B&H</option>
                                                        <option value="direct">Direct Marque</option>
                                                    </select>
                                                </div>

                                                <div className="w-24">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Prix (€)</label>
                                                    <input
                                                        type="number"
                                                        value={offer.price}
                                                        onChange={(e) => handleOfferChange(index, 'price', parseFloat(e.target.value))}
                                                        className="w-full px-3 py-1.5 rounded-md border border-border text-sm"
                                                    />
                                                </div>

                                                <div className="flex-[2] w-full md:w-auto">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Lien Affilié</label>
                                                    <input
                                                        type="text"
                                                        value={offer.affiliate_link}
                                                        onChange={(e) => handleOfferChange(index, 'affiliate_link', e.target.value)}
                                                        className="w-full px-3 py-1.5 rounded-md border border-border text-sm"
                                                        placeholder="https://..."
                                                    />
                                                </div>

                                                <div className="w-20 text-center">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Stock</label>
                                                    <input
                                                        type="checkbox"
                                                        checked={offer.in_stock}
                                                        onChange={(e) => handleOfferChange(index, 'in_stock', e.target.checked)}
                                                        className="w-4 h-4"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeOffer(index)}
                                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-4 md:mt-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        {formData.offers.length === 0 && (
                                            <p className="text-center text-sm text-muted-foreground italic py-4 bg-secondary/5 rounded-lg border border-dashed border-border">
                                                Aucune offre associée. Ajoutez-en une pour que le produit soit achetable.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-border">
                                    <Button type="button" variant="ghost" onClick={() => setView('list')}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={formLoading}>
                                        {formLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        Enregistrer le produit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    );
};
