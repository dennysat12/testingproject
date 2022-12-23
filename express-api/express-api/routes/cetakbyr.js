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

function rupiahParser(angka){
if (typeof angka == 'number'){
return new Intl.NumberFormat('id-ID',{
style:'currency',
currency:'IDR',
minimumFractionDigits:0,

}


).format(angka)

}else return'error'

}

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

async function pdfDenny2(kelas,tahun) {




let pembayarandatalunas = await knex.select('*').from('pembayaran').innerJoin('datamurid','pembayaran.NISN','datamurid.NISN').where('datamurid.kelas',kelas).whereRaw('Year(tgl) = ?', tahun).andWhere('status',1).orderBy('tgl_lunas','asc').orderBy('datamurid.nama','asc')
console.log(pembayarandatalunas)


let pembayarandata = await knex.select('*').from('pembayaran').innerJoin('datamurid','pembayaran.NISN','datamurid.NISN').where('datamurid.kelas',kelas).whereRaw('Year(tgl) = ?', tahun).andWhere('status',0).orderBy('tgl','asc').orderBy('datamurid.nama','asc')
console.log(pembayarandata)



 
        // =================================== TABEL 1 ===================================
        let tabelData1 = [
          {
            nama: 'Testing',
            informasi: 'Nyoba aja ngetik gajelas',
            nominal: 20000,
            tanggal: '2019-06-12'
          },
          {
            nama: 'Testing',
            informasi: 'Nyoba aja ngetik gajelas',
            nominal: 20000,
            tanggal:'2019-06-12'
          },
          {
            nama: 'Testing',
            informasi: 'Nyoba aja ngetik gajelas',
            nominal: 20000,
            tanggal: '2019-06-12'
          },
        ]
    
        var isiTabel1 = [];
        isiTabel1.push([{
          text: 'No',
          style: 'tableHeader'
        },
        {
          text: 'Nama',
          style: 'tableHeader'
        },
        {
          text: 'Informasi Pembayaran',
          style: 'tableHeader'
        },
        {
          text: 'Nominal',
          style: 'tableHeader'
        },
        {
          text: 'Tanggal Pembayaran',
          style: 'tableHeader'
        },
        ]);
    
      pembayarandatalunas.forEach(function (ele, i) {
          var dataRow= [];
    
          dataRow.push(i + 1)
          dataRow.push(ele.nama)
          dataRow.push(ele.perihal)
          dataRow.push(rupiahParser(ele.nominal))
          dataRow.push(ele.tgl_lunas.toLocaleDateString('id-ID',{day:'2-digit', month:'2-digit',year:'numeric'}))
          console.log(ele.tgl)
    
          isiTabel1.push(dataRow);
        });
    
        // =================================== TABEL 2 ===================================
        let tabelData2 = [
          {
            nama: 'Testing',
            informasi: 'Nyoba aja ngetik gajelas',
            nominal: 20000,
            tanggal: '2019-06-12'
          },
          {
            nama: 'Testing',
            informasi: 'Nyoba aja ngetik gajelas',
            nominal: 20000,
            tanggal: '2019-06-12'
          },
          {
            nama: 'Testing',
            informasi: 'Nyoba aja ngetik gajelas',
            nominal: 20000,
            tanggal: '2019-06-12'
          },
        ]
    
        var isiTabel2= [];
        isiTabel2.push([{
          text: 'No',
          style: 'tableHeader'
        },
        {
          text: 'Nama',
          style: 'tableHeader'
        },
        {
          text: 'Informasi Pembayaran',
          style: 'tableHeader'
        },
        {
          text: 'Nominal',
          style: 'tableHeader'
        },
        {
          text: 'Tanggal Pembayaran Dibuat',
          style: 'tableHeader'
        },
        ]);
    
        pembayarandata.forEach(function (ele, i) {
          var dataRow= [];
    
    
          dataRow.push(i + 1)
          dataRow.push(ele.nama)
          dataRow.push(ele.perihal)
          dataRow.push(rupiahParser(ele.nominal))
          dataRow.push(ele.tgl.toLocaleDateString('id-ID',{day:'2-digit', month:'2-digit',year:'numeric'}))
          console.log(ele.tgl)
    
          isiTabel2.push(dataRow);
        });
    
        return [
          {
            stack: ['LAPORAN PEMBAYARAN SD AISYIYAH KAMILA', 'PERIODE 20XX/20XX'],
            style: 'judul',
            alignment: 'center',
          },
          {
            style: 'tabelKopBab',
            table: {
              widths: [80, 'auto', '*'],
              body: [
                ['Tahun', ':', '2010'],
                ['Kelas', ':', '3A'],
              ],
            },
            layout: 'noBorders',
          },
          {
            text: 'Pembayaran Lunas',
            bold: true
          },
          {
            table: {
              widths: [25, '*', 250, '*', '*'],
              headerRows: 1,
              body: isiTabel1,
              dontBreakRows: true
            },
            style: 'tabelBasic'
          },
          {
            text: 'Pembayaran Belum Lunas',
            bold: true
          },
          {
            table: {
              widths: [25, '*', 250, '*', '*'],
              headerRows: 1,
              body: isiTabel2,
              dontBreakRows: true
            },
            style: 'tabelBasic'
          }
        ]
      }
    

// module.exports = { pdfDenny2 }
exports.pdfDenny2 = pdfDenny2