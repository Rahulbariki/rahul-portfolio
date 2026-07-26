import re

file_path = "d:\\Ai Projects\\Rahul\'s Portfolio\\rahul-portfolio.html"
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace css vars in HTML usage
html = html.replace('var(--blue)', 'var(--yellow)')
html = html.replace('var(--cyan)', 'var(--grey-light)')
html = html.replace('var(--green)', 'var(--white)')

html = html.replace('--blue:', '--yellow:')
html = html.replace('--cyan:', '--grey-light:')
html = html.replace('--green:', '--white:')

# Replace static rgba colors (blue -> yellow, cyan -> grey, green -> white)
html = html.replace('rgba(59, 130, 246', 'rgba(255, 215, 0')
html = html.replace('rgba(59,130,246', 'rgba(255,215,0')
html = html.replace('rgba(34, 211, 238', 'rgba(200, 200, 200')
html = html.replace('rgba(34,211,238', 'rgba(200,200,200')
html = html.replace('rgba(34, 197, 94', 'rgba(255, 255, 255')
html = html.replace('rgba(34,197,94', 'rgba(255,255,255')

css_root_new = '''    [data-theme="dark"] {
      --bg: #050505;
      --bg2: #0f0f0f;
      --bg3: #1a1a1a;
      --yellow: #ffd700;
      --grey-light: #aaaaaa;
      --white: #ffffff;
      --text: #eeeeee;
      --muted: #888888;
      --border: rgba(255, 215, 0, 0.15);
      --glow: rgba(255, 215, 0, 0.2);
    }
    
    [data-theme="light"] {
      --bg: #f5f5f5;
      --bg2: #ebebeb;
      --bg3: #e0e0e0;
      --yellow: #b8860b;
      --grey-light: #555555;
      --white: #111111;
      --text: #1a1a1a;
      --muted: #666666;
      --border: rgba(0, 0, 0, 0.1);
      --glow: rgba(184, 134, 11, 0.2);
    }'''

# Replace the original :root block with our new theme root
html = re.sub(r'    :root \{[^\}]+\}', css_root_new, html, count=1, flags=re.MULTILINE|re.DOTALL)

# Default to dark mode on body
html = html.replace('<body>', '<body data-theme="dark">')

# Replace global toggle CSS
toggle_css = '''
    /* THEME TOGGLE */
    .theme-toggle {
      background: var(--bg3);
      border: 1px solid var(--border);
      color: var(--text);
      width: 44px; height: 44px;
      border-radius: 50%;
      cursor: none;
      display: flex;
      align-items: center; justify-content: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      margin-left: 20px;
    }
    .theme-toggle:hover { border-color: var(--yellow); box-shadow: 0 0 15px var(--glow); transform: scale(1.05); }
    .theme-toggle .icon { position: absolute; transition: transform 0.4s ease, opacity 0.4s ease; font-size: 1.1rem; }
    
    body[data-theme="dark"] .light-icon { opacity: 1; transform: translateY(0) scale(1.1); }
    body[data-theme="dark"] .dark-icon { opacity: 0; transform: translateY(20px) scale(0.5); }
    body[data-theme="light"] .light-icon { opacity: 0; transform: translateY(-20px) scale(0.5); }
    body[data-theme="light"] .dark-icon { opacity: 1; transform: translateY(0) scale(1.1); }

    /* NAV */'''
html = html.replace('    /* NAV */', toggle_css)

# Inject toggle inside NAV
nav_end_idx = html.find('  </nav>')
if nav_end_idx != -1:
    nav_toggle_html = '''    </ul>
    <button id="theme-toggle" class="theme-toggle">
      <span class="icon light-icon">☀️</span>
      <span class="icon dark-icon">🌙</span>
    </button>
'''
    html = re.sub(r'    </ul>', nav_toggle_html, html, count=1)

# Add toggle JS Logic
toggle_js = '''
    /* ─── THEME TOGGLE ─── */
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
      const body = document.body;
      const current = body.getAttribute('data-theme');
      body.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });

    // Cursor scale-up on hoverable elements
    document.querySelectorAll('a, button, .project-card, .skill-cat, .exp-card, .cert-card, .stat-card, .theme-toggle').forEach(el => {
'''
html = html.replace('    // Cursor scale-up on hoverable elements\n    document.querySelectorAll(\'a, button, .project-card, .skill-cat, .exp-card, .cert-card, .stat-card\').forEach(el => {', toggle_js)

# Replace three.js colors (Hex)
# Blue -> Yellow
html = html.replace('0x3b82f6', '0xffd700')
# Dark emissive -> Goldenrod
html = html.replace('0x1d4ed8', '0xb8860b')
# Cyan -> Grey Light
html = html.replace('0x22d3ee', '0xcccccc')
# Dark cyan emissive -> Dark Grey
html = html.replace('0x0891b2', '0x555555')
# Green -> White
html = html.replace('0x22c55e', '0xffffff')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("done")
