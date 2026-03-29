// ============================================================
//  CuscoTalent — MOCK CLIENT (Sin Supabase, datos locales)
//  Para usar Supabase real, reemplaza este archivo con el
//  cliente original y define tus credenciales.
// ============================================================

// ── Mock Data ───────────────────────────────────────────────

const MOCK_USERS = [
    { id: 'u-001', email: 'empresa@demo.com',    password: 'empresa123',  role: 'company',    full_name: 'Paqarina Hub',     onboarding_completed: true },
    { id: 'u-002', email: 'talento@demo.com',    password: 'talento123',  role: 'freelancer', full_name: 'María Quispe',     onboarding_completed: true },
    { id: 'u-003', email: 'admin@demo.com',      password: 'admin123',    role: 'admin',      full_name: 'Admin Paqarina',   onboarding_completed: true },
];

const MOCK_JOBS = [
    { id: 'j-001', company_id: 'u-001', title: 'Desarrollador Frontend React', category: 'Ingeniería de Sistemas', salary: 1500, description: 'Buscamos talento UNSAAC para crear landing pages para 3 startups incubadas en el Hub Tecnológico.', experience_level: 'Junior', created_at: new Date().toISOString() },
    { id: 'j-002', company_id: 'u-001', title: 'Asesoría Legal Corporativa',    category: 'Derecho',                salary: 800,  description: 'Actualización de contratos bilingües y revisión de términos para nueva temporada alta.',     experience_level: 'Junior', created_at: new Date().toISOString() },
    { id: 'j-003', company_id: 'u-001', title: 'Diseñador Gráfico / UI',        category: 'Arte y Diseño',          salary: 1200, description: 'Creación de catálogo digital y rediseño de menú para restaurantes en el Valle Sagrado.',       experience_level: 'Junior', created_at: new Date().toISOString() },
];

// ── Session Helpers ──────────────────────────────────────────

function _getSession() {
    try { return JSON.parse(sessionStorage.getItem('_mockSession') || 'null'); } catch { return null; }
}
function _setSession(sessionObj) {
    if (sessionObj) { sessionStorage.setItem('_mockSession', JSON.stringify(sessionObj)); }
    else { sessionStorage.removeItem('_mockSession'); }
}

// ── AUTO-BOOTSTRAP: Ensure a default session always exists ───
// This makes all protected pages accessible without logging in.
// Login still works to switch between user accounts.
(function autoBootstrapSession() {
    if (!_getSession()) {
        // Default to freelancer account so all pages work immediately
        _setSession({ user: { id: 'u-002', email: 'talento@demo.com' } });
        sessionStorage.setItem('andesTalentLoggedIn', 'true');
        sessionStorage.setItem('andesTalentRole', 'freelancer');
        sessionStorage.setItem('andesTalentUser', JSON.stringify({
            id: 'u-002', full_name: 'María Quispe', role: 'freelancer', onboarding_completed: true
        }));
    }
})();

// Global helper to log out
function clearSession() {
    sessionStorage.clear();
    window.location.href = 'code.html';
}

// ── Query Builder (chainable) ────────────────────────────────

function _makeQuery(tableName) {
    let _data = tableName === 'profiles' ? MOCK_USERS.map(u => ({
        id: u.id, full_name: u.full_name, role: u.role, onboarding_completed: u.onboarding_completed
    })) : tableName === 'jobs' ? [...MOCK_JOBS] : [];

    let _filters = [];
    let _single = false;
    let _updatePayload = null;
    let _upsertPayload = null;
    let _insertPayload = null;

    const q = {
        select: (_cols) => q,
        eq: (col, val) => { _filters.push({ col, val }); return q; },
        order: (_col, _opts) => q,
        limit: (_n) => q,
        single: () => { _single = true; return q; },
        update: (payload) => { _updatePayload = payload; return q; },
        upsert: (payload) => { _upsertPayload = payload; return resolve(); },
        insert: (payload) => { _insertPayload = payload; return resolve(); },
        then: (resolve) => resolve(resolveResult()),
    };

    function applyFilters(rows) {
        return _filters.reduce((acc, f) => acc.filter(r => r[f.col] == f.val), rows);
    }

    function resolveResult() {
        if (_updatePayload || _upsertPayload || _insertPayload) return { data: {}, error: null };
        const filtered = applyFilters(_data);
        if (_single) {
            return filtered.length > 0
                ? { data: filtered[0], error: null }
                : { data: null, error: { message: 'Row not found' } };
        }
        return { data: filtered, error: null };
    }

    function resolve() { return Promise.resolve(resolveResult()); }

    // Make it awaitable
    q[Symbol.toStringTag] = 'Promise';
    const originalThen = q.then;
    q.then = (onFulfilled, onRejected) => Promise.resolve(resolveResult()).then(onFulfilled, onRejected);

    return q;
}

// ── Mock Supabase Object ─────────────────────────────────────

const supabase = {
    auth: {
        getSession: async () => {
            const s = _getSession();
            return { data: { session: s ? { user: s.user } : null }, error: null };
        },

        signInWithPassword: async ({ email, password }) => {
            const user = MOCK_USERS.find(u => u.email === email && u.password === password);
            if (!user) return { data: null, error: { message: 'Correo o contraseña incorrectos.' } };
            const session = { user: { id: user.id, email: user.email } };
            _setSession(session);
            return { data: { user: session.user, session }, error: null };
        },

        signUp: async ({ email, password }) => {
            const exists = MOCK_USERS.find(u => u.email === email);
            if (exists) return { data: null, error: { message: 'Este correo ya está registrado. Usa "Iniciar Sesión".' } };
            const newUser = { id: 'u-' + Date.now(), email, password, role: 'freelancer', full_name: email.split('@')[0], onboarding_completed: true };
            MOCK_USERS.push(newUser);
            const session = { user: { id: newUser.id, email: newUser.email } };
            _setSession(session);
            return { data: { user: session.user, session }, error: null };
        },

        signOut: async () => {
            _setSession(null);
            sessionStorage.clear();
            return { error: null };
        },

        onAuthStateChange: (callback) => {
            // No-op in mock; return a fake subscription
            return { data: { subscription: { unsubscribe: () => {} } } };
        },
    },

    from: (tableName) => _makeQuery(tableName),
};

// ── Global Session Sync Helper (same API as real client) ─────

async function syncAndeanSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        const mockUser = MOCK_USERS.find(u => u.id === session.user.id);
        if (mockUser) {
            const profile = { id: mockUser.id, full_name: mockUser.full_name, role: mockUser.role, onboarding_completed: mockUser.onboarding_completed };
            sessionStorage.setItem('andesTalentRole', profile.role);
            sessionStorage.setItem('andesTalentLoggedIn', 'true');
            sessionStorage.setItem('andesTalentUser', JSON.stringify(profile));
            return { session, profile };
        }
    } else {
        sessionStorage.removeItem('andesTalentLoggedIn');
        sessionStorage.removeItem('andesTalentRole');
        sessionStorage.removeItem('andesTalentUser');
    }
    return { session: null, profile: null };
}
