//import * as say from './function.js';
import {$, munculForm, closes, tambahData, } from './function.js';




$('#muncul').addEventListener('click', munculForm)
  $('#tanggal').setAttribute('value',new Date())
$('.close').addEventListener('click', ()=>{
  closes()
  $("form").reset()
})
	

//ketikaBtnDiKlik()
$(".btn").addEventListener('click', e =>{
    tambahData()
    e.preventDefault()
   // closes()
 })

