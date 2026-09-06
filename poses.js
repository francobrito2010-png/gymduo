/* ============================================================
 *  GymDuo — Motor de poses (ilustraciones de ejercicios)
 *  Figura articulada de LÍNEA (coherente con la de Coro).
 *  window.GymPose.svgFor(ex, frame) / .pairFor(ex) / .patternFor(ex)
 *  Ángulos: 0 = abajo, 90 = adelante, 180 = arriba, 270 = atrás.
 * ============================================================ */
(function () {
  const r2 = n => Math.round(n * 100) / 100
  const rad = d => d * Math.PI / 180
  const step = (p, a, l) => [p[0] + Math.sin(rad(a)) * l, p[1] + Math.cos(rad(a)) * l]
  const pl = pts => 'M ' + pts.map(p => r2(p[0]) + ' ' + r2(p[1])).join(' L ')

  function figure(P) {
    const pelvis = [100, 250]
    const chest = step(pelvis, P.torso, 58)
    const neck = step(chest, P.torso + (P.neck || 0), 12)
    const head = step(neck, P.torso + (P.neck || 0), 15)
    const shoulder = step(chest, P.torso, -4)
    const hipN = [pelvis[0] + 2, pelvis[1]], hipF = [pelvis[0] - 2, pelvis[1]]
    const kneeN = step(hipN, P.nThigh, 50), ankleN = step(kneeN, P.nShin, 48), toeN = step(ankleN, P.nFoot, 15)
    const kneeF = step(hipF, P.fThigh, 50), ankleF = step(kneeF, P.fShin, 48), toeF = step(ankleF, P.fFoot, 15)
    const elbowN = step(shoulder, P.nUArm, 30), handN = step(elbowN, P.nFArm, 26)
    const elbowF = step(shoulder, P.fUArm, 30), handF = step(elbowF, P.fFArm, 26)
    return {
      farLeg: `<path d="${pl([hipF, kneeF, ankleF, toeF])}"/>`,
      farArm: `<path d="${pl([shoulder, elbowF, handF])}"/>`,
      torso: `<path d="${pl([pelvis, chest, neck])}"/>`,
      head: `<circle cx="${r2(head[0])}" cy="${r2(head[1])}" r="12"/>`,
      nearLeg: `<path d="${pl([hipN, kneeN, ankleN, toeN])}"/>`,
      nearArm: `<path d="${pl([shoulder, elbowN, handN])}"/>`
    }
  }

  function render(P) {
    const f = figure(P)
    const t = P.lift ? ` transform="translate(0 ${P.lift})"` : ''
    return `<svg viewBox="0 20 200 370" class="pose-svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g${t}>` +
      `<g stroke="#5b6474" stroke-width="9">${f.farLeg}</g>` +
      `<g stroke="#5b6474" stroke-width="7">${f.farArm}</g>` +
      `<g stroke-width="12">${f.torso}</g>` +
      `<g stroke-width="6">${f.head}</g>` +
      `<g stroke-width="11">${f.nearLeg}</g>` +
      `<g stroke-width="8">${f.nearArm}</g>` +
      `</g></svg>`
  }

  const STAND = { torso: 178, neck: 0, nThigh: 3, nShin: 1, nFoot: 80, fThigh: -3, fShin: -1, fFoot: 80, nUArm: 6, nFArm: 8, fUArm: -4, fFArm: -2 }
  const P = (o) => Object.assign({}, STAND, o)

  // patrón: { start, work }  (start = posición inicial, work = esfuerzo)
  const PATTERNS = {
    squat: { start: STAND, work: P({ torso: 156, neck: 10, nThigh: 58, nShin: -34, fThigh: 50, fShin: -38, nUArm: 78, nFArm: 92, fUArm: 76, fFArm: 90 }) },
    lunge: { start: STAND, work: P({ torso: 177, neck: 2, nThigh: 26, nShin: -8, fThigh: -34, fShin: 12, fFoot: 120, nUArm: 12, nFArm: 45, fUArm: -8, fFArm: 35, lift: -6 }) },
    hinge: { start: STAND, work: P({ torso: 120, neck: 20, nUArm: 122, nFArm: 134, fUArm: 120, fFArm: 132 }) },
    calf: { start: P({ nFoot: 84, fFoot: 84 }), work: P({ nFoot: 122, fFoot: 122, lift: -14 }) },
    curl: { start: STAND, work: P({ nUArm: 8, nFArm: 150, fUArm: -4, fFArm: 148 }) },
    press_oh: { start: P({ nUArm: 186, nFArm: 150, fUArm: 176, fFArm: 150, neck: 2 }), work: P({ nUArm: 183, nFArm: 183, fUArm: 178, fFArm: 178 }) },
    pushdown: { start: P({ nUArm: 14, nFArm: 88, fUArm: 6, fFArm: 80 }), work: P({ nUArm: 12, nFArm: 12, fUArm: 6, fFArm: 8 }) },
    raise: { start: STAND, work: P({ nUArm: 92, nFArm: 92, fUArm: 88, fFArm: 88 }) },
    row: { start: P({ torso: 128, neck: 22, nUArm: 130, nFArm: 130, fUArm: 128, fFArm: 128 }), work: P({ torso: 128, neck: 22, nUArm: 214, nFArm: 250, fUArm: 210, fFArm: 246 }) },
    pushup: { start: P({ torso: 92, neck: -6, nThigh: 90, nShin: 90, nFoot: 58, fThigh: 90, fShin: 92, fFoot: 58, nUArm: 176, nFArm: 176, fUArm: 172, fFArm: 172, lift: 70 }), work: P({ torso: 92, neck: -6, nThigh: 90, nShin: 90, nFoot: 58, fThigh: 90, fShin: 92, fFoot: 58, nUArm: 150, nFArm: 210, fUArm: 150, fFArm: 210, lift: 84 }) },
    plank: { start: P({ torso: 92, neck: -6, nThigh: 90, nShin: 90, nFoot: 58, fThigh: 90, fShin: 92, fFoot: 58, nUArm: 176, nFArm: 176, fUArm: 172, fFArm: 172, lift: 70 }), work: null },
    crunch: { start: P({ torso: 96, neck: -4, nThigh: 50, nShin: 120, nFoot: 60, fThigh: 52, fShin: 122, fFoot: 60, nUArm: 40, nFArm: 40, fUArm: 42, fFArm: 42, lift: 78 }), work: P({ torso: 66, neck: 8, nThigh: 50, nShin: 120, nFoot: 60, fThigh: 52, fShin: 122, fFoot: 60, nUArm: 30, nFArm: 34, fUArm: 32, fFArm: 36, lift: 74 }) },
    legraise: { start: P({ torso: 92, neck: -6, nThigh: 92, nShin: 92, nFoot: 58, fThigh: 92, fShin: 92, fFoot: 58, nUArm: 100, nFArm: 100, fUArm: 100, fFArm: 100, lift: 84 }), work: P({ torso: 92, neck: -6, nThigh: 40, nShin: 30, nFoot: 40, fThigh: 42, fShin: 32, fFoot: 40, nUArm: 100, nFArm: 100, fUArm: 100, fFArm: 100, lift: 84 }) },
    pullup: { start: P({ nUArm: 184, nFArm: 184, fUArm: 176, fFArm: 176, neck: 2 }), work: P({ nUArm: 186, nFArm: 150, fUArm: 174, fFArm: 150, neck: 2, lift: -12 }) },
    cardio: { start: STAND, work: P({ nUArm: 202, nFArm: 205, fUArm: 158, fFArm: 160, nThigh: 20, fThigh: -18 }) },
    stand: { start: STAND, work: STAND }
  }

  // overrides por ejercicio concreto
  const MAP = {
    flexiones: 'pushup', fondos_banco: 'pushup', fondos_pecho: 'pushup',
    plancha: 'plank', plancha_lateral: 'plank', mountain_climbers: 'plank', rueda_ab: 'plank',
    crunch: 'crunch', bicicleta: 'crunch', giro_ruso: 'crunch',
    elevacion_piernas: 'legraise',
    sentadilla: 'squat', sentadilla_barra: 'squat', sentadilla_goblet: 'squat', sentadilla_sumo: 'squat', sentadilla_bulgara: 'lunge', sentadilla_cossack: 'lunge', prensa: 'squat', extension_cuadriceps: 'squat', step_up: 'lunge',
    zancadas: 'lunge',
    peso_muerto: 'hinge', peso_muerto_rumano: 'hinge', buenos_dias: 'hinge', hiperextension: 'hinge', superman: 'hinge', hip_thrust: 'hinge', puente_gluteo: 'hinge', patada_gluteo: 'hinge', curl_femoral: 'hinge', curl_nordico: 'hinge',
    elevacion_gemelos: 'calf', gemelo_sentado: 'calf', salto_comba: 'cardio',
    dominadas: 'pullup', dominadas_supinas: 'pullup', jalon_pecho: 'pullup', jalon_tricep: 'pushdown', remo_invertido: 'row', remo_barra: 'row', remo_mancuerna: 'row', remo_menton: 'raise',
    curl_biceps: 'curl', curl_martillo: 'curl', curl_concentrado: 'curl', curl_barra: 'curl', curl_muneca: 'curl',
    press_militar: 'press_oh', press_arnold: 'press_oh', elevaciones_laterales: 'raise', elevaciones_frontales: 'raise', pajaro: 'raise', face_pull: 'raise', encogimientos: 'raise',
    press_banca: 'pushup', press_mancuernas: 'pushup', press_inclinado: 'pushup', aperturas: 'pushup',
    extension_tricep: 'press_oh', patada_tricep: 'row', press_frances: 'press_oh',
    farmer_walk: 'stand', aductor_maquina: 'stand'
  }
  const BY_MUSCLE = {
    pecho: 'pushup', hombros: 'press_oh', biceps: 'curl', triceps: 'pushdown',
    dorsales: 'row', trapecios: 'raise', abdomen: 'crunch', oblicuos: 'crunch',
    lumbar: 'hinge', gluteos: 'hinge', cuadriceps: 'squat', isquios: 'hinge',
    gemelos: 'calf', aductores: 'squat', antebrazos: 'curl'
  }

  function patternFor(ex) {
    if (!ex) return 'stand'
    return MAP[ex.id] || BY_MUSCLE[ex.musculo] || 'stand'
  }
  function svgFor(ex, frame) {
    const pat = PATTERNS[patternFor(ex)] || PATTERNS.stand
    const pose = frame === 'start' ? pat.start : (pat.work || pat.start)
    return render(pose)
  }
  function hasMovement(ex) {
    const pat = PATTERNS[patternFor(ex)]
    return pat && pat.work && pat.start !== pat.work && JSON.stringify(pat.work) !== JSON.stringify(pat.start)
  }
  function pairFor(ex) {
    if (!hasMovement(ex)) return `<div class="pose-pair single">${svgFor(ex, 'work')}</div>`
    return `<div class="pose-pair"><div class="pose-cell">${svgFor(ex, 'start')}<em>inicio</em></div><div class="pose-arrow">→</div><div class="pose-cell">${svgFor(ex, 'work')}<em>trabajo</em></div></div>`
  }

  window.GymPose = { render, svgFor, pairFor, patternFor, hasMovement, PATTERNS }
})();
