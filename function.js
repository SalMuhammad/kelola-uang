import {dataUang,thisMonthReverse} from'./eksekusiData.js'





/* export function hapusData(id){
//$('bi-trash').addEventListener('click',()=>{
  if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
	  dataUang.splice(id, 1)
//	 console.log(id.target.parentElement)
		localStorage.setItem("dataUang", JSON.stringify(dataUang))
//		tampilkanData()
	}
//})
}*/


//fungsi dom
export function $(varr){
  return document.querySelector(varr)
}
export function $all(varr){
  return document.querySelectorAll(varr)
}

//memunculkan form 
export function munculForm(){
  $('.layoting').style.display = "block"
  $('.trash').style.display = "none"
  tampilkanwaktuSekarang()
}

//menghilangkan form
export function closes(){
  $('.layoting').style.display = "none"
  $(".btn").classList.remove('edit')
  $(".btn").textContent= "Tambahkan"
  kategoriKetikaKeluar()
 // $('.caption .trash').innerHTML = ''
  $('.trash').style.display = "block"
  $('.form').reset()
}


//pengecekan select
export function pengecekanSelect(){
  $('#jenis').addEventListener("change",() =>{
    if($('#jenis').value === "masuk"){
      kategoriKetikaMasuk()
    }else{
      kategoriKetikaKeluar()
    }
  })
}


//fungsi kategori ketika masuk
export function kategoriKetikaMasuk(){
  $("#jenis").classList.add('teal')
  $("#jenis").classList.remove('red')
  $(".masuk").style.display = "block"
  $(".keluar").style.display = "none"
}

//fungsi ketika kategori masuk
export function kategoriKetikaKeluar(){
  $("#jenis").classList.add('red')
  $("#jenis").classList.remove('teal')
  $(".masuk").style.display = "none"
  $(".keluar").style.display = "block"
}

//fungsi rupiah
export function rupiah(bilangan){
  var	number_string = bilangan.toString(),
	  sisa  	= number_string.length % 3,
	  rupiah 	= number_string.substr(0, sisa),
	  ribuan 	= number_string.substr(sisa).match(/\d{3}/g)
  if (ribuan) {
   // let separator;
	 const separator = sisa ? '.' : '';
  	rupiah += separator + ribuan.join('.')
  }
  return rupiah
}		



function generateUniqueId() {
  // Membuat string acak menggunakan metode Math.random()
  let uniqueId = Math.random().toString(36).substring(2, 8);
  
  // Cek apakah id sudah ada
  if (document.getElementById(uniqueId)) {
    // Jika id sudah ada, panggil fungsi generateUniqueId() lagi untuk membuat id yang berbeda
    return generateUniqueId();
  }
  
  // Jika id belum ada, return id yang telah dihasilkan
  return uniqueId;
}

//fungsi tambah data
export function tambahData() {
 // let tanggal = new Date().toLocaleDateString("id-ID");
  let jenis = $("#jenis").value
  let kategori = document.getElementById(jenis === "masuk" ? "kategori-masuk" : "kategori-keluar").value
  if(!$('#nominal').value){
    alert('form belum di isi')
  }else if(!$('#nominal').value){
    alert('nominal wajib di isi')
  }else {
    
   let data = {
      tanggal   :$('#tanggal').value,
      nominal   :$('#nominal').value,
      kategori,
      keterangan:$('#keterangan').value,
      jenis,
      id        :generateUniqueId()
    }
    if(!$(".btn").classList.contains("edit")){
      dataUang.push(data)
      localStorage.setItem("dataUang", JSON.stringify(dataUang))
      $('form').reset()
    }else{
      let id = $(".btn").getAttribute('data-id')
      dataUang[id].jenis = $("#jenis").value
      dataUang[id].kategori = kategori
      dataUang[id].tanggal = $("#tanggal").value
      dataUang[id].nominal = $("#nominal").value
      dataUang[id].keterangan = $("#keterangan").value
      localStorage.setItem("dataUang", JSON.stringify(dataUang))
    } closes();window.location = 'index.html'//tampilkanData(thisMonthReverse);
  }
}


//fungsi menambahkan total ke ke Array DataUang
export function tambahTotal(objek) {
  for (const tanggal in objek) {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;
     
    objek[tanggal].forEach((transaksi) => {
      const nominal = parseInt(transaksi.nominal)
      
      if (transaksi.jenis === "masuk") {
        totalPemasukan += nominal;
      } else if (transaksi.jenis === "keluar") {
        totalPengeluaran += nominal;
      }
    
    });
    objek[tanggal].push(totalPemasukan);
    objek[tanggal].push(totalPengeluaran);
  }
  return objek;
}

function add3Dots(string, limit)
{
  var dots = "...";
  if(string.length > limit)
  {
    // you can also use substr instead of substring
    string = string.substring(0,limit) + dots;
  }
 
    return string;
}

export function ubahFormatData(dataAwal) {
  const dataBaru = {}
  dataAwal.forEach(item => {
    const tanggal = new Date(item.tanggal);
    const tahun = tanggal.getFullYear();
    const bulan = String(tanggal.getMonth() + 1)//.padStart(2, '0');
    const hari = String(tanggal.getDate())//.padStart(2, '0');

    if (!dataBaru[tahun]) {
      dataBaru[tahun] = {};
    }
    if (!dataBaru[tahun][bulan]) {
      dataBaru[tahun][bulan] = {};
    }
    if (!dataBaru[tahun][bulan][hari]) {
      dataBaru[tahun][bulan][hari] = [];
    }
    dataBaru[tahun][bulan][hari].push(item);
  })
  return dataBaru
}


export function sortByTime(data) {
  // Menggabungkan semua data menjadi satu array
  if(data !== null && typeof data === 'object'){
    const mergedArray = Object.values(data).flat()
    // Mengurutkan array berdasarkan waktu menggunakan metode .sort()
    const sortedArray = mergedArray.sort((a, b) => {
        if (a.tanggal < b.tanggal) return -1;
        if (a.tanggal > b.tanggal) return 1;
        return 0;
      });
  
      return sortedArray;
    } 
}

export function tampilkanwaktuSekarang() {
  const dt = new Date();
  const timeZoneOffset = + 420; // 7 jam = 7 x 60 menit = -420 menit
  const localDate = new Date(dt.getTime() + timeZoneOffset * 60 * 1000);
  const currentDate = localDate.toISOString().slice(0, 16);
  $("#tanggal").value = currentDate;
}


export function pilihBulanIni(data) {
  const sekarang = new Date();
  const currentYear = sekarang.getFullYear();
  const currentMonth = sekarang.getMonth() +1
  let currentMonthData = {};
  let year;
  let month
  for ( year in data) {
    if (year === String(currentYear)) {
      for ( month in data[year]){
        if (month === String(currentMonth)) {
          currentMonthData = data[year][month];
          break
        }
      }
      break;
    }
  }
  if (currentMonthData !== null && typeof  currentMonthData === 'object') {
    if (Object.keys(currentMonthData).length === 0) {
      $(".container").innerHTML = ` <span class="confir-data-kosong">Tidak ada transaksi di bulan ${currentMonth} tahun ${currentYear}</span>`
    return;
    }
  } 

  
 //tambahTotal(currentMonthData)
 // console.log(currentMonthData)
 return currentMonthData

}










export function tampilkanData(dataArr) {
  // Membuat objek untuk menyimpan data per hari
  const dataPerHari = {};
	
	if (typeof dataArr !== 'undefined' && dataArr !== null) {
  // Memisahkan data berdasarkan tanggal
  dataArr.forEach(data => {
   // Mengambil tanggal saja dari string tanggal
    const tanggal = data.tanggal.slice(0, 10);
    if (!dataPerHari[tanggal]) {
	     dataPerHari[tanggal] = [];
    }
    dataPerHari[tanggal].push(data);
    }
  )//	console.log(JSON.stringify(dataPerHari))
  
  tambahTotal(dataPerHari)	
  //console.log(dataPerHari)
  let tableHtml = "";
  for (const tanggal in dataPerHari) {
    let pengeluaran = dataPerHari[tanggal].length -1
    let pemasukan = dataPerHari[tanggal].length - 2
    const date = new Date(tanggal); // membuat objek Date dari string tanggal
    const dinten = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][date.getDay()];
  /*  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][date.getMonth()]; */// mengambil nama bulan
    const tgl = tanggal.slice(8,10)
    const bln = tanggal.slice(5,7)
    const thn = tanggal.slice(0,4)
    tableHtml += `
        <tr class"row">
          <th>
            <div class="flex">
              <b class="tgl flex"><span>${tgl}</span></b>
              <div class="">
                <div class="bulan-tahun">${bln}-${thn}</div>
                <div class="dinten">${dinten}</div>
              </div>
           </div>
         </th>
         <th class="pemasukan"><span class="nominal">${rupiah(dataPerHari[tanggal][pemasukan])}</span></th>
          <th class="pengeluaran">
            <span class="nominal">${rupiah(dataPerHari[tanggal][pengeluaran])}
            </span>
          </th>
          <th>detile</th>
        </tr>
    `;
    dataPerHari[tanggal].pop()
    dataPerHari[tanggal].pop()
    
    
    //meluping value objek dataPerHari
    if (typeof dataPerHari[tanggal] !== 'undefined'/* && dataPerHari[tanggal] !== null*/) {
        dataPerHari[tanggal].forEach((data,id) => {
        const jenis = data.jenis === "masuk" ? "Pemasukan" : "Pengeluaran";
        let tr = data.jenis === "masuk"? '<tr class="pemasukan trs">': '<tr class="pengeluaran trs">'
      
        tableHtml += tr;
        tableHtml += `
	         <td>${data.kategori}</td>
	         <td>${add3Dots(data.keterangan,9)}</td>
           <td class="nominal">
              ${rupiah(data.nominal)}
              <span class="id-transaksi">${data.id}</span>
           </td>
           <td class="detile">🔍</td>
        </tr>
        `;
        })
      } 
    $(".table").innerHTML = tableHtml;
    }
  }
}