/* ============================================================
 *  GymDuo — Almacenamiento y sincronización
 *  Fuente de verdad local (localStorage) + espejo remoto opcional.
 *  Drivers de sync (por prioridad):
 *    1) Firebase   -> window.__gymFirebaseDriver (si hay credenciales)
 *    2) DB Artifact-> claude.use('db')  (sincroniza con tu sesión Claude)
 *    3) local      -> solo este dispositivo
 *  Colecciones: profiles / workouts / body   (doc id workouts|body = pid__fecha)
 * ============================================================ */
(function () {
  const LS_KEY = 'gymduo:state'
  const LS_CUR = 'gymduo:current'

  const empty = () => ({ profiles: {}, workouts: {}, body: {} })
  let state = empty()
  let subs = []
  let driver = null
  let mode = 'local'

  function safeParse(s) { try { return JSON.parse(s) } catch { return null } }
  function loadLocal() {
    try { const d = safeParse(localStorage.getItem(LS_KEY)); if (d) state = Object.assign(empty(), d) } catch {}
  }
  function saveLocal() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch {}
  }
  function notify() { subs.forEach(fn => { try { fn(state) } catch {} }) }

  // clave compuesta para workouts/body
  const key = (pid, date) => pid + '__' + date

  // ---- API de lectura ----
  const getState = () => state
  const getProfile = pid => state.profiles[pid] || null
  const bothProfiles = () => state.profiles
  const getWorkout = (pid, date) => state.workouts[key(pid, date)] || null
  const listWorkouts = pid => Object.values(state.workouts).filter(w => w.pid === pid).sort((a, b) => (a.date < b.date ? 1 : -1))
  const getBody = (pid, date) => state.body[key(pid, date)] || null
  const listBody = pid => Object.values(state.body).filter(b => b.pid === pid).sort((a, b) => (a.date < b.date ? 1 : -1))

  // ---- API de escritura (usuario) ----
  function setProfile(pid, data) {
    const doc = Object.assign({}, state.profiles[pid], data, { pid, updatedAt: Date.now() })
    state.profiles[pid] = doc
    saveLocal(); notify()
    remoteWrite('profiles', pid, doc)
  }
  function setWorkout(pid, date, data) {
    const k = key(pid, date)
    const doc = Object.assign({}, state.workouts[k], data, { pid, date, updatedAt: Date.now() })
    state.workouts[k] = doc
    saveLocal(); notify()
    remoteWrite('workouts', k, doc)
  }
  function setBody(pid, date, data) {
    const k = key(pid, date)
    const doc = Object.assign({}, state.body[k], data, { pid, date, updatedAt: Date.now() })
    state.body[k] = doc
    saveLocal(); notify()
    remoteWrite('body', k, doc)
  }

  function remoteWrite(coll, id, doc) {
    if (driver) { try { driver.write(coll, id, doc) } catch {} }
  }

  // ---- fusión desde remoto (gana el updatedAt más nuevo) ----
  function mergeDoc(coll, id, doc) {
    if (!doc) return
    const bucket = coll === 'profiles' ? state.profiles : coll === 'workouts' ? state.workouts : state.body
    const cur = bucket[id]
    if (!cur || (doc.updatedAt || 0) >= (cur.updatedAt || 0)) {
      bucket[id] = doc
      return true
    }
    return false
  }
  function mergeCollection(coll, docs) {
    let changed = false
    docs.forEach(d => { if (d && d.id) { if (mergeDoc(coll, coll === 'profiles' ? d.pid || d.id : d.id, d)) changed = true } })
    if (changed) { saveLocal(); notify() }
  }

  // ---- driver: DB del artifact (claude.use) ----
  async function artifactDbDriver() {
    if (!(window.claude && typeof window.claude.use === 'function')) return null
    let db
    try { db = await window.claude.use('db') } catch { db = null }
    if (!db) return null
    const drv = {
      write(coll, id, data) {
        try { db.collection(coll).doc(String(id)).set(data) } catch {}
      }
    }
    // suscripciones en vivo
    ;['profiles', 'workouts', 'body'].forEach(coll => {
      try {
        db.collection(coll).onSnapshot(snap => {
          const docs = snap.docs.map(s => { const o = s.data() || {}; o.id = s.id; return o })
          mergeCollection(coll, docs)
        }, () => {})
      } catch {}
    })
    return drv
  }

  async function pickDriver() {
    // 1) Firebase si el index.html lo activó (espera breve a que cargue el módulo)
    for (let i = 0; i < 20 && !window.__gymFirebaseDriver; i++) {
      if (window.__gymFirebaseNone) break
      await new Promise(r => setTimeout(r, 100))
    }
    if (window.__gymFirebaseDriver) {
      driver = window.__gymFirebaseDriver
      mode = 'firebase'
      driver.subscribeAll && driver.subscribeAll(mergeCollection)
      return
    }
    // 2) DB del artifact
    const adb = await artifactDbDriver()
    if (adb) { driver = adb; mode = 'artifact'; return }
    // 3) local
    driver = null; mode = 'local'
  }

  async function init() {
    loadLocal()
    // current profile
    try { window.GymStore.current = localStorage.getItem(LS_CUR) || null } catch {}
    await pickDriver()
    notify()
    return mode
  }

  function setCurrent(pid) {
    window.GymStore.current = pid
    try { localStorage.setItem(LS_CUR, pid || '') } catch {}
    notify()
  }
  function getMode() { return mode }
  function onChange(fn) { subs.push(fn); return () => { subs = subs.filter(f => f !== fn) } }

  window.GymStore = {
    init, onChange, getMode, current: null, setCurrent,
    getState, getProfile, bothProfiles, setProfile,
    getWorkout, listWorkouts, setWorkout,
    getBody, listBody, setBody
  }
})();
