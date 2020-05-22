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

if(process.env.NODE_ENV === 'production'){

    app.use(express.static(__dirname + '/public/'));

    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
 
app.get('/api', async (req, res) => {
    const items = await getFolders();
    res.send( await items );
});

app.post('/', async (req, res) => {
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
        
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
    await allCities;
    return items;
}
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
