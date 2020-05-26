const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var admin = require("firebase-admin");

var serviceAccount = require("./api/data-bank-nia-firebase-adminsdk-7qsf0-f34e62b0fc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://data-bank-nia.firebaseio.com"
});


let db = admin.firestore();

const app = express();
 
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.get('/api', async (req, res) => {
    const items = await getFolders();
    res.send( await items );
});

app.post('/insert', async (req, res) => {
    // firebase.firestore().collection('folders').doc(this.editedItem.name).set({
    //     name: this.editedItem.name,
    // })
    // .then(function() {
    //     console.log("Document successfully written!");
    // })
    // .catch(function(error) {
    //     console.error("Error writing document: ", error);
    // });
    const ins = await insertFolders(req.body);
    const items = await getFolders();
    res.send( await items );
});

async function getFolders(){
    var items = [];
    let citiesRef = db.collection('folders');
    let allCities = citiesRef.get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var data = doc.data();
            data.src = 'folder-icon.png';
            data.artist = '0 documents';
            data.color = '#FFFFFF';
            items.push(data);
        });
        console.log('document get!');
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
    await allCities;
    return items;
}

async function insertFolders(folder){
    let data = folder;
    let setDoc = db.collection('folders').doc(data.name).set(data);
    await setDoc;
    return true;
}

if(process.env.NODE_ENV === 'production'){

    app.use(express.static(__dirname + '/public/'));

    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
