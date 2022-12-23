const express = require('express');
const router = express.Router();
let PdfPrinter = require('pdfmake');
const Promise = require("bluebird");
// var bodyParser = require('body-parser');
//import Konten from './konten'
var {
    pdfDenny2
} = require('./test')


// var {Konten}=require('./konten')
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
function extractValue(arr, prop) {

    // extract value from property
    let extractedValue = arr.map(item => item[prop]);

    return extractedValue;

}
router.get('/struktur/(:kelas)', async (req, res) => {

    let data = await knex.select('*').from('struktur_raport').innerJoin('tipe_akademik', 'struktur_raport.tipe', 'tipe_akademik.id').where('kelas', req.params.kelas).orderBy('struktur_raport.urut', 'asc')
    console.log(data)
    res.json({
        status: true,
        message: 'List Data Posts',
        data: data,
    })




});




router.get('/tampilraport/(:NISN)/(:kelas)/(:ujian)/(:semester)', async (req, res) => {

    let NISN = req.params.NISN
    let ujian = req.params.ujian
    let kelas = req.params.kelas
    let data3 = await knex.select('kurikulum').from('kelas').where('idkelas', kelas).limit(1)
    let result = data3[0].kurikulum

    console.log("data", result)
    let semester = req.params.semester
    datatampil = await knex.select('*').from('jam_akademik_a').innerJoin('struktur_raport', 'jam_akademik_a.tipe_aka', 'struktur_raport.tipe').where('struktur_raport.kelas', kelas).innerJoin('raport', 'jam_akademik_a.id_mapel', 'raport.idmapel').andWhere('NISN', NISN).andWhere('ujian', ujian + semester).andWhereNot(result, '0').orderBy('mapel', 'asc')
    res.json({
        status: true,
        message: 'data',
        data: datatampil
    })


})







function createPdfBinary(pdfDoc, konten, callback) {

    var fontDescriptors = {
        Times: {
            normal: 'Times-Roman',
            bold: 'Times-Bold',
            italics: 'Times-Italic',
            bolditalics: 'Times-BoldItalic'
        },
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        }
    };

    var printer = new PdfPrinter(fontDescriptors);

    var doc = printer.createPdfKitDocument(pdfDoc);

    var chunks = konten;
    var result;

    doc.on('data', function (chunk) {
        chunks.push(chunk);
        console.log('test')
    });
    doc.on('end', function () {
        result = Buffer.concat(chunks);
        callback('data:application/pdf;base64,' + result.toString('base64'));
        console.log('selesai')

    });
    doc.end();

}








router.get('/cetakraport/(:NISN)/(:kelas)/(:ujian)/(:semester)', async (req, res) => {

    



    try {
        let NISN = req.params.NISN
        let ujian = req.params.ujian
        let kelas = req.params.kelas
        let semester = req.params.semester
        console.log(ujian , '+', semester)
        let cekmurid = await knex.select('NISN').from('datamurid').where('NISN',NISN)
        if (!cekmurid || cekmurid.length==0) {
   
           throw ({
               status: false,
               message: 'Data Murid kosong',
              
           })
        }
        let cekkelas = await knex.select('idkelas').from('kelas').where('idkelas',kelas)
        if (!cekkelas || cekkelas.length==0) {
   
           throw ({
               status: false,
               message: 'Data Kelas kosong',
              
           })
        }
        if (!['uas','uts'].includes(ujian) || !['1','2'].includes(semester)){
           throw ({
               status: false,
               message: 'Data Ujian tidak terisi',
              
           })
   
        }
   

        var binaryResult = await createPdf(NISN,kelas,ujian,semester)
        res.contentType('application/pdf').send(binaryResult);
        console.log('tampil')
    } catch (err) {

        res.send(err.message);
    }


})



async function createPdf(NISN,kelas,ujian,semester) {
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
        content: await pdfDenny2(NISN,kelas,ujian,semester),
        styles: await generateStyle(),
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


router.delete('/deletemuatan/(:NISN)/(:kelas)/(:ujian)/(:semester)', async (req, res) => {
    let NISN = req.params.NISN
    let kelas = req.params.kelas
    let ujian = req.params.ujian
    let semester = req.params.semester


    //delete yang tidak ada

    let check2 = await knex.select('*').from('raport').where('NISN', NISN).andWhere('ujian', ujian + semester)

    check2.map(async (a) => {
        console.log('test')
        let testdata = await knex.select('*').from('struktur_raport').innerJoin('jam_akademik_a', 'struktur_raport.tipe', 'jam_akademik_a.tipe_aka').where("jam_akademik_a.id_mapel", a.id_mapel).where('kelas', kelas)
        console.log(testdata)

        if (testdata.length == 0) {
            await knex('raport').where('id_mapel', a.id_mapel).andWhere('NISN', NISN).andWhere('ujian', ujian).andWhere('semester', semester).del()


        }

    })
    res.json({
        status: true,
        message: 'hapus yang tidak ada di struktur raport',

    })

})




router.get('/setraport/(:kelas)/(:NISN)/(:ujian)/(:semester)', async (req, res) => {
    let data1 = await knex.select('*').from('struktur_raport').where('kelas', req.params.kelas).innerJoin('jam_akademik_a', 'struktur_raport.tipe', 'jam_akademik_a.tipe_aka')
    let kelas = req.params.kelas
    let NISN = req.params.NISN
    let ujian = req.params.ujian

    let semester = req.params.semester

    if (kelas == null || NISN == "Pilih Murid Setelah Memilih Tipe Ujian dan Semester" || ujian == null || semester == null || kelas == 0 || NISN == 0 || ujian == 0 || semester == 0) {
        res.json({
            status: false,
            message: 'Data kosong',
        })

    }

    let data3 = await knex.select('kurikulum').from('kelas').where('idkelas', kelas).limit(1)
    let result = data3[0].kurikulum
    console.log("data", result)


    await data1.map(async (u) => {
            let check = await knex.select('*').from('raport').where('idmapel', u.id_mapel).andWhere('NISN', NISN).andWhere('ujian', ujian + semester)
            let cekkosong = await knex.select(result).from('jam_akademik_a').where('id_mapel', u.id_mapel)
            let validkosong = Number(extractValue(cekkosong, result));

            if (check && check.length > 0) {

                await knex('raport').where('NISN', NISN).andWhere('idmapel', u.id_mapel).andWhere('ujian', ujian + semester).catch((err) => {
                    console.log(err);
                    throw err
                })




            } else {

                let formData = {
                    idmapel: u.id_mapel,
                    NISN: NISN,
                    pengetahuan: "0",
                    keterampilan: "0",
                    rerata: "0",
                    ujian: ujian + semester,





                }


                await knex('raport').insert(formData)





            }




        }

    )





    //let datatampil = await knex.select('*').from('raport').innerJoin('jam_akademik_a','raport.idmapel','jam_akademik_a.id_mapel').where('NISN',NISN).andWhere('ujian',ujian).andWhere('semester',semester).andWhereNot('jammapel',0)






    res.json({
        status: true,
        message: 'Struktur Raport diupdate',
    })




});


router.delete('/deletekosong/', async (req, res) => {

    await knex.select('*').from('raport').where('jammapel', 0).del()
    res.json({
        status: true,
        message: 'Delete Success',
    })


});

router.post('/store', [

        //validation
        body('kelas').notEmpty(),
        body('tipe').notEmpty(),
        body('urut').notEmpty(),

    ], async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("1")
            return res.status(422).json({
                errors: errors.array()
            });
        }



        //define formData
        let formData = {
            kelas: req.body.kelas,
            tipe: req.body.tipe,
            urut: req.body.urut,


        }


        const datacek = await knex.select('urut').from('struktur_raport').where('kelas', req.body.kelas).orderBy('urut', 'desc').limit(1)

        if (datacek && datacek.length > 0) {

            let i = datacek[0].urut
            while (i >= req.body.urut) {
                await knex('struktur_raport').where('urut', i).update('urut', i + 1)

                i--
            };
            console.log('test', formData)

            await knex('struktur_raport').insert(formData).then(() => console.log("data inserted"))
                .catch((err) => {
                    console.log(err);
                    throw err
                })
            console.log("sucess")
            res.json({
                status: true,
                message: 'Input Success',
            })






        } else {

            await knex('struktur_raport').insert(formData).then(() => console.log("data inserted"))
                .catch((err) => {
                    console.log(err);
                    throw err
                })
            console.log("sucess")
            res.json({
                status: true,
                message: 'Input Success',
            })

        }

    }


)

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





router.get('/selectmapel/(:kelas)/(:NISN)/(:ujian)/(:semester)', async (req, res) => {
    let data3 = await knex.select('kurikulum').from('kelas').where('idkelas', req.params.kelas).limit(1)
    let result = data3[0].kurikulum

    console.log("data", result)
    let data = await knex.select('*').from('jam_akademik_a').whereNot(result, 0).leftJoin('raport', 'jam_akademik_a.id_mapel', 'raport.idmapel').andWhere('raport.NISN', req.params.NISN).orWhere('raport.NISN', null)

    res.json({
        status: true,
        message: 'List Data Posts',
        data: data,
    })




});



router.patch('/reset/(:NISN)/(:ujian)/(:semester)', async (req, res) => {

    //data post
    let formData = {

        pengetahuan: 0,
        keterampilan: 0,
        rerata: 0

    }

    // update query
    await knex('raport').where('NISN', req.params.NISN).where('ujian', req.params.ujian + req.params.semester).update(formData)
    res.status(200).json({
        status: true,
        message: 'Update Data Successfully!'
    })



});


router.delete('/reset/(:NISN)', async (req, res) => {
    await knex('raport').where('NISN', req.params.NISN).del()

    res.json({
        status: true,
        message: 'Data Reset',
    })




});




router.patch('/updatedata/', [

    //validation
    body('NISN').notEmpty(),
    body('mapel').notEmpty(),
    body('pengetahuan').notEmpty(),
    body('keterampilan').notEmpty(),
    body('ujian').notEmpty(),
    body('semester').notEmpty(),

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }


    let test = await knex.select('*').from('raport').where('NISN', req.body.NISN).andWhere('idmapel', req.body.mapel).andWhere('ujian', req.body.ujian + req.body.semester)
    let rerata = Number(req.body.pengetahuan) + Number(req.body.keterampilan)
    console.log(rerata)
    let rata2 = rerata / 2
    console.log(rata2)
    let result = Math.round(rata2);
    console.log(result)
    if (test.length == 0) {


        let formData = {
            NISN: req.body.NISN,
            idmapel: req.body.mapel,
            pengetahuan: req.body.pengetahuan,
            keterampilan: req.body.keterampilan,
            ujian: req.body.ujian + req.body.semester,
            rerata: result

        }

        await knex('raport').insert(formData)
        res.status(200).json({
            status: true,
            message: 'Update Data Masuk'
        })
    } else {

        //data post
        let formData = {

            pengetahuan: req.body.pengetahuan,
            keterampilan: req.body.keterampilan,
            rerata: result

        }

        // update query
        await knex('raport').where('NISN', req.body.NISN).andWhere('idmapel', req.body.mapel).andWhere('ujian', req.body.ujian + req.body.semester).update(formData)
        res.status(200).json({
            status: true,
            message: 'Update Data Successfully!'
        })
    }

});




router.delete('/delete/(:urutan)/(:kelas)', async (req, res) => {


    const datacek = await knex.select('urut').from('struktur_raport').where('kelas', req.params.kelas).orderBy('urut', 'desc').limit(1)
    console.log(datacek)
    if (datacek.length == 0) {
        res.json({
            status: false,
            message: 'Data Kosong',
        })

    }
    let a = req.params.urutan;
    let kelas = req.params.kelas;
    await knex('struktur_raport').where('urut', a).andWhere('kelas', kelas).delete('urut', a)




    let i = datacek[0].urut
    console.log(i)
    while (a <= i) {
        await knex('struktur_raport').where('urut', a).andWhere('kelas', kelas).update('urut', a - 1)

        a++
    };



    res.json({
        status: true,
        message: 'Delete Success',
    })


});

router.get('/maksimalurutan/(:kelas)', async (req, res) => {



    let data2 = await knex('struktur_raport').where('kelas', req.params.kelas).max('urut')

    let result2 = Number(extractValue(data2, 'max(`urut`)'));
    let final = result2 + 1;
    console.log(data2)
    res.json({
        status: true,
        message: 'List Data Posts',
        data: final,
    })

});


router.patch('/sikap/(:sikap)', [

    //validation
    body('NISN').notEmpty(),
    body('nilai').notEmpty(),

], async (req, res) => {
    let sikap = req.params.sikap
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }



    //data post
    let formData = {
        NISN: req.body.NISN,
        sikap1: "-",
        sikap2: "-",
        sikap3: "-",
        sikap4: "-",
        sikap5: "-",
    }
    let check = await knex.select('*').from('sikapmurid').where('NISN', req.body.NISN)

    if (check.length == 0) {
        await knex('sikapmurid').insert(formData).then(() => console.log("data inserted"))
            .catch((err) => {
                console.log(err);
                throw err
            })
        console.log("sucess")


    }

    // update query
    await knex('sikapmurid').where('NISN', req.body.NISN).update(sikap, req.body.nilai)
    res.status(200).json({
        status: true,
        message: 'Update Data Successfully!'
    })


});


router.get('/sikap1/(:NISN)', async (req, res) => {
    let NISN = req.params.NISN


    let data = await knex('sikapmurid').innerJoin('nilaisikap', 'sikapmurid.sikap1', 'nilaisikap.nilai').where('sikapmurid.NISN', NISN)

    res.json({
        status: true,
        message: 'List Data Posts',
        data: data
    })

});


router.get('/sikap2/(:NISN)', async (req, res) => {
    let NISN = req.params.NISN


    let data = await knex('sikapmurid').innerJoin('nilaisikap', 'sikapmurid.sikap2', 'nilaisikap.nilai').where('sikapmurid.NISN', NISN)

    res.json({
        status: true,
        message: 'List Data Posts',
        data: data
    })

});



router.get('/sikap3/(:NISN)', async (req, res) => {
    let NISN = req.params.NISN


    let data = await knex('sikapmurid').innerJoin('nilaisikap', 'sikapmurid.sikap3', 'nilaisikap.nilai').where('sikapmurid.NISN', NISN)

    res.json({
        status: true,
        message: 'List Data Posts',
        data: data
    })

});



router.get('/sikap4/(:NISN)', async (req, res) => {
    let NISN = req.params.NISN


    let data = await knex('sikapmurid').innerJoin('nilaisikap', 'sikapmurid.sikap4', 'nilaisikap.nilai').where('sikapmurid.NISN', NISN)

    res.json({
        status: true,
        message: 'List Data Posts',
        data: data
    })

});



router.get('/sikap5/(:NISN)', async (req, res) => {
    let NISN = req.params.NISN


    let data = await knex('sikapmurid').innerJoin('nilaisikap', 'sikapmurid.sikap5', 'nilaisikap.nilai').where('sikapmurid.NISN', NISN)

    res.json({
        status: true,
        message: 'List Data Posts',
        data: data
    })

});





module.exports = router;