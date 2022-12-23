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
router.get('/tampilkelas/(:kelas)/(:mapel)', function (req, res) {
    //query
    let kelas = req.params.kelas;
    let mapel = req.params.mapel;
    connection.query(`SELECT * FROM materi WHERE idkelas = ${kelas} AND idmapel = ${mapel} `, function (err, rows) {
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
    body('idmapel').notEmpty(),
    body('bab').notEmpty(),
    body('judul').notEmpty(),
    body('info').notEmpty(),
    body('file').notEmpty(),
    body('hidden').notEmpty(),
    body('kodemateri').notEmpty(),
], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        idkelas: req.body.idkelas,
      idmapel: req.body.idmapel,
      bab: req.body.bab,
        judul: req.body.judul,
        info: req.body.info,
        file: req.body.file,
        hidden: req.body.hidden,
        kodemateri: req.body.kodemateri,
      
    }
    // insert query
    connection.query('INSERT INTO materi SET ?', formData, function (err, rows) {
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
 router.get('/materi/(:id)', function (req, res) {

    let id = req.params.nomor_id;

    connection.query(`SELECT * FROM jawab_murid WHERE kodemateri = ${id}`, function (err, rows) {

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

    body('bab').notEmpty(),
    body('judul').notEmpty(),
    body('info').notEmpty(),
    body('file').notEmpty(),
    body('hidden').notEmpty(),

], async (req, res) => {

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
    
        bab: req.body.bab,
        judul: req.body.judul,
        info: req.body.info,
        file: req.body.file,
        hidden: req.body.hidden,
    }

    // update query
    await knex('materi').where('kodemateri',id).update(formData).then(() => console.log("data inserted"))
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
 router.delete('/delete/(:id)', async (req, res) => {

    let id = req.params.id;
     



    await knex('materi').where('kodemateri',id).del().then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })







});


  

module.exports = router;