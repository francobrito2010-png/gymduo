/* ============================================================
 *  GymDuo — Geometría de la figura muscular (SVG por <path>)
 *  Genera figura frontal y trasera, masculina y femenina.
 *  window.GymGeo.svg(sex, view, state) -> markup <svg>
 * ============================================================ */
(function () {
  const CX = 120, VB = '0 0 240 560'
  const r2 = n => Math.round(n * 100) / 100

  function ellipse(cx, cy, rx, ry) {
    const k = 0.5523, ox = rx * k, oy = ry * k
    return `M ${cx-rx} ${cy} C ${cx-rx} ${cy-oy} ${cx-ox} ${cy-ry} ${cx} ${cy-ry} C ${cx+ox} ${cy-ry} ${cx+rx} ${cy-oy} ${cx+rx} ${cy} C ${cx+rx} ${cy+oy} ${cx+ox} ${cy+ry} ${cx} ${cy+ry} C ${cx-ox} ${cy+ry} ${cx-rx} ${cy+oy} ${cx-rx} ${cy} Z`
  }
  function limb(cx, yt, yb, wt, wb) {
    return `M ${cx-wt} ${yt} C ${cx-wt} ${yt-wt*0.9} ${cx+wt} ${yt-wt*0.9} ${cx+wt} ${yt} L ${cx+wb} ${yb} C ${cx+wb} ${yb+wb} ${cx-wb} ${yb+wb} ${cx-wb} ${yb} Z`
  }
  function mirror(d) { let i = 0; return d.replace(/-?\d+(?:\.\d+)?/g, m => { const v = parseFloat(m); const o = i % 2 === 0 ? 240 - v : v; i++; return String(r2(o)) }) }
  const pair = d => d + ' ' + mirror(d)

  function transformPath(d, fn) {
    const toks = d.match(/[a-zA-Z]|-?\d+(?:\.\d+)?/g); const out = []; let i = 0
    while (i < toks.length) {
      if (/[a-zA-Z]/.test(toks[i])) { out.push(toks[i]); i++ }
      else { const x = parseFloat(toks[i]), y = parseFloat(toks[i + 1]); const [nx, ny] = fn(x, y); out.push(r2(nx), r2(ny)); i += 2 }
    }
    return out.join(' ')
  }
  const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t))
  function sxAt(y) {
    if (y <= 68) return 0.90
    if (y <= 92) return lerp(0.90, 0.80, (y - 68) / 24)
    if (y <= 200) return lerp(0.80, 0.72, (y - 92) / 108)
    if (y <= 250) return lerp(0.72, 1.16, (y - 200) / 50)
    if (y <= 378) return lerp(1.16, 0.95, (y - 250) / 128)
    return 0.95
  }
  const feminize = d => transformPath(d, (x, y) => [CX + (x - CX) * sxAt(y), y])

  function torso() {
    const shX = 54, shY = 92, wX = 28, wY = 202, hX = 35, hY = 250, cY = 266
    return `M ${CX-shX} ${shY} C ${CX-shX-3} ${shY+32} ${CX-wX-2} ${wY-34} ${CX-wX} ${wY} C ${CX-wX} ${wY+20} ${CX-hX} ${hY-26} ${CX-hX} ${hY} C ${CX-hX} ${hY+14} ${CX-hX+9} ${cY-2} ${CX-9} ${cY} L ${CX+9} ${cY} C ${CX+hX-9} ${cY-2} ${CX+hX} ${hY+14} ${CX+hX} ${hY} C ${CX+hX} ${hY-26} ${CX+wX} ${wY+20} ${CX+wX} ${wY} C ${CX+wX+2} ${wY-34} ${CX+shX+3} ${shY+32} ${CX+shX} ${shY} C ${CX+shX*0.45} ${shY-7} ${CX-shX*0.45} ${shY-7} ${CX-shX} ${shY} Z`
  }
  const SIL = [
    ellipse(CX, 42, 23, 26), limb(CX, 60, 94, 12, 16), torso(),
    limb(56, 94, 172, 17, 12), limb(184, 94, 172, 17, 12),
    limb(52, 172, 260, 11, 7), limb(188, 172, 260, 11, 7),
    limb(98, 256, 380, 25, 15), limb(142, 256, 380, 25, 15),
    limb(100, 384, 476, 15, 8), limb(140, 384, 476, 15, 8)
  ]

  const FRONT = {
    trapecios: pair('M 108 66 C 112 78 104 88 88 90 C 96 80 100 72 105 66 Z'),
    hombros: pair('M 66 95 C 53 96 49 111 58 119 C 69 125 82 120 83 107 C 83 99 77 95 66 95 Z'),
    pecho: pair('M 117 99 C 103 93 89 95 81 104 C 76 113 80 125 91 130 C 104 134 115 129 117 118 Z'),
    biceps: pair('M 58 126 C 49 129 47 150 54 163 C 62 170 69 160 67 145 C 66 134 64 126 58 126 Z'),
    antebrazos: pair('M 51 178 C 44 181 43 204 49 220 C 56 231 62 219 60 202 C 59 187 57 178 51 178 Z'),
    abdomen: 'M 106 137 C 106 134 134 134 134 137 L 133 199 C 133 206 107 206 107 199 Z',
    oblicuos: pair('M 104 150 C 98 152 97 172 100 189 C 104 198 110 191 110 176 C 110 161 108 150 104 150 Z'),
    cuadriceps: pair('M 98 270 C 83 272 79 304 86 338 C 93 362 107 358 109 331 C 111 300 109 270 98 270 Z'),
    aductores: pair('M 113 274 C 107 276 105 302 108 330 C 111 346 119 341 119 320 C 119 296 117 274 113 274 Z'),
    gemelos: pair('M 100 392 C 90 394 88 420 93 444 C 99 460 110 456 110 433 C 110 410 108 392 100 392 Z')
  }
  const FRONT_DETAIL = [
    'M 120 100 L 120 130',
    'M 108 152 L 132 152 M 108 165 L 132 165 M 108 178 L 132 178 M 120 138 L 120 198',
    'M 98 285 L 100 350', 'M 142 285 L 140 350'
  ]

  const BACK = {
    trapecios: 'M 120 82 C 100 84 88 92 86 106 C 100 124 110 147 120 157 C 130 147 140 124 154 106 C 152 92 140 84 120 82 Z',
    hombros: pair('M 66 95 C 53 96 49 111 58 119 C 69 125 82 120 83 107 C 83 99 77 95 66 95 Z'),
    triceps: pair('M 58 126 C 49 129 47 152 54 165 C 62 172 69 161 67 146 C 66 135 64 126 58 126 Z'),
    antebrazos: pair('M 51 178 C 44 181 43 204 49 220 C 56 231 62 219 60 202 C 59 187 57 178 51 178 Z'),
    dorsales: pair('M 116 128 C 101 130 91 145 92 165 C 94 186 107 196 118 187 C 120 167 120 145 116 128 Z'),
    lumbar: 'M 107 190 C 107 186 133 186 133 190 C 134 205 128 216 120 216 C 112 216 106 205 107 190 Z',
    gluteos: pair('M 104 222 C 89 222 83 244 90 261 C 99 274 117 271 117 250 C 117 235 115 222 104 222 Z'),
    isquios: pair('M 98 274 C 85 276 81 306 88 341 C 94 363 108 359 110 333 C 112 302 108 274 98 274 Z'),
    gemelos: pair('M 100 392 C 90 394 88 420 93 444 C 99 460 110 456 110 433 C 110 410 108 392 100 392 Z')
  }
  const BACK_DETAIL = [
    'M 120 84 L 120 216',
    'M 100 175 L 108 165', 'M 140 175 L 132 165',
    'M 98 285 L 100 355', 'M 142 285 L 140 355'
  ]

  const COLORS = { none: '#2b2f3a', worked: '#22c55e', today: '#f59e0b' }

  function svg(sex, view, state) {
    state = state || {}
    const fem = sex === 'female'
    const sil = SIL.map(d => (fem ? feminize(d) : d))
    const muscles = view === 'front' ? FRONT : BACK
    const detail = view === 'front' ? FRONT_DETAIL : BACK_DETAIL
    let s = `<svg viewBox="${VB}" class="mm-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Figura ${view === 'front' ? 'frontal' : 'trasera'}">`
    s += '<g class="mm-sil">' + sil.map(d => `<path d="${d}" fill="#171a21" stroke="#0b0d11" stroke-width="1.2"/>`).join('') + '</g>'
    s += '<g class="mm-muscles">' + Object.entries(muscles).map(([id, d]) =>
      `<path id="mm-${view}-${id}" data-m="${id}" d="${fem ? feminize(d) : d}" fill="${COLORS[state[id] || 'none']}" stroke="#0b0d11" stroke-width="0.8" class="mm-muscle"><title>${MUSCLES[id].label}</title></path>`
    ).join('') + '</g>'
    s += '<g class="mm-detail" fill="none" stroke="#0b0d11" stroke-width="1" opacity="0.45" stroke-linecap="round" pointer-events="none">' +
      detail.map(d => `<path d="${fem ? feminize(d) : d}"/>`).join('') + '</g>'
    s += '</svg>'
    return s
  }

  const MUSCLES = {
    pecho: { label: 'Pecho', view: 'front' },
    hombros: { label: 'Hombros', view: 'both' },
    biceps: { label: 'Bíceps', view: 'front' },
    triceps: { label: 'Tríceps', view: 'back' },
    antebrazos: { label: 'Antebrazos', view: 'both' },
    abdomen: { label: 'Abdomen', view: 'front' },
    oblicuos: { label: 'Oblicuos', view: 'front' },
    dorsales: { label: 'Dorsales', view: 'back' },
    trapecios: { label: 'Trapecios', view: 'both' },
    lumbar: { label: 'Lumbar', view: 'back' },
    gluteos: { label: 'Glúteos', view: 'back' },
    cuadriceps: { label: 'Cuádriceps', view: 'front' },
    isquios: { label: 'Isquios', view: 'back' },
    gemelos: { label: 'Gemelos', view: 'both' },
    aductores: { label: 'Aductores', view: 'front' }
  }

  window.GymGeo = { svg, MUSCLES, COLORS, VIEWBOX: VB }
})();
