/* ============================================================
 *  GymDuo — App (vanilla JS). Renderiza todo dentro de #root.
 * ============================================================ */
(function () {
  const G = window.GymGeo, P = window.GymPlan, C = window.GymCalc
  const EX = window.EXERCISES
  const EX_BY_ID = {}; EX.forEach(e => EX_BY_ID[e.id] = e)
  const MUS = G.MUSCLES

  const PROFILES = [
    { pid: 'franco', def: 'Franco', color: '#f59e0b' },
    { pid: 'novia', def: 'Ella', color: '#ec4899' }
  ]

  // ---------- estado UI ----------
  const S = { route: 'select', tab: 'hoy', setupPid: null, overlay: null, sex: 'male' }
  const store = window.GymStore

  // ---------- utilidades fecha ----------
  const pad = n => String(n).padStart(2, '0')
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
  const todayISO = () => iso(new Date())
  const dow = (isoStr) => { const d = isoStr ? new Date(isoStr + 'T00:00') : new Date(); return (d.getDay() + 6) % 7 }
  function weekDates() {
    const now = new Date(); const d0 = (now.getDay() + 6) % 7
    const mon = new Date(now); mon.setDate(now.getDate() - d0)
    return [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return iso(d) })
  }

  const cur = () => store.current
  const curProfile = () => store.getProfile(cur())

  // ---------- coberturas musculares ----------
  function weekMuscleState(pid) {
    const dates = weekDates(), today = todayISO(), st = {}
    dates.forEach(dt => {
      const w = store.getWorkout(pid, dt)
      if (w && w.exercises) {
        w.exercises.filter(e => e.done).forEach(e => {
          const ex = EX_BY_ID[e.id]; if (!ex) return
          ;[ex.musculo, ...(ex.sec || [])].forEach(m => {
            if (dt === today) st[m] = 'today'
            else if (st[m] !== 'today') st[m] = 'worked'
          })
        })
      }
    })
    return st
  }
  function highlightState(muscles) { const st = {}; (muscles || []).forEach(m => st[m] = 'today'); return st }

  function exercisesForMuscle(m) {
    return EX.filter(e => e.musculo === m || (e.sec || []).includes(m))
  }
  function lastWeight(pid, exId) {
    const ws = store.listWorkouts(pid)
    for (const w of ws) {
      const e = (w.exercises || []).find(x => x.id === exId && x.weight)
      if (e) return { weight: e.weight, reps: e.reps, date: w.date }
    }
    return null
  }

  // ---------- helpers DOM ----------
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const root = () => document.getElementById('root')

  function mapBlock(sex, state, opts) {
    opts = opts || {}
    const both = opts.view || 'both'
    let cols = ''
    if (both === 'both' || both === 'front') cols += `<div class="mm-col">${G.svg(sex, 'front', state)}<span class="mm-cap">Frente</span></div>`
    if (both === 'both' || both === 'back') cols += `<div class="mm-col">${G.svg(sex, 'back', state)}<span class="mm-cap">Espalda</span></div>`
    const legend = opts.legend ? `<div class="mm-legend"><span><i style="background:${G.COLORS.none}"></i>Sin trabajar</span><span><i style="background:${G.COLORS.worked}"></i>Esta semana</span><span><i style="background:${G.COLORS.today}"></i>Hoy</span></div>` : ''
    return `<div class="mm" data-map="1">${cols}</div>${legend}`
  }

  // tip del día
  function tipOfDay(goal) {
    const arr = (window.TIPS[goal === 'masa' ? 'masa' : 'grasa']) || window.TIPS.grasa
    const day = Math.floor((Date.now()) / 86400000)
    return arr[day % arr.length]
  }

  // ============================================================
  //  PANTALLAS
  // ============================================================
  function screenSelect() {
    const cards = PROFILES.map(p => {
      const prof = store.getProfile(p.pid)
      const name = prof ? prof.name : p.def
      const sub = prof ? `${prof.goal === 'masa' ? 'Subir masa' : prof.goal === 'grasa' ? 'Bajar grasa' : 'Tonificar'} · ${prof.days} días` : 'Sin configurar'
      return `<button class="pcard" data-act="pick" data-pid="${p.pid}" style="--pc:${p.color}">
        <span class="pav">${esc(name[0] || '?')}</span>
        <span class="pname">${esc(name)}</span>
        <span class="psub">${esc(sub)}</span>
      </button>`
    }).join('')
    return `<div class="select">
      <div class="brand"><span class="logo">💪</span><h1>GymDuo</h1><p>¿Quién entrena hoy?</p></div>
      <div class="pcards">${cards}</div>
      <p class="hint">Toca tu perfil. Se recuerda en este teléfono.</p>
    </div>`
  }

  function screenSetup(pid) {
    const p = PROFILES.find(x => x.pid === pid)
    const prof = store.getProfile(pid) || {}
    const opt = (v, cur) => v === cur ? 'selected' : ''
    const seg = (name, val, cur, opts) => `<div class="seg" data-seg="${name}">` + opts.map(o =>
      `<button type="button" class="segb ${o[0] === (cur ?? val) ? 'on' : ''}" data-seg-val="${o[0]}">${o[1]}</button>`).join('') + `</div>`
    return `<div class="setup">
      <div class="setup-head"><button class="back" data-act="toSelect">‹</button><h2>${prof.name ? 'Editar perfil' : 'Configura tu perfil'}</h2></div>
      <form id="setupForm">
        <label>Nombre<input name="name" value="${esc(prof.name || p.def)}" required></label>
        <label>Sexo</label>${seg('sex', prof.sex || 'male', prof.sex || 'male', [['male', 'Hombre'], ['female', 'Mujer']])}
        <div class="row2">
          <label>Edad<input name="age" type="number" min="12" max="90" value="${esc(prof.age || 25)}"></label>
          <label>Altura (cm)<input name="height" type="number" min="120" max="220" value="${esc(prof.height || 170)}"></label>
        </div>
        <label>Objetivo</label>${seg('goal', prof.goal || 'grasa', prof.goal || 'grasa', [['grasa', 'Bajar grasa'], ['masa', 'Subir masa'], ['tonificar', 'Tonificar']])}
        <label>Nivel</label>${seg('level', prof.level || 'principiante', prof.level || 'principiante', [['principiante', 'Principiante'], ['intermedio', 'Intermedio']])}
        <label>Días por semana</label>${seg('days', prof.days || 3, prof.days || 3, [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']])}
        <label>Equipamiento</label>${seg('equip', prof.equip || 'gym', prof.equip || 'gym', [['gym', 'Gym completo'], ['mancuernas', 'Mancuernas'], ['peso', 'Peso corporal']])}
        <button type="submit" class="cta">${prof.name ? 'Guardar y regenerar plan' : 'Crear mi plan'}</button>
      </form>
    </div>`
  }

  // ---------- HOY ----------
  function tabHoy() {
    const prof = curProfile()
    const today = todayISO()
    const di = dow()
    const day = prof.plan.week[di]
    const tip = tipOfDay(prof.goal)
    let sessionCard
    if (day.rest) {
      const wk = weekMuscleState(cur())
      const worked = Object.keys(wk)
      const falta = Object.keys(MUS).filter(m => !worked.includes(m))
      sessionCard = `<div class="card rest">
        <h3>Hoy toca descanso 😌</h3>
        <p>Recupera: dormir bien y caminar cuenta. ${falta.length ? 'Si quieres mover algo, esta semana te falta trabajar: <b>' + falta.slice(0, 4).map(m => MUS[m].label).join(', ') + '</b>.' : ''}</p>
      </div>`
    } else {
      const w = store.getWorkout(cur(), today)
      const doneCount = w ? (w.exercises || []).filter(e => e.done).length : 0
      const total = day.exercises.length
      sessionCard = `<div class="card">
        <div class="card-top"><span class="badge">${day.title}</span>${doneCount ? `<span class="prog">${doneCount}/${total} hechos</span>` : ''}</div>
        <div class="chips">${day.muscles.map(m => `<span class="chip">${MUS[m] ? MUS[m].label : m}</span>`).join('')}</div>
        ${mapBlock(prof.sex, highlightState(day.muscles), { view: 'both' })}
        <button class="cta" data-act="openSession" data-date="${today}">${doneCount ? 'Seguir sesión' : '¿Qué hago hoy? Empezar'}</button>
      </div>`
    }
    return `<div class="tab">
      <div class="greet"><h2>Hola, ${esc(prof.name)} 👋</h2><span>${P.DAYS[di]}</span></div>
      ${sessionCard}
      <div class="card tip"><span class="tip-k">Tip del día</span><h4>${esc(tip.t)}</h4><p>${esc(tip.d)}</p><div class="tip-a">👉 ${esc(tip.a)}</div></div>
    </div>`
  }

  // ---------- SEMANA ----------
  function tabSemana() {
    const prof = curProfile()
    const wk = weekMuscleState(cur())
    const worked = Object.keys(wk)
    const falta = Object.keys(MUS).filter(m => !worked.includes(m))
    const di = dow()
    const rows = prof.plan.week.map((d, i) => {
      const isToday = i === di
      return `<div class="wday ${d.rest ? 'off' : ''} ${isToday ? 'now' : ''}" data-act="dayMenu" data-i="${i}">
        <div class="wday-l"><b>${P.DAYS[i].slice(0, 3)}</b>${isToday ? '<span class="dot"></span>' : ''}</div>
        <div class="wday-r">${d.rest ? '<span class="muted">Descanso</span>' : `<span class="wt">${d.title}</span><div class="chips sm">${d.muscles.slice(0, 5).map(m => `<span class="chip">${MUS[m] ? MUS[m].label : m}</span>`).join('')}</div>`}</div>
        <span class="wedit">⋯</span>
      </div>`
    }).join('')
    return `<div class="tab">
      <div class="greet"><h2>Tu semana</h2><span>${prof.split === '4' ? 'Torso / Pierna' : prof.split === '3' || prof.split === '2' ? 'Full body' : 'Push / Pull / Pierna'}</span></div>
      <div class="card explain">${esc(prof.plan.explain)}</div>
      <div class="wlist">${rows}</div>
      <div class="card">
        <h3>¿Qué hice y qué me falta?</h3>
        ${mapBlock(prof.sex, wk, { view: 'both', legend: true })}
        <p class="cover">${worked.length ? 'Trabajado: <b>' + worked.map(m => MUS[m] ? MUS[m].label : m).join(', ') + '</b>.' : 'Aún no has registrado nada esta semana.'}</p>
        ${falta.length ? `<div class="sugg">Para equilibrar te falta: <b>${falta.map(m => MUS[m].label).join(', ')}</b></div>` : '<div class="sugg ok">¡Semana completa! 🔥</div>'}
      </div>
    </div>`
  }

  // ---------- CUERPO ----------
  function tabCuerpo() {
    const prof = curProfile()
    const list = store.listBody(cur())
    const last = list[0]
    const imc = last ? C.imc(last.weight, prof.height) : null
    const kcal = last ? C.calorias(prof, last.weight) : null
    const metrics = [['weight', 'Peso (kg)'], ['cintura', 'Cintura'], ['cadera', 'Cadera'], ['pecho', 'Pecho'], ['brazo', 'Brazo'], ['muslo', 'Muslo']]
    const chart = weightChart(list)
    let photo = ''
    try { const d = localStorage.getItem('gymduo:photo:' + cur()); if (d) photo = d } catch {}
    return `<div class="tab">
      <div class="greet"><h2>Cuerpo</h2><span>Mide tu progreso</span></div>
      <div class="card">
        <h3>Registrar hoy</h3>
        <form id="bodyForm" class="bodygrid">
          ${metrics.map(m => `<label>${m[1]}<input name="${m[0]}" type="number" step="0.1" inputmode="decimal" value="${last && last[m[0]] ? esc(last[m[0]]) : ''}" placeholder="${m[0] === 'weight' ? 'kg' : 'cm'}"></label>`).join('')}
          <button type="submit" class="cta">Guardar medidas</button>
        </form>
      </div>
      ${imc ? `<div class="card stats">
        <div class="stat"><span>IMC</span><b>${imc.valor}</b><small>${imc.categoria}</small></div>
        ${kcal ? `<div class="stat"><span>Mantenimiento</span><b>${kcal.mantenimiento}</b><small>kcal/día</small></div>
        <div class="stat"><span>Tu objetivo</span><b>${kcal.objetivo[0]}-${kcal.objetivo[1]}</b><small>${esc(kcal.nota)}</small></div>` : ''}
      </div><p class="disclaimer">Orientativo, no es prescripción médica.</p>` : ''}
      <div class="card">
        <h3>Evolución del peso</h3>
        ${chart}
      </div>
      <div class="card">
        <h3>Foto de progreso</h3>
        <p class="disclaimer">Se guarda solo en este teléfono, no se sube a ningún sitio.</p>
        ${photo ? `<img class="progimg" src="${photo}" alt="foto">` : ''}
        <label class="filebtn">${photo ? 'Cambiar foto' : 'Añadir foto'}<input id="photoInput" type="file" accept="image/*" hidden></label>
      </div>
    </div>`
  }

  function weightChart(list) {
    const pts = list.filter(b => b.weight).map(b => ({ x: b.date, y: +b.weight })).reverse()
    if (pts.length < 2) return `<p class="muted">Registra tu peso al menos 2 días para ver la gráfica.</p>`
    const W = 300, H = 120, pad = 24
    const ys = pts.map(p => p.y), min = Math.min(...ys), max = Math.max(...ys)
    const rng = (max - min) || 1
    const X = i => pad + i * (W - pad * 2) / (pts.length - 1)
    const Y = v => H - pad - (v - min) / rng * (H - pad * 2)
    const line = pts.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.y).toFixed(1)).join(' ')
    const dots = pts.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="3" fill="#22c55e"/>`).join('')
    return `<svg viewBox="0 0 ${W} ${H}" class="chart"><path d="${line}" fill="none" stroke="#22c55e" stroke-width="2"/>${dots}
      <text x="2" y="14" class="ct">${max} kg</text><text x="2" y="${H - 6}" class="ct">${min} kg</text></svg>`
  }

  // ---------- TIPS ----------
  function tabTips() {
    const prof = curProfile()
    const sec = (title, arr) => `<h3 class="tsec">${title}</h3>` + arr.map(t =>
      `<div class="card tipc"><h4>${esc(t.t)}</h4><p>${esc(t.d)}</p><div class="tip-a">👉 ${esc(t.a)}</div></div>`).join('')
    const primary = prof.goal === 'masa' ? 'masa' : 'grasa'
    const order = primary === 'masa' ? ['masa', 'grasa'] : ['grasa', 'masa']
    return `<div class="tab">
      <div class="greet"><h2>Tips</h2><span>Directos y realistas</span></div>
      ${sec(order[0] === 'masa' ? 'Subir masa' : 'Bajar grasa', window.TIPS[order[0]])}
      ${sec(order[1] === 'masa' ? 'Subir masa' : 'Bajar grasa', window.TIPS[order[1]])}
      <h3 class="tsec">Dudas frecuentes</h3>
      <div class="faq">${window.FAQS.map((f, i) => `<div class="faqi"><button class="faqq" data-act="faq" data-i="${i}">${esc(f.q)}<span>+</span></button><div class="faqa" data-a="${i}" hidden>${esc(f.a)}</div></div>`).join('')}</div>
    </div>`
  }

  // ---------- PERFIL ----------
  function tabPerfil() {
    const prof = curProfile()
    const mode = store.getMode()
    const modeTxt = mode === 'firebase' ? 'Sincronizado (Firebase)' : mode === 'artifact' ? 'Sincronizado entre dispositivos' : 'Solo en este teléfono'
    const goalTxt = prof.goal === 'masa' ? 'Subir masa' : prof.goal === 'grasa' ? 'Bajar grasa' : 'Tonificar'
    return `<div class="tab">
      <div class="greet"><h2>Perfil</h2><span>${esc(prof.name)}</span></div>
      <div class="card kv">
        <div><span>Objetivo</span><b>${goalTxt}</b></div>
        <div><span>Nivel</span><b>${prof.level === 'principiante' ? 'Principiante' : 'Intermedio'}</b></div>
        <div><span>Días/semana</span><b>${prof.days}</b></div>
        <div><span>Equipo</span><b>${prof.equip === 'gym' ? 'Gym completo' : prof.equip === 'mancuernas' ? 'Mancuernas' : 'Peso corporal'}</b></div>
        <div><span>Series</span><b>${prof.plan.prescription.series}x${prof.plan.prescription.reps}</b></div>
        <div><span>Descanso</span><b>${prof.plan.prescription.desc}</b></div>
      </div>
      <button class="cta ghost" data-act="editProfile">Editar perfil y plan</button>
      <div class="card sync"><span class="sdot ${mode}"></span>${modeTxt}</div>
      <button class="cta ghost" data-act="switch">Cambiar de perfil</button>
      <p class="ver">GymDuo · para los dos 💪</p>
    </div>`
  }

  // ============================================================
  //  OVERLAYS (sesión, ejercicio, músculo, menú de día)
  // ============================================================
  function overlaySession(date) {
    const prof = curProfile()
    const di = dow(date)
    const day = prof.plan.week[di]
    if (day.rest) return ''
    let w = store.getWorkout(cur(), date)
    if (!w) w = { exercises: day.exercises.map(e => ({ id: e.id, done: false, weight: '', reps: '' })) }
    const rows = day.exercises.map((pe, idx) => {
      const ex = EX_BY_ID[pe.id]
      const log = w.exercises.find(x => x.id === pe.id) || { done: false, weight: '', reps: '' }
      const last = lastWeight(cur(), pe.id)
      return `<div class="exrow ${log.done ? 'done' : ''}">
        <button class="chk" data-act="toggleEx" data-id="${pe.id}" data-date="${date}">${log.done ? '✓' : ''}</button>
        <div class="exmain" data-act="openEx" data-id="${pe.id}">
          <b>${esc(ex.nombre)}</b>
          <small>${pe.series} series · ${pe.reps} reps · descanso ${pe.desc}</small>
          ${last ? `<em>Última vez: ${esc(last.weight)}${isNaN(last.weight) ? '' : ' kg'} · ${esc(last.reps || '')}</em>` : ''}
        </div>
        <div class="exin">
          <input placeholder="kg" inputmode="decimal" value="${esc(log.weight)}" data-act="exWeight" data-id="${pe.id}" data-date="${date}">
          <input placeholder="reps" inputmode="numeric" value="${esc(log.reps)}" data-act="exReps" data-id="${pe.id}" data-date="${date}">
        </div>
      </div>`
    }).join('')
    const allDone = w.exercises.length && w.exercises.every(e => e.done)
    return `<div class="overlay"><div class="sheet">
      <div class="sheet-head"><b>${day.title}</b><button class="x" data-act="close">✕</button></div>
      <div class="chips">${day.muscles.map(m => `<span class="chip">${MUS[m] ? MUS[m].label : m}</span>`).join('')}</div>
      <div class="exlist">${rows}</div>
      <button class="cta ${allDone ? 'okc' : ''}" data-act="finishSession" data-date="${date}">${allDone ? '¡Sesión completada! ✓' : 'Terminar y guardar'}</button>
    </div></div>`
  }

  function overlayExercise(id) {
    const ex = EX_BY_ID[id]; if (!ex) return ''
    const sec = (ex.sec || []).map(m => MUS[m] ? MUS[m].label : m)
    const st = highlightState([ex.musculo, ...(ex.sec || [])])
    const last = lastWeight(cur(), id)
    return `<div class="overlay"><div class="sheet">
      <div class="sheet-head"><b>${esc(ex.nombre)}</b><button class="x" data-act="close">✕</button></div>
      <div class="exficha">
        <div class="ficha-map">${G.svg(curProfile().sex, MUS[ex.musculo] && MUS[ex.musculo].view === 'back' ? 'back' : 'front', st)}</div>
        <div class="ficha-txt">
          <div class="chips"><span class="chip on">${MUS[ex.musculo] ? MUS[ex.musculo].label : ex.musculo}</span>${sec.map(s => `<span class="chip">${s}</span>`).join('')}</div>
          <p class="tech"><b>Técnica.</b> ${esc(ex.tecnica)}</p>
          <p class="err"><b>Error común.</b> ${esc(ex.error)}</p>
          ${last ? `<p class="last">Tu última carga: <b>${esc(last.weight)} kg</b> (${esc(last.date)})</p>` : ''}
        </div>
      </div>
    </div></div>`
  }

  function overlayMuscle(m) {
    const exs = exercisesForMuscle(m)
    return `<div class="overlay"><div class="sheet">
      <div class="sheet-head"><b>${MUS[m] ? MUS[m].label : m}</b><button class="x" data-act="close">✕</button></div>
      <p class="muted">Ejercicios que lo entrenan:</p>
      <div class="exlist">${exs.map(e => `<div class="exrow simple" data-act="openEx" data-id="${e.id}"><div class="exmain"><b>${esc(e.nombre)}</b><small>${e.musculo === m ? 'Principal' : 'Secundario'} · ${e.equipo === 'gym' ? 'Gym' : e.equipo === 'mancuernas' ? 'Mancuernas' : 'Peso corporal'}</small></div><span class="arr">›</span></div>`).join('')}</div>
    </div></div>`
  }

  function overlayDayMenu(i) {
    const prof = curProfile()
    const d = prof.plan.week[i]
    const others = P.DAYS.map((n, j) => j === i ? '' : `<button class="menu-it" data-act="swapDay" data-i="${i}" data-j="${j}">Mover a ${n}</button>`).join('')
    return `<div class="overlay" data-act="close"><div class="menu" onclick="event.stopPropagation()">
      <b>${P.DAYS[i]}</b>
      <button class="menu-it" data-act="toggleRest" data-i="${i}">${d.rest ? 'Quitar descanso (entrenar)' : 'Marcar como descanso'}</button>
      ${others}
    </div></div>`
  }

  // ============================================================
  //  RENDER
  // ============================================================
  function render() {
    const r = root(); if (!r) return
    if (S.route === 'select') { r.innerHTML = screenSelect(); return }
    if (S.route === 'setup') { r.innerHTML = screenSetup(S.setupPid); bindSegs(); return }
    // app
    const prof = curProfile()
    if (!prof || !prof.plan) { S.route = 'setup'; S.setupPid = cur(); render(); return }
    const tabs = { hoy: tabHoy, semana: tabSemana, cuerpo: tabCuerpo, tips: tabTips, perfil: tabPerfil }
    const nav = `<nav class="bnav">${[['hoy', 'Hoy', '🏋️'], ['semana', 'Semana', '📅'], ['cuerpo', 'Cuerpo', '📈'], ['tips', 'Tips', '💡'], ['perfil', 'Perfil', '👤']].map(t =>
      `<button class="nav ${S.tab === t[0] ? 'on' : ''}" data-act="tab" data-t="${t[0]}"><span>${t[2]}</span>${t[1]}</button>`).join('')}</nav>`
    let ov = ''
    if (S.overlay) {
      if (S.overlay.k === 'session') ov = overlaySession(S.overlay.date)
      else if (S.overlay.k === 'ex') ov = overlayExercise(S.overlay.id)
      else if (S.overlay.k === 'muscle') ov = overlayMuscle(S.overlay.m)
      else if (S.overlay.k === 'daymenu') ov = overlayDayMenu(S.overlay.i)
    }
    r.innerHTML = `<div class="app">${tabs[S.tab]()}</div>${nav}${ov}`
  }

  function bindSegs() {
    // manejado por delegación (data-seg-val)
  }

  // ============================================================
  //  EVENTOS (delegación)
  // ============================================================
  document.addEventListener('click', e => {
    const seg = e.target.closest('[data-seg-val]')
    if (seg) {
      const wrap = seg.closest('[data-seg]')
      wrap.querySelectorAll('.segb').forEach(b => b.classList.remove('on'))
      seg.classList.add('on')
      wrap.dataset.val = seg.dataset.segVal
      return
    }
    const el = e.target.closest('[data-act]'); if (!el) return
    const a = el.dataset.act
    if (a === 'pick') {
      store.setCurrent(el.dataset.pid)
      const prof = store.getProfile(el.dataset.pid)
      if (prof && prof.plan) { S.route = 'app'; S.tab = 'hoy' } else { S.route = 'setup'; S.setupPid = el.dataset.pid }
      render()
    }
    else if (a === 'toSelect') { S.route = 'select'; render() }
    else if (a === 'tab') { S.tab = el.dataset.t; S.overlay = null; render() }
    else if (a === 'openSession') { S.overlay = { k: 'session', date: el.dataset.date }; render() }
    else if (a === 'openEx') { S.overlay = { k: 'ex', id: el.dataset.id }; render() }
    else if (a === 'close') { S.overlay = null; render() }
    else if (a === 'editProfile') { S.route = 'setup'; S.setupPid = cur(); render() }
    else if (a === 'switch') { store.setCurrent(null); S.route = 'select'; render() }
    else if (a === 'faq') {
      const box = document.querySelector('[data-a="' + el.dataset.i + '"]')
      if (box) { box.hidden = !box.hidden; el.querySelector('span').textContent = box.hidden ? '+' : '–' }
    }
    else if (a === 'dayMenu') { S.overlay = { k: 'daymenu', i: +el.dataset.i }; render() }
    else if (a === 'toggleEx') { toggleEx(el.dataset.id, el.dataset.date); }
    else if (a === 'finishSession') { finishSession(el.dataset.date) }
    else if (a === 'toggleRest') { toggleRest(+el.dataset.i) }
    else if (a === 'swapDay') { swapDay(+el.dataset.i, +el.dataset.j) }
    else if (a === 'muscleTap') { S.overlay = { k: 'muscle', m: el.dataset.m }; render() }
  })

  // tap en músculo del SVG (delegación por data-m)
  document.addEventListener('click', e => {
    const path = e.target.closest('path[data-m]'); if (!path) return
    if (e.target.closest('.ficha-map')) return
    S.overlay = { k: 'muscle', m: path.dataset.m }; render()
  })

  document.addEventListener('input', e => {
    const el = e.target.closest('[data-act]'); if (!el) return
    if (el.dataset.act === 'exWeight') updateExField(el.dataset.id, el.dataset.date, 'weight', el.value)
    else if (el.dataset.act === 'exReps') updateExField(el.dataset.id, el.dataset.date, 'reps', el.value)
  })

  document.addEventListener('submit', e => {
    if (e.target.id === 'setupForm') { e.preventDefault(); saveSetup(e.target) }
    else if (e.target.id === 'bodyForm') { e.preventDefault(); saveBody(e.target) }
  })

  document.addEventListener('change', e => {
    if (e.target.id === 'photoInput') savePhoto(e.target)
  })

  // ---------- acciones ----------
  function saveSetup(form) {
    const g = n => { const w = form.querySelector('[data-seg="' + n + '"]'); return w ? (w.dataset.val || w.querySelector('.segb.on')?.dataset.segVal) : null }
    const data = {
      name: form.name.value.trim() || 'Perfil',
      sex: g('sex'), goal: g('goal'), level: g('level'),
      days: +g('days'), equip: g('equip'),
      age: +form.age.value, height: +form.height.value
    }
    data.plan = P.build(data)
    data.split = data.plan.split
    store.setProfile(S.setupPid, data)
    store.setCurrent(S.setupPid)
    S.route = 'app'; S.tab = 'hoy'; render()
  }

  function currentWorkout(date) {
    const prof = curProfile(); const day = prof.plan.week[dow(date)]
    let w = store.getWorkout(cur(), date)
    if (!w) w = { exercises: day.exercises.map(e => ({ id: e.id, done: false, weight: '', reps: '' })) }
    // asegurar que están todos los ejercicios del día
    day.exercises.forEach(pe => { if (!w.exercises.find(x => x.id === pe.id)) w.exercises.push({ id: pe.id, done: false, weight: '', reps: '' }) })
    return w
  }
  function toggleEx(id, date) {
    const w = currentWorkout(date)
    const e = w.exercises.find(x => x.id === id); if (e) e.done = !e.done
    store.setWorkout(cur(), date, { exercises: w.exercises }); render()
  }
  function updateExField(id, date, field, val) {
    const w = currentWorkout(date)
    const e = w.exercises.find(x => x.id === id); if (e) e[field] = val
    store.setWorkout(cur(), date, { exercises: w.exercises })
    // sin render completo para no perder el foco del input
  }
  function finishSession(date) {
    const w = currentWorkout(date)
    store.setWorkout(cur(), date, { exercises: w.exercises, finished: true })
    S.overlay = null; S.tab = 'semana'; render()
  }
  function saveBody(form) {
    const data = {}
    ;['weight', 'cintura', 'cadera', 'pecho', 'brazo', 'muslo'].forEach(k => { if (form[k].value) data[k] = +form[k].value })
    store.setBody(cur(), todayISO(), data); render()
  }
  function savePhoto(input) {
    const f = input.files && input.files[0]; if (!f) return
    const rd = new FileReader()
    rd.onload = () => { try { localStorage.setItem('gymduo:photo:' + cur(), rd.result) } catch {} render() }
    rd.readAsDataURL(f)
  }
  function toggleRest(i) {
    const prof = curProfile(); const wk = prof.plan.week.slice()
    if (wk[i].rest) {
      // convertir en día de entrenamiento: reutiliza una sesión existente
      const src = wk.find(d => !d.rest)
      wk[i] = src ? Object.assign({}, src, { dayName: P.DAYS[i] }) : wk[i]
      if (!src) wk[i].rest = false
    } else {
      wk[i] = { dayName: P.DAYS[i], rest: true }
    }
    prof.plan.week = wk
    store.setProfile(cur(), { plan: prof.plan })
    S.overlay = null; render()
  }
  function swapDay(i, j) {
    const prof = curProfile(); const wk = prof.plan.week.slice()
    const tmp = Object.assign({}, wk[i], { dayName: P.DAYS[j] })
    wk[i] = Object.assign({}, wk[j], { dayName: P.DAYS[i] })
    wk[j] = tmp
    prof.plan.week = wk
    store.setProfile(cur(), { plan: prof.plan })
    S.overlay = null; render()
  }

  // ---------- arranque ----------
  store.onChange(() => { if (document.getElementById('root')) render() })
  store.init().then(() => {
    if (store.current) {
      const prof = store.getProfile(store.current)
      S.route = prof && prof.plan ? 'app' : (prof ? 'setup' : 'select')
      if (S.route === 'setup') S.setupPid = store.current
    } else S.route = 'select'
    render()
  })
  render()
})();
