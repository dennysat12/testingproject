const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');


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
    body('limitwaktu').notEmpty(),
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
        idmateri: req.body.idmateri,
        idkelas: req.body.idkelas,
        bab: req.body.bab,
        info: req.body.info,
        limitwaktu: req.body.limitwaktu,
    }



    
    // insert query
    connection.query('INSERT INTO soal SET ?', formData, function (err, rows) {
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
 router.get('/soal/(:id)', function (req, res) {

    let id = req.params.nomor_id;

    connection.query(`SELECT * FROM soal WHERE id_soal = ${id}`, function (err, rows) {

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