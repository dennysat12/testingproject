const express = require('express');
const router = express.Router();

let PdfPrinter = require('pdfmake');
const Promise = require("bluebird");
// var bodyParser = require('body-parser');
//import Konten from './konten'
var {
    pdfDenny2
} = require('./cetakbyr')

  
//import express validator
const {
    body,
    validationResult
} = require('express-validator');

//import database
const connection = require('../config/database');
const knex = require('../config/knexdb');
/**PDF
 */


async function generateStyle() {
    return {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        // bold: true,
        // fontSize: 11,
        color: 'black',
        fillColor: '#eeeeee',
      },
      tableHeaderDenny: {
        bold: true,
        // fontSize: 11,
        color: 'black',
        fillColor: '#eeeeee',
        alignment: 'center'
      },
      tabelBasic: {
        margin: [0, 10, 0, 15],
      },
      tabelKopBab: {
        margin: [0, 0, 0, 25],
      },
      judul: {
        bold: true,
        fontSize: 16,
        color: 'black',
        margin: [0, 0, 0, 30],
      },
      paragrafNormal: {
        lineHeight: 1.5,
        fontSize: 11,
      },
      subBab: {
        fontSize: 12,
        margin: [0, 5, 0, 10],
      },
      kasMasuk: {
        color: 'green',
      },
      kasKeluar: {
        color: 'red',
      },
      olJudul: {
        fontSize: 11,
        margin: [0, 5, 0, 10],
      },
      olKonten: {
        fontSize: 11,
        margin: [0, 0, 0, 10],
      },
      olWadah: {
        fontSize: 11,
        margin: [0, 10, 0, 15],
      },
      olTabel: {
        margin: [0, 0, 0, 15],
      },
    }
  }



router.get('/cetakbayar/(:kelas)/(:tahun)', async (req, res) => {

    



    try {
        let kelas = req.params.kelas
         let tahun = req.params.tahun
        // let kelas = req.params.kelas
        // let semester = req.params.semester
        // console.log(ujian , '+', semester)
         let cekmurid = await knex.select('*').from('kelas').where('idkelas',kelas)

        
        if (!cekmurid || cekmurid.length==0) {
   
   throw ({
               status: false,
               message: 'Data Kelas',
              
           })
        }
        // let cekkelas = await knex.select('idkelas').from('kelas').where('idkelas',kelas)
        // if (!cekkelas || cekkelas.length==0) {
   
        //    throw ({
        //        status: false,
        //        message: 'Data Kelas kosong',
              
        //    })
        // }
        // if (!['uas','uts'].includes(ujian) || !['1','2'].includes(semester)){
        //    throw ({
        //        status: false,
        //        message: 'Data Ujian tidak terisi',
              
        //    })
   
        // }
   

        var binaryResult = await createPdf(kelas,tahun)
        res.contentType('application/pdf').send(binaryResult);
        console.log('tampil')
    } catch (err) {

        res.send(err.message);
    }


})



async function createPdf(kelas,tahun) {
    var fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        }
    }

  //var konten = new Konten();
    var printer = new PdfPrinter(fonts);
    var docDefinition = {
        content: await pdfDenny2(kelas,tahun),
        styles: await generateStyle(),
        pageOrientation:'landscape',
        // content: ['testing mantap'],
        defaultStyle: {
            font: 'Helvetica'
        }
    };
    var pdfDoc = printer.createPdfKitDocument(docDefinition);

    return new Promise((resolve, reject) => {
        try {
            var chunks = [];
            pdfDoc.on('data', chunk => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.end();
            console.log('selesai')
        } catch (err) {
            reject(err);
        }
    });
};















/**
 * INDEX POSTS
 */
router.get('/', function (req, res) {
    //query
    connection.query(`SELECT * FROM pembayaran`, function (err, rows) {
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
 router.get('/tagihankelas/(:kelas)/(:status)/(:bulan)/(:tahun)', async (req, res)  =>{
    let kelas = req.params.kelas;
let status = req.params.status;
let bulan = req.params.bulan;
let tahun = req.params.tahun;
    const datamurid = await knex.select('NISN').from('datamurid').where('kelas',kelas)
    //query


let ids = datamurid.map( (item) => item.NISN);
 console.log(ids)

 //query
 connection.query( `SELECT * FROM pembayaran WHERE NISN IN (` + ids.join() + `) AND status =${status} AND MONTH(tgl) =${bulan} AND YEAR(tgl) =${tahun}  `  , function (err, rows) {
    if (err) {
     
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        })
    } else {
        console.log(rows)
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
 router.get('/tagihanmurid/(:NISN)/(:status)/(:bulan)/(:tahun)', async (req, res)  =>{
    let NISN = req.params.NISN;
let status = req.params.status;
let bulan = req.params.bulan;
let tahun = req.params.tahun;



 //query
 connection.query( `SELECT * FROM pembayaran WHERE NISN  =${NISN}  AND status =${status} AND MONTH(tgl) =${bulan} AND YEAR(tgl) =${tahun}`  , function (err, rows) {
    if (err) {
     
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        })
    } else {
        console.log(rows)
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
   
    body('perihal').notEmpty(),
    body('nominal').notEmpty(),
    body('kelas').notEmpty(),
    body('status').notEmpty(),

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }



    let kelas = req.body.kelas

const datamurid = await knex.select('NISN').from('datamurid').where('kelas',kelas)
let dataterakhir = datamurid.length -1;
console.log (dataterakhir)
datamurid[0].NISN
let i = 0




var today = new Date();
var dd = today.getDate();

var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
var hh = today.getHours();
var mmm =today.getMinutes();
var ss = today.getSeconds();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
today = yyyy+'-'+mm+'-'+dd;

console.log (today)


while (i <= dataterakhir) {



ids = yyyy+'-'+mm+'-'+dd+'-'+hh+'-'+mmm+'-'+ss+'-'+datamurid[i].NISN

    let formData = {
        id:ids,
        NISN: datamurid[i].NISN,
        perihal: req.body.perihal,
        nominal: req.body.nominal,
        status: req.body.status,
        tgl: today,
        tgl_lunas: today,
        
    }

    console.log (formData)
       // insert query
       connection.query('INSERT INTO pembayaran SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } 
    })
i++

}


res.json({
    status: true,
    message: 'semua pembayaran masuk',
 
})



});

//update


router.patch('/update/:id', [

    //validation

    
    body('perihal').notEmpty(),
    body('nominal').notEmpty(),
    body('status').notEmpty(),
    body('tgl_lunas').notEmpty(),
   

], async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id post
    let id = req.params.id;
console.log(id)
    //data post
    let formData = {
     
        perihal: req.body.perihal,
        nominal: req.body.nominal,
        status: req.body.status,
        tgl_lunas: req.body.tgl_lunas,
       
    }

    // update query
  
    await knex('pembayaran').where('id',id).update(formData).then(() => console.log("data inserted"))
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

    
    await knex('pembayaran').where('id',id).del().then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err })
    console.log("sucess") 
    res.json({
        status: true,
        message: 'Input Success',
    })
});


module.exports = router;