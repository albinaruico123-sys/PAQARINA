"""Remove the old duplicate doAuth block that was left after the replace operation."""
with open('code.html', 'r', encoding='utf-8') as f:
    c = f.read()

# The old code block starts right after the new doAuth() closing brace
# Find the second occurrence of "async function doAuth()" and remove everything from it
# to the second closing block

first = c.find('async function doAuth()')
second = c.find('async function doAuth()', first + 1)

if second > 0:
    # Find the end of the old block - it ends at the matching closing brace + the session check block
    # The old block is from `second` to the next function definition
    next_func = c.find('\n// ──', second)
    if next_func < 0:
        next_func = c.find('\nfunction ', second)
    
    old_block = c[second:next_func]
    print('OLD BLOCK FOUND, length:', len(old_block))
    print('Preview:', old_block[:200])
    
    c = c[:second] + c[next_func:]
    with open('code.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Cleaned.')
else:
    # No duplicate, but check for the orphaned variable declarations
    # Find the orphaned lines (the old function body variables after new function ends)
    old_vars = "\n    var email    = (document.getElementById('login-email')?.value || '').trim();"
    pos = c.find(old_vars)
    if pos > 0:
        # Find the end of this old block
        end = c.find('\n// ──', pos)
        print('Found orphaned vars at', pos, 'to', end)
        c = c[:pos] + c[end:]
        with open('code.html', 'w', encoding='utf-8') as f:
            f.write(c)
        print('Cleaned orphaned vars.')
    else:
        print('No duplicate found - file may be clean')
