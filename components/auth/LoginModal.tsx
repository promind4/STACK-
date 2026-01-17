import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Loader2, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Check, Music, Video, Gamepad2, Mic 
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  type: 'music' | 'video' | 'stream' | null;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'register' | 'onboarding';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Onboarding State
  const [selectedArchetype, setSelectedArchetype] = useState<'music' | 'video' | 'stream' | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSelectedArchetype(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Google login skips registration, assumes existing user or quick create
      // For this mock, we go to onboarding if it's "new", but let's assume direct login for Google
      onLoginSuccess({
        name: "John Doe",
        email: "john.doe@gmail.com",
        type: 'stream' // Default mock
      });
      onClose();
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'login') {
      // Simulate Login
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess({
          name: email.split('@')[0],
          email: email,
          type: 'stream' // Mock profile fetch
        });
        onClose();
      }, 1500);
    } else {
      // Simulate Register -> Go to Onboarding
      setTimeout(() => {
        setIsLoading(false);
        setMode('onboarding');
      }, 1000);
    }
  };

  const handleFinalizeOnboarding = () => {
    if (!selectedArchetype) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: email.split('@')[0] || "Nouveau Créateur",
        email: email,
        type: selectedArchetype
      });
      onClose();
    }, 1000);
  };

  // Password Strength Logic
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    let score = 0;
    if (pass.length > 7) score += 1;
    if (pass.length > 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(password);
  const getStrengthLabel = () => {
    if (strength === 0) return { label: '', color: 'bg-transparent' };
    if (strength < 2) return { label: 'Faible', color: 'bg-red-500' };
    if (strength < 4) return { label: 'Moyen', color: 'bg-amber-500' };
    return { label: 'Fort', color: 'bg-emerald-500' };
  };

  const strengthInfo = getStrengthLabel();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* MODAL CONTAINER */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FAFAFA] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden pointer-events-auto relative border border-white/50 flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* === MODE: ONBOARDING === */}
              {mode === 'onboarding' ? (
                <div className="p-8 md:p-12 flex flex-col h-full overflow-y-auto">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif text-foreground mb-2">Bienvenue au Studio</h2>
                    <p className="text-muted-foreground text-sm">
                      Aidez-nous à personnaliser votre expérience. Quel est votre profil principal ?
                    </p>
                  </div>

                  <div className="grid gap-4 mb-8">
                    {[
                      { id: 'music', label: 'Musicien / Producteur', icon: <Music className="w-5 h-5"/>, desc: 'Home studio, enregistrement, mixage.' },
                      { id: 'video', label: 'Vidéaste / YouTuber', icon: <Video className="w-5 h-5"/>, desc: 'Vlog, court-métrage, setup caméra.' },
                      { id: 'stream', label: 'Streamer', icon: <Gamepad2 className="w-5 h-5"/>, desc: 'Twitch, live gaming, interaction.' },
                    ].map((archetype) => (
                      <button
                        key={archetype.id}
                        onClick={() => setSelectedArchetype(archetype.id as any)}
                        className={`
                          relative p-4 rounded-xl border-2 text-left flex items-start gap-4 transition-all duration-200
                          ${selectedArchetype === archetype.id 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-border bg-white hover:border-primary/30 hover:bg-white/80'
                          }
                        `}
                      >
                        <div className={`p-3 rounded-lg ${selectedArchetype === archetype.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                          {archetype.icon}
                        </div>
                        <div>
                          <h3 className={`font-bold ${selectedArchetype === archetype.id ? 'text-primary' : 'text-foreground'}`}>
                            {archetype.label}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{archetype.desc}</p>
                        </div>
                        {selectedArchetype === archetype.id && (
                          <div className="absolute top-4 right-4 text-primary">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleFinalizeOnboarding}
                    disabled={!selectedArchetype || isLoading}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-auto"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <>Terminer <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              ) : (
                /* === MODE: LOGIN / REGISTER === */
                <div className="flex flex-col h-full">
                  {/* Tabs */}
                  <div className="flex border-b border-border">
                    <button 
                      onClick={() => setMode('login')}
                      className={`flex-1 py-4 text-sm font-bold transition-colors relative ${mode === 'login' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                    >
                      Connexion
                      {mode === 'login' && <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                    <button 
                      onClick={() => setMode('register')}
                      className={`flex-1 py-4 text-sm font-bold transition-colors relative ${mode === 'register' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                    >
                      Créer un compte
                      {mode === 'register' && <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                  </div>

                  <div className="p-8 md:p-10 overflow-y-auto">
                    {/* Google Button */}
                    <button
                      onClick={handleGoogleLogin}
                      type="button"
                      disabled={isLoading}
                      className="w-full bg-white hover:bg-gray-50 text-foreground font-medium py-3 px-4 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70 mb-6"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span>Continuer avec Google</span>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px bg-border flex-1" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Ou par email</span>
                      <div className="h-px bg-border flex-1" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground uppercase tracking-wide">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            type="email" 
                            required
                            placeholder="vous@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground uppercase tracking-wide">Mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-input rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        {/* Strength Meter (Register only) */}
                        {mode === 'register' && password.length > 0 && (
                           <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div 
                                  className={`h-full ${strengthInfo.color}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(strength / 4) * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-medium text-muted-foreground w-12 text-right">{strengthInfo.label}</span>
                           </div>
                        )}
                      </div>

                      {/* Confirm Password (Register only) */}
                      {mode === 'register' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-1.5"
                        >
                          <label className="text-xs font-bold text-foreground uppercase tracking-wide">Confirmer</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              required
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 ${
                                confirmPassword.length > 0 && confirmPassword !== password 
                                  ? 'border-red-300 focus:border-red-500' 
                                  : 'border-input focus:border-primary'
                              }`}
                            />
                          </div>
                          {confirmPassword.length > 0 && confirmPassword !== password && (
                             <p className="text-[10px] text-red-500">Les mots de passe ne correspondent pas.</p>
                          )}
                        </motion.div>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading || (mode === 'register' && (strength < 2 || password !== confirmPassword))}
                          className="w-full bg-foreground text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            mode === 'login' ? 'Se connecter' : 'Créer mon compte'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Footer Terms */}
                  <div className="p-4 bg-secondary/30 text-center border-t border-border mt-auto">
                    <p className="text-[10px] text-muted-foreground">
                      Protégé par reCAPTCHA. <a href="#" className="underline">Confidentialité</a> et <a href="#" className="underline">Conditions</a>.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};