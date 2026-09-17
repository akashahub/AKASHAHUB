/** Store — profile + grants. UI never talks to Firestore. */
const KEY = 'academy-os.v03';

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
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function createStore(opts) {
  const listeners = [];
  let state = readLocal();

  function emit() {
    writeLocal(state);
    listeners.forEach(function (fn) { fn(state); });
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
      at: new Date().toISOString()
    }, { merge: true });
    return 'ok';
  } catch (e) {
    return 'local';
  }
}
