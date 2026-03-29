// ============================================================
//  CuscoTalent / AndeanTalent — Supabase Real Client
//  Proyecto: AndeanTalent (jxjxaadnycytpkyemohd)
// ============================================================

const SUPABASE_URL = 'https://jxjxaadnycytpkyemohd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4anhhYWRueWN5dHBreWVtb2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDYyMDEsImV4cCI6MjA5MDI4MjIwMX0.PEqrVc1iY_R4V0Fj65Kz0RdGdhziWqB-7Okv70BLakc';

// Initialize real Supabase client (CDN provides window.supabase)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'andeantalent-auth'
    }
});

// ── Session Sync Helper ──────────────────────────────────────
// Used by all pages to load session and profile from Supabase
async function syncAndeanSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            sessionStorage.removeItem('andesTalentLoggedIn');
            sessionStorage.removeItem('andesTalentRole');
            sessionStorage.removeItem('andesTalentUser');
            return { session: null, profile: null };
        }

        // Fetch profile from Supabase
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            sessionStorage.setItem('andesTalentLoggedIn', 'true');
            sessionStorage.setItem('andesTalentRole', profile.role || 'freelancer');
            sessionStorage.setItem('andesTalentUser', JSON.stringify(profile));
        }

        return { session, profile: profile || null };
    } catch (err) {
        console.warn('[AndeanTalent] syncAndeanSession error:', err);
        return { session: null, profile: null };
    }
}

// ── Sign Out ─────────────────────────────────────────────────
async function clearSession() {
    await supabase.auth.signOut();
    sessionStorage.clear();
    window.location.href = 'code.html';
}
