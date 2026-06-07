import Link from 'next/link';
import Image from 'next/image';
import { EmailCaptureForm } from '@/components/client/EmailCaptureForm';

function InstagramIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function TikTokIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
        </svg>
    );
}

export function Footer() {
    return (
        <footer className="bg-background border-t border-border pt-10 md:pt-14 pb-6">
            <div className="container mx-auto px-6 max-w-[1200px]">

                {/* BLOC CAPTURE EMAIL */}
                <div className="bg-secondary/40 border border-border rounded-2xl px-6 py-8 mb-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div>
                        <p className="font-bold text-foreground text-base">Recevez nos meilleurs guides chaque mois</p>
                        <p className="text-[13px] text-muted-foreground mt-1">Gratuit, sans spam. Désabonnement en un clic.</p>
                    </div>
                    <EmailCaptureForm />
                </div>

                {/* LAYOUT PRINCIPAL : Grid Hybrid (Mobile: 2 cols / Desktop: 4 cols) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-12 mb-10">

                    {/* COLONNE 1 : MARQUE & LOGO */}
                    <div className="col-span-2 lg:col-span-1 space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/branding/logo.svg"
                                alt="Logo Fluxlab"
                                width={120}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <p className="text-[13px] text-muted-foreground leading-relaxed font-light">
                            La plateforme de référence pour configurer votre studio créatif.
                        </p>
                        {/* RÉSEAUX SOCIAUX — décommenter quand les comptes sont actifs
                        <div className="flex items-center gap-3 pt-1">
                            <a
                                href="https://www.instagram.com/the_fluxlab"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Fluxlab sur Instagram"
                                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                                <InstagramIcon />
                            </a>
                            <a
                                href="https://www.tiktok.com/@the_fluxlab"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Fluxlab sur TikTok"
                                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                                <TikTokIcon />
                            </a>
                        </div>
                        */}
                    </div>

                    {/* COLONNE 2 : UNIVERS */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Univers</h4>
                        <ul className="space-y-3 text-[13px] text-muted-foreground font-light">
                            <li><Link href="/categorie/audio" className="hover:text-primary transition-colors">Studio &amp; Son</Link></li>
                            <li><Link href="/categorie/video" className="hover:text-primary transition-colors">Image &amp; Lumière</Link></li>
                            <li><Link href="/categorie/streaming" className="hover:text-primary transition-colors">Streaming Live</Link></li>
                            <li><Link href="/categorie/micros-dynamiques" className="hover:text-primary transition-colors">Micros Dynamiques</Link></li>
                            <li><Link href="/categorie/micros-usb" className="hover:text-primary transition-colors">Micros USB</Link></li>
                            <li><Link href="/categorie/cartes-son" className="hover:text-primary transition-colors">Interfaces Audio</Link></li>
                            <li><Link href="/configurateur" className="hover:text-primary transition-colors font-medium">Le Labo IA</Link></li>
                        </ul>
                    </div>

                    {/* COLONNE 3 : RESSOURCES */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Ressources</h4>
                        <ul className="space-y-3 text-[13px] text-muted-foreground font-light">
                            <li><Link href="/guides" className="hover:text-primary transition-colors">Guides et tutos</Link></li>
                            <li><Link href="/guide/xlr-vs-usb" className="hover:text-primary transition-colors">XLR vs USB</Link></li>
                            <li><Link href="/guide/choisir-casque-studio" className="hover:text-primary transition-colors">Choisir son casque studio</Link></li>
                            <li><Link href="/guide/top-5-interfaces" className="hover:text-primary transition-colors">Top 5 interfaces audio</Link></li>
                            <li><Link href="/a-propos" className="hover:text-primary transition-colors">L&apos;Atelier Fluxlab</Link></li>
                            <li><Link href="/methodologie" className="hover:text-primary transition-colors">Notre Méthodologie</Link></li>
                        </ul>
                    </div>

                    {/* COLONNE 4 : INFORMATIONS LÉGALES (alignée à droite) */}
                    <div className="space-y-4 lg:text-right">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Informations Légales</h4>
                        <ul className="space-y-3 text-[13px] text-muted-foreground font-light">
                            <li><Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales</Link></li>
                            <li><Link href="/confidentialite" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
                            <li><Link href="/cgu" className="hover:text-primary transition-colors">CGU</Link></li>
                            <li><Link href="/admin" className="hover:text-primary transition-colors opacity-70">Administration</Link></li>
                        </ul>
                    </div>

                </div>

                {/* DISCLAIMER AFFILIATION */}
                <div className="border-t border-border pt-6 mb-6">
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center max-w-3xl mx-auto">
                        <strong>Transparence :</strong> Fluxlab participe à des programmes d&apos;affiliation (Amazon, Thomann, Woodbrass, etc.). Un achat via ces liens peut nous faire percevoir une commission, sans surcoût pour vous.
                    </p>
                </div>

                {/* BARRE FINALE */}
                <div className="border-t border-border pt-6 flex justify-center items-center text-[11px] md:text-xs text-muted-foreground">
                    <p className="font-light">&copy; {new Date().getFullYear()}. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
