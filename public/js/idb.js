//variable for db connect
let db;
//connect to the indexedDB local storage of client's browser with name and version number
const request = indexedDB.open('mrmoneymanager', 1)

//on new events, change version and store new event
request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('offline-entries', { autoIncrement: true });
};

//upload saved transactions once client is back online
request.onsuccess = function(e) {
    db = e.target.result;

    if (navigator.onLine) {
        //upload transaction
    }
};

//catch errors
request.onerror = function(e) {
    console.log(e.target.errorCode);
};

//save entries when offline
function localSave(transaction) {
    console.log('saving transaction entry to local database')
    const entry = db.transaction(['offline-entries'], 'readwrite');
    const entryObjectStore = entry.objectStore('offline-entries');
    entryObjectStore.add(transaction);
};

//upload stored entries
function uploadEntries() {
    const entry = db.transaction(['offline-entries'], 'readwrite');
    const entryObjectStore = entry.objectStore('offline-entries');
    const getAll = entryObjectStore.getAll();
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(serverRes => {
                if (serverRes.message) {
                    throw new Error(serverRes);
                }
                const entry = db.transaction(['offline-entries'], 'readwrite');
                const entryObjectStore = entry.objectStore('offline-entries');
                entryObjectStore.clear();
                alert('locally saved entries now uploaded');
            })
            .catch(err => { console.log(err); });
        }
    }
};

window.addEventListener('online', uploadEntries);