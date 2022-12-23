const express = require('express');
const router = express.Router();

//import express validator




// With express-promise-router
var router2 = require("express-promise-router")();







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
router.get('/', async(req, res) => {
    //query
     let data = await knex.select('*').from('jam_akademik_a')
    console.log(data)   
    res.json({status: true,
        message: 'List Data Posts',
              data: data,})
});


//tipe 



/**
 * STORE POST
 */
router.post('/store', [

    //validation
    body('id_mapel').notEmpty(),
    body('mapel').notEmpty(),
    body('kelas1').notEmpty(),
    body('kelas2').notEmpty(),
    body('kelas3').notEmpty(),
    body('kelas4').notEmpty(),
    body('kelas5').notEmpty(),
    body('kelas6').notEmpty(),
    body('tipe_aka').notEmpty()

],async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(100).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        id_mapel: req.body.id_mapel,
        mapel: req.body.mapel,
        kelas1: req.body.kelas1,
        kelas2: req.body.kelas2,
        kelas3: req.body.kelas3,
        kelas4: req.body.kelas4,
        kelas5: req.body.kelas5,
        kelas6: req.body.kelas6,
        tipe_aka: req.body.tipe_aka,
    }
    
    
    
    const datacek = await knex.select('id_mapel').from('jam_akademik_a').where('id_mapel',req.body.id_mapel).limit(1)
    if (datacek && datacek.length> 0) {
      
        return res.status(411).json({
            status: false,
            message: 'id sudah ada',

        
        });}
  

    
    
    
    // insert query\




    connection.query('INSERT INTO jam_akademik_a SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: rows[0]
            })
        }
    })

});




//router.get('/test2', function (req ,res) {


//query

//  const tipe = connection.query(`SELECT * FROM tipe_akademik  `  )
//   function mapel() {
//    let i = 0   
//      for (const mapeltipe of tipe ){
//      const baru = connection.query ('SELECT * FROM jam_akademik_a WHERE tipe_aka = ? '  ,[mapeltipe.id]  ,function (err, rows)  {
//      tipe[i].baru = baru

//      i++}}
//     }}



//
//  }
//    )
//


// you can only use async in an async function so make the function async
router.get("/tes3", async function (req, res) {
    // await until the Promise is rejected or resolved
    const data = await getDatabaseData();
    return res.status(201).json({
        status: true,
        message: 'Insert Data Successfully',
        data: data
    })
  });
  
  async function getDatabaseData(){
    // return a promise immediately and once the callback returns return an error (reject the promise) or the data (resolve the promise) 
    return new Promise((resolve, reject) => {
      // That's a guess but if you have a foreign key you can JOIN, just search for SQL JOIN and you will find lots of examples/ explanations 
      connection.query(`SELECT * FROM jam_akademik_a INNER JOIN tipe_akademik ON tipe_akademik.id = jam_akademik_a.tipe_aka ORDER BY mapel ASC  ;`, (err, result) => {
        // if an error occurred reject promise
        if(err) reject(err);
        // we have the data so we can resolve the promise
        else resolve(result);

        
      })
    })
  };


//;



router.get("/tes4", async function (req, res) {
    // await until the Promise is rejected or resolved
    
    

    connection.query(`SELECT * FROM tipe_akademik  `, (err, result) => {
        tipe = result

    })
    const data = await getDatabaseData2();
    return res.status(500).json({ data: data });
  });
  
  async function getDatabaseData2(){
    let tipe = []
    // return a promise immediately and once the callback returns return an error (reject the promise) or the data (resolve the promise) 
    return new Promise((resolve, reject) => {
      // That's a guess but if you have a foreign key you can JOIN, just search for SQL JOIN and you will find lots of examples/ explanations 
      let i = 0
      for (let mapeltipe of tipe) {
          connection.query('SELECT * FROM jam_akademik_a WHERE tipe_aka = ? ', [mapeltipe.id], (err, listmapel) => {
              tipe[i].listmapel = listmapel
              i++
          })
      }
      // we have the data so we can resolve the promise
     resolve(tipe);

    })
  };

//;



router2.get('/test', async (req, res) => {


    //query

    let tipe = []

    connection.query(`SELECT * FROM tipe_akademik  `, function (err, result) {
        tipe = result

    })



    async function loop() {
        let i = 0
        for (let mapeltipe of tipe) {
            connection.query('SELECT * FROM jam_akademik_a WHERE tipe_aka = ? ', [mapeltipe.id], function (err, listmapel) {
                tipe[i].listmapel = listmapel
                i++
            })
        }

    }
    await loop()



    return res.status(500).json({
        data: tipe
    })

})



//function mapel() {
//let i = 0   
//for (const mapeltipe of tipe ){
//const baru = connection.query ('SELECT * FROM jam_akademik_a WHERE tipe_aka = ? '  ,[mapeltipe.id]  ,function   (err, rows)  )
//tipe[i].baru = baru

//i++}

//}

//mapel()   


;



















/**
 * SHOW POST
 */
router.get('/(:id)', async (req, res) =>{


    const urutanawal = await knex.select('*').from('jam_akademik_a').where('id_mapel',req.params.id)

    
    
    
    
    
    
    return res.status(200).json({
        status: true,
        message: 'Detail Data Post',
        data: urutanawal
    })
    
});







/**
 * SHOW POST
 */
 router.get('/namamapel/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT mapel FROM jam_akademik_a WHERE id =${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if post not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Post Not Found!',
            })
        }
        // if post found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data Post',
                data: rows[0]
            })
        }
    })
});











/**
 * SELECT
 */
router.get('/check/(:tipe_aka)', function (req, res) {
    //query

    let tipe_aka = req.params.tipe_aka;
    connection.query(`SELECT * FROM jam_akademik_a WHERE tipe_aka =${tipe_aka}`, function (err, rows) {
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
 * UPDATE POST
 */
 router.patch('/updatejam/', [

    //validation
   
  
    body('kelas').notEmpty(),
    body('jam').notEmpty(),
    body('id').notEmpty(),
], async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

 
    //data post
   
    // update query
  
    await knex('jam_akademik_a').where('id_mapel',req.body.id).update(req.body.kelas , req.body.jam).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })

});





/**
 * UPDATE POST
 */
 router.patch('/updatenama/', [

    //validation
   
  
    body('nama').notEmpty(),
    body('id').notEmpty(),
    body('idbaru').notEmpty(),

], async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
     }

     let id = req.body.idbaru.replace(/\s+/g, '');
     console.log (id)
     let formData = {
        id_mapel: id,
        mapel: req.body.nama
    }
    
    
    //data post
   
    // update query
  const datacek = await knex('jam_akademik_a').where('id_mapel',req.body.idbaru)
  if (  datacek.length> 0 && req.body.idbaru != req.body.id) {
      
    return res.status(411).json({
        status: false,
        message: 'id sudah ada'

    
    });}


    await knex('jam_akademik_a').where('id_mapel',req.body.id).update(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })

});

/**
 * DELETE POST
 */
router.delete('/delete/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`DELETE FROM jam_akademik_a WHERE id_mapel = ${id}`, function (err, rows) {
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

module.exports = router;