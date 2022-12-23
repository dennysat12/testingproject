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
    connection.query(`SELECT * FROM soal`, function (err, rows) {
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

function extractValue(arr, prop) {

    // extract value from property
    let extractedValue = arr.map(item => item[prop]);

    return extractedValue;

}
/**
 * STORE POST
 */
 router.post('/store', [

    //validation
    body('id_soal').notEmpty(),
    body('idmateri').notEmpty(),
    body('idkelas').notEmpty(),
    body('bab').notEmpty(),
    body('info').notEmpty(),
    
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        id_soal: req.body.id_soal,
        idmateri: req.body.idmateri,
        idkelas: req.body.idkelas,
        bab: req.body.bab,
        info: req.body.info,
        
    }

    await knex('soal').insert(formData).then(() => console.log("data inserted"))
          

    
   
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
              
            })
});

/**
 * SHOW POST
 */
 router.get('/soal/(:mapel)/(:kelas)', async (req, res)  =>{

    let mapel = req.params.mapel;
    let kelas = req.params.kelas;
  

    let data = await knex.select('*').from('soal').where('idmateri',mapel).andWhere('idkelas',kelas)
    return res.status(201).json({
        status: true,
        message: 'Data tampil',
        data: data
    })
   






 })
 //buat soal guru
 router.get('/soalpilganguru/:idsoal', async (req, res)  =>{

    let idsoal = req.params.idsoal;
 
  

    let data = await knex.select('*').from('pilgan').where('id_soal',idsoal)
    return res.status(201).json({
        status: true,
        message: 'Data tampil',
        data: data
    })
   






 })

 router.post('/store/buatpilgan/:ids', [

    //validation
   
    body('a').notEmpty(),
    body('b').notEmpty(),
    body('c').notEmpty(),
    body('d').notEmpty(),
    body('e').notEmpty(),
    body('kunci').notEmpty(),
    body('soal').notEmpty(),
    
], async (req, res) => {
    let ids = req.params.ids
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let data2 = await knex('pilgan').where('id_soal',ids).max('no')
   console.log(data2)
    let result2 = Number(extractValue(data2, 'max(`no`)'));
        let getnomor = result2 + 1;    
console.log(getnomor)

    //define formData
    let formData = {
        id_soal: ids,
        no: getnomor,
        a: req.body.a,
        b: req.body.b,
        c: req.body.c,
        d: req.body.d,
        e: req.body.e,
        kunci: req.body.kunci,
        soal: req.body.soal,
    }

    await knex('pilgan').insert(formData).then(() => console.log("data inserted"))
          

    
   
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
              
            })
});

router.delete('/deletepilganguru/:ids', async (req, res) => {
    let ids = req.params.ids
   
console.log('jalan ga')

    //delete max

    let data2 = await knex('pilgan').where('id_soal',ids).max('no')
    console.log(data2)
    if (data2== null){
        res.json({
            status:false,
            message: 'habis soalnya',
    
        })
    }

    let result2 = Number(extractValue(data2, 'max(`no`)'));
    console.log(ids,result2)

    await knex('pilgan').where('id_soal', ids).andWhere('no',result2).del()

    res.json({
        status: true,
        message: 'hapus soal terakhir',

    })

})
/**
 * UPDATE POST
 */
 router.patch('/update/(:id_soal)', [

    //validation
    body('id_soal').notEmpty(),
    body('idmateri').notEmpty(),
    body('bab').notEmpty(),
    body('info').notEmpty(),
    body('limitwaktu').notEmpty(),
  

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //nomor_induk post
    let id_soal = req.params.id_soal;

    //data post
    let formData = {
        id_soal: req.body.id_soal,
        idmateri: req.body.idmateri,
  
        bab: req.body.bab,
        info: req.body.info,
        limitwaktu: req.body.limitwaktu,
    }

    // update query
    connection.query(`UPDATE soal SET ? WHERE id_soal = ${id_soal}`, formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully!'
            })
        }
    })

});

/**
 * DELETE POST
 */
 router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM soal WHERE id_soal = ${id}`, function(err, rows) {
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