import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer className="bg-background border-t border-border pt-10 md:pt-14 pb-6">
            <div className="container mx-auto px-6 max-w-[1200px]">

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
