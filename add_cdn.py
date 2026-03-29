"""
Add Supabase CDN script tag back to all HTML files,
before the assets/supabase-client.js script tag.
"""
import re, os

CDN_TAG = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n'

files = [
    'code.html', 'admin.html', 'chat.html', 'explorar.html',
    'company-profile.html', 'freelancer-profile.html',
    'onboarding.html', 'public-profile.html'
]

for fname in files:
    if not os.path.exists(fname):
        print(f'SKIP (not found): {fname}')
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        c = f.read()

    # Skip if CDN already added
    if 'cdn.jsdelivr.net/npm/@supabase/supabase-js' in c:
        print(f'~ Already has CDN: {fname}')
        continue

    # Insert CDN just before the supabase-client.js script
    new_c = c.replace(
        '<script src="assets/supabase-client.js"></script>',
        CDN_TAG + '<script src="assets/supabase-client.js"></script>'
    )
    if new_c == c:
        # Try alternate paths
        new_c = c.replace(
            '<script src="./assets/supabase-client.js"></script>',
            CDN_TAG + '<script src="./assets/supabase-client.js"></script>'
        )

    if new_c != c:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(new_c)
        print(f'✓ Added CDN: {fname}')
    else:
        print(f'⚠ supabase-client.js tag not found: {fname}')
        # Add CDN before </head>
        new_c = c.replace('</head>', CDN_TAG + '    <script src="assets/supabase-client.js"></script>\n</head>', 1)
        if new_c != c:
            with open(fname, 'w', encoding='utf-8') as f:
                f.write(new_c)
            print(f'  → Added before </head>: {fname}')

print('Done.')
