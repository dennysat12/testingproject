const express = require('express');
const router = express.Router();
const knex = require('../config/knexdb');
//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');


/**
 * INDEX POSTS
 */
router.get('/', function (req, res) {
    //query
    connection.query(`SELECT * FROM jawab_murid`, function (err, rows) {
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
 * INDEX POSTS
 */
router.get('/test', function (req, res) {
    //query

    
    connection.query(`SELECT * FROM pilgan INNER JOIN soal ON pilgan.id_soal = soal.id_soal `, function (err, rows) {
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
    body('id_soal').notEmpty(),
    body('NISN').notEmpty(),
    body('no').notEmpty(),
    body('jawaban').notEmpty(),
  
], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        id_soal: req.body.id_soal,
      NISN: req.body.NISN,
        no: req.body.no,
       
       jawaban: req.body.jawaban,
  
    }
    // insert query
    connection.query('INSERT INTO jawab_murid SET ?', formData, function (err, rows) {
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

/**
 * SHOW POST
 */
 router.get('/jawab_murid/(:id)', function (req, res) {

    let id = req.params.nomor_id;

    connection.query(`SELECT * FROM jawab_murid WHERE no = ${id}`, function (err, rows) {

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
 * UPDATE POST
 */
 router.patch('/update/(:id)', [

    //validation

    body('no').notEmpty(),
    body('jawaban').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //nomor_induk post
    let id = req.params.id;

    //data post
    let formData = {
    
          no: req.body.no,
         
         jawaban: req.body.jawaban,
    }

    // update query
    connection.query(`UPDATE jawab_murid SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
     
    connection.query(`DELETE FROM jawab_murid WHERE idsoal = ${id}`, function(err, rows) {
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



router.get('/nilai/(:id)/(:NISN)',  async (req, res) =>{

    let id = req.params.id;
    let NISN= req.params.NISN;

    let soal = await knex.select('no').from('pilgan').where('id_soal',id).orderBy('no','desc').limit(1)
    let max = soal[0].no
    console.log(max)
    let a = 1
   let nilai=0
    while (a  <= max) {
        let jawaban= await knex.select('jawaban').from('jawab_murid').where('idsoal',id).andWhere('NISN',NISN).andWhere('no',a).limit(1)
       
       let j = jawaban[0].jawaban
       console.log(j)
        let kunci = await knex.select('kunci').from('pilgan').where('id_soal',id).andWhere('no',a).limit(1)
        let k = kunci[0].kunci
console.log(k)
        if (j==k) {
            nilai++
    }
    
    
        a++
    }




let totalnilai = nilai/max

console.log(totalnilai)



        return res.status(200).json({
            status: true,
            message: 'bisa',
            data:totalnilai})
});
  

module.exports = router;