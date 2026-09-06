/* ============================================================
 *  GymDuo — Generador de plan semanal + cálculos corporales
 *  window.GymPlan.build(profile) -> plan
 *  window.GymCalc.imc / .calorias
 * ============================================================ */
(function () {
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  // qué equipamiento permite cada elección del usuario
  const EQUIP_ALLOW = {
    gym: ['gym', 'mancuernas', 'peso'],
    mancuernas: ['mancuernas', 'peso'],
    peso: ['peso']
  }

  const TARGETS = {
    fullbody: ['cuadriceps', 'pecho', 'dorsales', 'hombros', 'isquios', 'gluteos', 'abdomen', 'biceps', 'triceps'],
    torso: ['pecho', 'dorsales', 'hombros', 'triceps', 'biceps', 'trapecios', 'abdomen'],
    pierna: ['cuadriceps', 'isquios', 'gluteos', 'gemelos', 'aductores', 'abdomen'],
    push: ['pecho', 'hombros', 'triceps', 'abdomen'],
    pull: ['dorsales', 'biceps', 'trapecios', 'antebrazos']
  }
  const TYPE_LABEL = {
    fullbody: 'Full body', torso: 'Torso', pierna: 'Pierna', push: 'Empuje (push)', pull: 'Tirón (pull)'
  }

  // patrón de días de la semana (0=Lunes) y rotación de sesiones según nº de días
  function splitFor(days) {
    if (days <= 2) return { pattern: [0, 3], seq: ['fullbody', 'fullbody'], key: '2' }
    if (days === 3) return { pattern: [0, 2, 4], seq: ['fullbody', 'fullbody', 'fullbody'], key: '3' }
    if (days === 4) return { pattern: [0, 1, 3, 4], seq: ['torso', 'pierna', 'torso', 'pierna'], key: '4' }
    if (days === 5) return { pattern: [0, 1, 2, 4, 5], seq: ['push', 'pull', 'pierna', 'torso', 'pierna'], key: '5' }
    return { pattern: [0, 1, 2, 3, 4, 5], seq: ['push', 'pull', 'pierna', 'push', 'pull', 'pierna'], key: '6' }
  }
  const EXPLAIN = {
    '2': 'Con 2 días hacemos full body: entrenas todo el cuerpo en cada sesión para no dejar ningún músculo sin trabajar.',
    '3': 'Con 3 días, full body: cubres el cuerpo entero 3 veces por semana. Es lo mejor para empezar y progresar rápido.',
    '4': 'Con 4 días dividimos en torso/pierna: entrenas cada mitad del cuerpo 2 veces por semana con más volumen.',
    '5': 'Con 5 días usamos push/pull/pierna: agrupas por empuje, tirón y pierna para meter más volumen y recuperar mejor.',
    '6': 'Con 6 días, push/pull/pierna x2: máxima frecuencia, cada grupo 2 veces por semana. Cuida el descanso y el sueño.'
  }

  function prescription(goal, level) {
    let p
    if (goal === 'masa') p = { series: 4, reps: '6-10', desc: '90-120s' }
    else if (goal === 'grasa') p = { series: 3, reps: '12-15', desc: '45-60s' }
    else p = { series: 3, reps: '10-12', desc: '60-75s' }
    if (level === 'principiante') p.series = Math.min(p.series, 3)
    return p
  }

  // elige ejercicios cubriendo los músculos objetivo
  function pickExercises(targets, allowed, level, count, offset) {
    const pool = window.EXERCISES.filter(e => allowed.includes(e.equipo))
    const chosen = []
    const rank = e => (e.nivel === level ? 0 : 1)
    // 1ª pasada: 1 por músculo objetivo (con rotación para variar entre días iguales)
    const rot = targets.slice(offset % targets.length).concat(targets.slice(0, offset % targets.length))
    for (const m of rot) {
      const cand = pool.filter(e => e.musculo === m && !chosen.includes(e)).sort((a, b) => rank(a) - rank(b))
      if (cand[0]) chosen.push(cand[0])
      if (chosen.length >= count) break
    }
    // 2ª pasada: rellenar hasta 'count'
    let guard = 0
    while (chosen.length < count && guard < 60) {
      const m = rot[guard % rot.length]
      const cand = pool.filter(e => e.musculo === m && !chosen.includes(e)).sort((a, b) => rank(a) - rank(b))
      if (cand[0]) chosen.push(cand[0])
      guard++
    }
    return chosen.slice(0, count)
  }

  function build(profile) {
    const { goal, level, days, equip, sex } = profile
    const allowed = EQUIP_ALLOW[equip] || EQUIP_ALLOW.gym
    const sp = splitFor(days)
    const rx = prescription(goal, level)
    const count = level === 'principiante' ? 5 : 6

    // construye una sesión por cada entrada de la secuencia
    const sessions = sp.seq.map((type, i) => {
      const exs = pickExercises(TARGETS[type], allowed, level, count, i)
      const muscles = new Set()
      exs.forEach(e => { muscles.add(e.musculo); (e.sec || []).forEach(m => muscles.add(m)) })
      return {
        type, title: TYPE_LABEL[type],
        muscles: [...muscles],
        exercises: exs.map(e => ({ id: e.id, series: rx.series, reps: rx.reps, desc: rx.desc }))
      }
    })

    // reparte por la semana (L-D)
    const week = DAYS.map((dayName, idx) => {
      const pos = sp.pattern.indexOf(idx)
      if (pos === -1) return { dayName, rest: true }
      return Object.assign({ dayName, rest: false }, sessions[pos])
    })

    return {
      split: sp.key,
      explain: EXPLAIN[sp.key],
      prescription: rx,
      week,
      generatedAt: Date.now()
    }
  }

  // devuelve set de músculos que entrena un día (principal + secundarios)
  function musclesOfDay(day) {
    if (!day || day.rest) return []
    return day.muscles || []
  }

  // ---- RETO de 30 días (estilo Darebee): días secuenciales + progresión semanal ----
  function buildProgram(profile, startDate) {
    const { goal, level, days, equip } = profile
    const allowed = EQUIP_ALLOW[equip] || EQUIP_ALLOW.gym
    const sp = splitFor(days)
    const baseRx = prescription(goal, level)
    const count = level === 'principiante' ? 5 : 6
    // sesiones base (una por entrada de la secuencia del split)
    const base = sp.seq.map((type, i) => {
      const exs = pickExercises(TARGETS[type], allowed, level, count, i)
      const muscles = [...new Set(exs.flatMap(e => [e.musculo, ...(e.sec || [])]))]
      return { type, title: TYPE_LABEL[type], exs, muscles }
    })
    const list = []
    let ti = 0
    for (let n = 1; n <= 30; n++) {
      const diw = ((n - 1) % 7) + 1
      if (diw > days) { list.push({ n, rest: true }); continue }
      const week = Math.ceil(n / 7)
      const s = base[ti % base.length]; ti++
      const series = baseRx.series + (week >= 2 ? 1 : 0) + (week >= 4 ? 1 : 0)
      const tempo = week === 3
      list.push({
        n, rest: false, week, title: s.title, muscles: s.muscles,
        exercises: s.exs.map(e => ({ id: e.id, series, reps: baseRx.reps, desc: baseRx.desc, tempo }))
      })
    }
    return { startDate, generatedAt: Date.now(), reps: baseRx.reps, days: list }
  }

  window.GymPlan = { build, buildProgram, musclesOfDay, DAYS, TARGETS }

  // ---------------- CÁLCULOS ----------------
  function imc(kg, cm) {
    if (!kg || !cm) return null
    const m = cm / 100
    const v = kg / (m * m)
    let cat = 'Peso normal'
    if (v < 18.5) cat = 'Bajo peso'
    else if (v < 25) cat = 'Peso normal'
    else if (v < 30) cat = 'Sobrepeso'
    else cat = 'Obesidad'
    return { valor: Math.round(v * 10) / 10, categoria: cat }
  }

  // Mifflin-St Jeor + factor de actividad + ajuste por objetivo
  function calorias(profile, kg) {
    const { sex, age, height, goal } = profile
    if (!kg || !height || !age) return null
    const bmr = 10 * kg + 6.25 * height - 5 * age + (sex === 'female' ? -161 : 5)
    const mantenimiento = Math.round(bmr * 1.45) // actividad moderada
    let objetivo, nota
    if (goal === 'grasa') { objetivo = [mantenimiento - 500, mantenimiento - 300]; nota = 'déficit para bajar grasa' }
    else if (goal === 'masa') { objetivo = [mantenimiento + 250, mantenimiento + 400]; nota = 'superávit para ganar músculo' }
    else { objetivo = [mantenimiento - 150, mantenimiento + 150]; nota = 'mantenimiento para tonificar' }
    return { mantenimiento, objetivo, nota }
  }

  window.GymCalc = { imc, calorias }
})();
