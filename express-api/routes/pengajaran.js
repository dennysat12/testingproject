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

/**
 * INDEX POSTS
 */
router.get('/', function (req, res) {
    //query
    connection.query(`SELECT * FROM pengajar_materi`, function (err, rows) {
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
    body('idmateri').notEmpty(),
    body('idkelas').notEmpty(),
    body('nomor_induk_guru').notEmpty(),
    

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        idmateri: req.body.idmateri,
        idkelas: req.body.idkelas,
        nomor_induk_guru: req.body.nomor_induk_guru,
       
        
    }
    const datacek = await knex.select('*').from('pengajar_materi').where('idmateri',req.body.idmateri).andWhere('idkelas',req.body.idkelas)
    if (datacek && datacek.length> 0) {
      
        await knex('pengajar_materi').where('idmateri',req.body.idmateri).andWhere('idkelas',req.body.idkelas).update(formData)
        res.status(200).json({
            status: true,
            message: 'Pengajar Diperbaharui di kelas'+ idkelas+'untuk mapel'+idmateri
        })


        ;}

        else {
            await knex('pengajar_materi').insert(formData)
            console.log("sucess") 
            res.json({
                status: true,
                message: 'Jadwal Dimasukan',
            })
        
            

            
        }


});

/**
 * SHOW POST
 */
 router.get('/(:kelas)', async (req, res) =>{

    let kelas = req.params.kelas;

    let cekkurikulum = await knex.select('kurikulum').from('kelas').where('idkelas',kelas)
   let datacekkuri = cekkurikulum[0].kurikulum



   let tampil = await knex.select('*').from('jam_akademik_a').leftOuterJoin('pengajar_materi', function() {
    this
      .on('jam_akademik_a.id_mapel', '=', 'pengajar_materi.idmateri')
      
  }).where(datacekkuri, '>',0)
console.log(tampil)
  res.json({
    status: true,
    message: 'Jadwal Dimasukan',
    data : tampil
})







 })



 router.get('/pengajar/(:pengajar)', async (req, res) =>{

    let pengajar = req.params.pengajar;

    let cekkurikulum = await knex.select('*').from('pengajar_materi').where('nomor_induk_guru',pengajar)
 
 
console.log(tampil)
  res.json({
    status: true,
    message: 'Daftar Materi yang Diajar',
    data : cekkurikulum
})})








module.exports = router;