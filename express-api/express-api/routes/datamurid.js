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

 router.get('/(:kelas)',  async(req,res) =>  {
   let kelas = req.params.kelas
    let data = await knex.select('*').from('datamurid').orderBy('nama','asc').where('kelas',kelas)
    console.log(data)   
    res.json({status: true,
        message: 'List Data Posts',
              data: data,})




});


router.get('/muridkelas/(:kelas)',  async(req,res) =>  {
   
    let data = await knex.select('*').from('datamurid').innerJoin('kelas','datamurid.kelas','kelas.idkelas').where('datamurid.kelas',req.params.kelas).orderBy('nama','asc')
    console.log(data)   
    res.json({status: true,
        message: 'List Data Posts',
              data: data,})




});


router.post('/store', [

    //validation
    body('NISN').notEmpty(),
    body('NIS').notEmpty(),
    body('kelas').notEmpty(),
    body('nama').notEmpty(),
    body('password').notEmpty(),
    body('alamat').notEmpty(),
    body('kontak').notEmpty(),
    body('kota_ttl').notEmpty(),

], async(req, res) => {
    const datacek = await knex.select('NISN').from('datamurid').where('NISN',req.body.NISN).limit(1)
    if (datacek && datacek.length> 0) {
      
        return res.status(411).json({
            status: false,
            message: 'NISN sudah ada/sama',

        
        });}
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'data ada yang kosong',
        
        });
    }


    try{
    //define formData
    let formData = {
        NISN: req.body.NISN,
        NIS: req.body.NIS,
        kelas: req.body.kelas,
        nama: req.body.nama,
        password: req.body.password,
        alamat: req.body.alamat,
        kontak: req.body.kontak,
        kota_ttl: req.body.kota_ttl,

    }

    

    await knex('datamurid').insert(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })

    
}catch(err) {
    return res.status(422).json({
        status: false,
        message: 'data inputan salah 2',
    })



}}

);





router.patch('/updatekelas/:kelas', [

    //validation
    
    body('kelas').notEmpty(),
   

], async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id post
    let id = req.params.kelas;

    //data post
    let formData = {
      
        kelas: req.body.kelas,
        

    }

    // update query
    await knex('datamurid').where('kelas',id).update(formData)
    res.status(200).json({
        status: true,
        message: 'Update Data Successfully!'
    })


});

router.patch('/update/:id', [

    //validation
    body('NISN').notEmpty(),
    body('kelas').notEmpty(),
    body('nama').notEmpty(),
    body('password').notEmpty(),
    body('alamat').notEmpty(),
    body('kontak').notEmpty(),
    body('kota_ttl').notEmpty()


], async(req, res) => {

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
        NISN: req.body.NISN,
        kelas: req.body.kelas,
        nama: req.body.nama,
        password: req.body.password,
        alamat: req.body.alamat ,
        kontak: req.body.kontak,
        kota_ttl: req.body.kota_ttl,

    }

    // update query
    await knex('datamurid').where('NISN',id).update(formData)
    res.status(200).json({
        status: true,
        message: 'Update Data Successfully!'
    })


});


router.delete('/delete/(:NISN)', async(req, res) => {

    let NISN = req.params.NISN;

    await knex('datamurid').where('NISN',NISN).delete('NISN',NISN)

   
    res.json({
        status: true,
        message: 'Delete Success',
    })


});












module.exports = router;