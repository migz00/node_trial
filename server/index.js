const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Multer = require('multer')
const UUID = require("uuid-v4");
var admin = require("firebase-admin");

var serviceAccount = require("./api/data-bank-nia-firebase-adminsdk-7qsf0-f34e62b0fc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://data-bank-nia.firebaseio.com",
  storageBucket: "data-bank-nia.appspot.com"
});

let db = admin.firestore();
let bucketName = "data-bank-nia.appspot.com";
const app = express();
 
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});
let bucket = admin.storage().bucket();

app.get('/api', async (req, res) => {
    const items = await getFolders();
    res.send( await items );
});

app.get('/documents/:id', async (req, res) => {
    console.log(req.params.id)
    const items = await getDocuments(req.params.id);
    res.send( items );
});

app.post('/insert', async (req, res) => {
    console.log(req.body);
    const ins = await insertFolders(req.body);
    const items = await getFolders();
    res.send( await items );
});

app.post('/upload', multer.single('file'), async (req, res) => {
    console.log("upload");
    console.log(req.body);
    const upload = await sendUpload(req.file, req.body);
    const fire = await insertDocument(req.body, upload);
    console.log(upload);
    res.send( { url : upload } );
});

function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

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

async function getDocuments(id){
    var items = [];
    let docRef = db.collection('folders/'+id+'/'+id);
    let allDocs = docRef.get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var data = doc.data();
            data.name = doc.data().year + '-' + doc.data().province;
            console.log(data);
            items.push(data);
        });
        console.log('document get!');
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
    await allDocs;
    return items;
}

async function insertFolders(folder){
    let data = folder;
    let setDoc = db.collection('folders').doc(data.name).set(data);
    await setDoc;
    return true;
}

async function insertDocument(document, link){
    var id = document.year+"-"+document.province;
    let data = {
        year: document.year,
        province: document.province,
        link: link
    }        
    let setDoc = db.collection('folders').doc(document.folder).collection(document.folder).doc(id).set(data);
    await setDoc;
    return true;
}

async function sendUpload(req, body) {
  
    const gcsname = body.year+"-"+body.province;
    const file = bucket.file('nia/'+gcsname);
    var path = '';
    let uuid = UUID();

    const stream = file.createWriteStream({
        metadata: {
        contentType: req.mimetype,
        metadata: {
            firebaseStorageDownloadTokens: uuid
        }
        },
        resumable: false,
    });

    stream.on('error', err => {
        req.cloudStorageError = err;
    });

    stream.on('finish', async () => {
        req.cloudStorageObject = gcsname;
        await file.makePublic();
        req.cloudStoragePublicUrl = getPublicUrl(gcsname);

    });
    stream.end(req.buffer);
    await file.exists().then(function(data) {
        const exists = data[0];
    });
    // await file.getSignedUrl({
    //     action: 'read',
    //     expires: '01-01-2021'
    // }).then(signedUrls => {
    //     path = signedUrls[0];
    // });
    path = "https://firebasestorage.googleapis.com/v0/b/" + bucketName + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid
    console.log(path);
    return path;
}

if(process.env.NODE_ENV === 'production'){

    app.use(express.static(__dirname + '/public/'));

    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
