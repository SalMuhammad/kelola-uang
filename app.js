const words = JSON.parse(localStorage.getItem('words'))|| []

// Memuat data kata saat halaman dimuat
loadWords(filterByTime(words,0,0,0))

//pilihan untuk menampilkan
$('#ygDitampilkan').addEventListener('change',() => {
  $('#table-body').innerHTML = ''
 if($('#ygDitampilkan').value === 'sekarang'){
     loadWords(filterByTime(words,0,0,0))
  }else if($('#ygDitampilkan').value === 'kemarin'){
     loadWords(filterByTime(words,0,0,-1))
  }else if($('#ygDitampilkan').value === 'lusa'){
     loadWords(filterByTime(words,0,0, -2))
  }else if($('#ygDitampilkan').value === 'minggu-lalu'){
     loadWords(filterByTime(words,0,0, -7))
  }else if($('#ygDitampilkan').value === '10hari-lalu'){
     loadWords(filterByTime(words,0,0,-10))
  }else if($('#ygDitampilkan').value === '2minggu-lalu'){
     loadWords(filterByTime(words,0,0, -14))
  }else if($('#ygDitampilkan').value === '18hari-lalu'){
     loadWords(filterByTime(words,0,0, -18))
  }else if($('#ygDitampilkan').value === 'mingu-lusa'){
     loadWords(filterByTime(words,0,0,-21))
  }else if($('#ygDitampilkan').value === 'bulan-kemarin'){
     loadWords(filterByTime(words,0,-1,0))
  }else if($('#ygDitampilkan').value === '2bulan-lalu'){
     loadWords(filterByTime(words,0,-2,0))
  }else if($('#ygDitampilkan').value === 'bulan-lusa'){
     loadWords(filterByTime(words,0,-3,0))
  }else if($('#ygDitampilkan').value === '5bulan-lalu'){
     loadWords(filterByTime(words,0,-5,0))
  }else{
    loadWords(words);
  }
})

// Menambahkan event listener untuk form saat di-submit
$('#add-form').addEventListener('submit', e => {
  e.preventDefault();
  const english = $('#english').value.trim();
  const indonesian = $('#indonesian').value.trim ();
  
  if (english !== '' && indonesian !== '' && $('#date').value !== '') {
    const word = {
      english: english,
      indonesian: indonesian,
      date: $('#date').value
    };
    addWord(word);
    $('#add-form').reset();
  }
});

// Menambahkan event listener untuk tombol hapus
$('#table-body').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const row = e.target.parentElement.parentElement;
    
    const index = row.dataset.index;
    if(confirm('apakah yakin?')){
      deleteWord(index);
    }
  }
});

// Menambahkan event listener untuk tombol edit
$('#table-body').addEventListener('click', (e) => {
  if (e.target.classList.contains('edit')) {
    const row = e.target.parentElement.parentElement;
    const index = row.dataset.index;
    const word = getWord(index);
    editWord(index, word);
  }
})

function filterByTime(obj,tahun,bulan,tanggal) {
  const sekarang = tambahkanNol(new Date()).toLocaleString();
  const tgl = tambahTanggal(new Date(), tanggal)
  const bln = tambahBulan(new Date(), bulan)
  const thn = tambahTahun(new Date(), tahun)
  const hari = `${thn}-${bln}-${tgl}`;
  return obj.filter(w =>  w.date === tambahkanNol(hari))
}

function tambahkanNol(dateString) {
  let dateObj = new Date(dateString);
  let month = dateObj.getMonth() + 1;
  let date = dateObj.getDate();
  return dateObj.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
}


function $(ell){
  return document.querySelector(ell)
}


// Fungsi untuk memuat data kata dari localStorage ke tabel
function loadWords(words) {
  words.forEach((word, index) => {
    const row = document.createElement('tr');
    row.dataset.index = index;
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${word.english}</td>
      <td>${word.indonesian}</td>
     
      <td>
        <button class="edit">🖊️</button>
        <button class="delete">🗑️</button>
      </td>
    `;
    
    $('#table-body').appendChild(row);
    
  })
}

// Fungsi untuk menambahkan kata baru ke localStorage dan tabel
function addWord(word) {
  words.push(word);
  localStorage.setItem('words', JSON.stringify(words));
  
  
  const row = document.createElement('tr');
  row.dataset.index = words.length - 1;
  row.innerHTML = `
    <td>${words.length}</td>
    <td>${word.english}</td>
    <td>${word.indonesian}</td>
   
    <td>
      <button class="edit">🖊️</button>
        <button class="delete">🗑️</button>
    </td>
  `;
  $('#table-body').appendChild(row); 
}



// Fungsi untuk menghapus kata dari localStorage dan tabel
function deleteWord(index) {
//  const words = JSON.parse(localStorage.getItem('words')) || [];
  words.splice(index, 1);
  localStorage.setItem('words', JSON.stringify(words));
  const rows = $('#table-body').querySelectorAll('tr');
  rows[index].remove();
  updateTableIndexes();
}

// Fungsi untuk memperbarui nomor indeks pada tabel setelah dihapus
function updateTableIndexes() {
  const rows = $('#table-body').querySelectorAll('tr');
  rows.forEach((row, index) => {
    row.dataset.index = index;
    row.firstElementChild.textContent = index + 1;
  });
}

// Fungsi untuk mengambil kata dari localStorage berdasarkan index
function getWord(index) {
  return words[index];
}

// Fungsi untuk mengedit kata dalam localStorage dan tabel
function editWord(index, word) {
  const english = prompt('Bahasa Inggris:', word.english);
  const indonesian = prompt('Bahasa Indonesia:', word.indonesian);
  if (english !== null && indonesian !== null && english !== '' && indonesian !== '') {
    const newWord = {
      english: english,
      indonesian: indonesian,
      date: words[index].date
    };
  //  const words = JSON.parse(localStorage.getItem('words')) || [];
    words.splice(index, 1, newWord);
    localStorage.setItem('words', JSON.stringify(words));
    const row = $('#table-body').querySelector(`tr[data-index="${index}"]`);
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${newWord.english}</td>
      <td>${newWord.indonesian}</td>

      <td>
        <button class="edit">🖊️</button>
        <button class="delete">🗑️</button>
      </td>
    `;
    updateTableIndexes(); // tambahkan ini untuk memperbarui nomor indeks pada tabel
  }
}


// Fungsi untuk menambahkan atau mengurangi tanggal
function tambahTanggal(tanggal, jumlahHari) {
  var date = new Date(tanggal);
  date.setDate(date.getDate() + jumlahHari);
  return date.getDate();
}

// Fungsi untuk menambahkan atau mengurangi bulan
// Fungsi untuk menambahkan atau mengurangi bulan
function tambahBulan(tanggal, jumlahBulan) {
  var date = new Date(tanggal);
  date.setMonth(date.getMonth() + jumlahBulan);
  return date.getMonth() +1;
}

// Fungsi untuk menambahkan atau mengurangi tahun
function tambahTahun(tanggal, jumlahTahun) {
  var date = new Date(tanggal);
  date.setFullYear(date.getFullYear() + jumlahTahun);
  return date.getFullYear();
}


// Contoh penggunaan fungsi untuk menambahkan atau mengurangi tanggal, bulan, dan tahun
var tanggalSekarang = new Date();
//console.log("Tanggal Sekarang:", tanggalSekarang);

var tgl = tambahTanggal(tanggalSekarang, -27);
//console.log("Tanggal setelah ditambah 7 hari:", tgl);
/*

//var bln = tambahBulan(tanggalSekarang, 2);
//console.log("Tanggal setelah ditambah 2 bulan:", bln);

//var thn = tambahTahun(tanggalSekarang, 5);
//console.log("Tanggal setelah ditambah 5 tahun:", thn);


function tampilkanwaktuSekarang() {
  const dt = new Date();
  const timeZoneOffset = + 420; // 7 jam = 7 x 60 menit = -420 menit
  const localDate = new Date(dt.getTime() + timeZoneOffset * 60 * 1000);
  const currentDate = localDate.toISOString().slice(0, 16);
  console.log($('#date'))
  $('#date').value = currentDate
}*/























