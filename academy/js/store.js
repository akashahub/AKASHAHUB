/** Store - profile + grants + access log. UI never talks to Firestore. */
const KEY = 'academy-os.v03';
const LOG_CAP = 40;

function blank() {
  return {
    tenantId: 'fluir',
    signed: false,
    role: null,
    workspace: null,
    unitId: 'pituba',
    name: '',
    email: '',
    uid: '',
    job: 'recepcao',
    alunoTrack: 'pilates',
    done: {},
    attend: {},
    dreUrl: '',
    grants: {},
    accessLog: [],
    loc: '',
    cloud: 'local'
  };
}

function readLocal() {
  try {
    return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || 'null') || {});
  } catch (e) {
    return blank();
  }
}

function writeLocal(state) {
  const copy = Object.assign({}, state, { accessLog: (state.accessLog || []).slice(-LOG_CAP) });
  localStorage.setItem(KEY, JSON.stringify(copy));
}

export function createStore(opts) {
  let state = readLocal();

  function emit() {
    writeLocal(state);
    if (opts && opts.onPersist) opts.onPersist(state);
  }

  return {
    get: function () { return state; },
    patch: function (partial) {
      state = Object.assign({}, state, partial);
      emit();
    },
    markLesson: function (id) {
      const done = Object.assign({}, state.done);
      done[id] = true;
      state = Object.assign({}, state, { done: done });
      emit();
    },
    markAttend: function (eventId, rec) {
      const attend = Object.assign({}, state.attend);
      attend[eventId] = rec;
      state = Object.assign({}, state, { attend: attend });
      emit();
    },
    logAccess: function (rec) {
      const row = {
        email: state.email || '',
        name: state.name || 'local',
        ws: rec.ws || '',
        what: rec.what || '',
        at: new Date().toISOString(),
        loc: rec.loc || state.loc || ''
      };
      const accessLog = (state.accessLog || []).concat([row]).slice(-LOG_CAP);
      state = Object.assign({}, state, { accessLog: accessLog });
      emit();
      return row;
    },
    setLoc: function (loc) {
      const accessLog = (state.accessLog || []).slice();
      if (accessLog.length && !accessLog[accessLog.length - 1].loc) {
        accessLog[accessLog.length - 1] = Object.assign({}, accessLog[accessLog.length - 1], { loc: loc });
      }
      state = Object.assign({}, state, { loc: loc, accessLog: accessLog });
      emit();
    },
    setGrant: function (email, grant) {
      const grants = Object.assign({}, state.grants);
      grants[String(email || '').trim().toLowerCase()] = grant;
      state = Object.assign({}, state, { grants: grants });
      emit();
    },
    removeGrant: function (email) {
      const grants = Object.assign({}, state.grants);
      delete grants[String(email || '').trim().toLowerCase()];
      state = Object.assign({}, state, { grants: grants });
      emit();
    },
    signOut: function () {
      state = Object.assign({}, state, { signed: false, workspace: null, role: null });
      emit();
    }
  };
}

export async function persistFirestore(db, state) {
  if (!db || !state.uid) return 'local';
  try {
    await db.collection('academy_profiles').doc(state.uid).set({
      tenantId: state.tenantId,
      role: state.role,
      workspace: state.workspace,
      unitId: state.unitId,
      name: state.name,
      email: state.email,
      job: state.job,
      done: state.done,
      attend: state.attend,
      dreUrl: state.dreUrl,
      grants: state.grants,
      loc: state.loc || '',
      at: new Date().toISOString()
    }, { merge: true });
    return 'ok';
  } catch (e) {
    return 'local';
  }
}

export async function pushAccess(db, row) {
  if (!db || !row) return;
  try {
    await db.collection('academy_access').add({
      tenantId: 'fluir',
      email: row.email || '',
      name: row.name || '',
      ws: row.ws || '',
      what: String(row.what || '').slice(0, 80),
      at: row.at,
      loc: row.loc || ''
    });
  } catch (e) {}
}

export async function fetchAccess(db) {
  if (!db) return [];
  try {
    const snap = await db.collection('academy_access').orderBy('at', 'desc').limit(30).get();
    return snap.docs.map(function (d) { return d.data(); });
  } catch (e) {
    try {
      const snap = await db.collection('academy_access').limit(30).get();
      return snap.docs.map(function (d) { return d.data(); });
    } catch (e2) {
      return [];
    }
  }
}
