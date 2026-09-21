// Alke Wallet - app.js - Lección 1 y 5
'use strict';

const STORAGE_KEYS = {
  saldo: 'aw_saldo',
  transacciones: 'aw_transacciones',
  contactos: 'aw_contactos',
  usuario: 'aw_usuario'
};

const DEMO_CREDENTIALS = {
  email: 'frida@alkewallet.cl',
  password: '123456'
};

const PROTECTED_PAGES = ['menu.html', 'deposit.html', 'withdraw.html', 'sendmoney.html', 'transactions.html'];

// Inicialización
$(document).ready(function(){
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  if(PROTECTED_PAGES.includes(paginaActual) && !localStorage.getItem(STORAGE_KEYS.usuario)){
    window.location.href = 'login.html';
    return;
  }

  // Saldo inicial
  if(!localStorage.getItem(STORAGE_KEYS.saldo)){
    localStorage.setItem(STORAGE_KEYS.saldo, '1250000');
  }
  // Transacciones iniciales
  if(!localStorage.getItem(STORAGE_KEYS.transacciones)){
    const iniciales = [
      {tipo:'Depósito', monto:1250000, fecha: new Date().toLocaleDateString(), detalle:'Depósito inicial'},
      {tipo:'Envío', monto:-75000, fecha: new Date().toLocaleDateString(), detalle:'Transferencia a Juan Pérez'},
      {tipo:'Recepción', monto:75000, fecha: new Date().toLocaleDateString(), detalle:'Recepción de Ana López'}
    ];
    localStorage.setItem(STORAGE_KEYS.transacciones, JSON.stringify(iniciales));
  }
  // Contactos iniciales
  if(!localStorage.getItem(STORAGE_KEYS.contactos)){
    const contactos = [{nombre:'Juan Pérez', cuenta:'juan.perez@alke'}, {nombre:'Ana López', cuenta:'ana.lopez@alke'}, {nombre:'Carlos Ruiz', cuenta:'carlos.ruiz@alke'}];
    localStorage.setItem(STORAGE_KEYS.contactos, JSON.stringify(contactos));
  }

  actualizarSaldoUI();
  renderUltimosMovimientos();
  renderResumen();
  $('#userName').text(localStorage.getItem(STORAGE_KEYS.usuario)?.split('@')[0] || 'Usuario');

  // Login - validación Lección 5
  $('#loginForm').on('submit', function(e){
    e.preventDefault();
    const email = $('#email').val().trim();
    const pass = $('#password').val().trim();
    if(email !== DEMO_CREDENTIALS.email || pass !== DEMO_CREDENTIALS.password){
      $(this).addClass('was-validated');
      $('#loginAlert').removeClass('d-none').text('Credenciales inválidas. Use frida@alkewallet.cl y 123456 para la demo.');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.usuario, email);
    // Simular validación exitosa
    window.location.href = 'menu.html';
  });

  $('#logoutBtn').on('click', function(e){
    e.preventDefault();
    localStorage.removeItem(STORAGE_KEYS.usuario);
    window.location.href = 'login.html';
  });

  $('#receiveForm').on('submit', function(e){
    e.preventDefault();
    const origen = $('#origenRecepcion').val().trim();
    const monto = Number($('#montoRecepcion').val());
    const mensaje = $('#receiveMsg');
    if(!origen || !Number.isInteger(monto) || monto < 1000){
      mensaje.removeClass('d-none alert-success').addClass('alert-danger').text('Ingrese un origen y un monto entero mínimo de $1.000.');
      return;
    }
    const nuevoSaldo = Number(localStorage.getItem(STORAGE_KEYS.saldo) || '0') + monto;
    localStorage.setItem(STORAGE_KEYS.saldo, String(nuevoSaldo));
    const txs = JSON.parse(localStorage.getItem(STORAGE_KEYS.transacciones) || '[]');
    txs.push({tipo:'Recepción', monto, fecha:new Date().toLocaleString('es-CL'), detalle:`Fondos recibidos de ${origen}`});
    localStorage.setItem(STORAGE_KEYS.transacciones, JSON.stringify(txs));
    actualizarSaldoUI();
    renderResumen();
    renderUltimosMovimientos();
    bootstrap.Modal.getOrCreateInstance(document.getElementById('receiveModal')).hide();
    this.reset();
  });

  // Guardar contacto modal
  $('#guardarContacto').on('click', function(){
    const nombre = $('#formContacto input').eq(0).val();
    const cuenta = $('#formContacto input').eq(1).val();
    if(nombre && cuenta){
      const contactos = JSON.parse(localStorage.getItem(STORAGE_KEYS.contactos) || '[]');
      contactos.push({nombre, cuenta});
      localStorage.setItem(STORAGE_KEYS.contactos, JSON.stringify(contactos));
      // efecto visual jQuery Lección 6
      bootstrap.Modal.getOrCreateInstance(document.getElementById('contactModal')).hide();
      $('body').append('<div class="position-fixed bottom-0 end-0 p-3"><div class="toast show bg-success text-white"><div class="toast-body">Contacto '+nombre+' agregado</div></div></div>');
      setTimeout(()=>$('.toast').fadeOut(), 2500);
    }
  });

  // Animaciones menu Lección 6
  $('.card').hide().fadeIn(600);
});

function actualizarSaldoUI(){
  const saldo = parseInt(localStorage.getItem(STORAGE_KEYS.saldo) || '0', 10);
  const formateado = new Intl.NumberFormat('es-CL', {style:'currency', currency:'CLP'}).format(saldo);
  $('#saldoActual').text(formateado);
  $('#saldoActualDeposit').text(formateado);
}

function renderResumen(){
  const txs = JSON.parse(localStorage.getItem(STORAGE_KEYS.transacciones) || '[]');
  const ingresos = txs.reduce((total, tx) => tx.monto > 0 ? total + tx.monto : total, 0);
  const egresos = txs.reduce((total, tx) => tx.monto < 0 ? total + Math.abs(tx.monto) : total, 0);
  const formato = valor => new Intl.NumberFormat('es-CL', {style:'currency', currency:'CLP'}).format(valor);
  $('#totalIngresosMenu').text(formato(ingresos));
  $('#totalEgresosMenu').text(formato(egresos));
}

function escapeHtml(value){
  return $('<div>').text(value == null ? '' : String(value)).html();
}

function renderUltimosMovimientos(){
  const cont = $('#ultimosMovimientos, #listaTransacciones');
  if(!cont.length) return;
  const txs = JSON.parse(localStorage.getItem(STORAGE_KEYS.transacciones) || '[]');
  cont.empty();
  txs.slice().reverse().slice(0,5).forEach(t=>{
    const clase = t.monto>0?'text-success':'text-danger';
    const signo = t.monto>0?'+':'';
    const html = `<div class="list-group-item d-flex justify-content-between align-items-center">
      <div><strong>${escapeHtml(t.tipo)}</strong><br><small class="text-muted">${escapeHtml(t.detalle)} - ${escapeHtml(t.fecha)}</small></div>
      <span class="fw-bold ${clase}">${signo}${new Intl.NumberFormat('es-CL').format(t.monto)}</span>
    </div>`;
    cont.append(html);
  });
}
