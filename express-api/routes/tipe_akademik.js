const express = require('express');
const router = express.Router();

  
  
//import express validator
const {
    body,
    validationResult
} = require('express-validator');

//import database

const knex = require('../config/knexdb');
/**
 * INDEX POSTS
 */
 function extractValue(arr, prop) {

    // extract value from property
    let extractedValue = arr.map(item => item[prop]);

    return extractedValue;

}


 router.get('/tes',  async(req,res) =>  {
   
  

let data2 = await knex.select('*').from('tipe_akademik').leftOuterJoin('jam_akademik_a','id','tipe_aka').where('tipe_aka',null)

    console.log(data2)   
    res.json({status: true,
        message: 'List Data Posts',
              data: data2,})

});

router.get('/urutansemua',  async(req,res) =>  {
   
  

    let data2 = await knex.select('urutan').from('tipe_akademik').orderBy('urutan','asc')
    
        console.log(data2)   
        res.json({status: true,
            message: 'List Data Posts',
                  data: data2,})
    
    });



    router.get('/maksimalurutan',  async(req,res) =>  {
   
  

        let data2 = await knex('tipe_akademik').max('urutan')
   
        let result2 = Number(extractValue(data2, 'max(`urutan`)'));
            let final = result2 + 1;    
            console.log(data2)   
            res.json({status: true,
                message: 'List Data Posts',
                      data: final,})
        
        });
/**
 * STORE POST
 */
router.post('/store', [

    //validation
    body('id').notEmpty(),
    body('tipe_akademik').notEmpty(),

], async(req, res) => {
    const datacek = await knex.select('id').from('tipe_akademik').where('id',req.body.id).limit(1)
    if (datacek && datacek.length> 0) {
      
        return res.status(411).json({
            status: false,
            message: 'id sudah ada',

        
        });}
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'data inputan salah',
        
        });
    }

    try{
    //define formData
    let formData = {
        id: req.body.id,
        tipe_akademik: req.body.tipe_akademik,


    }

    

    await knex('tipe_akademik').insert(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })

    
}catch(err) {
    return res.status(422).json({
        status: false,
        message: 'data inputan salah',
    })



}}

);
   

/**
 * SHOW POST
 */
router.get('/:id', async (req, res)=>{

    const urutanawal = await knex.select('*').from('tipe_akademik').where('id',req.params.id)

    
    
    
    
    
    
    return res.status(200).json({
        status: true,
        message: 'Detail Data Post',
        data: urutanawal
    })
    
});
/**
 * UPDATE POST
 */
router.patch('/update/:id', [

    //validation
    body('id').notEmpty(),
    body('tipe_akademik').notEmpty(),
    body('urutan').notEmpty(),

], async(req, res) => {
    let idparam = req.params.id;
    const datacek = await knex.select('id').from('tipe_akademik').where('id',req.body.id).limit(1)
    if (datacek && datacek.length> 0 && req.body.id != idparam) {
      
        return res.status(411).json({
            status: false,
            message: 'id sudah ada',

        
        });}

        else{
    //id post


    //data post
    let formData = {
        id: req.body.id,
        tipe_akademik: req.body.tipe_akademik,
        urutan : req.body.urutan,
    }

    const urutanawal = await knex.select('urutan').from('tipe_akademik').where('id',idparam)
    const limitatas = await knex.select('urutan').from('tipe_akademik').orderBy('urutan','desc').limit(1)
    let limit = limitatas[0].urutan


    let b = req.body.urutan
    let a = urutanawal[0].urutan

    console.log ( 'urutan ke' + a + 'mau ke ' + req.body.urutan )
    const datacekurutan = await knex.select('urutan').from('tipe_akademik').where('urutan',req.body.urutan).limit(1)
    if (datacekurutan && datacekurutan.length> 0) {
      
      if (req.body.urutan == a)
      {    
        console.log (a+'='+req.body.urutan)
        
        await knex('tipe_akademik').where('id',idparam).update(formData)
      res.status(200).json({
          status: true,
          message: 'Update Data Successfully!'
      })}
      
      else if (a > req.body.urutan){

        console.log (a+'>'+req.body.urutan)
        

        while (a >= b){

         console.log( a + '=' + a+1)
            await knex('tipe_akademik').where('urutan',a).update('urutan',a+1)
            a--
          }



          await knex('tipe_akademik').where('id',idparam).update(formData)
          res.status(200).json({
              status: true,
              message: 'Update Data Successfully!'
          })

      }

        else {
            console.log (a+'<'+req.body.urutan)
            
            
            
            
            while (a <= req.body.urutan){
                console.log(a)
      await knex('tipe_akademik').where('urutan',a).update('urutan',a-1)
        a++
    }
    await knex('tipe_akademik').where('id',idparam).update(formData)
    res.status(200).json({
        status: true,
        message: 'Update Data Successfully!'
    })}
    


    
      }



    else {
       
          await knex('tipe_akademik').where('id',idparam).update(formData)
          res.status(200).json({
              status: true,
              message: 'Update Data Successfully!'
          })
          

    }}
    // update query
  


});
//select
router.get("/",  async(req,res) =>  {
   
    let data = await knex.select('*').from('tipe_akademik').orderBy('urutan','asc')
    console.log(data)   
    res.json({status: true,
        message: 'List Data Posts',
              data: data,})

});






/**
 * STORE POST Ditengah
 */
router.post('/storedata', [

    //validation
    body('id').notEmpty(),
    body('tipe_akademik').notEmpty(),
    body('urutan').notEmpty(),
], async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("1")
        return res.status(422).json({
            errors: errors.array()
        });
    }



    //define formData
    let formData = {
        id: req.body.id,
        tipe_akademik: req.body.tipe_akademik,
        urutan: req.body.urutan
        ,


    }

    const datacekawal = await knex.select('*').from('tipe_akademik').where('id',req.body.id).limit(1)
    if (datacekawal && datacekawal.length> 0 ) {
      
        return res.status(411).json({
            status: false,
            message: 'id sudah ada',

        
        });}


        

    const datacek = await knex.select('urutan').from('tipe_akademik').orderBy('urutan','desc').limit(1)
 
    if (datacek && datacek.length> 0 ){

        let i = datacek[0].urutan
    while (i >= req.body.urutan) {
        await knex('struktur_raport').where('urutan',i).update('urutan',i+1)
      
        i--
    };
    
   while (i >= req.body.urutan) {
        await knex('tipe_akademik').where('urutan',i).update('urutan',i+1)
      
        i--
    };
    

    await knex('tipe_akademik').insert(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })}else {await knex('tipe_akademik').insert(formData).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })}

    
    
    
    
    
    
  





});



/**
 * DELETE POST
 */
router.delete('/delete/:id', async(req, res) => {

    let id = req.params.id;

    const urutan = await knex.select('urutan').from('tipe_akademik').where('id',id).limit(1)
    
    console.log(urutan )
    if ( urutan.length==0 ){

        res.json({
            status: false,
            message: 'Data Tidak Ditemukan',
        })
    }
    let a = urutan[0].urutan



    

    const datacek = await knex.select('urutan').from('tipe_akademik').orderBy('urutan','desc').limit(1)
    
    if (datacek.length==0 ){

        res.json({
            status: false,
            message: 'Data Yang akan Dihapus Tidak Ditemukan',
        })
    }
    let i = datacek[0].urutan
   console.log (i)
   while (a <= i) {
        await knex('tipe_akademik').where('urutan',a).update('urutan',a-1)
      
        a++
    };


    await knex('tipe_akademik').where('id',id).delete('urutan',id)
    res.json({
        status: true,
        message: 'Delete Success',
    })


});

module.exports = router;