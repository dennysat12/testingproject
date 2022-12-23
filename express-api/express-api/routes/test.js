const express = require('express');
const router = express.Router();

//import express validator
const {
    body,
    validationResult
} = require('express-validator');

//import database
const connection = require('../config/database');
const fs = require('fs').promises
const knex = require('../config/knexdb');

function kapitalpertama(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

function kapitalkedua(text) {

    let pure = text.split(' ')
    let newText = ''
    for (let i = 0; i < pure.length; i++) {
        newText += kapitalpertama(pure[i])
        if (i !== pure.length - 1) {
            newText += ' '

        }

    }
    return newText
}

async function pdfDenny2(NISN, kelas, ujian, semester) {
    let datamurid = await knex.select('*').from('datamurid').where('NISN', NISN).first()

    let datakelas = await knex.select('*').from('kelas').where('idkelas', kelas).first()
    let datasikap1 = await knex.select('*').from('sikapmurid').where('NISN', NISN).innerJoin('nilaisikap', 'sikapmurid.sikap1', 'nilaisikap.nilai').first()
    let datasikap2 = await knex.select('*').from('sikapmurid').where('NISN', NISN).innerJoin('nilaisikap', 'sikapmurid.sikap2', 'nilaisikap.nilai').first()
    let datasikap3 = await knex.select('*').from('sikapmurid').where('NISN', NISN).innerJoin('nilaisikap', 'sikapmurid.sikap3', 'nilaisikap.nilai').first()
    let datasikap4 = await knex.select('*').from('sikapmurid').where('NISN', NISN).innerJoin('nilaisikap', 'sikapmurid.sikap4', 'nilaisikap.nilai').first()
    let datasikap5 = await knex.select('*').from('sikapmurid').where('NISN', NISN).innerJoin('nilaisikap', 'sikapmurid.sikap5', 'nilaisikap.nilai').first()
    let data3 = await knex.select('kurikulum').from('kelas').where('idkelas', kelas).limit(1)
    let result = data3[0].kurikulum
    let strukturmuatan = await knex.select('*').from('struktur_raport').where('kelas', datamurid.kelas).orderBy('urut', 'asc').innerJoin('tipe_akademik','struktur_raport.tipe','tipe_akademik.id')
    let wadah = []
    let datakepsek = await knex.select('*').from('kepalasekolah').innerJoin('data_guru','kepalasekolah.guru','data_guru.nomorinduk').first()
    let datawali = await knex.select('*').from('walikelas').innerJoin('data_guru','walikelas.guru','data_guru.nomorinduk').where('walikelas.kelas',kelas).first()

console.log(datakepsek)

console.log(datawali)
    for (const item of strukturmuatan) {

        let dataraport = await knex.select('*')
            .from('raport').innerJoin('jam_akademik_a', 'raport.idmapel', 'jam_akademik_a.id_mapel').innerJoin('tipe_akademik','jam_akademik_a.tipe_aka','tipe_akademik.id').where('raport.NISN', NISN).andWhere('raport.ujian', ujian + semester).andWhere('jam_akademik_a.tipe_aka', item.tipe)
            .whereNot(result, '0')

        wadah.push({
            data: dataraport,
            muatan : item.tipe_akademik
        })
    }

    // =================================== TABEL KOP SURAT ===================================
    var isiKopSurat = [];
    const contents = await fs.readFile('file/static/logo.png')
    console.log(contents)
    // let bgGambar
    // const placeholderLogo = 'placeholder/foto.png'
    // let urlFoto = placeholderLogo // disini mekanik kalo if ga valid, kasi placeholder

    // if (await Drive.exists(urlFoto)) { // kalo ngga di giniin, ntar bakal infinite await kalo file gaada
    //     const logoToko = await Drive.get(urlFoto) // ntar diganti jadi dinamis dari db, sama diresize dulu kali hmmm
    //     bgGambar = logoToko
    // }

    isiKopSurat.push([{
             image: contents,
             width: 70,
             margin: [15, 0, 0, 0],
            border: [false, false, false, true]
        },
        {
            stack: [{
                    text: 'PIMPINAN CABANG AISYIYAH LOWOKWARU',
                    alignment: 'center',
                    margin: [0, 0, 0, 10],
                    fontSize: 12
                },
                {
                    text: 'SEKOLAH DASAR AISYIYAH KOTA MALANG',
                    alignment: 'center',
                    bold: true,
                    margin: [0, 0, 0, 10],
                    fontSize: 12
                },
                {
                    text: 'NSS / NPSN : 102056104011 / 20539409',
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                {
                    text: 'Disini diisi alamat lengkap sekolah, Nomor Telpon, sama Alamat Email',
                    alignment: 'center',
                    margin: [0, 0, 0, 5]
                },
            ],
            border: [false, false, false, true]
        }
    ])

    // =================================== TABEL PART A ===================================
    let tabelData0 = [{
            sikap: 'Ketaatan Ibadah',
            nilai: datasikap1.sikap1,
            predikat: datasikap1.keterangan
        },
        {
            sikap: 'Berperilaku Syukur',
            nilai: datasikap2.sikap2,
            predikat: datasikap2.keterangan
        },

    ]

    let tabelDatasikap1 = [{
            sikap: 'Jujur',
            nilai: datasikap3.sikap3,
            predikat: datasikap3.keterangan
        },
        {
            sikap: 'Disiplin',
            nilai: datasikap4.sikap4,
            predikat: datasikap4.keterangan
        },
        {
            sikap: 'Tanggung Jawab',
            nilai: datasikap5.sikap5,
            predikat: datasikap5.keterangan
        },
    ]

    var isiTabelA = [];
    isiTabelA.push([{
            text: 'PENILAIAN SIKAP',
            style: 'tableHeaderDenny',
            colSpan: 4,
            fillColor: '#ADE792'
        },
        {},
        {},
        {},
    ]);

    isiTabelA.push([{
            text: 'NO.',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#d1ffc2'
        },
        {
            text: 'SIKAP SPIRITUAL',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#d1ffc2'
        },
        {
            text: 'NILAI',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#d1ffc2'
        },
        {
            text: 'PREDIKAT',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#d1ffc2'
        },
    ]);

    tabelData0.forEach((ele, i) => {
        var dataRow = [];

        dataRow.push({
            text: i + 1,
            alignment: 'right'
        })
        dataRow.push(ele.sikap)
        dataRow.push({
            text: ele.nilai,
            alignment: 'center',
            bold: true
        })
        dataRow.push({
            text: ele.predikat,
            alignment: 'center',
            bold: true
        })

        isiTabelA.push(dataRow);
    })


    isiTabelA.push([{
            text: 'NO.',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#F3ECB0'
        },
        {
            text: 'SIKAP SOSIAL',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#F3ECB0'
        },
        {
            text: 'NILAI',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#F3ECB0'
        },
        {
            text: 'PREDIKAT',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#F3ECB0'
        },
    ]);
    //tabel sikap2
    tabelDatasikap1.forEach((ele, i) => {
        var dataRow = [];

        dataRow.push({
            text: i + 1,
            alignment: 'right'
        })
        dataRow.push(ele.sikap)
        dataRow.push({
            text: ele.nilai,
            alignment: 'center',
            bold: true
        })
        dataRow.push({
            text: ele.predikat,
            alignment: 'center',
            bold: true
        })

        isiTabelA.push(dataRow);
    })

    // =================================== TABEL PART B ===================================
    let tabelData1 = [{
            mapel: 'Testing',
            pengetahuan: 30,
            ketrampilan: 34,
            rerata: 44
        },
        {
            mapel: 'Testing 2',
            pengetahuan: 30,
            ketrampilan: 34,
            rerata: 44
        },
        {
            mapel: 'Testing 3',
            pengetahuan: 30,
            ketrampilan: 34,
            rerata: 44
        },
    ]

    var isiTabelB = [];
    isiTabelB.push([{
            text: 'PENILAIAN PENGETAHUAN DAN KETRAMPILAN',
            style: 'tableHeaderDenny',
            colSpan: 5,
            border: [true, false, true, true],
            fillColor: '#82C3EC'
        },
        {
            text: null,
            border: [true, false, true, true]
        },
        {
            text: null,
            border: [true, false, true, true]
        },
        {
            text: null,
            border: [true, false, true, true]
        },
        {
            text: null,
            border: [true, false, true, true]
        },
    ]);

    isiTabelB.push([{
            text: 'NO.',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#addfff'
        },
        {
            text: 'MUATAN PELAJARAN',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#addfff'
        },
        {
            text: 'PENGETAHUAN',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#addfff'
        },
        {
            text: 'KETRAMPILAN',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#addfff'
        },
        {
            text: 'RERATA',
            style: 'tableHeaderDenny',
            colspan: 1,
            fillColor: '#addfff'
        },
    ]);
    let meanPengetahuan = 0
    let meanKetrampilan = 0
    let jp =0
    let jk = 0
    let tp=0
    let tk=0
    for (const item of wadah) {
        isiTabelB.push([{
                text: 'A.',
                style: 'tableHeaderDenny',
                fillColor: '#DFDFDE'
            },
            {
                text: item.muatan,
                style: 'tableHeaderDenny',
                alignment: 'left',
                colSpan: 4,
                fillColor: '#DFDFDE'
            },
            {},
            {},
            {},
        ]);

        let akhirMuatanA = 0
        item.data.forEach((ele, i) => {
            var dataRow = [];

            dataRow.push({
                text: i + 1,
                alignment: 'right'
            })
            dataRow.push(ele.mapel)
            dataRow.push({
                text: ele.pengetahuan,
                alignment: 'center'
            })
            dataRow.push({
                text: ele.keterampilan,
                alignment: 'center'
            })
            dataRow.push({
                text: ele.rerata,
                bold: true,
                alignment: 'center'
            })

            isiTabelB.push(dataRow);
            akhirMuatanA = i + 1

            jp++
            jk++
            tp+=ele.pengetahuan
            tk+=ele.keterampilan
        })

     
    }

    if (jk && jk && tp && tk ){

        meanKetrampilan = tk/jk
        meanPengetahuan =tp/jp

    }




    

    isiTabelB.push([{
            text: `Rata-Rata Pengetahuan = ${meanPengetahuan.toFixed(2)} dan Rata-Rata Ketrampilan = ${meanKetrampilan.toFixed(2)}`,
            style: 'tableHeaderDenny',
            colSpan: 5,
            fillColor: '#DFDFDE',
            italics: true
        },
        {},
        {},
        {},
        {},
    ]);

    // =================================== TABEL PART C ===================================
    var isiTabelC = [];
    let jumlahSakit = 0
    let jumlahIzin = 0
    let jumlahTanpa = 0
    let total = jumlahIzin + jumlahSakit + jumlahTanpa

    isiTabelC.push([{
            text: 'Ketidakhadiran',
            decoration: 'underline',
            fillColor: '#DFDFDE',
            border: [true, true, false, true]
        },
        {
            text: `Sakit : ${ (jumlahSakit)? jumlahSakit: '-' }`,
            italics: true,
            fillColor: '#DFDFDE',
            border: [false, true, false, true]
        },
        {
            text: `Izin :  ${ (jumlahIzin)? jumlahIzin: '-' }`,
            italics: true,
            fillColor: '#DFDFDE',
            border: [false, true, false, true]
        },
        {
            text: `Tanpa Keterangan :  ${ (jumlahTanpa)? jumlahTanpa: '-' }`,
            italics: true,
            fillColor: '#DFDFDE',
            border: [false, true, false, true]
        },
        {
            text: '=',
            fillColor: '#DFDFDE',
            border: [false, true, false, true]
        },
        {
            text: `${total} hari`,
            fillColor: '#DFDFDE',
            border: [false, true, true, true],
            alignment: 'right'
        }
    ])

    // =================================== TABEL PARAF ===================================
    var isiTabelParaf = [];
    isiTabelParaf.push([{},
        {},
        {},
        {},
        {
            text: 'Malang, '+new Date().toLocaleDateString('id-ID',{day : '2-digit' ,month: 'long', year:'numeric'}),
            alignment: 'right'
        },
    ])

    isiTabelParaf.push([{
            text: 'Mengetahui'
        },
        {},
        {},
        {},
        {
            text: 'SD AISYIYAH',
            alignment: 'right'
        },
    ])

    isiTabelParaf.push([{
            text: 'Orang Tua/Wali'
        },
        {},
        {
            text: 'Kepala Sekolah',
            alignment: 'center'
        },
        {},
        {
            text: 'Wali ' +datakelas.namakelas,
            alignment: 'right'
        },
    ])

    isiTabelParaf.push([{
            margin: [0, 50, 0, 0],
            text: null
        },
        {},
        {},
        {},
        {},
    ])

    isiTabelParaf.push([{
            text: '.............................'
        },
        {},
        {
            text: datakepsek.nama,
            alignment: 'center'
        },
        {},
        {
            text:datawali.nama,
            alignment: 'right'
        },
    ])

    isiTabelParaf.push([{},
        {},
        {
            text: 'NBM : '+ datakepsek.nomorinduk ,
            alignment: 'center'
        },
        {},
        {
            text: 'NBM : ' + datawali.nomorinduk,
            alignment: 'right'
        },
    ])

    // ===================================================================================
    return [
        // {
        //   stack: ['LAPORAN PEMBAYARAN SD AISYIYAH KAMILA', 'PERIODE 20XX/20XX'],
        //   style: 'judul',
        //   alignment: 'center',
        // },
        {
            table: {
                widths: [100, '*'],
                // headerRows: 1,
                body: isiKopSurat,
                dontBreakRows: true
            },
            margin: [0, 0, 0, 10],
            layout: {
                hLineWidth: function (i, node) {
                    return 2
                }
            },
        },
        {
            // style: 'tabelKopBab',
            margin: [0, 0, 0, 10],
            table: {
                widths: [80, 'auto', '*', 10, 80, 'auto', 60],
                body: [
                    [{
                        text: 'NAMA SISWA',
                        bold: true
                    }, ':', kapitalkedua(datamurid.nama), null, {
                        text: 'KELAS',
                        bold: true
                    }, ':', {
                        text: datakelas.namakelas,
                        alignment: 'right'
                    }],
                    [{
                        text: 'NIS / NISN',
                        bold: true
                    }, ':', datamurid.NIS + '/' + datamurid.NISN, null, {
                        text: 'SEMESTER',
                        bold: true
                    }, ':', {
                        text: semester + ((semester == '2') ? '(GENAP)' : '(GANJIL)'),
                        alignment: 'right'
                    }],
                ],
            },
            layout: 'noBorders',
        },
        {
            table: {
                widths: [25, '*', '*', '*'],
                headerRows: 1,
                body: isiTabelA,
                dontBreakRows: true
            },
            margin: [0, 0, 0, 0]
        },
        {
            table: {
                widths: [25, 170, '*', '*', '*'],
                headerRows: 1,
                body: isiTabelB,
                dontBreakRows: true
            },
            // margin: [0, 0, 0, 15]
        },
        {
            table: {
                widths: [90, 80, 80, '*', 'auto', 50],
                // headerRows: 1,
                body: isiTabelC,
                dontBreakRows: true
            },
            margin: [0, 0, 0, 15]
        },
        {
            table: {
                widths: [150, '*', 130, '*', 150],
                // headerRows: 1,
                body: isiTabelParaf,
                dontBreakRows: true
            },
            margin: [0, 0, 0, 15],
            layout: 'noBorders',
        },
    ]
}
// exports.generateStyle = generateStyle
exports.pdfDenny2 = pdfDenny2