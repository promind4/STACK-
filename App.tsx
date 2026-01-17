import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LogoTicker } from './components/LogoTicker';
import { FeaturedProducts } from './components/FeaturedProducts';
import { VerticalSelector } from './components/VerticalSelector';
import { WhyUsSection } from './components/WhyUsSection';
import { Footer } from './components/Footer';
import { ProductPage } from './components/ProductPage';
import { CategoryPage } from './components/CategoryPage';
import { GuidesPage } from './components/GuidesPage';
import { AboutPage } from './components/AboutPage';
import { GuideArticlePage } from './components/GuideArticlePage';
import { GuidePathPage } from './components/GuidePathPage';
import { ConfiguratorPage } from './components/ConfiguratorPage';
import { VersusPage } from './components/VersusPage';
import { LegalMentionsPage } from './components/legal/LegalMentionsPage';
import { TermsPage } from './components/legal/TermsPage';
import { PrivacyPage } from './components/legal/PrivacyPage';

type RouteType = 
  | 'home' 
  | 'product' 
  | 'category' 
  | 'guides' 
  | 'about' 
  | 'guide-article' 
  | 'guide-path' 
  | 'configurator'
  | 'versus'
  | 'legal-mentions'
  | 'cgu'
  | 'privacy';

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

function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteType>('home');
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);

  const navigate = (page: string, slug?: string) => {
    window.scrollTo(0, 0);
    const validRoutes = [
      'home', 'product', 'category', 'guides', 'about', 
      'guide-article', 'guide-path', 'configurator', 'versus',
      'legal-mentions', 'cgu', 'privacy'
    ];
    
    if (validRoutes.includes(page)) {
      setCurrentRoute(page as RouteType);
      if (slug) {
        setSelectedSlug(slug);
      }
    } else {
      setCurrentRoute('home');
    }
  };

  const renderContent = () => {
    switch (currentRoute) {
      case 'product':
        return <ProductPage onBack={() => navigate('category')} slug={selectedSlug} />;
      case 'category':
        return <CategoryPage onNavigate={navigate} categorySlug={selectedSlug} />;
      case 'guides':
        return <GuidesPage onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'guide-article':
        return <GuideArticlePage onNavigate={navigate} slug={selectedSlug} />;
      case 'guide-path':
        return <GuidePathPage onNavigate={navigate} slug={selectedSlug} />;
      case 'configurator':
        return <ConfiguratorPage onNavigate={navigate} />;
      case 'versus':
        return <VersusPage onNavigate={navigate} slug={selectedSlug} />;
      case 'legal-mentions':
        return <LegalMentionsPage onNavigate={navigate} />;
      case 'cgu':
        return <TermsPage onNavigate={navigate} />;
      case 'privacy':
        return <PrivacyPage onNavigate={navigate} />;
      default:
        return (
          <div className="flex flex-col">
            <HeroSection onNavigate={navigate} />
            <LogoTicker />
            <div onClick={() => navigate('category')} className="cursor-pointer">
              <FeaturedProducts />
            </div>
            <VerticalSelector onNavigate={navigate} />
            <WhyUsSection />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative text-foreground selection:bg-primary/30">
      <BackgroundLayer />
      <div className="relative z-10">
        {(currentRoute === 'home' || currentRoute === 'category' || currentRoute === 'guides' || currentRoute === 'versus') && <Navbar onNavigate={navigate} />}
        
        {renderContent()}
        
        {(currentRoute === 'home' || currentRoute === 'versus' || currentRoute === 'guides') && <Footer onNavigate={navigate} />}
      </div>
    </div>
  );
}

export default App;