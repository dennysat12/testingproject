const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

const knex = require('../config/knexdb');


/**
 * INDEX POSTS
 */
router.get('/', function (req, res) {
    //query

    
    connection.query(`SELECT * FROM kelas`, function (err, rows) {
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
    body('idkelas').notEmpty(),
    body('namakelas').notEmpty(),
    body('kurikulum').notEmpty(),
   
 

],async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        idkelas: req.body.idkelas,
        namakelas: req.body.namakelas,
        kurikulum: req.body.kurikulum,
        
        
    }
    // update query
    await knex('kelas').insert(formData).then(() => console.log("data inserted"))
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
 router.get('/kelas/(:id)', async(req, res) =>{

    const urutanawal = await knex.select('*').from('kelas').where('idkelas',req.params.id)

    
    
    
    
    
    
    return res.status(200).json({
        status: true,
        message: 'Detail Data Post',
        data: urutanawal
    })
});


/**
 * SHOW POST
 */
 router.get('/cekhapus/', async (req, res) => {


    let data2 = await knex.select('*').from('kelas').leftOuterJoin('datamurid','idkelas','kelas').where('kelas',null)

    console.log(data2)   
    res.json({status: true,
        message: 'List Data Posts',
              data: data2,})


});







/**
 * UPDATE POST
 */
 router.patch('/update/(:id)', [

    //validation
    body('idkelas').notEmpty(),
    body('namakelas').notEmpty(),
    body('kurikulum').notEmpty(),

  

],async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    const datacek = await knex('kelas').where('idkelas',req.body.idkelas)
    if (datacek && datacek.length> 0 && req.body.idkelas != req.params.id) {
        
      return res.status(411).json({
          status: false,
          message: 'id sudah ada'
  
      
      });}
  
    //nomor_induk post
    let id= req.params.id;

    //data post
    let formData = {
        idkelas: req.body.idkelas,
        namakelas: req.body.namakelas,
        kurikulum: req.body.kurikulum,
     
    }

    await knex('kelas').where('idkelas',id).update(formData)
    res.status(200).json({
        status: true,
        message: 'Update Data Successfully!'
    })}

);

/**
 * DELETE POST
 */
 router.delete('/delete/(:id)', async function(req, res) {

    let id= req.params.id;
 


//delete kelas

  
await knex('kelas').where('idkelas',id).del().then(() => console.log("data inserted"))
.catch((err) => { console.log(err); throw err })
console.log("sucess") 
res.json({
    status: true,
    message: 'Input Success',
})
});

module.exports = router;