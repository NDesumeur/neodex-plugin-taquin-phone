// Taquin : fais glisser les pièces pour remettre l'image en ordre. Chiffres, ton fond NeoDex, ton image ou des images toutes prêtes en pixel art.
// Appli NeoDex habillée en pixel art (police bitmap, cadres et boutons en pixels). Elle tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Taquin</span><span class="hint" id="tqInfo" data-pxskip></span></div>
  <div class="tqMain"><div class="tqBoardBox"><div id="tqBoard" data-pxskip></div><div id="tqPreview"></div></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="tqStats"></div></div>
      <label class="row">Taille <select class="f gSel" id="tqSize"><option value="3">3 × 3</option><option value="4" selected>4 × 4</option><option value="5">5 × 5</option><option value="6">6 × 6</option><option value="7">7 × 7</option><option value="8">8 × 8</option></select></label>
      <label class="row">Image <select class="f gSel" id="tqSrc"><option value="num">Chiffres</option><option value="fond" selected>Ton fond NeoDex</option><option value="perso">Ton image</option><optgroup label="Images pixel art"><option value="px0">Montagnes au couchant</option><option value="px1">Phare la nuit</option><option value="px2">Forêt d'automne</option><option value="px3">Oasis</option><option value="px4">Renard</option><option value="px5">Poisson clown</option><option value="px6">Tortue</option></optgroup></select></label>
      <div class="row"><button class="btn main" id="tqNew">MÉLANGER</button><button class="btn" id="tqPick">CHOISIR UNE IMAGE</button></div>
      <label class="check"><input type="checkbox" id="tqNums" checked> Numéros sur l'image</label>
      <div class="row"><button class="btn" id="tqPeek">Maintenir : voir le modèle</button></div>
      <div class="hint">Touche une pièce sur la ligne ou la colonne du trou pour la faire glisser. Ton image est gardée dans la sauvegarde.</div>
    </div></div>
  <input type="file" id="tqFile" accept="image/*" hidden>
</div>`;
const CSS = `.tqMain{display:flex;gap:26px;align-items:flex-start;flex-wrap:wrap}
.tqBoardBox{position:relative;flex:none;padding:6px;background:#05010b;box-shadow:0 0 0 3px var(--line2)}
#tqBoard{position:relative}
.tqTile{position:absolute;left:0;top:0;display:grid;place-items:center;font-family:var(--text);color:#f4ecff;background:#3a1a66;box-shadow:inset -4px -4px 0 #1e0c3a,inset 4px 4px 0 #8a5cf0,0 0 0 1px #05010b;cursor:var(--cp,pointer);transition:transform .12s steps(3);image-rendering:pixelated;user-select:none}
.tqTile.ok:not([style*="background-image"]){color:#7ee07a}
.tqTile[style*="background-image"]{box-shadow:inset 0 0 0 1px rgba(5,1,11,.7)}
.tqTile .tqNum{display:none;font:13px var(--text);color:#fff;background:rgba(5,1,11,.65);padding:2px 5px;position:absolute;left:4px;top:4px}
.tqTile.numbers .tqNum{display:block}
.tqTile.hole{transition:opacity .4s}
#tqPreview{display:none;position:absolute;inset:6px;background-size:100% 100%;image-rendering:pixelated;box-shadow:0 0 0 3px #ffd84a;pointer-events:none}
#tqPreview.on{display:block}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:400px}
#tqInfo{font:16px var(--text)}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx, ask, newTab, pixIcon, PIX, WX } = host;
  const folder = ctx.folder, legacy = ctx.legacy || {};
  ctx.host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "TAQUIN", T: {"k": "#050c06", "k2": "#0c1a0e", "fill": "#142a18", "fillOn": "#1c3a22", "hl": "#24482a", "line": "#3a6a40", "acc": "#3fe0ff", "accL": "#c8f8ff", "accS": "#1a9ac0", "accD": "#06304a", "rivet": "#c8f8ff", "btn": "#24482a", "btnHi": "#5a9a5a", "btnLo": "#0c1a0e", "btnHov": "#2a5430", "btnHovHi": "#7aba7a", "text": "#f0fff0", "muted": "#b0d0a8", "acc2": "#ff4fa8", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#060e08", "bgDot": "#142a18", "bgDot2": "#0c1a0e", "spark": "#3a6a40", "spark2": "#ff4fa8", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["kkkkkkkkkkkk", "kaaakbbbkcck", "kaaakbbbkcck", "kaaakbbbkcck", "kkkkkkkkkkkk", "kbbbkccckkkk", "kbbbkccck..k", "kbbbkccck..k", "kkkkkkkkkkkk", "kccck....aak", "kccck....aak", "kkkkkkkkkkkk"],
  icons: [[/^MÉLANGER/, "play"], [/^RECORDS/, "crown"], [/^CHOISIR/, "folder"]] });
  const $ = id => id === "taquinApp" ? view : (view.querySelector('#' + id) || document.getElementById(id));  // les identifiants de ta vue d'abord, puis ceux de la page (fenêtres, menus)
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const __icon = () => ctx.icon;  // l'icône de ce plugin
  const LEGACY_GAMES = {"top":["taquin","taquinImg"],"best":"^taquin"};
  let games = await doc('games');
  if (games == null) {  // première ouverture : tu retrouves tes records et tes parties d'avant
    const old = legacy.api ? await legacy.api('games').catch(() => null) : null; games = { best: {} };
    if (old) { const re = new RegExp(LEGACY_GAMES.best); for (const [k, v] of Object.entries(old.best || {})) if (re.test(k)) games.best[k] = v; for (const k of LEGACY_GAMES.top) if (old[k] !== undefined) games[k] = old[k]; await folder.write('games', games); }
  }
  games = { best: {}, ...games };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v, higher = true) => { const b = games.best[k]; if (b == null || (higher ? v > b : v < b)) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);  // la section d'un jeu
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // centred pixel-font lines over a dark band
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  g.textAlign = 'center';
  lines.forEach(([text, color, size], i) => { g.fillStyle = color; g.font = (size || 8) + 'px "Press Start 2P", monospace'; g.fillText(text, w / 2, y0 + i * 14); });
  g.textAlign = 'left';
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
  // ---- ton code d'origine ----
const anyOf = a => a[Math.floor(Math.random() * a.length)];
const shuffled = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Taquin: slide the tiles back in order; numbers, the current NeoDex sky, or your own image (kept in the save) ---------- */
let tq = null, tqSky = null;
const tqSkyNow = () => ctx.host.sky ? ctx.host.sky().then(u => { tqSky = u; }).catch(() => {}) : Promise.resolve();
function tqImage() {
  const src = $('tqSrc').value;
  if (src === 'perso') return games.taquinImg || null;
  if (src === 'fond') return tqSky;
  if (src.startsWith('px')) return tqArt(+src.slice(2));  // a square cut from the two sky layers, as on screen (given by NeoDex, refreshed at each opening)
  return null;
}
function tqNew() {
  const n = +$('tqSize').value, tiles = [...Array(n * n).keys()];  // tiles[pos] = tile number, n*n-1 = the hole
  let hole = n * n - 1, prev = -1;
  for (let k = 0; k < 120 * n * n; k++) {  // random legal moves from the solved grid: always solvable
    const opts = [hole - n, hole + n, hole % n ? hole - 1 : -1, hole % n < n - 1 ? hole + 1 : -1].filter(p => p >= 0 && p < n * n && p !== prev);
    const p = anyOf(opts); [tiles[hole], tiles[p]] = [tiles[p], tiles[hole]]; prev = hole; hole = p;
  }
  if (tiles.every((t, i) => t === i)) return tqNew();
  tq = {n, tiles, moves: 0, t0: 0, secs: 0, done: false, img: tqImage()};
  $('taquinApp').classList.toggle('perso', $('tqSrc').value === 'perso' || $('tqSrc').value.startsWith('px'));  // your own picture keeps its colours; NeoDex's decor follows the theme
  $('tqBoard').replaceChildren();
  if ($('tqSrc').value === 'perso' && !tq.img) toast('Choisis d\'abord une image');
  tqRender();
}
function tqMove(pos) {
  if (!tq || tq.done) return;
  const n = tq.n, hole = tq.tiles.indexOf(n * n - 1), hr = Math.floor(hole / n), hc = hole % n, r = Math.floor(pos / n), c = pos % n;
  if (pos === hole || (r !== hr && c !== hc)) return;
  const step = r === hr ? Math.sign(c - hc) : Math.sign(r - hr) * n;  // slides the whole line between the tile and the hole
  for (let p = hole; p !== pos; p += step) { [tq.tiles[p], tq.tiles[p + step]] = [tq.tiles[p + step], tq.tiles[p]]; tq.moves++; }
  if (!tq.t0) tq.t0 = Date.now();
  sfx('click');
  if (tq.tiles.every((t, i) => t === i)) {
    tq.done = true; tq.secs = Math.round((Date.now() - tq.t0) / 1000);
    const st = gstore('taquin', {done: 0}); st.done++;
    const rec = best('taquin' + n, tq.moves, false); best('taquinT' + n, tq.secs, false); saveGames(); sfx('launch');
    if (rec) toast('Nouveau record : ' + tq.moves + ' coups');
  }
  tqRender();
}
function tqRender() {
  // la taille du plateau : la hauteur de la fenêtre et la place à côté du panneau (ou toute la largeur quand le panneau passe dessous)
  const n = tq.n, mw = view.querySelector('.tqMain').clientWidth || 900, bw = mw >= 640 ? mw - 318 : mw - 32;   // téléphone : le cadre (6 px de marge et 3 px de bord de chaque côté) doit tenir aussi
  const size = Math.floor(Math.max(200, Math.min(880, innerHeight - 200, bw)) / n) * n, cell = size / n, box = $('tqBoard');
  box.style.width = box.style.height = size + 'px';
  if (box.children.length !== n * n) box.replaceChildren(...Array.from({length: n * n}, (_, t) => {
    const d = el('div', 'tqTile' + (t === n * n - 1 ? ' hole' : '')); d.dataset.t = t;
    if (tq.img) { d.style.backgroundImage = `url(${tq.img})`; d.style.backgroundSize = `${n * 100}% ${n * 100}%`; d.style.backgroundPosition = `${t % n / (n - 1) * 100}% ${Math.floor(t / n) / (n - 1) * 100}%`; d.append(el('span', 'tqNum', String(t + 1))); }
    else d.append(el('b', '', String(t + 1)));
    d.onclick = () => tqMove(tq.tiles.indexOf(t));
    return d;
  }));
  for (const d of box.children) {
    const t = +d.dataset.t, p = tq.tiles.indexOf(t);
    Object.assign(d.style, {width: cell + 'px', height: cell + 'px', transform: `translate(${p % n * cell}px, ${Math.floor(p / n) * cell}px)`, fontSize: cell * .35 + 'px'});
    d.classList.toggle('ok', p === t); d.classList.toggle('numbers', $('tqNums').checked);
    if (t === n * n - 1) d.style.opacity = tq.done ? 1 : 0;
  }
  const rec = games.best['taquin' + n], secs = tq.done ? tq.secs : tq.t0 ? Math.round((Date.now() - tq.t0) / 1000) : 0;
  $('tqInfo').textContent = (tq.done ? 'Résolu ! ' : '') + tq.moves + ' coups · ' + clock(secs) + ' · record ' + (rec ? rec + ' coups' : '—');
  tqStats();
}
function tqStats() {  // les records de chaque taille déjà résolue (coups et temps), puis le nombre de taquins résolus
  const rows = [3, 4, 5, 6, 7, 8].filter(k => games.best['taquin' + k]).map(k => [k + ' × ' + k, games.best['taquin' + k] + ' coups · ' + clock(games.best['taquinT' + k] || 0)]);
  rows.push(['Résolus', String(games.taquin?.done || 0)]);
  $('tqStats').replaceChildren(...rows.flatMap(([k, v]) => [el('span', '', k), el('b', '', v)]));
}
addEventListener('resize', () => { if (tq && view.classList.contains('on')) tqRender(); });  // le plateau suit la fenêtre
/* ---------- les images toutes prêtes : dessinées pixel par pixel sur 48 × 48, agrandies sans lissage ---------- */
const TQ_ART = [
  g => {  // montagnes au couchant
    ['#2a1a5a', '#4a2a7a', '#7a3a8a', '#b04a7a', '#e06a5a', '#ff9a4a', '#ffc85a'].forEach((c, i) => tqPx(g, c, 0, i * 4, 48, 48));
    tqEll(g, '#fff0a0', 34, 26, 6, 6); tqEll(g, '#ffd84a', 34, 26, 5, 5);
    tqRidge(g, '#3a2a5a', 30, 6, 3, 1); tqRidge(g, '#2a1a40', 34, 5, 7, 2);
    for (let x = 0; x < 48; x++) { const y = Math.round(tqH(x, 3, 1) + 4); if (y < 26) tqPx(g, '#e8e0ff', x, y, 1, 2); }  // la neige sur les sommets de la crête du fond
    tqPx(g, '#1a2a5a', 0, 38, 48, 10); for (let y = 39; y < 48; y += 2) for (let x = (y * 5) % 7; x < 48; x += 7) tqPx(g, '#ff9a4a', x, y, 2, 1);
    tqPx(g, '#ffd84a', 32, 40, 4, 1); tqPx(g, '#ffd84a', 33, 43, 2, 1);
  },
  g => {  // un phare la nuit
    ['#05081a', '#0a1028', '#101a3a', '#18264a'].forEach((c, i) => tqPx(g, c, 0, i * 8, 48, 48));
    for (const [x, y] of [[14, 2], [24, 4], [33, 2], [42, 6], [45, 23], [30, 21], [3, 16]]) tqPx(g, '#e8f0ff', x, y);
    tqEll(g, '#f4f0d0', 6, 6, 3, 3); tqEll(g, '#0a1028', 8, 5, 2, 2);
    tqPx(g, '#0e2a4a', 0, 32, 48, 16); for (let y = 33; y < 48; y += 3) for (let x = (y * 3) % 9; x < 48; x += 9) tqPx(g, '#3a6a9a', x, y, 3, 1);
    tqEll(g, '#2a2a3a', 14, 34, 10, 4); tqPx(g, '#3a3a4a', 6, 31, 16, 3);
    for (let y = 12; y < 31; y++) { const w = 6 - Math.floor((y - 12) / 8), x = 14 - Math.ceil(w / 2); tqPx(g, Math.floor((y - 12) / 4) % 2 ? '#f4f0f0' : '#d4143c', x, y, w, 1); }
    tqPx(g, '#2a2a3a', 10, 8, 8, 4); tqPx(g, '#ffe08a', 12, 9, 4, 2); tqPx(g, '#d4143c', 11, 6, 6, 2); tqPx(g, '#d4143c', 13, 5, 2, 1);
    tqTri(g, '#26305a', 17, 9, 47, 3, 47, 17); tqTri(g, '#3a4878', 17, 10, 47, 7, 47, 13);  // le faisceau
  },
  g => {  // une forêt d'automne
    ['#5aa0e8', '#7ab4f0', '#9ac8f4'].forEach((c, i) => tqPx(g, c, 0, i * 6, 48, 48)); tqPx(g, '#b8dcf8', 0, 18, 48, 8);
    tqEll(g, '#ffffff', 10, 6, 5, 2); tqEll(g, '#ffffff', 14, 5, 4, 2); tqEll(g, '#ffffff', 36, 9, 6, 2);
    tqRidge(g, '#6a9a5a', 24, 3, 11, 1.5); tqPx(g, '#7aa04a', 0, 32, 48, 16);
    for (let y = 32; y < 48; y++) { const c = 22 + Math.round((y - 32) * .6), w = 2 + Math.floor((y - 32) / 3); tqPx(g, '#c8a060', c - w, y, w * 2, 1); }
    for (const [x, y, c] of [[5, 30, '#e05a2a'], [13, 27, '#ffb03a'], [33, 28, '#d4143c'], [42, 31, '#ff8a3a'], [8, 40, '#ffb03a'], [38, 41, '#e05a2a']]) {
      tqPx(g, '#5a3a1a', x, y - 1, 2, 7); tqTri(g, c, x + 1, y - 11, x - 4, y, x + 5, y); tqPx(g, 'rgba(0,0,0,.18)', x + 2, y - 6, 3, 6);
      tqPx(g, '#fff0a0', x - 1, y - 6, 1, 1);
    }
  },
  g => {  // une oasis
    ['#f0c060', '#f4d080', '#f8e0a0'].forEach((c, i) => tqPx(g, c, 0, i * 7, 48, 48)); tqPx(g, '#fbe8b8', 0, 21, 48, 6);
    tqEll(g, '#fff8e0', 10, 10, 5, 5);
    tqRidge(g, '#e8a850', 28, 4, 5, .8); tqRidge(g, '#d89040', 34, 4, 13, 1.1);
    tqEll(g, '#2a8ac8', 26, 40, 12, 4); tqEll(g, '#5ab8e8', 25, 39, 8, 2);
    for (const x of [34, 16]) { for (let y = 22; y < 38; y++) tqPx(g, '#8a5a2a', x + Math.round((y - 22) / 8), y, 2, 1);
      for (const [dx, dy] of [[-6, 1], [-4, 0], [-2, -1], [2, -1], [4, 0], [6, 1], [-5, 2], [5, 2]]) tqPx(g, '#3a9a3a', x + dx, 21 + dy, 3, 1);
      tqPx(g, '#2a7a2a', x - 1, 21, 4, 2); tqPx(g, '#8a3a1a', x + 1, 23, 2, 1); }
    tqPx(g, '#3a8a2a', 6, 33, 2, 8); tqPx(g, '#3a8a2a', 3, 35, 2, 3); tqPx(g, '#3a8a2a', 4, 37, 2, 1); tqPx(g, '#3a8a2a', 9, 34, 2, 3);
  },
  g => {  // un renard de profil, assis dans l'herbe
    tqPx(g, '#9ad0f0', 0, 0, 48, 34); tqPx(g, '#5aa04a', 0, 34, 48, 14); tqPx(g, '#4a8a3a', 0, 34, 48, 1);
    tqEll(g, '#e8661a', 9, 37, 8, 4); tqEll(g, '#ffffff', 3, 37, 3, 3);  // la queue et son bout blanc
    tqEll(g, '#e8661a', 21, 31, 9, 8); tqEll(g, '#fff4e0', 25, 33, 4, 5);  // le corps et le poitrail
    tqPx(g, '#3a2010', 17, 38, 3, 5); tqPx(g, '#3a2010', 26, 38, 3, 5);
    tqEll(g, '#e8661a', 30, 19, 7, 6);  // la tête
    tqTri(g, '#e8661a', 24, 17, 28, 7, 33, 14); tqTri(g, '#3a2010', 27, 14, 28, 10, 31, 14);  // l'oreille
    tqTri(g, '#e8661a', 34, 16, 44, 21, 34, 23); tqTri(g, '#fff4e0', 33, 21, 44, 21, 34, 25);  // le museau
    tqPx(g, '#1a0a05', 43, 20, 2, 2); tqPx(g, '#1a0a05', 32, 17, 2, 2); tqPx(g, '#ffffff', 32, 17, 1, 1);  // la truffe et l'œil
  },
  g => {  // un poisson clown de profil, entre les algues
    ['#0a3a6a', '#0e4a7a', '#125a8a', '#186a9a'].forEach((c, i) => tqPx(g, c, 0, i * 10, 48, 48)); tqPx(g, '#e8d090', 0, 42, 48, 6);
    for (const x of [5, 9, 41]) for (let y = 22; y < 43; y++) tqPx(g, '#2a9a4a', x + Math.round(Math.sin(y / 3) * 1.5), y, 2, 1);
    tqTri(g, '#ff7a1a', 4, 14, 12, 22, 4, 30); tqPx(g, '#1a0a05', 4, 14, 1, 17);  // la queue
    tqEll(g, '#ff7a1a', 25, 22, 14, 9);
    for (const x of [17, 27]) for (let y = 12; y < 33; y++) { const dx = (x + 1 - 25) / 14, dy = (y - 22) / 9; if (dx * dx + dy * dy <= 1) { tqPx(g, '#ffffff', x, y, 3, 1); tqPx(g, '#1a0a05', x - 1, y, 1, 1); tqPx(g, '#1a0a05', x + 3, y, 1, 1); } }
    tqTri(g, '#ff7a1a', 20, 14, 28, 9, 32, 14); tqTri(g, '#ff9a4a', 22, 28, 28, 34, 30, 28);  // les nageoires
    tqPx(g, '#ffffff', 33, 18, 4, 4); tqPx(g, '#1a0a05', 35, 19, 2, 2); tqPx(g, '#c84a1a', 38, 24, 2, 1);  // l'œil et la bouche
  },
  g => {  // une tortue de profil sur la plage
    tqPx(g, '#8ad0f8', 0, 0, 48, 20); tqPx(g, '#2a8ac8', 0, 20, 48, 6); tqPx(g, '#5ab8e8', 0, 20, 48, 1); tqPx(g, '#f0d890', 0, 26, 48, 22);
    tqEll(g, '#fff4c0', 40, 7, 4, 4);
    tqEll(g, '#6aa83a', 39, 33, 5, 4); tqPx(g, '#6aa83a', 33, 33, 6, 3); tqPx(g, '#1a0a05', 41, 31, 2, 2);  // la tête, son œil
    tqPx(g, '#6aa83a', 13, 37, 5, 5); tqPx(g, '#6aa83a', 28, 37, 5, 5);  // les pattes
    for (let y = 22; y < 38; y++) for (let x = 6; x < 38; x++) { const dx = (x - 21.5) / 16, dy = (38 - y) / 16; if (dx * dx + dy * dy <= 1) tqPx(g, '#8a5a2a', x, y); }  // la carapace
    for (const [x, y] of [[12, 30], [20, 26], [28, 30], [20, 33], [14, 35], [26, 35]]) { tqPx(g, '#c8a050', x, y, 4, 3); tqPx(g, '#5a3a1a', x, y + 3, 4, 1); }
    tqPx(g, '#5a3a1a', 6, 37, 32, 1); tqPx(g, '#6aa83a', 3, 36, 4, 2);  // le bord et la queue
  },
];
const tqPx = (g, c, x, y, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
function tqEll(g, c, cx, cy, rx, ry) { for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx + .5) + (y * y) / (ry * ry + .5) <= 1) tqPx(g, c, cx + x, cy + y); }
function tqTri(g, c, ax, ay, bx, by, cx, cy) {  // un triangle plein, pixel par pixel
  const s = (px, py, qx, qy, rx, ry) => (px - rx) * (qy - ry) - (qx - rx) * (py - ry);
  for (let y = Math.min(ay, by, cy); y <= Math.max(ay, by, cy); y++) for (let x = Math.min(ax, bx, cx); x <= Math.max(ax, bx, cx); x++) {
    const d1 = s(x, y, ax, ay, bx, by), d2 = s(x, y, bx, by, cx, cy), d3 = s(x, y, cx, cy, ax, ay);
    if (!((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0))) tqPx(g, c, x, y);
  }
}
const tqH = (x, seed, amp) => 20 + amp * (Math.sin(x * .21 + seed) * 4 + Math.sin(x * .53 + seed * 2) * 2 + Math.sin(x * 1.1 + seed * 3));  // la ligne d'une crête
function tqRidge(g, c, base, amp, seed, k) { for (let x = 0; x < 48; x++) { const y = Math.round(base - 20 + tqH(x, seed, k) - amp); tqPx(g, c, x, y, 1, 48 - y); } }
const tqArtCache = [];
function tqArt(i) {
  if (tqArtCache[i]) return tqArtCache[i];
  const s = document.createElement('canvas'); s.width = s.height = 48; TQ_ART[i](s.getContext('2d'));
  const b = document.createElement('canvas'); b.width = b.height = 480; const g = b.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(s, 0, 0, 480, 480);
  return (tqArtCache[i] = b.toDataURL('image/png'));
}
{  // vérification : chaque image se dessine, sans case vide, et toutes sont différentes
  const seen = new Set(), bad = [];
  TQ_ART.forEach((f, i) => { const c = document.createElement('canvas'); c.width = c.height = 48; const g = c.getContext('2d'); f(g); const d = g.getImageData(0, 0, 48, 48).data; let empty = 0; for (let k = 3; k < d.length; k += 4) if (!d[k]) empty++; if (empty) bad.push(i + ' : ' + empty + ' pixels vides'); seen.add(c.toDataURL()); });
  console.assert(!bad.length && seen.size === TQ_ART.length && view.querySelectorAll('#tqSrc option[value^=px]').length === TQ_ART.length, 'taquin images', bad);
}
setInterval(() => { if (tq?.t0 && !tq.done && view.classList.contains('on')) tqRender(); }, 1000);
$('tqNew').onclick = tqNew;
$('tqSize').onchange = $('tqSrc').onchange = () => { if ($('tqSrc').value === 'perso' && !games.taquinImg) return $('tqFile').click(); tqNew(); };
$('tqNums').onchange = () => tqRender();
$('tqPick').onclick = () => $('tqFile').click();
$('tqFile').onchange = e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  const img = new Image();
  img.onload = () => {  // centred square, 480 px: small enough for the synced save
    const c = document.createElement('canvas'), s = Math.min(img.width, img.height); c.width = c.height = 480;
    c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 480, 480);
    games.taquinImg = c.toDataURL('image/jpeg', .85); saveGames(); URL.revokeObjectURL(img.src);
    $('tqSrc').value = 'perso'; tqNew();
  };
  img.onerror = () => toast('Image illisible', true);
  img.src = URL.createObjectURL(f);
};
$('tqPeek').onpointerdown = () => { if (tq?.img) $('tqPreview').style.backgroundImage = `url(${tq.img})`; $('tqPreview').classList.add('on'); };
$('tqPeek').onpointerup = $('tqPeek').onpointerleave = () => $('tqPreview').classList.remove('on');
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !tq || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  const n = tq.n, hole = tq.tiles.indexOf(n * n - 1), d = {ArrowUp: n, ArrowDown: -n, ArrowLeft: 1, ArrowRight: -1}[e.key];  // the arrow pushes the tile next to the hole into it
  if (d == null) return; e.preventDefault();
  const p = hole + d; if (p < 0 || p >= n * n || (Math.abs(d) === 1 && Math.floor(p / n) !== Math.floor(hole / n))) return;
  tqMove(p);
});  // (non indenté : les textes sur plusieurs lignes restent exactement les tiens)
$('tqBoard').__tq = {st: () => tq, move: p => tqMove(p), art: i => tqArt(i)};  // pour le test « local »
  // ---- fin ----
  ctx.onOpen(() => tqSkyNow().then(() => { tq ? tqRender() : tqNew(); }));
}
