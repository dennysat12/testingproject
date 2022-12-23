const express = require('express')


const app = express()
const port = 3000

//import library CORS
const cors = require('cors')

//use cors
app.use(cors())

//import body parser
const bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '50mb' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))




//import route posts
const postsAkademik_A = require('./routes/akademik_a');
app.use('/api/akademik_a', postsAkademik_A); // use route posts di Express

//import route posts
const postsTipe_Akademik = require('./routes/tipe_Akademik');
app.use('/api/tipe_akademik', postsTipe_Akademik); // use route posts di Express


//import route posts
const postsAkademik_C1 = require('./routes/akademik_c1');
app.use('/api/akademik_c1', postsAkademik_C1); // use route posts di Express

//import route posts
const postsAkademik_C2 = require('./routes/akademik_c2');
app.use('/api/akademik_c2', postsAkademik_C2); // use route posts di Express



const postsDataGuru= require('./routes/dataguru');
app.use('/api/dataguru', postsDataGuru); // use route posts di Express


const postsDataMurid= require('./routes/datamurid');
app.use('/api/datamurid', postsDataMurid); // use route posts di Express

const postsJadwal= require('./routes/jadwal_akademik');
app.use('/api/jadwal', postsJadwal); // use route posts di Express

const postsKelas= require('./routes/kelas');
app.use('/api/kelas', postsKelas); // use route posts di Express

const postsSoal= require('./routes/soal');
app.use('/api/soal', postsSoal); // use route posts di Express


const postsJawab= require('./routes/jawaban');
app.use('/api/jawab', postsJawab); // use route posts di Express

const postsPengajar= require('./routes/pengajaran');
app.use('/api/pengajaran', postsPengajar); // use route posts di Express

const postsMateri= require('./routes/materi');
app.use('/api/materi', postsMateri); // use route posts di Express

const postsPembayaran= require('./routes/pembayaran');
app.use('/api/pembayaran', postsPembayaran); // use route posts di Express

const postsRaport= require('./routes/raport');
app.use('/api/raport', postsRaport); // use route posts di Express





app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})