// ============================================================
//  CuscoTalent / AndeanTalent — Supabase Real Client
//  Proyecto: AndeanTalent (jxjxaadnycytpkyemohd)
// ============================================================

const SUPABASE_URL = 'https://cgjgspmkyuzzfictavrg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_isuwoR2CCDaorNyFNVL-7w_Uq6yAZUl';

// The global 'supabase' variable will be the client instance
var supabase;
var sb;

function initSupabase() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        console.warn('[Supabase] SDK not ready, retrying...');
        setTimeout(initSupabase, 50);
        return;
    }

    try {
        // 1. Create the client
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storageKey: 'andeantalent-auth'
            }
        });

        // 2. Overwrite the global namespace with the client instance
        // This makes 'supabase.from()' etc. work across all existing code.
        window.supabase = client;
        window.sb = client;
        supabase = client;
        sb = client;

        console.log('[Supabase] Client initialized successfully.');
        window.dispatchEvent(new CustomEvent('supabase-initialized'));
    } catch (err) {
        console.error('[Supabase] Initialization error:', err);
    }
}

// Start initialization
initSupabase();

// Helper for scripts that need to ensure it's a client
function getSB() {
    return window.sb || window.supabase;
}

// ── Session Sync Helper ──────────────────────────────────────
async function syncAndeanSession() {
    var client = getSB();
    if (!client || typeof client.from !== 'function') return { session: null, profile: null };

    try {
        const { data: { session }, error } = await client.auth.getSession();
        if (error || !session) return { session: null, profile: null };

        const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            localStorage.setItem('andesTalentLoggedIn', 'true');
            localStorage.setItem('andesTalentRole', profile.role || 'freelancer');
            localStorage.setItem('andesTalentUserDni', profile.dni || profile.id);
            localStorage.setItem('andesTalentUserName', profile.full_name || 'Usuario');
            localStorage.setItem('andesTalentUser', JSON.stringify(profile));
        }
        return { session, profile: profile || null };
    } catch (err) {
        console.warn('[Supabase] Session sync failed:', err);
        return { session: null, profile: null };
    }
}

// ── Vault Document Management ────────────────────────────────
async function uploadAndeanDocument(docType, file, userId) {
    const client = getSB();
    if (!client || !userId) return { error: 'No autenticado.' };

    const fileExt = file.name.split('.').pop();
    const fileName = `${docType}_${Date.now()}.${fileExt}`;
    const filePath = `vault/${userId}/${fileName}`;

    try {
        // 1. Upload to Storage (Bucket: andes-vault)
        const { error: uploadError } = await client.storage
            .from('andes-vault')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        // 2. Get Public URL (Optional, but useful for preview)
        const { data: urlData } = client.storage.from('andes-vault').getPublicUrl(filePath);

        // 3. Update Profiles vault_docs JSON
        const { data: profile } = await client.from('profiles').select('vault_docs').eq('id', userId).single();
        const currentDocs = profile?.vault_docs || {};
        currentDocs[docType] = {
            path: filePath,
            public_url: urlData.publicUrl,
            name: file.name,
            uploaded_at: new Date().toISOString()
        };

        const { error: updateError } = await client
            .from('profiles')
            .update({ vault_docs: currentDocs, verification_status: 'in_review' })
            .eq('id', userId);

        if (updateError) throw updateError;

        return { success: true, doc: currentDocs[docType] };
    } catch (err) {
        console.error('[Vault Upload Error]', err);
        return { error: err.message };
    }
}

async function getAndeanVaultStatus(userId) {
    const client = getSB();
    if (!client || !userId) return null;
    const { data } = await client.from('profiles').select('vault_docs').eq('id', userId).single();
    return data?.vault_docs || {};
}

// Export for window
window.uploadAndeanDocument = uploadAndeanDocument;
window.getAndeanVaultStatus = getAndeanVaultStatus;

// ── Auth Listener for Persistence ────────────────────────────
getSB().auth.onAuthStateChange(async (event, session) => {
    console.log('[Supabase Auth Event]', event);
    if (session) {
        await syncAndeanSession();
    } else {
        // Aggressive Local Bypass: Do NOT clear storage automatically in local mode
        console.log('[Supabase] No session found, but allowing local bypass if flags exist.');
    }
});

// ── Sign Out ─────────────────────────────────────────────────
async function clearSession() {
    var client = getSB();
    if (client && client.auth) await client.auth.signOut();
    localStorage.clear();
    window.location.href = 'code.html';
}
