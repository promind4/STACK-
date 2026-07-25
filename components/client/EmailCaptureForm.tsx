'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export function EmailCaptureForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setStatus('success');
                (window as any).gtag?.('event', 'newsletter_signup', { location: 'email_capture_form' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    }

    if (status === 'success') {
        return (
            <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Parfait ! Vous recevrez le prochain guide.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-64"
            />
            <button
                type="submit"
                disabled={status === 'loading'}
                className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60 shrink-0"
            >
                {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>Je m&apos;abonne <ArrowRight className="w-4 h-4" /></>
                )}
            </button>
            {status === 'error' && (
                <p className="text-red-500 text-xs mt-1 sm:mt-0 sm:self-center">Une erreur s&apos;est produite, réessayez.</p>
            )}
        </form>
    );
}
