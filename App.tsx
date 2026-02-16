import React, { Suspense } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LogoTicker } from './components/LogoTicker';
import { FeaturedProducts } from './components/FeaturedProducts';
import { VerticalSelector } from './components/VerticalSelector';
import { WhyUsSection } from './components/WhyUsSection';
import { Footer } from './components/Footer';
import { ComparisonProvider } from './context/ComparisonContext';
import { ComparisonBar } from './components/ComparisonBar';
import { useSEO } from './components/SEOHelper';

// Lazy Load Pages to optimize initial bundle size & LCP
const ProductPage = React.lazy(() => import('./components/ProductPage').then(module => ({ default: module.ProductPage })));
const CategoryPage = React.lazy(() => import('./components/CategoryPage').then(module => ({ default: module.CategoryPage })));
const GuidesPage = React.lazy(() => import('./components/GuidesPage').then(module => ({ default: module.GuidesPage })));
const AboutPage = React.lazy(() => import('./components/AboutPage').then(module => ({ default: module.AboutPage })));
const GuideArticlePage = React.lazy(() => import('./components/GuideArticlePage').then(module => ({ default: module.GuideArticlePage })));
const GuidePathPage = React.lazy(() => import('./components/GuidePathPage').then(module => ({ default: module.GuidePathPage })));
const ConfiguratorPage = React.lazy(() => import('./components/ConfiguratorPage').then(module => ({ default: module.ConfiguratorPage })));
const VersusPage = React.lazy(() => import('./components/VersusPage').then(module => ({ default: module.VersusPage })));
const LegalMentionsPage = React.lazy(() => import('./components/legal/LegalMentionsPage').then(module => ({ default: module.LegalMentionsPage })));
const TermsPage = React.lazy(() => import('./components/legal/TermsPage').then(module => ({ default: module.TermsPage })));
const PrivacyPage = React.lazy(() => import('./components/legal/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const AdminPage = React.lazy(() => import('./components/admin/AdminPage').then(module => ({ default: module.AdminPage })));


// ============================================================
// URL MAPPING: old page names → URL paths
// ============================================================
const PAGE_TO_URL: Record<string, string> = {
  home: '/',
  product: '/produit',
  category: '/categorie',
  guides: '/guides',
  about: '/a-propos',
  'guide-article': '/guide',
  'guide-path': '/parcours',
  configurator: '/configurateur',
  versus: '/versus',
  'legal-mentions': '/mentions-legales',
  cgu: '/cgu',
  privacy: '/confidentialite',
  admin: '/admin',
};

// ============================================================
// Background Layer
// ============================================================
const BackgroundLayer = () => (
  <div className="fixed inset-0 z-0 h-full w-full bg-[#FAFAFA] overflow-hidden pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#D3B27B] opacity-25 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#E8DCC4] opacity-30 blur-[120px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[#FAFAFA] opacity-60 blur-[100px]" />
    <div
      className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
      }}
    />
  </div>
);

// ============================================================
// Layout wrapper: Navbar + Footer on ALL pages
// ============================================================
const Layout: React.FC<{ children: React.ReactNode; navigate: (page: string, slug?: string, query?: string) => void }> = ({ children, navigate }) => (
  <>
    <Navbar onNavigate={navigate} />
    {children}
    <Footer onNavigate={navigate} />
    <ComparisonBar onNavigate={navigate} />
  </>
);

// ============================================================
// Route Wrappers (extract useParams → pass as props)
// ============================================================
const ProductRoute: React.FC<{ navigate: (page: string, slug?: string) => void }> = ({ navigate }) => {
  const { slug } = useParams();
  return <ProductPage onBack={() => navigate('category')} onNavigate={navigate} slug={slug} />;
};

const CategoryRoute: React.FC<{ navigate: (page: string, slug?: string, query?: string) => void }> = ({ navigate }) => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || undefined;
  return <CategoryPage onNavigate={navigate} categorySlug={slug} initialSearchQuery={query} />;
};

const GuideArticleRoute: React.FC<{ navigate: (page: string, slug?: string) => void }> = ({ navigate }) => {
  const { slug } = useParams();
  return <GuideArticlePage onNavigate={navigate} slug={slug} />;
};

const GuidePathRoute: React.FC<{ navigate: (page: string, slug?: string) => void }> = ({ navigate }) => {
  const { slug } = useParams();
  return <GuidePathPage onNavigate={navigate} slug={slug} />;
};

const VersusRoute: React.FC<{ navigate: (page: string, slug?: string) => void }> = ({ navigate }) => {
  const { slug } = useParams();
  return <VersusPage onNavigate={navigate} slug={slug} />;
};

// ============================================================
// Home Page Component
// ============================================================
const HomePage: React.FC<{ navigate: (page: string, slug?: string) => void }> = ({ navigate }) => {
  useSEO({
    title: 'Fluxlab - Comparateur Intelligent de Matériel Audio, Vidéo & Streaming',
    description: 'Trouvez le setup parfait au meilleur prix. Fluxlab compare les prix de centaines de produits audio, vidéo et streaming sur toutes les boutiques françaises.',
  });

  return (
    <div className="flex flex-col">
      <HeroSection onNavigate={navigate} />
      <LogoTicker />
      <FeaturedProducts onNavigate={navigate} />
      <VerticalSelector onNavigate={navigate} />
      <WhyUsSection />
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const routerNavigate = useNavigate();

  // Wrapper: maps old page names + slugs to real URL paths
  const navigate = (page: string, slug?: string, query?: string) => {
    const base = PAGE_TO_URL[page] || '/';

    let url = base;
    if (slug) {
      url = `${base}/${slug}`;
    }
    if (query) {
      url += `?q=${encodeURIComponent(query)}`;
    }

    window.scrollTo(0, 0);
    routerNavigate(url);
  };

  return (
    <ComparisonProvider>
      <div className="min-h-screen relative text-foreground selection:bg-primary/30 font-sans">
        <BackgroundLayer />
        <div className="relative z-10">
          <Layout navigate={navigate}>
            <Suspense fallback={
              <div className="h-screen w-full flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin"></div>
              </div>
            }>
              <Routes>
                {/* HOME */}
                <Route path="/" element={<HomePage navigate={navigate} />} />

                {/* PRODUCTS */}
                <Route path="/produit/:slug" element={<ProductRoute navigate={navigate} />} />

                {/* CATEGORIES */}
                <Route path="/categorie" element={<CategoryRoute navigate={navigate} />} />
                <Route path="/categorie/:slug" element={<CategoryRoute navigate={navigate} />} />

                {/* GUIDES */}
                <Route path="/guides" element={<GuidesPage onNavigate={navigate} />} />
                <Route path="/guide/:slug" element={<GuideArticleRoute navigate={navigate} />} />
                <Route path="/parcours/:slug" element={<GuidePathRoute navigate={navigate} />} />

                {/* CONFIGURATOR */}
                <Route path="/configurateur" element={<ConfiguratorPage onNavigate={navigate} />} />

                {/* VERSUS */}
                <Route path="/versus" element={<VersusRoute navigate={navigate} />} />
                <Route path="/versus/:slug" element={<VersusRoute navigate={navigate} />} />

                {/* ABOUT */}
                <Route path="/a-propos" element={<AboutPage onNavigate={navigate} />} />

                {/* LEGAL */}
                <Route path="/mentions-legales" element={<LegalMentionsPage onNavigate={navigate} />} />
                <Route path="/cgu" element={<TermsPage onNavigate={navigate} />} />
                <Route path="/confidentialite" element={<PrivacyPage onNavigate={navigate} />} />

                {/* ADMIN */}
                <Route path="/admin" element={<AdminPage onNavigate={navigate} />} />


                {/* FALLBACK → Home */}
                <Route path="*" element={<HomePage navigate={navigate} />} />
              </Routes>
            </Suspense>
          </Layout>
        </div>
      </div>
    </ComparisonProvider>
  );
}

export default App;