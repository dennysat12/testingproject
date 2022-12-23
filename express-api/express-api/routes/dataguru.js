const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');
const knex = require('../config/knexdb');






function extractValue(arr, prop) {

    // extract value from property
    let extractedValue = arr.map(item => item[prop]);

    return extractedValue;

}
/**
 * INDEX POSTS
 */
router.get('/', function (req, res) {
    //query
    connection.query(`SELECT * FROM data_guru`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Posts',
                data: rows
            })
        }
    });
});

/**
 * STORE POST
 */
 router.post('/store', [

    //validation
    body('nomor_induk').notEmpty(),
    body('nama').notEmpty(),
    body('info').notEmpty(),
   
    body('password').notEmpty(),
    body('alamat').notEmpty(),
    body('kontak').notEmpty(),
],async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
   

 //validation
   

  let nid = req.body.nomor_induk.replace(/\s+/g, '');
 
  let formData = {
    nomorinduk: nid,
    nama: req.body.nama,
    info: req.body.info,
  
    password: req.body.password,
    alamat: req.body.alamat,
    kontak: req.body.kontak
    
}

 
 //data post


const datacek = await knex('data_guru').where('nomorinduk',nid)
if (datacek && datacek.length> 0) {
   
 return res.status(411).json({
     status: false,
     message: 'nomor induk sudah ada'

 
 });}


 await knex('data_guru').insert(formData).then(() => console.log("data inserted"))
 .catch((err) => { console.log(err); throw err })
 console.log("sucess") 
 res.json({
     status: true,
     message: 'Input Success',
 })

});
    
  



/**
 * SHOW POST
 */
 router.get('/(:nomor_induk)', async (req, res) => {


    const urutanawal = await knex.select('*').from('data_guru').where('nomorinduk',req.params.nomor_induk).limit(1)

    
    
    
    
    
    
    return res.status(200).json({
        status: true,
        message: 'Detail Data Post',
        data: urutanawal
    })

   
});
/**
 * UPDATE POST
 */
 router.patch('/update/:nomor_induk', [

    //validation
    body('nomorinduk').notEmpty(),
    body('nama').notEmpty(),
    body('info').notEmpty(),
    body('kontak').notEmpty(),
    body('alamat').notEmpty(),
    body('password').notEmpty()
  

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    const datacek = await knex('data_guru').where('nomorinduk',req.body.nomorinduk)
    if (datacek && datacek.length> 0 && req.body.nomorinduk != req.params.nomor_induk) {
        
      return res.status(411).json({
          status: false,
          message: 'id sudah ada'
  
      
      });}
    //nomor_induk post
    let nomor_induk = req.params.nomor_induk;

    //data post
    let formData = {
        nomorinduk: req.body.nomorinduk,
        nama: req.body.nama,
        info: req.body.info,
        alamat: req.body.alamat,
        password: req.body.password,
     
        kontak: req.body.kontak,
    }

    // update query
    await knex('data_guru').where('nomorinduk',nomor_induk).update(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })

});

router.get('/get/kepsek', async (req, res) =>{
    //query
    
 let kepsek =await  knex('kepalasekolah').innerJoin('data_guru','kepalasekolah.guru','data_guru.nomorinduk')
console.log(kepsek)
          res.json({
                status: true,
                message: 'kepsek',
                data : kepsek
            })
      
});

router.patch('/kepsek/', [

    //validation
    body('nomorinduk').notEmpty(),
  
  

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    const datacek = await knex('kepalasekolah')
    console.log(datacek)
    
    if (datacek && datacek.length> 0 ) {
    await knex ('kepalasekolah').where('guru',datacek[0].guru).update('guru',req.body.nomorinduk)
    res.json({
        status: true,
        message: 'Kepsek dirubah',
    })
    
    ;}
    //nomor_induk post
 else{

    // update query
    await knex('kepalasekolah').insert({guru : req.body.nomorinduk}).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Data Kepsek Dimasukkan',
    })}

});


router.patch('/walikelas/', [

    //validation
    body('nomorinduk').notEmpty(),
    body('kelas').notEmpty(),
  

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    const datacek = await knex('walikelas').where('kelas',req.body.kelas)
    console.log(datacek)
    
    if (datacek && datacek.length> 0 ) {
    await knex ('walikelas').where('kelas',req.body.kelas).update('guru',req.body.nomorinduk)
    res.json({
        status: true,
        message: 'Wali Kelas dirubah',
    })
    
    ;}
    //nomor_induk post
 else{
    let formData = {
        guru: req.body.nomorinduk,
        kelas: req.body.kelas,
        
    }
    // update query
    await knex('walikelas').insert(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Data Wali Kelas Dimasukkan',
    })}

});


/**
 * DELETE POST
 */
 router.delete('/delete/(:nomor_induk)', function(req, res) {

    let nomor_induk = req.params.nomor_induk;
     
    connection.query(`DELETE FROM data_guru WHERE nomorinduk = ${nomor_induk}`, function(err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            })
        }
    })
});














router.get('/get/walikelas', async (req, res) =>{
    //query
    
 let kepsek =await  knex('kelas').leftJoin('walikelas','kelas.idkelas','walikelas.kelas').leftJoin('data_guru','walikelas.guru','data_guru.nomorinduk').orderBy('kelas.namakelas','asc')
console.log(kepsek)
          res.json({
                status: true,
                message: 'kepsek',
                data : kepsek
            })
      
});

router.get('/get/tampilpengajar/(:kelas)', async (req, res) =>{
    let kelas = req.params.kelas
    let data =await  knex.select('id_mapel','mapel','nama').from('jam_akademik_a').leftJoin('pengajar_materi','jam_akademik_a.id_mapel','pengajar_materi.idmateri').leftJoin('data_guru','pengajar_materi.nomor_induk_guru','data_guru.nomorinduk').orderBy('jam_akademik_a.mapel','asc').andWhere('idkelas',kelas)
    console.log(data)
             res.json({
                   status: true,
                   message: 'data tampil',
              data : data
               })
         })


router.get('/get/pengajar/(:kelas)', async (req, res) =>{
    //query
    let kelas = req.params.kelas


    let data3 = await knex.select('kurikulum').from('kelas').where('idkelas',kelas).limit(1)
let result = data3[0].kurikulum
console.log ( "data" , result)
let kels='kelas1'
let test = await knex.select('id_mapel',result).from('jam_akademik_a')
console.log (test)
await test.map(async (u)=>  {
   
    let cekkosong = await knex.select(result).from('jam_akademik_a').where('id_mapel',u.id_mapel)
    let validkosong = Number(extractValue(cekkosong, result));
    console.log(cekkosong,'data angka')
if (validkosong==0){
    console.log(u.id_mapel,validkosong)
let cek = await knex.select('*').from('pengajar_materi').where('idmateri',u.id_mapel).andWhere('idkelas',kelas)
if (cek.length==0){
console.log('jam kosong dan tidak ada di pengajaran' , u.id_mapel,validkosong)

}
else{
    await knex.select('*').from('pengajar_materi').where('idmateri',u.id_mapel).andWhere('idkelas',kelas).del()
console.log('ada yang dihapus ' , u.id_mapel, validkosong)
}

}
else{

    let formData = {
     idmateri:u.id_mapel,
     idkelas : kelas,
     nomor_induk_guru:"tanpa pengajar"

    
    
    }
    let cek = await knex.select('*').from('pengajar_materi').where('idmateri',u.id_mapel).andWhere('idkelas',kelas)
    if (cek.length==0){
    
        await knex('pengajar_materi').insert(formData).then(() => console.log("data inserted"))
    }
    else{
   console.log(u.id_mapel,validkosong,"sudah ada datanya")
    }
}


})











          res.json({
                status: true,
                message: 'data tampil',
           
            })
      
});




router.patch('/pengajar/', [

    //validation
    body('nomorinduk').notEmpty(),
    body('kelas').notEmpty(),
    body('mapel').notEmpty(),
  

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }



    const datacek = await knex('pengajar_materi').where('idmateri',req.body.mapel).andWhere('idkelas',req.body.kelas)
    console.log(datacek)
    
    if (datacek && datacek.length> 0 ) {
    await knex ('pengajar_materi').where('idkelas',req.body.kelas).andWhere('idmateri',req.body.mapel).update('nomor_induk_guru',req.body.nomorinduk)
    res.json({
        status: true,
        message: 'Wali Kelas dirubah',
    })
    
    ;}
    //nomor_induk post
 else{
    let formData = {
        nomor_induk_guru: req.body.nomorinduk,
        idkelas: req.body.kelas,
        idmateri: req.body.mapel,
    }
    // update query
    await knex('pengajar_materi').insert(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Data Wali Kelas Dimasukkan',
    })}

});













module.exports = router;