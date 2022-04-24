//variable for db connect
let db;
//connect to the indexedDB local storage of client's browser with name and version number
const request = indexedDB.open('mrmoneymanager', 1)

//on new events, change version and store new event
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('transaction', { autoIncrement: true });
};

//save transactions when offline
function saveTransaction(transaction) {
    const newTransaction = db.transaction(['new-transaction'], 'readwrite');
    const transactionObjectStore = newTransaction.objectStore('new-transaction');
    transactionObjectStore.add(transaction);
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