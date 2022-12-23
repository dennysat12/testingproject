const express = require('express');
const router = express.Router();

  
  
//import express validator
const {
    body,
    validationResult
} = require('express-validator');

//import database
const connection = require('../config/database');
const knex = require('../config/knexdb');
/**
 * INDEX POSTS
 */
 function extractValue(arr, prop) {

    // extract value from property
    let extractedValue = arr.map(item => item[prop]);

    return extractedValue;

}



//distinc jamke
router.get('/jamke/(:kelas)',  async(req,res) =>  {
   let kelas = req.params.kelas

let data2 = await knex('kurikulum').distinct('jamke').where('kelas',kelas)

    console.log(data2)   
    res.json({status: true,
        message: 'List Data Posts',
              data: data2,})

});



//cek sisa



/**
 * STORE POST
 */
router.post('/store', [

    //validation
    body('jamke').notEmpty(),
    body('kelas').notEmpty(),
    body('hari').notEmpty(),
    body('mapel').notEmpty(),



    
], async(req, res) => {

    let formData = {
        jamke: req.body.jamke,
        kelas: req.body.kelas,
        hari: req.body.hari,
        mapel: req.body.mapel,
    }

    if (req.body.mapel =="---" ) {
        await knex('kurikulum').where('jamke',req.body.jamke).andWhere('kelas',req.body.kelas).andWhere('hari',req.body.hari).update(formData)
        res.status(200).json({
            status: true,
            message: 'Jadwal Diperbaharui'})
    
    
    }
    else{
  
    let data2 = await knex('kurikulum').count('hari').where('kelas',req.body.kelas).andWhere('mapel',req.body.mapel,)
    let result2 = Number(extractValue(data2, 'count(`hari`)'));
    
    let data3 = await knex.select('kurikulum').from('kelas').where('idkelas',req.body.kelas).limit(1)
    let result3 = data3[0].kurikulum
    let data1 = await knex.select(result3).from('jam_akademik_a').where('id_mapel',req.body.mapel).limit(1)
    let cekkosong = await knex.select(result3).from('jam_akademik_a').where('id_mapel',req.body.mapel)
    let result1 = Number(extractValue(data1, result3))
    
    let result = result1-result2
    console.log(result3)
    console.log('t',data1,cekkosong,req.body.mapel)
    console.log(result1)
    
    console.log(result)
     


if (result <=0 ) {

    res.json({status: false,
        message: 'Sisa Jam Pelajaran Habis',
              })



}

else {



    const datacek = await knex.select('*').from('kurikulum').where('jamke',req.body.jamke).andWhere('kelas',req.body.kelas).andWhere('hari',req.body.hari)
    if (datacek && datacek.length> 0) {
      
        await knex('kurikulum').where('jamke',req.body.jamke).andWhere('kelas',req.body.kelas).andWhere('hari',req.body.hari).update(formData)
        res.status(200).json({
            status: true,
            message: 'Jadwal Diperbaharui'
        })


        ;}

        else {
            
            res.json({
                status: false,
                message: 'Jadwal tidak ditemukan',
            })
        
            

            
        }
    }

}


      






}

);
   

 //POST

router.get('/(:kelas)', async (req, res) => {
    // await until the Promise is rejected or resolved
   
    let kelas = req.params.kelas
      
     
   //update sisa
//let data2 = await knex('kurikulum').count('hari').where('kelas',kelas).andWhere('mapel',mapel)
//let result2 = Number(extractValue(data2, 'count(`hari`)'));

let data3 = await knex.select('kurikulum').from('kelas').where('idkelas',kelas).limit(1)

console.log(data3)
let result3 = data3[0].kurikulum


let loop = await knex.select("id_mapel", result3).from('jam_akademik_a')
let looptotal = await knex.count("id_mapel", result3).from('jam_akademik_a')


let loopttl = Number(extractValue(looptotal, 'count(`id_mapel`)'));


let i = 0
while (i<loopttl){

    let data2 = await knex('kurikulum').count('hari').where('kelas',kelas).andWhere('mapel',loop[i].id_mapel)
    let result2 = Number(extractValue(data2, 'count(`hari`)'));

    let dataawal = await knex.select(result3).from('jam_akademik_a').where('id_mapel',loop[i].id_mapel).limit(1)

let result1 =  Number(extractValue(dataawal, result3));

 let sisa =  result1-result2
console.log(sisa)

let formData = {
    idmapel: loop[i].id_mapel,
    kelas: kelas,
    sisa: sisa,
    total: result1

}


let cek = await knex('sisajampelajaran').where('idmapel',loop[i].id_mapel).andWhere('kelas',kelas).limit(1)
if (cek && cek.length> 0) {
    await knex('sisajampelajaran').where('idmapel',loop[i].id_mapel).andWhere('kelas',kelas).update(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("beberapa data diupdate") 
  

}

else {
   
  
    await knex('sisajampelajaran').insert(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })

}

console.log (result1 , "test",result2)
i++
}
//let data1 = await knex.select(result3).from('jam_akademik_a').where('id_mapel',mapel).limit(1)

//let result1 = Number(extractValue(data1, result3))

//result = result1-result2

 
   



















    connection.query(`SELECT * FROM kurikulum LEFT JOIN jam_akademik_a ON jam_akademik_a.id_mapel = kurikulum.mapel WHERE kelas = ${kelas}`, function (err, rows) {
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
})




 //Tambah jam

 router.post('/tambah/(:kelas)', async (req, res) => {
    // await until the Promise is rejected or resolved
   
    let kelas = req.params.kelas
    let i = 1

    let maks = await knex('kurikulum').max('jamke').where('kelas',kelas)

    let result = Number(extractValue(maks, 'max(`jamke`)'));


    while (i <=6){

        let formData = {
            jamke: result+1,
            kelas: kelas,
            hari: i,
            mapel: "---",
        }

    await knex('kurikulum').insert(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })



i++


}
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })
})








 //Tambah jam

 router.delete('/delete/(:kelas)', async (req, res) => {
    // await until the Promise is rejected or resolved
   
    let kelas = req.params.kelas


    let maks = await knex('kurikulum').max('jamke').where('kelas',kelas)

    let result = Number(extractValue(maks, 'max(`jamke`)'));


   

    await knex('kurikulum').where('kelas',kelas).andWhere('jamke',result).del().then(() => console.log("data deleted"))
    .catch((err) => { console.log(err); throw err })




    console.log("sucess") 
    res.json({
        status: true,
        message: 'Data Deleted',
    })
})








 //Tambah jam

 router.get('/getsisa/(:kelas)', async (req, res) => {
    // await until the Promise is rejected or resolved
   
   let kelas = req.params.kelas

    let sisa = await knex.from('sisajampelajaran').innerJoin('jam_akademik_a', 'sisajampelajaran.idmapel', 'jam_akademik_a.id_mapel').where('kelas',kelas)

  
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
        data: sisa
    })
})
module.exports = router;