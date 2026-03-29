"""
1. Remove all hardcoded job cards from code.html
2. Add loadJobs() Supabase function to the script block
3. Inject loadJobs() call into window.addEventListener('load', ...)
"""

with open('code.html', 'r', encoding='utf-8') as f:
    c = f.read()

# ── STEP 1: Remove old hardcoded job cards ────────────────────
# They start with <!-- Job Card 1 --> and end just before </div> that closes the grid
OLD_CARDS_START = '                <!-- Job Card 1 -->'
# Find the closing </div></div> after the 3rd card's </div>
card_start = c.find(OLD_CARDS_START)
if card_start >= 0:
    # Find the closing </div> for the entire grid (after the 3 cards)
    # The section ends with the grid's outer </div>
    # We know the ticker section comes after
    ticker_marker = '<!-- Category Ticker -->'
    ticker_pos = c.find(ticker_marker, card_start)
    # Find closure of grid before ticker
    closing = c.rfind('</div>', card_start, ticker_pos)
    # We want to remove the cards but NOT the grid container's closing div
    # Remove from OLD_CARDS_START up to (but not including) the ticker section comment
    # Actually we need to remove from card_start to the closing </div>\n        </section>
    # Let's find where </section> is before the ticker
    section_end = c.rfind('</section>', card_start, ticker_pos)
    # Remove from card_start to just before \n        </section>
    c = c[:card_start] + c[section_end:]
    print('✓ Old job cards removed')
else:
    print('⚠ Old job cards not found (may already be removed)')

# ── STEP 2: Add loadJobs() function to script block ──────────
LOAD_JOBS_FUNC = '''
// ── Load Jobs from Supabase ──────────────────────────────────
async function loadJobs() {
    var grid = document.getElementById('jobs-grid');
    var loading = document.getElementById('jobs-loading');
    if (!grid) return;

    try {
        var res = await supabase
            .from('jobs')
            .select('*, profiles!company_id(full_name)')
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(6);

        if (loading) loading.remove();

        if (!res.data || res.data.length === 0) {
            grid.innerHTML = '<div class="col-span-3 text-center py-20 text-on-surface-variant"><span class="material-symbols-outlined text-5xl mb-4 block text-outline">work_off</span><p class="font-semibold">No hay convocatorias abiertas aún.</p><p class="text-sm mt-1">Las empresas aún no han publicado proyectos.</p></div>';
            return;
        }

        var icons = { 'Ingeniería de Sistemas': 'code', 'Derecho': 'gavel', 'Arte y Diseño': 'brush', 'Marketing': 'campaign', 'Contabilidad': 'calculate', 'Turismo': 'travel_explore' };
        
        res.data.forEach(function(job, i) {
            var icon = icons[job.category] || 'work';
            var company = (job.profiles && job.profiles.full_name) ? job.profiles.full_name : 'Empresa Verificada';
            var salary = job.salary ? 'S/ ' + Number(job.salary).toLocaleString() : 'A convenir';
            var border = i === 0 ? 'border-t-4 border-secondary' : '';
            var card = document.createElement('div');
            card.className = 'glass-premium p-6 rounded-3xl hover-gold-glow cursor-pointer transition-all flex flex-col justify-between ' + border;
            card.onclick = function() { openProjectModal(job.title, company, salary, icon, job.description || ''); };
            card.innerHTML = '<div>' +
                '<div class="flex justify-between items-start mb-4">' +
                    '<div class="w-12 h-12 bg-secondary-container/20 rounded-xl flex items-center justify-center text-secondary">' +
                        '<span class="material-symbols-outlined">' + icon + '</span>' +
                    '</div>' +
                    '<span class="bg-primary/5 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/10">' + (job.category || 'General') + '</span>' +
                '</div>' +
                '<p class="text-[10px] text-outline font-bold uppercase tracking-widest mb-1">' + company + '</p>' +
                '<h3 class="font-headline text-xl font-bold text-primary mb-2">' + job.title + '</h3>' +
                '<p class="text-on-surface-variant text-sm line-clamp-2">' + (job.description || '') + '</p>' +
                '</div>' +
                '<div class="mt-6 pt-4 border-t border-outline-variant/30 flex justify-between items-center">' +
                    '<div class="flex items-center gap-2">' +
                        '<span class="material-symbols-outlined text-green-700 text-sm">payments</span>' +
                        '<span class="font-bold text-green-800 text-sm">' + salary + '</span>' +
                    '</div>' +
                    '<button type="button" onclick="openProjectModal(\'' + job.title.replace(/'/g,"\\'")+'\',\'' + company.replace(/'/g,"\\'")+'\',\'' + salary + '\',\'' + icon + '\',\'' + (job.description||'').replace(/'/g,"\\'").replace(/\n/g,' ').substring(0,200) + '\')" class="text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">Postular</button>' +
                '</div>';
            grid.appendChild(card);
        });
    } catch(e) {
        console.error('[loadJobs] Error:', e);
        if (loading) loading.innerHTML = '<p class="text-red-500">Error al cargar convocatorias.</p>';
    }
}
'''

# Insert before the session check at bottom of script
INSERT_BEFORE = '// ── Session Check on page load'
if INSERT_BEFORE in c:
    c = c.replace(INSERT_BEFORE, LOAD_JOBS_FUNC + INSERT_BEFORE)
    print('✓ loadJobs() function added')

# ── STEP 3: Call loadJobs() in window.load handler ────────────
OLD_LOAD_CALL = "var result = await syncAndeanSession();"
NEW_LOAD_CALL = "loadJobs();\n        var result = await syncAndeanSession();"
if OLD_LOAD_CALL in c:
    c = c.replace(OLD_LOAD_CALL, NEW_LOAD_CALL, 1)
    print('✓ loadJobs() called in window.load')

with open('code.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Done.')
