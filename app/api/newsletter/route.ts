import { NextRequest, NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID ? Number(process.env.BREVO_LIST_ID) : undefined;

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    if (!BREVO_API_KEY) {
        // Graceful degradation: log and return success so the UI doesn't block
        console.warn('[newsletter] BREVO_API_KEY not set — email not forwarded:', email);
        return NextResponse.json({ ok: true });
    }

    const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            updateEnabled: true,
            ...(BREVO_LIST_ID ? { listIds: [BREVO_LIST_ID] } : {}),
        }),
    });

    if (!res.ok && res.status !== 204) {
        const body = await res.text();
        console.error('[newsletter] Brevo error:', res.status, body);
        return NextResponse.json({ error: 'Erreur Brevo' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
