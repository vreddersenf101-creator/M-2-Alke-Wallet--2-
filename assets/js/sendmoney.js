
'use strict';
// Lección 5 - Función simular transferencia + Lección 6 - Autocompletar contactos con jQuery
$(document).ready(function(){
  const STORAGE = {saldo:'aw_saldo', transacciones:'aw_transacciones', contactos:'aw_contactos'};
  function getSaldo(){ return parseInt(localStorage.getItem(STORAGE.saldo)||'0',10); }
  function setSaldo(v){ localStorage.setItem(STORAGE.saldo, String(v)); actualizarSaldoUI(); }
  function getContactos(){ return JSON.parse(localStorage.getItem(STORAGE.contactos)||'[]'); }

  function renderContactos(){
    const lista = $('#listaContactos');
    lista.empty();
    const contactos = getContactos();
    contactos.forEach(c=>{
      const item = $(`<a href="#" class="list-group-item list-group-item-action d-flex justify-content-between"><div><strong>${escapeHtml(c.nombre)}</strong><br><small class="text-muted">${escapeHtml(c.cuenta)}</small></div><i class="bi bi-chevron-right"></i></a>`);
      item.on('click', function(e){ e.preventDefault(); $('#buscarContacto').val(c.nombre); $('#cuentaDestino').val(c.cuenta); $('#sugerenciasContactos').addClass('d-none'); });
      lista.append(item);
    });
    const saldo = getSaldo();
    $('#saldoActualSend').text(new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(saldo));
  }

  renderContactos();

  // Autocompletar Lección 6
  $('#buscarContacto').on('input', function(){
    const q = $(this).val().toLowerCase();
    $('#cuentaDestino').val('');
    const suger = $('#sugerenciasContactos');
    if(!q){ suger.addClass('d-none'); return; }
    const filtrados = getContactos().filter(c=>c.nombre.toLowerCase().includes(q) || c.cuenta.toLowerCase().includes(q));
    suger.empty();
    if(filtrados.length===0){ suger.addClass('d-none'); return; }
    filtrados.forEach(c=>{
      const opt = $(`<button type="button" class="list-group-item list-group-item-action"><strong>${escapeHtml(c.nombre)}</strong> - <small>${escapeHtml(c.cuenta)}</small></button>`);
      opt.on('click', function(){ $('#buscarContacto').val(c.nombre); $('#cuentaDestino').val(c.cuenta); suger.addClass('d-none'); });
      suger.append(opt);
    });
    suger.removeClass('d-none');
  });

  // Cerrar sugerencias al hacer click fuera
  $(document).on('click', function(e){ if(!$(e.target).closest('#buscarContacto, #sugerenciasContactos').length){ $('#sugerenciasContactos').addClass('d-none'); } });

  // Agregar nuevo contacto - Evento Lección 5 y 6
  $('#btnAgregarContacto').on('click', function(){
    const nombre = $('#nuevoNombre').val().trim();
    const cuenta = $('#nuevaCuenta').val().trim();
    if(!nombre || !cuenta) return;
    const contactos = getContactos();
    contactos.push({nombre, cuenta});
    localStorage.setItem(STORAGE.contactos, JSON.stringify(contactos));
    renderContactos();
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevoContacto')).hide();
    $('#formNuevoContacto')[0].reset();
    // Toast jQuery
    const toast = $('<div class="position-fixed bottom-0 end-0 p-3" style="z-index:1080"><div class="toast show bg-primary text-white"><div class="toast-body">Contacto '+nombre+' agregado correctamente</div></div></div>');
    $('body').append(toast);
    setTimeout(()=>toast.fadeOut(400, function(){ $(this).remove(); }), 2500);
  });

  // Enviar dinero - validación y simulación transferencia Lección 5
  $('#sendMoneyForm').on('submit', function(e){
    e.preventDefault();
    const contactoNombre = $('#buscarContacto').val().trim();
    const cuenta = $('#cuentaDestino').val().trim();
    const monto = parseInt($('#montoEnvio').val(),10);
    const motivo = $('#motivoEnvio').val().trim();

    const contactoValido = getContactos().some(c=>c.nombre === contactoNombre && c.cuenta === cuenta);
    if(!contactoValido || !monto || monto<1000 || !motivo){
      $(this).addClass('was-validated');
      $('#sendMsg').removeClass('d-none alert-success').addClass('alert-danger').text('Complete todos los campos. Monto mínimo $1.000.');
      return;
    }
    if(monto > getSaldo()){
      $('#sendMsg').removeClass('d-none alert-success').addClass('alert-danger').text('Saldo insuficiente. Su saldo es '+ new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(getSaldo()));
      return;
    }

    // Descontar saldo
    const nuevoSaldo = getSaldo() - monto;
    setSaldo(nuevoSaldo);

    // Guardar transacción
    const txs = JSON.parse(localStorage.getItem(STORAGE.transacciones)||'[]');
    txs.push({tipo:'Envío', monto:-monto, fecha:new Date().toLocaleString('es-CL'), detalle:`Envío a ${contactoNombre} - ${motivo}`});
    localStorage.setItem(STORAGE.transacciones, JSON.stringify(txs));

    // Mensaje dinámico Lección 6
    $('#sendMsg').removeClass('d-none alert-danger').addClass('alert-success')
      .html('<i class="bi bi-check2-circle me-2"></i>Transferencia de '+ new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(monto)+' a '+contactoNombre+' realizada. Nuevo saldo: '+ new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(nuevoSaldo));

    // Animación
    $('#saldoActualSend').fadeOut(200).fadeIn(400);
    $(this).removeClass('was-validated');
    $('#montoEnvio').val('');
    $('#motivoEnvio').val('');
  });
});
