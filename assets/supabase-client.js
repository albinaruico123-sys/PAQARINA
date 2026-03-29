// ============================================================
//  CuscoTalent — Supabase Real Client
//  Proyecto: https://dtzsuxukkanyghpncjvu.supabase.co
// ============================================================

const SUPABASE_URL  = 'https://dtzsuxukkanyghpncjvu.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_sj7SNmlmvxGGE8-eSfSh5g_0VgOkm8j';

// Initialize the real Supabase client
// supabase global is provided by the CDN script loaded in <head>
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'cuscotalent-auth'
    }
});

// ── Session Helper ───────────────────────────────────────────
// syncAndeanSession: used by all pages to load session + profile
async function syncAndeanSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            sessionStorage.removeItem('andesTalentLoggedIn');
            sessionStorage.removeItem('andesTalentRole');
            sessionStorage.removeItem('andesTalentUser');
            return { session: null, profile: null };
        }

        // Fetch profile row
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
        console.warn('[CuscoTalent] syncAndeanSession error:', err);
        return { session: null, profile: null };
    }
}
