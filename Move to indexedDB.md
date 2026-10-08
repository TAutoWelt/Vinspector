Move Local Storage from localStorage to IndexedDB
1. Goal and scope

Replace the two localStorage keys in index.html with IndexedDB. Nothing else changes.

In scope

Storage of the current draft (autocheck_current_draft)
Storage of the archived reports (autocheck_reports)
One-time migration of existing data from localStorage to IndexedDB

Out of scope (do not implement in this step)

Photos stay as base64 strings inside the records. Do not convert them to Blobs yet.
No sync, no login, no network calls, no changes to the Vue structure, UI, texts, Tailwind classes, or print layout.
The JSON data shape stays the same, including schemaVersion values 4 (draft) and 3 (reports).

Behavior that must stay identical

The app loads, restores the draft, and shows the archive exactly as before.
Toast messages, confirmation dialogs, and the badge count work the same way.
The "Export JSON" backup produces the same file format.
2. Current localStorage usage (the map to replace)
Function	Current behavior	New behavior
saveDraft()	localStorage.setItem('autocheck_current_draft', JSON.stringify(draft))	Write the draft object to the draft store, key 'current'
loadDraft()	Reads the draft, checks schemaVersion === 4, restores vehicle, specialValues, and items	Same logic, but reads from IndexedDB
resetForm()	localStorage.removeItem('autocheck_current_draft')	Delete key 'current' from the draft store
loadSavedReports()	Reads autocheck_reports, validates each report's schemaVersion === 3	Read all records from the reports store, validate the same way
saveReportToArchive()	Adds the report to the start of the array and writes the whole array	Put one record into the reports store
deleteReportFromArchive(idx)	Splices the array and writes the whole array	Delete one record by id
3. Target design

Database: name autocheck, version 1

Object stores:

draft: out-of-line keys. One record, key 'current'.
reports: keyPath: 'id'. One record per archived report.
javascript
// Database setup
const DB_NAME = 'autocheck';
const DB_VERSION = 1;
const DRAFT_KEY = 'current';
let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('draft')) db.createObjectStore('draft');
        if (!db.objectStoreNames.contains('reports')) db.createObjectStore('reports', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

// Write queue: keeps writes in order so a fast sequence of edits
// (typing in a comment field) cannot finish out of order.
let writeChain = Promise.resolve();
function enqueueWrite(task) {
  const run = writeChain.then(task);
  writeChain = run.catch(() => {});
  return run;
}

// Small helper: run one request inside a transaction and resolve with its result
async function dbRequest(storeName, mode, makeRequest) {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const req = makeRequest(tx.objectStore(storeName));
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
4. Function-by-function instructions

saveDraft() becomes an async function that does this:

Build the draft object exactly as today (schemaVersion: 4, vehicle, items, specialValues, savedAt).
Convert it to a plain object before writing: const plain = JSON.parse(JSON.stringify(draft));. See the gotchas below.
enqueueWrite(() => dbRequest('draft', 'readwrite', s => s.put(plain, DRAFT_KEY)))
On success, set draftLastSaved.value = new Date().
On failure, console.warn as today. Do not show a new toast for a routine draft save.

loadDraft() becomes async:

const draft = await dbRequest('draft', 'readonly', s => s.get(DRAFT_KEY));
If there is no draft, return.
Keep the existing logic unchanged: check schemaVersion !== 4, and if so delete the record, show the same toast, and return.
Restore vehicle, specialValues, and items with the same merge code as today.

loadSavedReports() becomes async:

Read all reports: await dbRequest('reports', 'readonly', s => s.getAll()).
Sort newest first by savedAt descending. This keeps the same order the current unshift produces.
If any report has schemaVersion !== 3, delete all records in reports, set savedReports.value = [], and show the same toast as today.
Otherwise set savedReports.value to the sorted list.

saveReportToArchive():

Build the report object exactly as today.
await enqueueWrite(() => dbRequest('reports', 'readwrite', s => s.put(report)))
Then savedReports.value.unshift(report).
Show the existing success toast.
On failure, show an error toast (see section 6).

deleteReportFromArchive(idx): change the signature to take the report's id, not its index.

In the template, change the call to deleteReportFromArchive(rep.id).
Keep the confirmation dialog.
await enqueueWrite(() => dbRequest('reports', 'readwrite', s => s.delete(id)))
Remove the item from savedReports.value by id.
Show the existing toast.

Reason: the array index is no longer the database key. Using the id avoids deleting the wrong report.

resetForm(): replace localStorage.removeItem(...) with enqueueWrite(() => dbRequest('draft', 'readwrite', s => s.delete(DRAFT_KEY))).

onMounted: keep the same order, and await each step:

javascript
onMounted(async () => {
  await loadInspectionPoints();
  await migrateFromLocalStorage();
  await loadSavedReports();
  await loadDraft();
  requestPersistentStorage();
});

requestPersistentStorage(): call once on start. Failure must not break the app.

javascript
async function requestPersistentStorage() {
  try {
    if (navigator.storage && navigator.storage.persist) await navigator.storage.persist();
  } catch (e) { /* ignore: not supported */ }
}
5. Migration from localStorage (run once)

Existing users have data in localStorage. Migrate it on first start.

javascript
async function migrateFromLocalStorage() {
  const rawDraft = localStorage.getItem('autocheck_current_draft');
  const rawReports = localStorage.getItem('autocheck_reports');
  if (!rawDraft && !rawReports) return;

  try {
    if (rawDraft) {
      const draft = JSON.parse(rawDraft);
      await enqueueWrite(() => dbRequest('draft', 'readwrite', s => s.put(draft, DRAFT_KEY)));
    }
    if (rawReports) {
      const reports = JSON.parse(rawReports);
      if (Array.isArray(reports)) {
        await enqueueWrite(() => new Promise(async (resolve, reject) => {
          const db = await getDb();
          const tx = db.transaction('reports', 'readwrite');
          reports.forEach(r => tx.objectStore('reports').put(r));
          tx.oncomplete = resolve;
          tx.onerror = () => reject(tx.error);
        }));
      }
    }
    // Remove the old data only after both writes succeeded
    localStorage.removeItem('autocheck_current_draft');
    localStorage.removeItem('autocheck_reports');
  } catch (e) {
    console.error('Migration failed; localStorage data kept:', e);
  }
}

Rules:

Remove the localStorage keys only after the IndexedDB writes succeed. If the migration fails, the old data stays and the next start tries again.
Do not change the data during migration. Copy it as is, and let the normal schemaVersion checks in loadDraft and loadSavedReports handle old or invalid data.

6. Error handling
If indexedDB is not available (very old or restricted browsers), show one warning toast on start: "Податоците нема да се зачуваат" (the data will not be saved), and keep the app working in memory. Do not fall back silently.
A failed report save must not show the success toast. Show an error toast instead, using the existing toast function with a red icon. Suggested text: "Грешка при зачувување. Пробајте повторно." (Save error. Please try again.)
Draft save failures stay silent apart from console.warn, as in the current code.
7. Gotchas
Vue reactive proxies cannot be stored in IndexedDB. IndexedDB uses the structured clone algorithm, which throws DataCloneError for Vue proxies. Always convert with JSON.parse(JSON.stringify(...)) before put, or use toRaw(). The current code already deep-clones in several places, so follow that pattern.
Keep the write order. Use enqueueWrite for every write. Typing in the comment field calls saveDraft on each keystroke, and out-of-order writes could save an older draft last.
Make onMounted wait for each step. The current code runs loadSavedReports and loadDraft one after another. Keep that order with await.
Report IDs must be unique. IDs come from Date.now() and could collide. Use put, which replaces an existing record, so a collision overwrites an old report. Either check for an existing ID before saving, or add a random suffix to new IDs. Choose one and document it.
Safari and storage eviction. Safari can clear site data after weeks without use. navigator.storage.persist() reduces this risk, but the Export JSON backup remains the safety net.
Do not block rendering. The database opens asynchronously. The app should show the checklist first and fill the draft in once loaded.

8. Deliverable
Updated index.html with the changes above
No other files changed
A short note in the pull request listing: the new IndexedDB name and version, the migration behavior, and the one new error toast