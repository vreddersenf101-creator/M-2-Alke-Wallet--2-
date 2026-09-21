
'use strict';
// Lección 5 - Bases JavaScript: gestionar saldo y evento Realizar depósito
$(document).ready(function(){
  const STORAGE = {saldo:'aw_saldo', transacciones:'aw_transacciones'};

  function getSaldo(){ return parseInt(localStorage.getItem(STORAGE.saldo)||'0',10); }
  function setSaldo(v){ localStorage.setItem(STORAGE.saldo, String(v)); actualizarSaldoUI(); }

  $('#depositForm').on('submit', function(e){
    e.preventDefault();
    const monto = parseInt($('#montoDeposito').val(),10);
    const metodo = $('#metodoPago').val();
    if(!monto || monto < 1000 || !metodo){
      $(this).addClass('was-validated');
      $('#depositMsg').removeClass('d-none alert-success').addClass('alert-danger').text('Complete todos los campos. Monto mínimo $1.000.');
      return;
    }
    // Simular lógica de depósito
    const nuevoSaldo = getSaldo() + monto;
    setSaldo(nuevoSaldo);

    // Guardar transacción
    const txs = JSON.parse(localStorage.getItem(STORAGE.transacciones)||'[]');
    txs.push({tipo:'Depósito', monto:monto, fecha:new Date().toLocaleString('es-CL'), detalle:`Depósito vía ${metodo}`});
    localStorage.setItem(STORAGE.transacciones, JSON.stringify(txs));

    // Feedback Lección 6 - jQuery actualización dinámica
    $('#depositMsg').removeClass('d-none alert-danger').addClass('alert-success d-flex align-items-center')
      .html('<i class="bi bi-check-circle me-2"></i> Depósito de '+ new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(monto)+' realizado con éxito. Nuevo saldo: '+ new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(nuevoSaldo));
    
    // Efecto visual
    $('.card-balance').animate({scale:'1.02'},200).animate({scale:'1'},200);
    $('#montoDeposito').val('');
    $('#metodoPago').val('');
    $(this).removeClass('was-validated');
  });
});
