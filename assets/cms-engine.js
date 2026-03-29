/**
 * CuscoTalent Visual CMS Engine
 * Enables 'Edit Mode' for admins to modify text strings globally.
 */

const CMSEngine = {
    isAdmin: false,
    editMode: false,

    async init() {
        // 1. Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            this.isAdmin = profile?.role === 'admin';
        }

        // 2. Load all CMS content
        await this.loadAllContent();

        // 3. Listen for Edit Mode toggle from admin panel (via storage for cross-tab sync)
        window.addEventListener('storage', () => {
            const mode = sessionStorage.getItem('andesCMSMode') === 'true';
            if (mode !== this.editMode) {
                this.toggleEditMode(mode);
            }
        });

        // Initial check
        const initialMode = sessionStorage.getItem('andesCMSMode') === 'true';
        if (initialMode) this.toggleEditMode(true);
    },

    async loadAllContent() {
        const { data, error } = await supabase.from('cms_content').select('*');
        if (data) {
            data.forEach(item => {
                const elements = document.querySelectorAll(`[data-cms-key="${item.key}"]`);
                elements.forEach(el => {
                    el.textContent = item.content;
                });
            });
        }
    },

    toggleEditMode(active) {
        if (!this.isAdmin && active) return;
        this.editMode = active;
        
        const editableElements = document.querySelectorAll('[data-cms-key]');
        
        if (active) {
            editableElements.forEach(el => {
                el.style.position = 'relative';
                el.style.outline = '1px dashed #D4AF37';
                
                const btn = document.createElement('button');
                btn.className = 'cms-edit-btn absolute -top-4 -right-4 bg-secondary text-primary w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-[100] transition-all hover:scale-110';
                btn.innerHTML = '<span class="material-symbols-outlined text-xs">edit</span>';
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.promptEdit(el);
                };
                el.appendChild(btn);
            });
        } else {
            editableElements.forEach(el => {
                el.style.outline = 'none';
                const btn = el.querySelector('.cms-edit-btn');
                if (btn) btn.remove();
            });
        }
    },

    async promptEdit(element) {
        const key = element.getAttribute('data-cms-key');
        const currentText = element.textContent.replace('edit', '').trim(); // Remove edit icon text if any
        const newText = prompt(`Editar contenido para [${key}]:`, currentText);
        
        if (newText !== null && newText !== currentText) {
            // Update UI
            element.childNodes[0].textContent = newText; // Update main text, keep button
            
            // Update Supabase
            const { error } = await supabase
                .from('cms_content')
                .upsert({ key: key, content: newText, updated_at: new Date() });
            
            if (error) {
                alert('Error al guardar en CMS: ' + error.message);
            }
        }
    }
};

// Auto-run if Supabase is available
if (window.supabase) {
    CMSEngine.init();
}
