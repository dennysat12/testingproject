module.export= class Konten {

    async pdfDenny1() {

        
        // =================================== TABEL 1 ===================================
        let tabelData1 = [{
                nama: 'Testing',
                informasi: 'Nyoba aja ngetik gajelas',
                nominal: 20000,
                tanggal: DateTime.fromISO('2019-06-12')
            },
            {
                nama: 'Testing',
                informasi: 'Nyoba aja ngetik gajelas',
                nominal: 20000,
                tanggal: DateTime.fromISO('2019-06-12')
            },
            {
                nama: 'Testing',
                informasi: 'Nyoba aja ngetik gajelas',
                nominal: 20000,
                tanggal: DateTime.fromISO('2019-06-12')
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

        tabelData1.forEach(function (ele, i) {
            var dataRow = [];

            dataRow.push(i + 1)
            dataRow.push(ele.nama)
            dataRow.push(ele.informasi)
            dataRow.push(rupiahParser(ele.nominal))
            dataRow.push(ele.tanggal.toFormat('f'))

            isiTabel1.push(dataRow);
        });

        // =================================== TABEL 2 ===================================
        let tabelData2 = [{
                nama: 'Testing',
                informasi: 'Nyoba aja ngetik gajelas',
                nominal: 20000,
                tanggal: DateTime.fromISO('2019-06-12')
            },
            {
                nama: 'Testing',
                informasi: 'Nyoba aja ngetik gajelas',
                nominal: 20000,
                tanggal: DateTime.fromISO('2019-06-12')
            },
            {
                nama: 'Testing',
                informasi: 'Nyoba aja ngetik gajelas',
                nominal: 20000,
                tanggal: DateTime.fromISO('2019-06-12')
            },
        ]

        var isiTabel2 = [];
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

        tabelData2.forEach(function (ele, i) {
            var dataRow = [];

            dataRow.push(i + 1)
            dataRow.push(ele.nama)
            dataRow.push(ele.informasi)
            dataRow.push(rupiahParser(ele.nominal))
            dataRow.push(ele.tanggal.toFormat('f'))

            isiTabel2.push(dataRow);
        });

        return [{
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

    async pdfDenny2() {
        // =================================== TABEL KOP SURAT ===================================
        var isiKopSurat = [];

        let bgGambar
        const placeholderLogo = 'placeholder/foto.png'
        let urlFoto = placeholderLogo // disini mekanik kalo if ga valid, kasi placeholder

        if (await Drive.exists(urlFoto)) { // kalo ngga di giniin, ntar bakal infinite await kalo file gaada
            const logoToko = await Drive.get(urlFoto) // ntar diganti jadi dinamis dari db, sama diresize dulu kali hmmm
            bgGambar = logoToko
        }

        isiKopSurat.push([{
                image: bgGambar,
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
                        text: 'NSS / NPSN : 1234567890 / 1234567890',
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
                sikap: 'Blabla tes 1',
                nilai: 'B',
                predikat: 'Baik'
            },
            {
                sikap: 'Blabla tes 2',
                nilai: 'B',
                predikat: 'Baik'
            },
            {
                sikap: 'Blabla tes 2',
                nilai: 'B',
                predikat: 'Baik'
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

        isiTabelB.push([{
                text: 'A.',
                style: 'tableHeaderDenny',
                fillColor: '#DFDFDE'
            },
            {
                text: 'Muatan Nasional',
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
        tabelData1.forEach((ele, i) => {
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
                text: ele.ketrampilan,
                alignment: 'center'
            })
            dataRow.push({
                text: ele.rerata,
                bold: true,
                alignment: 'center'
            })

            isiTabelB.push(dataRow);
            akhirMuatanA = i + 1
        })

        isiTabelB.push([{
                text: 'B.',
                style: 'tableHeaderDenny',
                fillColor: '#DFDFDE'
            },
            {
                text: 'Muatan Lokal',
                style: 'tableHeaderDenny',
                alignment: 'left',
                colSpan: 4,
                fillColor: '#DFDFDE'
            },
            {},
            {},
            {},
        ]);

        tabelData1.forEach((ele, i) => {
            var dataRow = [];

            dataRow.push({
                text: i + 1 + akhirMuatanA,
                alignment: 'right'
            })
            dataRow.push(ele.mapel)
            dataRow.push({
                text: ele.pengetahuan,
                alignment: 'center'
            })
            dataRow.push({
                text: ele.ketrampilan,
                alignment: 'center'
            })
            dataRow.push({
                text: ele.rerata,
                bold: true,
                alignment: 'center'
            })

            isiTabelB.push(dataRow);
            akhirMuatanA = i + 1
        })

        let meanPengetahuan = 0
        let meanKetrampilan = 0

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
                text: 'Tempat & Tanggal',
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
                text: 'Titel Guru Bersangkutan',
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
                text: 'Nama Kepala Sekolah',
                alignment: 'center'
            },
            {},
            {
                text: 'Nama Guru Berangkutan',
                alignment: 'right'
            },
        ])

        isiTabelParaf.push([{},
            {},
            {
                text: 'NBM: 1234567890',
                alignment: 'center'
            },
            {},
            {
                text: 'NBM: 1234567890',
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
                        }, ':', 'Testing nama siswa', null, {
                            text: 'KELAS',
                            bold: true
                        }, ':', {
                            text: 'tes',
                            alignment: 'right'
                        }],
                        [{
                            text: 'NIS / NISN',
                            bold: true
                        }, ':', '14045', null, {
                            text: 'SEMESTER',
                            bold: true
                        }, ':', {
                            text: '1(GANJIL)',
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
                    widths: [130, '*', 130, '*', 130],
                    // headerRows: 1,
                    body: isiTabelParaf,
                    dontBreakRows: true
                },
                margin: [0, 0, 0, 15],
                layout: 'noBorders',
            },
        ]
    }
}