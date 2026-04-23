
function readBooking(){try{return JSON.parse(localStorage.getItem('bookingDraft')||'{}')}catch(e){return {}}}
function saveBooking(v){localStorage.setItem('bookingDraft', JSON.stringify(v))}
function money(n){return n + ' ر.س'}
function calcBooking(data){
 const base=Number(data.basePrice||220), d=Number(data.duration||60);
 const extra=d===90?70:d===120?120:d===30?-40:0;
 const referee=data.referee?50:0, kits=data.kits?30:0;
 const total=Math.max(80, base+extra+referee+kits), deposit=Math.round(total*0.3);
 return {total,deposit,remaining:total-deposit};
}
function fillSummary(){
 const d=readBooking(), c=calcBooking(d);
 const map={'sum-venue':d.venueName||'ملعب النخبة الرياضي','sum-date':d.date||'2026-04-25','sum-time':d.time||'07:00 م','sum-duration':(d.duration||60)+' دقيقة','sum-total':money(c.total),'sum-deposit':money(c.deposit),'sum-remaining':money(c.remaining)};
 Object.keys(map).forEach(id=>{const el=document.getElementById(id); if(el) el.textContent=map[id]});
 const pt=document.getElementById('sum-payment-type'); if(pt) pt.textContent=d.paymentType==='full'?'دفع كامل':'عربون';
}
function initFilters(){
 const ids=['filter-sport','filter-city','filter-availability','filter-price'], els=ids.map(id=>document.getElementById(id));
 if(!document.querySelector('[data-venue-card]')) return;
 function run(){
  document.querySelectorAll('[data-venue-card]').forEach(c=>{
   const sport=document.getElementById('filter-sport').value, city=document.getElementById('filter-city').value, av=document.getElementById('filter-availability').value, pr=Number(document.getElementById('filter-price').value||9999);
   const ok=(sport==='all'||c.dataset.sport===sport)&&(city==='all'||c.dataset.city===city)&&(av==='all'||c.dataset.available===av)&&(Number(c.dataset.price)<=pr);
   c.style.display=ok?'':'none';
  })
 }
 els.forEach(el=>el&&el.addEventListener('change',run)); run();
}
function initBooking(){
 const form=document.getElementById('booking-form'); if(!form) return;
 let time='04:00 م';
 document.querySelectorAll('.slot[data-available="true"]').forEach(el=>el.addEventListener('click',()=>{document.querySelectorAll('.slot').forEach(s=>s.classList.remove('active')); el.classList.add('active'); time=el.dataset.time; update();}));
 function update(){
   const data={basePrice:220,duration:Number(document.getElementById('field-duration').value),referee:document.getElementById('field-referee').checked,kits:document.getElementById('field-kits').checked};
   const c=calcBooking(data);
   document.getElementById('live-total').textContent=money(c.total);
   document.getElementById('live-deposit').textContent=money(c.deposit);
   document.getElementById('live-remaining').textContent=money(c.remaining);
 }
 ['field-duration','field-referee','field-kits'].forEach(id=>document.getElementById(id).addEventListener('change',update)); update();
 form.addEventListener('submit',e=>{
   e.preventDefault();
   saveBooking({
     venueName:'ملعب النخبة الرياضي',basePrice:220,sport:document.getElementById('field-sport').value,date:document.getElementById('field-date').value,duration:Number(document.getElementById('field-duration').value),players:Number(document.getElementById('field-players').value),referee:document.getElementById('field-referee').checked,kits:document.getElementById('field-kits').checked,time
   });
   location.href='/payment/';
 });
}
function initPayment(){
 fillSummary();
 const form=document.getElementById('payment-form'); if(!form) return;
 form.addEventListener('submit',e=>{e.preventDefault(); const d=readBooking(); d.paymentType=document.querySelector('input[name="pay"]:checked').value; saveBooking(d); location.href='/booking-confirmation/'});
}
document.addEventListener('DOMContentLoaded', ()=>{initFilters(); initBooking(); initPayment(); fillSummary();});
