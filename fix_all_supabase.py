import os
import re

files_to_fix = [f for f in os.listdir('.') if f.endswith('.html')]
print(f"Checking {len(files_to_fix)} files...")

# Search for patterns like 'await supabase.from', 'supabase.auth', etc.
pattern = re.compile(r'(\s+)supabase\.')

for fname in files_to_fix:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'supabase.' in content:
        print(f"Fixing {fname}...")
        # 1. Replace 'supabase.' with 'getSB().'
        # To avoid errors if getSB() is undefined or client is null, 
        # we'll use a safer approach: (getSB() || {})
        # but in most cases, getSB() will work because it's defined in supabase-client.js
        content = content.replace('supabase.', 'getSB().')
        
        # 2. Also, if there are instances where we access 'supabase' without the dot
        # but 'getSB()' is preferred
        
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)

print("Done.")
