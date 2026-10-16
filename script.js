(function(){
  var PHONE='971588959532';
  function wa(msg){return 'https://wa.me/'+PHONE+'?text='+encodeURIComponent(msg)}
  function openWA(msg){
    var w=window.open(wa(msg),'_blank');
    if(!w){window.location.href=wa(msg)}
  }
  var $=function(s){return document.querySelector(s)};
  var $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};

  /* Modals */
  var closeBtn=$('#closeBtn');
  function openModal(id){
    $$('.modal').forEach(function(m){m.classList.remove('open')});
    $('#'+id).classList.add('open');
    closeBtn.hidden=false;
    document.body.style.overflow='hidden';
  }
  function closeAll(){
    $$('.modal').forEach(function(m){m.classList.remove('open')});
    closeBtn.hidden=true;
    document.body.style.overflow='';
  }
  if(closeBtn){
    closeBtn.addEventListener('click',closeAll);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
    $$('.modal').forEach(function(m){
      m.addEventListener('click',function(e){if(e.target===m)closeAll()});
    });
  }

  /* Book a Meeting -> contact popup */
  $$('[data-action="book"]').forEach(function(b){
    b.addEventListener('click',function(){openModal('contactModal')});
  });

  /* Popup options */
  var z=$('#opt-zoom');if(z)z.addEventListener('click',function(){openModal('zoomModal')});
  var w=$('#opt-whatsapp');if(w)w.addEventListener('click',function(){
    closeAll();
    openWA('Hi there! I would like to know more about properties in Dubai / Georgia. Please provide more details. Thank you');
  });
  var cb=$('#opt-callback');if(cb)cb.addEventListener('click',function(){
    closeAll();
    openWA('Hi there! I request you for a call back. Thank you.');
  });
  var cn=$('#opt-call');if(cn)cn.addEventListener('click',closeAll);

  /* I'm interested */
  $$('[data-interest]').forEach(function(b){
    b.addEventListener('click',function(){
      var section=b.getAttribute('data-section');
      var title=b.getAttribute('data-title');
      openWA('Hi there! I am interested in '+section+'. Please share more details about "'+title+'". Thank you');
    });
  });

  /* Zoom form */
  var form=$('#zoomForm');
  if(form){
    var d=form.elements['date'];
    var t=new Date();
    d.min=t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2)+'-'+('0'+t.getDate()).slice(-2);
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      ['name','guests','time','date'].forEach(function(n){
        var el=form.elements[n];
        var bad=!el.value.trim()||(n==='guests'&&Number(el.value)<1);
        el.classList.toggle('err',bad);
        if(bad)ok=false;
      });
      if(!ok){form.querySelector('.err').focus();return}
      var dt=new Date(form.elements['date'].value+'T00:00');
      var dateStr=dt.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
      var tm=form.elements['time'].value.split(':');
      var h=Number(tm[0]),ap=h>=12?'PM':'AM';h=h%12||12;
      var timeStr=h+':'+tm[1]+' '+ap;
      var msg='Hi there! I would like to book a Zoom meeting.\n'+
        'Name: '+form.elements['name'].value.trim()+'\n'+
        '# of Guests: '+form.elements['guests'].value+'\n'+
        'Time: '+timeStr+'\n'+
        'Date: '+dateStr+'\n'+
        'Please confirm. Thank you.';
      openWA(msg);
      form.reset();
      openModal('thanksModal');
    });
    form.addEventListener('input',function(e){e.target.classList.remove('err')});
  }

  /* Sticky banner: show only after the contact buttons scroll above the viewport */
  var contact=$('#contact'),sticky=$('#sticky');
  if(contact&&sticky&&'IntersectionObserver' in window){
    new IntersectionObserver(function(en){
      var e=en[0];
      var scrolledPast=!e.isIntersecting&&e.boundingClientRect.bottom<0;
      sticky.classList.toggle('show',scrolledPast);
      sticky.setAttribute('aria-hidden',scrolledPast?'false':'true');
    },{threshold:0}).observe(contact);
  }
})();
