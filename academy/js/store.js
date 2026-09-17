/** Store — one state tree, two adapters. UI never talks to Firestore. */
const KEY = 'academy-os.v02';

function blank() {
  return {
    tenantId: 'fluir',
    role: null,
    unitId: 'pituba',
    name: '',
    email: '',
    uid: '',
    done: {},
    attend: {},
    dreUrl: '',
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
    on: function (fn) { listeners.push(fn); return function () {
      const i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    }; },
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
    resetRole: function () {
      state = Object.assign({}, state, { role: null });
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
      unitId: state.unitId,
      name: state.name,
      email: state.email,
      done: state.done,
      attend: state.attend,
      dreUrl: state.dreUrl,
      at: new Date().toISOString()
    }, { merge: true });
    return 'ok';
  } catch (e) {
    return 'local';
  }
}
