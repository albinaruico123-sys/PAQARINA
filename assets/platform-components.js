/**
 * CuscoTalent Shared Platform Components
 * Includes: Notification Center, Smart Contract Modal, and Onboarding Redirects.
 */

const PlatformComponents = {
    async init() {
        this.renderNotificationBell();
        this.checkOnboarding();
    },

    // 1. Notification Center
    renderNotificationBell() {
        const headerRight = document.querySelector('header .flex.items-center.gap-4') || document.querySelector('nav .flex.items-center.gap-4');
        if (!headerRight) return;

        const bellContainer = document.createElement('div');
        bellContainer.className = 'relative';
        bellContainer.innerHTML = `
            <button id="noti-bell" class="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high transition-all relative">
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-surface-container-low"></span>
            </button>
            <div id="noti-dropdown" class="hidden absolute right-0 mt-4 w-80 glass-premium rounded-3xl border border-outline-variant/30 shadow-2xl p-4 z-[1000]">
                <div class="flex items-center justify-between mb-4 px-2">
                    <h4 class="font-black text-xs uppercase tracking-widest text-primary">Notificaciones</h4>
                    <span class="text-[10px] text-secondary font-bold cursor-pointer">Marcar todo como leído</span>
                </div>
                <div class="space-y-3 max-h-96 overflow-y-auto" id="noti-list">
                    <!-- Priority Notification (Gold) -->
                    <div class="p-4 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-start gap-3">
                        <span class="material-symbols-outlined text-secondary text-sm">verified</span>
                        <div>
                             <p class="text-xs font-bold text-primary">Perfil Validado</p>
                             <p class="text-[10px] text-on-surface-variant">Tu DNI ha sido aprobado. Sello UNSAAC activado.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        headerRight.prepend(bellContainer);

        const bell = document.getElementById('noti-bell');
        const dropdown = document.getElementById('noti-dropdown');

        bell.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => dropdown.classList.add('hidden'));
    },

    // 2. Smart Contract Modal
    showSmartContract(data) {
        const modal = document.createElement('div');
        modal.id = 'smart-contract-modal';
        modal.className = 'fixed inset-0 bg-primary/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-6';
        modal.innerHTML = `
            <div class="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                         <h2 class="font-headline font-black text-xl text-primary">Contrato de Locación de Servicios</h2>
                         <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generado Automáticamente por CuscoTalent</p>
                    </div>
                    <button onclick="document.getElementById('smart-contract-modal').remove()" class="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-all">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div class="p-10 overflow-y-auto text-sm leading-relaxed text-slate-700 font-serif">
                    <p class="mb-4 text-center font-bold underline">CONTRATO DE LOCACIÓN DE SERVICIOS</p>
                    <p class="mb-4">Conste por el presente documento el contrato de locación de servicios que celebran de una parte <strong>${data.businessName || 'LA EMPRESA'}</strong>, y de la otra parte el locador <strong>${data.freelancerName || 'EL FREELANCER'}</strong>, bajo los términos siguientes:</p>
                    <p class="mb-4"><strong>PRIMERO:</strong> EL LOCADOR se compromete a realizar el servicio de: <span class="bg-yellow-50 px-1 font-sans font-bold">${data.jobTitle}</span>.</p>
                    <p class="mb-4"><strong>SEGUNDO:</strong> El monto pactado por el servicio asciende a la suma de <strong>S/. ${data.budget}</strong>.</p>
                    <p class="mb-8 font-sans bg-primary/5 p-4 rounded-xl border border-primary/10"><strong>NOTA FISCAL:</strong> Se recuerda al FREELANCER que, conforme a la normativa de la SUNAT (Perú), es su responsabilidad emitir el <strong>Recibo por Honorarios (RH)</strong> electrónico una vez recibido el pago. <a href="https://www.sunat.gob.pe/" target="_blank" class="text-secondary font-bold underline">Ver cómo emitir mi RH</a>.</p>
                </div>

                <div class="p-8 bg-slate-50 border-t flex gap-4">
                    <button onclick="document.getElementById('smart-contract-modal').remove()" class="flex-1 py-4 font-bold text-slate-500 hover:text-primary transition-all">Cancelar</button>
                    <button onclick="window.location.href='chat.html?contract=demo'" class="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">Aceptar y Abrir Chat de Pago</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // 3. Security/Onboarding Redirect
    async checkOnboarding() {
        const { session } = await syncAndeanSession();
        if (!session) return;

        const { data: profile } = await supabase.from('profiles').select('onboarding_completed').eq('id', session.user.id).single();
        
        if (profile && !profile.onboarding_completed && !window.location.pathname.includes('onboarding.html') && !window.location.pathname.includes('code.html')) {
            window.location.href = 'onboarding.html';
        }
    }
};

PlatformComponents.init();
