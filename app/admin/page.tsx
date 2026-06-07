'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Loader2, ShieldCheck, Plus, CheckCircle, AlertTriangle, LogOut, Edit, Trash2, Save, X, Image as ImageIcon, ThumbsUp, ThumbsDown, ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { ImageUploader, GalleryUploader } from './ImageUploader';
import { Category, Product, ProductOffer, Article } from '@/types/database';

const supabase = createClient();

type ProductWithOffers = Product & {
    product_offers: ProductOffer[];
};

export default function AdminPage() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Global Dashboard State
    const [activeTab, setActiveTab] = useState<'products' | 'articles'>('products');

    // Products State
    const [view, setView] = useState<'list' | 'form'>('list');
    const [products, setProducts] = useState<ProductWithOffers[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sortByCompleteness, setSortByCompleteness] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Synchronisation des prix
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ ok: boolean; text: string } | null>(null);

    // Articles State
    const [articlesView, setArticlesView] = useState<'list' | 'form'>('list');
    const [articles, setArticles] = useState<Article[]>([]);
    const [articleSearchQuery, setArticleSearchQuery] = useState('');

    const [isEditingArticle, setIsEditingArticle] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
    const [articleFormLoading, setArticleFormLoading] = useState(false);
    const [articleFormMessage, setArticleFormMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const initialArticleFormData: Partial<Article> = {
        title: '',
        slug: '',
        category: 'Audio',
        read_time: '5 min',
        author: 'Équipe Fluxlab',
        published_at: '',
        hero_image_url: '',
        intro_text: '',
        is_published: false,
        product_blocks: [],
        sidebar_product_ids: [],
        content_sections: [],
        faq_items: [],
        related_products: []
    };
    const [articleFormData, setArticleFormData] = useState<Partial<Article>>(initialArticleFormData);


    const filteredProducts = products.filter(p => {
        if (selectedCategory && p.category_id !== selectedCategory) return false;
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            p.name.toLowerCase().includes(query) ||
            p.slug.toLowerCase().includes(query) ||
            (p.brand || '').toLowerCase().includes(query)
        );
    });

    const calculateCompleteness = (product: ProductWithOffers): number => {
        let score = 0;
        const hasMainImage = product.image_url && !product.image_url.includes('unsplash') && !product.image_url.includes('placeholder');
        if (hasMainImage) score += 10;
        const galleryCount = (product.gallery_images || []).filter(img => img).length;
        if (galleryCount >= 3 && galleryCount <= 6) score += 15;
        else if (galleryCount >= 1 && galleryCount <= 2) score += 8;
        else if (galleryCount > 6) score += 10;
        const desc = (product.description || '').toLowerCase();
        if (desc.length > 50) score += 5;
        if (desc.length >= 150 && desc.length <= 600) score += 10;
        else if (desc.length > 600) score += 5;
        if (desc.includes('\n')) score += 5;
        const qualityKeywords = ['qualité', 'audio', 'son', 'micro', 'xlr', 'usb', 'streaming', 'podcast', 'studio', 'enregistrement', 'dynamique', 'condensateur'];
        if (qualityKeywords.some(kw => desc.includes(kw))) score += 5;
        const badPatterns = ['lorem', 'à compléter', 'description du produit', 'texte ici', 'placeholder'];
        if (badPatterns.some(bp => desc.includes(bp))) score -= 10;
        const offers = product.product_offers || [];
        if (offers.length >= 1) score += 10;
        if (offers.length >= 2) score += 5;
        if (offers.some(o => o.price > 0)) score += 5;
        if (product.pros && product.pros.length >= 2) score += 8;
        if (product.cons && product.cons.length >= 1) score += 7;
        return Math.max(0, Math.min(100, score));
    };

    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const initialFormData = {
        name: '', slug: '', brand: '', category_id: '', description: '', image_url: '', is_active: true, rating: 5, review_count: 0, pros: [] as string[], cons: [] as string[], gallery_images: [] as string[], offers: [] as { merchant_name: string; price: number; affiliate_link: string; in_stock: boolean }[]
    };
    const [formData, setFormData] = useState(initialFormData);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(false);

    useEffect(() => { checkSession(); }, []);
    useEffect(() => { if (session) { fetchCategories(); fetchProducts(); fetchArticles(); } }, [session, refreshTrigger]);

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
        const { data, error } = await supabase.from('products').select(`*, product_offers (*)`).order('created_at', { ascending: false });
        if (error) console.error("Error fetching products:", error);
        else {
            let sortedData = data as ProductWithOffers[];
            if (sortByCompleteness) sortedData = sortedData.sort((a, b) => calculateCompleteness(a) - calculateCompleteness(b));
            setProducts(sortedData);
        }
    };

    const fetchArticles = async () => {
        const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (error) console.error("Error fetching articles:", error);
        else {
            setArticles(data as Article[]);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true); setAuthError(null);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAuthError(error.message); else setSession(data.session);
        setAuthLoading(false);
    };

    const handleLogout = async () => { await supabase.auth.signOut(); setSession(null); };

    // Déclenche la mise à jour des prix (tout le catalogue, ou un seul produit)
    const handleSyncPrices = async (productId?: string) => {
        setSyncing(true);
        setSyncResult(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error('Session expirée, reconnectez-vous.');

            const url = productId
                ? `/api/cron/update-prices?productId=${productId}`
                : '/api/cron/update-prices';
            const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();

            if (!res.ok || !data.ok) throw new Error(data.error || `Erreur HTTP ${res.status}`);

            const txt = `${data.updated} mis à jour · ${data.unchanged} inchangés · ${data.failed} échecs · ${data.skippedFresh} récents (ignorés) · ${data.skippedLocked} verrouillés · ${data.scrapingCalls} appels scraping (sur ${data.total} offres)`;
            setSyncResult({ ok: true, text: txt });
            if (data.updated > 0) setRefreshTrigger(p => p + 1);
        } catch (err: any) {
            setSyncResult({ ok: false, text: err.message || 'Erreur de synchronisation.' });
        } finally {
            setSyncing(false);
        }
    };

    const handleCreateNew = () => { setFormData(initialFormData); setIsEditing(false); setCurrentId(null); setFormMessage(null); setView('form'); };

    const handleEdit = (product: ProductWithOffers) => {
        setFormData({
            name: product.name, slug: product.slug, brand: product.brand || '', category_id: product.category_id || '', description: product.description || '', image_url: product.image_url || '', is_active: product.is_active || true, rating: product.rating || 5, review_count: (product as any).review_count ?? (product as any).reviews ?? 0, pros: product.pros || [], cons: product.cons || [], gallery_images: product.gallery_images || [], offers: product.product_offers.map(o => ({ merchant_name: o.merchant_name, price: o.price, affiliate_link: o.affiliate_link || '', in_stock: o.in_stock ?? true }))
        });
        setIsEditing(true); setCurrentId(product.id); setFormMessage(null); setView('form');
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ? \nCette action est irréversible.`)) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) alert("Erreur lors de la suppression : " + error.message); else setRefreshTrigger(prev => prev + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setFormLoading(true); setFormMessage(null);
        try {
            let productId = currentId;
            const productPayload = { name: formData.name, slug: formData.slug, brand: formData.brand, category_id: formData.category_id, description: formData.description, image_url: formData.image_url, is_active: formData.is_active, rating: formData.rating, review_count: formData.review_count, pros: formData.pros, cons: formData.cons, gallery_images: formData.gallery_images };
            if (isEditing && productId) {
                const { error: prodError } = await (supabase.from('products') as any).update(productPayload).eq('id', productId);
                if (prodError) throw prodError;
                await supabase.from('product_offers').delete().eq('product_id', productId);
            } else {
                const { data: newProduct, error: prodError } = await (supabase.from('products') as any).insert(productPayload).select().single();
                if (prodError || !newProduct) throw prodError || new Error("Failed to create product");
                productId = newProduct.id;
            }
            if (formData.offers.length > 0 && productId) {
                const offersPayload = formData.offers.map(offer => ({ product_id: productId, merchant_name: offer.merchant_name, price: offer.price, affiliate_link: offer.affiliate_link, in_stock: offer.in_stock, currency: 'EUR' }));
                const { error: offersError } = await supabase.from('product_offers').insert(offersPayload as any);
                if (offersError) throw offersError;
            }
            setFormMessage({ type: 'success', text: isEditing ? "Produit mis à jour avec succès !" : "Produit créé avec succès !" });
            if (!isEditing) { setFormData(initialFormData); setTimeout(() => setView('list'), 1500); setRefreshTrigger(prev => prev + 1); } else setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            console.error("Save error:", error); setFormMessage({ type: 'error', text: error.message || "Une erreur est survenue." });
        } finally { setFormLoading(false); }
    };

    const handleOfferChange = (index: number, field: string, value: any) => { const newOffers: any = [...formData.offers]; newOffers[index][field] = value; setFormData({ ...formData, offers: newOffers }); };
    const addOffer = () => setFormData({ ...formData, offers: [...formData.offers, { merchant_name: 'amazon', price: 0, affiliate_link: '', in_stock: true }] });
    const removeOffer = (index: number) => setFormData({ ...formData, offers: formData.offers.filter((_, i) => i !== index) });
    const handleListChange = (type: 'pros' | 'cons', index: number, value: string) => { const newList = [...formData[type]]; newList[index] = value; setFormData({ ...formData, [type]: newList }); };
    const addListItem = (type: 'pros' | 'cons') => setFormData({ ...formData, [type]: [...formData[type], ''] });
    const removeListItem = (type: 'pros' | 'cons', index: number) => { const newList = [...formData[type]]; newList.splice(index, 1); setFormData({ ...formData, [type]: newList }); };
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        if (!isEditing) { const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); setFormData(prev => ({ ...prev, name, slug })); } else setFormData(prev => ({ ...prev, name }));
    };

    // --- ARTICLE HANDLERS ---
    const handleCreateArticle = () => {
        setArticleFormData(initialArticleFormData);
        setIsEditingArticle(false);
        setCurrentArticleId(null);
        setArticleFormMessage(null);
        setArticlesView('form');
    };

    const handleEditArticle = (article: Article) => {
        setArticleFormData({
            title: article.title || '',
            slug: article.slug || '',
            category: article.category || 'Audio',
            read_time: article.read_time || '5 min',
            author: article.author || 'Équipe Fluxlab',
            published_at: article.published_at || '',
            hero_image_url: article.hero_image_url || '',
            intro_text: article.intro_text || '',
            is_published: article.is_published || false,
            product_blocks: article.product_blocks || [],
            sidebar_product_ids: article.sidebar_product_ids || [],
            content_sections: article.content_sections || [],
            faq_items: article.faq_items || [],
            related_products: article.related_products || []
        });
        setIsEditingArticle(true);
        setCurrentArticleId(article.id);
        setArticleFormMessage(null);
        setArticlesView('form');
    };

    // -- Product Blocks Handlers --
    const addArticleProductBlock = () => {
        setArticleFormData(prev => ({
            ...prev,
            product_blocks: [...(prev.product_blocks || []), { product_slug: '', badge: '', title: '', subtitle: '', image_url: '', description: '', pros_title: 'Points Forts', pros: [], cons_title: 'Limites', cons: [], usage_tip: '', affiliate_links: [] }]
        }));
    };
    const removeArticleProductBlock = (index: number) => {
        setArticleFormData(prev => ({ ...prev, product_blocks: (prev.product_blocks || []).filter((_, i) => i !== index) }));
    };
    const updateArticleProductBlock = (index: number, field: string, value: any) => {
        setArticleFormData(prev => {
            const newBlocks: any = [...(prev.product_blocks || [])];
            newBlocks[index][field] = value;
            return { ...prev, product_blocks: newBlocks };
        });
    };
    const addArticleProductBlockAffiliateLink = (blockIndex: number) => {
        setArticleFormData(prev => {
            const newBlocks: any = [...(prev.product_blocks || [])];
            newBlocks[blockIndex].affiliate_links.push({ merchant: 'amazon', url: '', label: 'Amazon' });
            return { ...prev, product_blocks: newBlocks };
        });
    };
    const updateArticleProductBlockAffiliateLink = (blockIndex: number, linkIndex: number, field: string, value: any) => {
        setArticleFormData(prev => {
            const newBlocks: any = [...(prev.product_blocks || [])];
            newBlocks[blockIndex].affiliate_links[linkIndex][field] = value;
            return { ...prev, product_blocks: newBlocks };
        });
    };
    const removeArticleProductBlockAffiliateLink = (blockIndex: number, linkIndex: number) => {
        setArticleFormData(prev => {
            const newBlocks: any = [...(prev.product_blocks || [])];
            newBlocks[blockIndex].affiliate_links.splice(linkIndex, 1);
            return { ...prev, product_blocks: newBlocks };
        });
    };
    const handleArticleProductBlockListChange = (blockIndex: number, type: 'pros' | 'cons', listIndex: number, value: string) => {
        setArticleFormData(prev => {
            const newBlocks: any = [...(prev.product_blocks || [])];
            if (!newBlocks[blockIndex][type]) newBlocks[blockIndex][type] = [];
            newBlocks[blockIndex][type][listIndex] = value;
            return { ...prev, product_blocks: newBlocks };
        });
    };
    const addArticleProductBlockListItem = (blockIndex: number, type: 'pros' | 'cons') => {
        setArticleFormData(prev => {
            const newBlocks: any = [...(prev.product_blocks || [])];
            if (!newBlocks[blockIndex][type]) newBlocks[blockIndex][type] = [];
            newBlocks[blockIndex][type].push('');
            return { ...prev, product_blocks: newBlocks };
        });
    };
    const removeArticleProductBlockListItem = (blockIndex: number, type: 'pros' | 'cons', listIndex: number) => {
        setArticleFormData(prev => {
            const newBlocks: any = [...(prev.product_blocks || [])];
            newBlocks[blockIndex][type].splice(listIndex, 1);
            return { ...prev, product_blocks: newBlocks };
        });
    };

    // -- Comparison Table Handlers --
    const initArticleComparisonTable = () => {
        setArticleFormData(prev => ({ ...prev, comparison_table: { headers: ['Critère', 'Choix 1', 'Choix 2'], rows: [{ cells: ['Budget', '-', '-'], highlight: false }] } }));
    };
    const removeArticleComparisonTable = () => {
        setArticleFormData(prev => ({ ...prev, comparison_table: null }));
    };
    const updateArticleComparisonTable = (type: 'header' | 'cell', rowIndex: number, colIndex: number, value: string) => {
        setArticleFormData(prev => {
            if (!prev.comparison_table) return prev;
            const newTable = JSON.parse(JSON.stringify(prev.comparison_table));
            if (type === 'header') newTable.headers[colIndex] = value;
            else newTable.rows[rowIndex].cells[colIndex] = value;
            return { ...prev, comparison_table: newTable };
        });
    };
    const updateArticleComparisonTableRowHighlight = (rowIndex: number, value: boolean) => {
        setArticleFormData(prev => {
            if (!prev.comparison_table) return prev;
            const newTable = JSON.parse(JSON.stringify(prev.comparison_table));
            newTable.rows[rowIndex].highlight = value;
            return { ...prev, comparison_table: newTable };
        });
    }
    const addArticleComparisonTableRow = () => {
        setArticleFormData(prev => {
            if (!prev.comparison_table) return prev;
            const newTable = JSON.parse(JSON.stringify(prev.comparison_table));
            newTable.rows.push({ cells: new Array(newTable.headers.length).fill(''), highlight: false });
            return { ...prev, comparison_table: newTable };
        });
    };
    const removeArticleComparisonTableRow = (rowIndex: number) => {
        setArticleFormData(prev => {
            if (!prev.comparison_table) return prev;
            const newTable = JSON.parse(JSON.stringify(prev.comparison_table));
            newTable.rows.splice(rowIndex, 1);
            return { ...prev, comparison_table: newTable };
        });
    };
    const addArticleComparisonTableCol = () => {
        setArticleFormData(prev => {
            if (!prev.comparison_table) return prev;
            const newTable = JSON.parse(JSON.stringify(prev.comparison_table));
            newTable.headers.push('Nouv. Colonne');
            newTable.rows.forEach((r: any) => r.cells.push(''));
            return { ...prev, comparison_table: newTable };
        });
    };
    const removeArticleComparisonTableCol = (colIndex: number) => {
        setArticleFormData(prev => {
            if (!prev.comparison_table) return prev;
            const newTable = JSON.parse(JSON.stringify(prev.comparison_table));
            newTable.headers.splice(colIndex, 1);
            newTable.rows.forEach((r: any) => r.cells.splice(colIndex, 1));
            return { ...prev, comparison_table: newTable };
        });
    };

    // -- Other Blocks Handlers --
    const addArticleContentSection = () => {
        setArticleFormData(prev => ({ ...prev, content_sections: [...(prev.content_sections || []), { order: (prev.content_sections || []).length + 1, title: '', html: '' }] }));
    };
    const updateArticleContentSection = (index: number, field: string, value: any) => {
        setArticleFormData(prev => {
            const newSections: any = [...(prev.content_sections || [])];
            newSections[index][field] = value;
            return { ...prev, content_sections: newSections };
        });
    };
    const removeArticleContentSection = (index: number) => {
        setArticleFormData(prev => ({ ...prev, content_sections: (prev.content_sections || []).filter((_, i) => i !== index) }));
    };

    const addArticleFaqItem = () => {
        setArticleFormData(prev => ({ ...prev, faq_items: [...(prev.faq_items || []), { question: '', answer: '' }] }));
    };
    const updateArticleFaqItem = (index: number, field: string, value: any) => {
        setArticleFormData(prev => {
            const newItems: any = [...(prev.faq_items || [])];
            newItems[index][field] = value;
            return { ...prev, faq_items: newItems };
        });
    };
    const removeArticleFaqItem = (index: number) => {
        setArticleFormData(prev => ({ ...prev, faq_items: (prev.faq_items || []).filter((_, i) => i !== index) }));
    };

    const handleDeleteArticle = async (id: string, title: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'article "${title}" ? \nCette action est irréversible.`)) return;
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) alert("Erreur lors de la suppression : " + error.message);
        else setRefreshTrigger(prev => prev + 1);
    };

    const handleArticleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setArticleFormLoading(true);
        setArticleFormMessage(null);
        try {
            const payload = { ...articleFormData };
            if (!payload.slug) {
                payload.slug = (payload.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            if (isEditingArticle && currentArticleId) {
                const { error } = await supabase.from('articles').update(payload).eq('id', currentArticleId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('articles').insert(payload);
                if (error) throw error;
            }
            setArticleFormMessage({ type: 'success', text: isEditingArticle ? "Article mis à jour avec succès !" : "Article créé avec succès !" });
            if (!isEditingArticle) {
                setArticleFormData(initialArticleFormData);
                setTimeout(() => setArticlesView('list'), 1500);
            }
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            console.error("Save article error:", error);
            setArticleFormMessage({ type: 'error', text: error.message || "Une erreur est survenue." });
        } finally {
            setArticleFormLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    if (!session) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-border">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2">Administration</h1>
                    <p className="text-muted-foreground text-center mb-8">Connectez-vous pour gérer le catalogue.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {authError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex gap-2"><AlertTriangle className="w-4 h-4" /> {authError}</div>}
                        <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                        <div><label className="block text-sm font-medium mb-1">Mot de passe</label><input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center" disabled={authLoading}>
                            {authLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Se connecter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <main className="flex-1 container mx-auto px-6 py-24 max-w-[1400px]">
                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b border-border">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`text-lg font-bold pb-4 border-b-2 transition-colors ${activeTab === 'products' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Catalogue Produits
                    </button>
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`text-lg font-bold pb-4 border-b-2 transition-colors ${activeTab === 'articles' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Guides & Articles
                    </button>
                </div>

                {activeTab === 'products' ? (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold font-serif">
                                    {view === 'form' ? (
                                        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 hover:text-primary transition-colors"><ArrowLeft className="w-6 h-6" /><span>Retour</span></button>
                                    ) : 'Tableau de Bord Produits'}
                                </h1>
                                <p className="text-muted-foreground">
                                    {view === 'form' ? (isEditing ? `Modification de "${formData.name}"` : 'Création d\'un nouveau produit') : `${products.length} produits • ${products.filter(p => calculateCompleteness(p) < 70).length} à compléter`}
                                </p>
                            </div>
                            <div className="flex gap-3 items-center">
                                {view === 'list' && (
                                    <>
                                        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-4 py-2 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 outline-none text-sm min-w-[200px]">
                                            <option value="">Toutes les catégories</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name} ({products.filter(p => p.category_id === cat.id).length})</option>)}
                                        </select>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input type="text" placeholder="Rechercher un produit..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-64 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                                            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
                                        </div>
                                        <button onClick={() => handleSyncPrices()} disabled={syncing} className="border border-border bg-white hover:bg-neutral-50 text-foreground font-bold px-4 py-2 rounded-md transition-colors flex items-center disabled:opacity-50" title="Met à jour les prix de tout le catalogue">
                                            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Synchro…' : 'Synchroniser les prix'}
                                        </button>
                                        <button onClick={handleCreateNew} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-4 py-2 rounded-md transition-colors flex items-center">
                                            <Plus className="w-4 h-4 mr-2" /> Nouveau
                                        </button>
                                    </>
                                )}
                                {view === 'form' && (
                                    <button onClick={() => setView('list')} className="border border-border bg-white hover:bg-neutral-50 font-bold px-4 py-2 rounded-md transition-colors flex items-center">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
                                    </button>
                                )}
                                <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"><LogOut className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {syncResult && view === 'list' && (
                            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${syncResult.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                {syncResult.ok ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                {syncResult.text}
                                <button onClick={() => setSyncResult(null)} className="ml-auto text-current/60 hover:text-current"><X className="w-4 h-4" /></button>
                            </div>
                        )}

                        {view === 'list' ? (
                            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary/30 border-b border-border">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Image</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Produit</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Marque</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary" onClick={() => { setSortByCompleteness(!sortByCompleteness); setRefreshTrigger(r => r + 1); }}>Score {sortByCompleteness ? '↑' : '↓'}</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Offres</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredProducts.map((product) => (
                                                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap"><div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden p-1">{product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-contain" /> : <ImageIcon className="w-4 h-4 text-muted-foreground" />}</div></td>
                                                    <td className="px-6 py-4"><div className="font-bold text-foreground">{product.name}</div><div className="text-xs text-muted-foreground font-mono">{product.slug}</div></td>
                                                    <td className="px-6 py-4 text-sm text-foreground">{product.brand}</td>
                                                    <td className="px-6 py-4"><div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${calculateCompleteness(product) >= 70 ? 'bg-green-100 text-green-700' : calculateCompleteness(product) >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{calculateCompleteness(product)}%</div></td>
                                                    <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{product.product_offers.map((offer, idx) => (<span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-secondary border border-border font-medium">{offer.merchant_name}</span>))}{product.product_offers.length === 0 && <span className="text-xs text-muted-foreground italic">Aucune offre</span>}</div></td>
                                                    <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(product)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(product.id, product.name)} className="p-2 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button></div></td>
                                                </tr>
                                            ))}
                                            {filteredProducts.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">{searchQuery ? `Aucun produit trouvé pour "${searchQuery}"` : 'Aucun produit. Commencez par en ajouter un !'}</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
                                    <div className="mb-8 pb-4 border-b border-border flex justify-between items-center">
                                        <h2 className="text-xl font-bold flex items-center gap-2">{isEditing ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}{isEditing ? `Modifier "${formData.name}"` : "Nouveau Produit"}</h2>
                                        {formMessage && <div className={`text-sm font-bold flex items-center gap-2 ${formMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{formMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}{formMessage.text}</div>}
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-2"><label className="block text-sm font-bold mb-2">Nom du produit <span className="text-red-500">*</span></label><input type="text" required value={formData.name} onChange={handleNameChange} className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" /></div>
                                            <div><label className="block text-sm font-bold mb-2">Slug (URL) <span className="text-red-500">*</span></label><input type="text" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border font-mono text-sm bg-neutral-50" /></div>
                                            <div><label className="block text-sm font-bold mb-2">Marque</label><input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50" /></div>
                                            <div><label className="block text-sm font-bold mb-2">Catégorie <span className="text-red-500">*</span></label><select required value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50"><option value="">Sélectionner...</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
                                            <div className="col-span-2 space-y-3"><label className="block text-sm font-bold">Images du Produit</label><GalleryUploader images={formData.image_url ? [formData.image_url, ...formData.gallery_images.filter(img => img !== formData.image_url)] : formData.gallery_images} onChange={(images) => { const mainImage = images[0] || ''; const galleryImages = images.slice(1); setFormData({ ...formData, image_url: mainImage, gallery_images: galleryImages }); }} productSlug={formData.slug || 'new-product'} maxImages={10} onSetAsMain={(url) => setFormData({ ...formData, image_url: url })} /></div>
                                            <div><label className="block text-sm font-bold mb-2">Note (Rating 0-5)</label><input type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50" /></div>
                                            <div><label className="block text-sm font-bold mb-2">Nombre d'avis</label><input type="number" min="0" value={formData.review_count} onChange={e => setFormData({ ...formData, review_count: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50" /></div>
                                            <div className="col-span-2"><label className="block text-sm font-bold mb-2">Description</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border bg-neutral-50/50 h-24 resize-none" /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
                                            <div>
                                                <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2 text-green-700"><ThumbsUp className="w-5 h-5" /> On aime (Pros)</h3><button type="button" onClick={() => addListItem('pros')} className="text-sm border border-border px-3 py-1.5 rounded-md flex items-center"><Plus className="w-4 h-4 mr-1" /> Ajouter</button></div>
                                                <div className="space-y-3">{formData.pros.map((item, idx) => (<div key={idx} className="flex gap-2 items-center"><input type="text" className="flex-1 px-3 py-2 rounded-lg border border-green-200 bg-green-50/20 focus:ring-1 focus:ring-green-500 outline-none text-sm" value={item} onChange={e => handleListChange('pros', idx, e.target.value)} /><button type="button" onClick={() => removeListItem('pros', idx)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></div>))}{formData.pros.length === 0 && <p className="text-center text-sm text-muted-foreground italic py-2 bg-green-50/10 rounded-lg border border-dashed border-green-200">Aucun point fort ajouté.</p>}</div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2 text-red-700"><ThumbsDown className="w-5 h-5" /> On aime moins (Cons)</h3><button type="button" onClick={() => addListItem('cons')} className="text-sm border border-border px-3 py-1.5 rounded-md flex items-center"><Plus className="w-4 h-4 mr-1" /> Ajouter</button></div>
                                                <div className="space-y-3">{formData.cons.map((item, idx) => (<div key={idx} className="flex gap-2 items-center"><input type="text" className="flex-1 px-3 py-2 rounded-lg border border-red-200 bg-red-50/20 focus:ring-1 focus:ring-red-500 outline-none text-sm" value={item} onChange={e => handleListChange('cons', idx, e.target.value)} /><button type="button" onClick={() => removeListItem('cons', idx)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></div>))}{formData.cons.length === 0 && <p className="text-center text-sm text-muted-foreground italic py-2 bg-red-50/10 rounded-lg border border-dashed border-red-200">Aucun point faible ajouté.</p>}</div>
                                            </div>
                                        </div>
                                        <div className="border-t border-border pt-8">
                                            <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold">Offres & Prix</h3><button type="button" onClick={addOffer} className="text-sm border border-border px-3 py-1.5 rounded-md flex items-center"><Plus className="w-4 h-4 mr-1" /> Ajouter une offre</button></div>
                                            <div className="space-y-4">
                                                {formData.offers.map((offer, index) => (
                                                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-secondary/10 rounded-xl border border-border/50 relative group">
                                                        <div className="flex-1 w-full md:w-auto"><label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Marchand</label><select value={offer.merchant_name} onChange={(e) => handleOfferChange(index, 'merchant_name', e.target.value)} className="w-full px-3 py-1.5 rounded-md border border-border text-sm"><option value="amazon">Amazon</option><option value="thomann">Thomann</option><option value="woodbrass">Woodbrass</option><option value="ldlc">LDLC</option><option value="bhphoto">B&H</option><option value="direct">Direct Marque</option></select></div>
                                                        <div className="w-28"><label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Prix (€)</label><input type="number" step="0.01" min="0" value={offer.price || ''} onChange={(e) => handleOfferChange(index, 'price', parseFloat(e.target.value) || 0)} className="w-full px-3 py-1.5 rounded-md border border-border text-sm" /></div>
                                                        <div className="flex-[2] w-full md:w-auto"><label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Lien Affilié</label><input type="text" value={offer.affiliate_link} onChange={(e) => handleOfferChange(index, 'affiliate_link', e.target.value)} className="w-full px-3 py-1.5 rounded-md border border-border text-sm" /></div>
                                                        <div className="w-20 text-center"><label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Stock</label><input type="checkbox" checked={offer.in_stock} onChange={(e) => handleOfferChange(index, 'in_stock', e.target.checked)} className="w-4 h-4" /></div>
                                                        <button type="button" onClick={() => removeOffer(index)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-4 md:mt-0"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
                                                {formData.offers.length === 0 && <p className="text-center text-sm text-muted-foreground italic py-4 bg-secondary/5 rounded-lg border border-dashed border-border">Aucune offre associée. Ajoutez-en une pour que le produit soit achetable.</p>}
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-4 pt-4 border-t border-border">
                                            <button type="button" onClick={() => setView('list')} className="text-muted-foreground hover:text-foreground font-bold px-4 py-2 rounded-md transition-colors">Annuler</button>
                                            <button type="submit" disabled={formLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-md transition-colors flex items-center">
                                                {formLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} Enregistrer le produit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    // ARTICLES VIEW
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold font-serif">
                                    {articlesView === 'form' ? (
                                        <button onClick={() => setArticlesView('list')} className="inline-flex items-center gap-2 hover:text-primary transition-colors"><ArrowLeft className="w-6 h-6" /><span>Retour</span></button>
                                    ) : 'Guides & Articles'}
                                </h1>
                                <p className="text-muted-foreground">
                                    {articlesView === 'form' ? 'Édition d\'un article' : `${articles.length} articles au total`}
                                </p>
                            </div>
                            <div className="flex gap-3 items-center">
                                {articlesView === 'list' && (
                                    <>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input type="text" placeholder="Rechercher un article..." value={articleSearchQuery} onChange={e => setArticleSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-64 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                                            {articleSearchQuery && <button onClick={() => setArticleSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
                                        </div>
                                    </>
                                )}
                                {articlesView === 'form' && (
                                    <button onClick={() => setArticlesView('list')} className="border border-border bg-white hover:bg-neutral-50 font-bold px-4 py-2 rounded-md transition-colors flex items-center">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
                                    </button>
                                )}
                                <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"><LogOut className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {articlesView === 'list' ? (
                            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary/30 border-b border-border">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Article</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Catégorie</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Statut</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {articles.filter(a => !articleSearchQuery || a.title.toLowerCase().includes(articleSearchQuery.toLowerCase())).map((article) => (
                                                <tr key={article.id} className="hover:bg-neutral-50 transition-colors">
                                                    <td className="px-6 py-4"><div className="font-bold text-foreground">{article.title}</div><div className="text-xs text-muted-foreground font-mono">{article.slug}</div></td>
                                                    <td className="px-6 py-4 text-sm text-foreground">{article.category}</td>
                                                    <td className="px-6 py-4 text-sm text-foreground">{article.published_at || 'Brouillon'}</td>
                                                    <td className="px-6 py-4"><div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${article.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{article.is_published ? 'Publié' : 'Brouillon'}</div></td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleEditArticle(article)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDeleteArticle(article.id, article.title)} className="p-2 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {articles.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">Aucun article trouvé.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-8 max-w-5xl mx-auto">
                                <div className="mb-8 pb-4 border-b border-border flex justify-between items-center">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        {isEditingArticle ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                                        {isEditingArticle ? `Modifier "${articleFormData.title}"` : "Nouvel Article"}
                                    </h2>
                                    {articleFormMessage && (
                                        <div className={`text-sm font-bold flex items-center gap-2 ${articleFormMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                            {articleFormMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            {articleFormMessage.text}
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleArticleSubmit} className="space-y-8">
                                    {/* SECTION 1: Informations Générales */}
                                    <div className="bg-neutral-50 p-6 rounded-xl border border-border">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">1. Informations Générales</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-bold mb-2">Titre de l'article <span className="text-red-500">*</span></label>
                                                <input type="text" required value={articleFormData.title} onChange={e => {
                                                    const title = e.target.value;
                                                    if (!isEditingArticle) {
                                                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                                        setArticleFormData(prev => ({ ...prev, title, slug }));
                                                    } else {
                                                        setArticleFormData(prev => ({ ...prev, title }));
                                                    }
                                                }} className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ex: Les 5 meilleures interfaces audio en 2026..." />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Slug (URL) <span className="text-red-500">*</span></label>
                                                <input type="text" required value={articleFormData.slug} onChange={e => setArticleFormData({ ...articleFormData, slug: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border font-mono text-sm bg-white" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Catégorie <span className="text-red-500">*</span></label>
                                                <select required value={articleFormData.category} onChange={e => setArticleFormData({ ...articleFormData, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border bg-white">
                                                    <option value="Audio">Audio</option>
                                                    <option value="Vidéo">Vidéo</option>
                                                    <option value="Streaming">Streaming</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Temps de lecture</label>
                                                <input type="text" value={articleFormData.read_time || ''} onChange={e => setArticleFormData({ ...articleFormData, read_time: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border bg-white" placeholder="Ex: 8 min" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Statut de publication</label>
                                                <div className="flex items-center gap-3 h-10">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" checked={articleFormData.is_published} onChange={e => setArticleFormData({ ...articleFormData, is_published: e.target.checked })} />
                                                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                        <span className="ml-3 text-sm font-medium">{articleFormData.is_published ? 'Publié' : 'Brouillon'}</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-bold mb-2">Image Hero (URL)</label>
                                                <div className="flex gap-4 items-start">
                                                    <div className="flex-1">
                                                        <input type="text" value={articleFormData.hero_image_url || ''} onChange={e => setArticleFormData({ ...articleFormData, hero_image_url: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border bg-white mb-2" placeholder="https://..." />
                                                        <p className="text-xs text-muted-foreground">URL de l'image d'en-tête de l'article.</p>
                                                    </div>
                                                    <div className="w-32 h-20 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden">
                                                        {articleFormData.hero_image_url ? <img src={articleFormData.hero_image_url} alt="Hero" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-muted-foreground" />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-bold mb-2">Introduction (Texte Riche / HTML)</label>
                                                <textarea value={articleFormData.intro_text || ''} onChange={e => setArticleFormData({ ...articleFormData, intro_text: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border bg-white h-32 font-mono text-sm" placeholder="<p>Bienvenue dans ce guide complet...</p>" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 2: Blocs Produits */}
                                    <div className="bg-neutral-50 p-6 rounded-xl border border-border">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary">2. Blocs Produits (Affiliation)</h3>
                                            <button type="button" onClick={addArticleProductBlock} className="text-sm bg-white border border-border px-3 py-1.5 rounded-md flex items-center shadow-sm hover:bg-neutral-100 transition-colors">
                                                <Plus className="w-4 h-4 mr-1" /> Ajouter un produit
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {(articleFormData.product_blocks || []).map((block, index) => (
                                                <div key={index} className="bg-white p-6 rounded-lg border border-border/50 shadow-sm relative">
                                                    <button type="button" onClick={() => removeArticleProductBlock(index)} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    <h4 className="font-bold mb-4">Produit #{index + 1} {block.title && `- ${block.title}`}</h4>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                        <div><label className="block text-xs font-bold mb-1">Slug du Produit (Optionnel)</label><input type="text" value={block.product_slug} onChange={e => updateArticleProductBlock(index, 'product_slug', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border text-sm" placeholder="Ex: focusrite-scarlett-solo" /></div>
                                                        <div><label className="block text-xs font-bold mb-1">Badge</label><input type="text" value={block.badge} onChange={e => updateArticleProductBlock(index, 'badge', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border text-sm" placeholder="Ex: #1 : Le Choix de la Rédac" /></div>
                                                        <div className="col-span-2 md:col-span-1"><label className="block text-xs font-bold mb-1">Titre</label><input type="text" value={block.title} onChange={e => updateArticleProductBlock(index, 'title', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border text-sm" /></div>
                                                        <div className="col-span-2 md:col-span-1"><label className="block text-xs font-bold mb-1">Sous-titre / Court Avis</label><input type="text" value={block.subtitle} onChange={e => updateArticleProductBlock(index, 'subtitle', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border text-sm" /></div>
                                                        <div className="col-span-2"><label className="block text-xs font-bold mb-1">Image URL</label><input type="text" value={block.image_url} onChange={e => updateArticleProductBlock(index, 'image_url', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border text-sm" /></div>
                                                        <div className="col-span-2"><label className="block text-xs font-bold mb-1">Description</label><textarea value={block.description} onChange={e => updateArticleProductBlock(index, 'description', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border text-sm h-20" /></div>
                                                        <div className="col-span-2"><label className="block text-xs font-bold mb-1">Conseil d'utilisation / Pour qui ?</label><input type="text" value={block.usage_tip} onChange={e => updateArticleProductBlock(index, 'usage_tip', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border text-sm" /></div>

                                                        {/* Pros & Cons */}
                                                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                            <div>
                                                                <div className="flex justify-between items-center mb-2"><h5 className="text-sm font-bold flex items-center gap-1 text-green-700"><ThumbsUp className="w-4 h-4" /> <input type="text" value={block.pros_title || 'Points Forts'} onChange={e => updateArticleProductBlock(index, 'pros_title', e.target.value)} className="bg-transparent border-b border-dashed border-green-300 focus:border-green-500 outline-none w-24 text-sm" /></h5><button type="button" onClick={() => addArticleProductBlockListItem(index, 'pros')} className="text-xs border border-green-200 px-2 py-1 rounded flex items-center hover:bg-green-50"><Plus className="w-3 h-3 mr-1" /> Ajouter</button></div>
                                                                <div className="space-y-2">{(block.pros || []).map((item, idx) => (<div key={idx} className="flex gap-1 items-center"><input type="text" className="flex-1 px-2 py-1 rounded border border-green-200 bg-green-50/20 text-sm" value={item} onChange={e => handleArticleProductBlockListChange(index, 'pros', idx, e.target.value)} /><button type="button" onClick={() => removeArticleProductBlockListItem(index, 'pros', idx)} className="p-1 text-muted-foreground hover:text-red-500 rounded"><Trash2 className="w-3 h-3" /></button></div>))}{(block.pros || []).length === 0 && <p className="text-xs text-muted-foreground italic">Aucun point fort.</p>}</div>
                                                            </div>
                                                            <div>
                                                                <div className="flex justify-between items-center mb-2"><h5 className="text-sm font-bold flex items-center gap-1 text-red-700"><ThumbsDown className="w-4 h-4" /> <input type="text" value={block.cons_title || 'Limites'} onChange={e => updateArticleProductBlock(index, 'cons_title', e.target.value)} className="bg-transparent border-b border-dashed border-red-300 focus:border-red-500 outline-none w-24 text-sm" /></h5><button type="button" onClick={() => addArticleProductBlockListItem(index, 'cons')} className="text-xs border border-red-200 px-2 py-1 rounded flex items-center hover:bg-red-50"><Plus className="w-3 h-3 mr-1" /> Ajouter</button></div>
                                                                <div className="space-y-2">{(block.cons || []).map((item, idx) => (<div key={idx} className="flex gap-1 items-center"><input type="text" className="flex-1 px-2 py-1 rounded border border-red-200 bg-red-50/20 text-sm" value={item} onChange={e => handleArticleProductBlockListChange(index, 'cons', idx, e.target.value)} /><button type="button" onClick={() => removeArticleProductBlockListItem(index, 'cons', idx)} className="p-1 text-muted-foreground hover:text-red-500 rounded"><Trash2 className="w-3 h-3" /></button></div>))}{(block.cons || []).length === 0 && <p className="text-xs text-muted-foreground italic">Aucun point faible.</p>}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-border pt-4 mt-2">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <div className="flex items-center gap-4">
                                                                <label className="block text-sm font-bold">Liens d'affiliation</label>
                                                                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                                                                    <input type="checkbox" checked={!!block.hide_product_link} onChange={e => updateArticleProductBlock(index, 'hide_product_link', e.target.checked)} className="rounded border-border" />
                                                                    Masquer le bouton "Voir la fiche produit"
                                                                </label>
                                                            </div>
                                                            <button type="button" onClick={() => addArticleProductBlockAffiliateLink(index)} className="text-xs border border-border px-2 py-1 rounded flex items-center hover:bg-neutral-50"><Plus className="w-3 h-3 mr-1" /> Ajouter lien</button>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {block.affiliate_links.map((link, linkIndex) => (
                                                                <div key={linkIndex} className="flex gap-2 items-start bg-neutral-50 p-3 rounded-lg border border-border">
                                                                    <div className="w-32"><label className="text-[10px] font-bold uppercase text-muted-foreground">Marchand</label><select value={link.merchant} onChange={e => updateArticleProductBlockAffiliateLink(index, linkIndex, 'merchant', e.target.value)} className="w-full px-2 py-1 rounded border border-border text-sm bg-white"><option value="amazon">Amazon</option><option value="thomann">Thomann</option><option value="woodbrass">Woodbrass</option><option value="ldlc">LDLC</option></select></div>
                                                                    <div className="flex-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Lien URL</label><input type="text" value={link.url} onChange={e => updateArticleProductBlockAffiliateLink(index, linkIndex, 'url', e.target.value)} className="w-full px-2 py-1 rounded border border-border text-sm bg-white" /></div>
                                                                    <div className="w-24"><label className="text-[10px] font-bold uppercase text-muted-foreground">Label</label><input type="text" value={link.label} onChange={e => updateArticleProductBlockAffiliateLink(index, linkIndex, 'label', e.target.value)} className="w-full px-2 py-1 rounded border border-border text-sm bg-white" placeholder="ex: Voir Prix" /></div>
                                                                    <div className="pt-4"><button type="button" onClick={() => removeArticleProductBlockAffiliateLink(index, linkIndex)} className="p-1 text-muted-foreground hover:text-red-500 rounded transition-colors"><Trash2 className="w-4 h-4" /></button></div>
                                                                </div>
                                                            ))}
                                                            {block.affiliate_links.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-2 bg-white">Aucun lien d'affiliation.</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {(articleFormData.product_blocks || []).length === 0 && <p className="text-center text-sm text-muted-foreground italic py-8 border border-dashed border-border rounded-lg bg-white">Aucun produit dans cet article. Cliquez sur "Ajouter un produit".</p>}
                                        </div>
                                    </div>

                                    {/* SECTION 3: Tableau Comparatif */}
                                    <div className="bg-neutral-50 p-6 rounded-xl border border-border">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary">3. Tableau Comparatif (Optionnel)</h3>
                                            {!articleFormData.comparison_table && (
                                                <button type="button" onClick={initArticleComparisonTable} className="text-sm bg-white border border-border px-3 py-1.5 rounded-md flex items-center shadow-sm hover:bg-neutral-100 transition-colors">
                                                    <Plus className="w-4 h-4 mr-1" /> Ajouter un tableau
                                                </button>
                                            )}
                                        </div>
                                        {articleFormData.comparison_table ? (
                                            <div className="bg-white p-4 rounded-lg border border-border/50 relative overflow-hidden">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="space-x-2">
                                                        <button type="button" onClick={addArticleComparisonTableRow} className="text-xs border border-border px-2 py-1 rounded hover:bg-neutral-50 transition-colors">+ Ajouter Ligne</button>
                                                        <button type="button" onClick={addArticleComparisonTableCol} className="text-xs border border-border px-2 py-1 rounded hover:bg-neutral-50 transition-colors">+ Ajouter Colonne</button>
                                                    </div>
                                                    <button type="button" onClick={removeArticleComparisonTable} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"><Trash2 className="w-4 h-4" /> Supprimer le tableau</button>
                                                </div>
                                                <div className="overflow-x-auto pb-4">
                                                    <table className="w-full text-sm text-left whitespace-nowrap">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-2 py-2"></th>
                                                                {articleFormData.comparison_table.headers.map((header, colIndex) => (
                                                                    <th key={colIndex} className="px-2 py-2 min-w-[120px]">
                                                                        <div className="flex items-center gap-1 bg-neutral-100 rounded px-2 py-1">
                                                                            <input type="text" value={header} onChange={e => updateArticleComparisonTable('header', 0, colIndex, e.target.value)} className="bg-transparent font-bold w-full outline-none" />
                                                                            {articleFormData.comparison_table!.headers.length > 2 && (
                                                                                <button type="button" onClick={() => removeArticleComparisonTableCol(colIndex)} className="text-red-400 hover:text-red-600 px-1">×</button>
                                                                            )}
                                                                        </div>
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {articleFormData.comparison_table.rows.map((row, rowIndex) => (
                                                                <tr key={rowIndex} className={row.highlight ? 'bg-amber-50/50' : 'border-t border-border/50'}>
                                                                    <td className="px-2 py-2 w-10 text-center">
                                                                        <div className="flex flex-col gap-2 items-center">
                                                                            {articleFormData.comparison_table!.rows.length > 1 && (
                                                                                <button type="button" onClick={() => removeArticleComparisonTableRow(rowIndex)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                                                                            )}
                                                                            <label className="cursor-pointer" title="Mettre en évidence cette ligne (ex: Vainqueur)">
                                                                                <input type="checkbox" checked={row.highlight || false} onChange={e => updateArticleComparisonTableRowHighlight(rowIndex, e.target.checked)} className="rounded border-border text-amber-500 focus:ring-amber-500 w-3 h-3 block mt-2" />
                                                                            </label>
                                                                        </div>
                                                                    </td>
                                                                    {row.cells.map((cell, colIndex) => (
                                                                        <td key={colIndex} className="px-2 py-2">
                                                                            <textarea value={cell} onChange={e => updateArticleComparisonTable('cell', rowIndex, colIndex, e.target.value)} className="w-full px-2 py-1.5 rounded border border-border text-sm min-h-[40px]" placeholder="..." />
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-center text-sm text-muted-foreground italic">Aucun tableau comparatif pour cet article.</p>
                                        )}
                                    </div>

                                    {/* SECTION 4: Contenu Libre */}
                                    <div className="bg-neutral-50 p-6 rounded-xl border border-border">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary">4. Sections de Contenu Libre (Optionnel)</h3>
                                            <button type="button" onClick={addArticleContentSection} className="text-sm bg-white border border-border px-3 py-1.5 rounded-md flex items-center shadow-sm hover:bg-neutral-100 transition-colors">
                                                <Plus className="w-4 h-4 mr-1" /> Ajouter une section
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {(articleFormData.content_sections || []).map((section, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-border/50 relative">
                                                    <button type="button" onClick={() => removeArticleContentSection(index)} className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    <div className="grid gap-3 mb-2 pr-10">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-muted-foreground">Ordre</span>
                                                            <input type="number" value={section.order} onChange={e => updateArticleContentSection(index, 'order', parseInt(e.target.value))} className="w-16 px-2 py-1 rounded border border-border text-sm" />
                                                            <input type="text" value={section.title} onChange={e => updateArticleContentSection(index, 'title', e.target.value)} className="flex-1 px-3 py-1.5 rounded border border-border text-sm font-bold" placeholder="Titre de la section (ex: Pourquoi choisir cette marque ?)" />
                                                        </div>
                                                        <textarea value={section.html} onChange={e => updateArticleContentSection(index, 'html', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border font-mono text-sm h-32" placeholder="<p>Texte HTML...</p>" />
                                                    </div>
                                                </div>
                                            ))}
                                            {(articleFormData.content_sections || []).length === 0 && <p className="text-center text-sm text-muted-foreground italic">Aucune section de contenu libre.</p>}
                                        </div>
                                    </div>

                                    {/* SECTION 5: Conclusion */}
                                    <div className="bg-neutral-50 p-6 rounded-xl border border-border">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary">5. Le Mot de la Fin (Optionnel)</h3>
                                            {!articleFormData.conclusion_block && (
                                                <button type="button" onClick={() => setArticleFormData({ ...articleFormData, conclusion_block: { emoji: '🏆', title: 'Le Mot de la Fin', content: '' } })} className="text-sm bg-white border border-border px-3 py-1.5 rounded-md flex items-center shadow-sm hover:bg-neutral-100 transition-colors"><Plus className="w-4 h-4 mr-1" /> Ajouter MdlF</button>
                                            )}
                                        </div>
                                        {articleFormData.conclusion_block ? (
                                            <div className="bg-white p-4 rounded-lg border border-border/50 relative">
                                                <button type="button" onClick={() => setArticleFormData({ ...articleFormData, conclusion_block: null })} className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                <div className="flex gap-4 pr-10">
                                                    <div className="w-16"><label className="block text-xs font-bold mb-1">Emoji</label><input type="text" value={articleFormData.conclusion_block.emoji} onChange={e => setArticleFormData({ ...articleFormData, conclusion_block: { ...articleFormData.conclusion_block!, emoji: e.target.value } })} className="w-full px-2 py-1.5 rounded border border-border text-center text-xl" /></div>
                                                    <div className="flex-1"><label className="block text-xs font-bold mb-1">Titre</label><input type="text" value={articleFormData.conclusion_block.title} onChange={e => setArticleFormData({ ...articleFormData, conclusion_block: { ...articleFormData.conclusion_block!, title: e.target.value } })} className="w-full px-3 py-1.5 rounded border border-border text-sm font-bold" /></div>
                                                </div>
                                                <div className="mt-3">
                                                    <label className="block text-xs font-bold mb-1">Contenu HTML</label>
                                                    <textarea value={articleFormData.conclusion_block.content} onChange={e => setArticleFormData({ ...articleFormData, conclusion_block: { ...articleFormData.conclusion_block!, content: e.target.value } })} className="w-full px-3 py-2 rounded-md border border-border font-mono text-sm h-24" placeholder="<p>Conclusion...</p>" />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-center text-sm text-muted-foreground italic">Aucun bloc de conclusion.</p>
                                        )}
                                    </div>

                                    {/* SECTION 6: FAQ */}
                                    <div className="bg-neutral-50 p-6 rounded-xl border border-border">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary">6. Foire Aux Questions (FAQ SEO)</h3>
                                            <button type="button" onClick={addArticleFaqItem} className="text-sm bg-white border border-border px-3 py-1.5 rounded-md flex items-center shadow-sm hover:bg-neutral-100 transition-colors">
                                                <Plus className="w-4 h-4 mr-1" /> Ajouter Q/R
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {(articleFormData.faq_items || []).map((faq, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-border/50 relative flex gap-4 pr-12">
                                                    <button type="button" onClick={() => removeArticleFaqItem(index)} className="absolute top-1/2 -translate-y-1/2 right-2 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    <div className="flex-1 space-y-2">
                                                        <input type="text" value={faq.question} onChange={e => updateArticleFaqItem(index, 'question', e.target.value)} className="w-full px-3 py-1.5 rounded border border-border text-sm font-bold placeholder:font-normal" placeholder="Question..." />
                                                        <textarea value={faq.answer} onChange={e => updateArticleFaqItem(index, 'answer', e.target.value)} className="w-full px-3 py-2 rounded-md border border-border text-sm h-16 resize-none" placeholder="Réponse..." />
                                                    </div>
                                                </div>
                                            ))}
                                            {(articleFormData.faq_items || []).length === 0 && <p className="text-center text-sm text-muted-foreground italic">Aucune question ajoutée pour la FAQ.</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4 border-t border-border mt-8">
                                        <button type="button" onClick={() => setArticlesView('list')} className="text-muted-foreground hover:text-foreground font-bold px-4 py-2 rounded-md transition-colors">
                                            Annuler
                                        </button>
                                        <button type="submit" disabled={articleFormLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-md transition-colors flex items-center">
                                            {articleFormLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                            Enregistrer l'article
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
