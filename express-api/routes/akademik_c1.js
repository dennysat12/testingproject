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
    connection.query(`SELECT * FROM jam_akademik_a WHERE tipe_aka LIKE '%akademik_c1%'`, function (err, rows) {
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
    body('id').notEmpty(),
    body('mapel').notEmpty(),
    body('kelas1').notEmpty(),
    body('kelas2').notEmpty(),
    body('kelas3').notEmpty(),
    body('kelas4').notEmpty(),
    body('kelas5').notEmpty(),
    body('kelas6').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        id: req.body.id,
        mapel: req.body.mapel,
        kelas1: req.body.kelas1,
        kelas2: req.body.kelas2,
        kelas3: req.body.kelas3,
        kelas4: req.body.kelas4,
        kelas5: req.body.kelas5,
        kelas6: req.body.kelas6,
        
    }
    // insert query
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

/**
 * SHOW POST
 */
 router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM jam_akademik_a WHERE id = ${id}`, function (err, rows) {

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
 router.patch('/update/:id', [

    //validation
    body('id').notEmpty(),
    body('mapel').notEmpty(),
    body('kelas1').notEmpty(),
    body('kelas2').notEmpty(),
    body('kelas3').notEmpty(),
    body('kelas4').notEmpty(),
    body('kelas5').notEmpty(),
    body('kelas6').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id post
    let id = req.params.id;

    //data post
    let formData = {
        id: req.body.id,
        mapel: req.body.mapel,
        kelas1: req.body.kelas1,
        kelas2: req.body.kelas2,
        kelas3: req.body.kelas3,
        kelas4: req.body.kelas4,
        kelas5: req.body.kelas5,
        kelas6: req.body.kelas6,
    }

    // update query
    connection.query(`UPDATE jam_akademik_a SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
     
    connection.query(`DELETE FROM jam_akademik_a WHERE id = ${id}`, function(err, rows) {
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