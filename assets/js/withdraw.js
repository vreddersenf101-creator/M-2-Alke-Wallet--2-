'use strict';

$(document).ready(function(){
  const STORAGE = {saldo:'aw_saldo', transacciones:'aw_transacciones'};
  const formato = valor => new Intl.NumberFormat('es-CL', {style:'currency', currency:'CLP'}).format(valor);

  function getSaldo(){
    return Number(localStorage.getItem(STORAGE.saldo) || '0');
  }

  function actualizarSaldo(){
    $('#saldoActualWithdraw').text(formato(getSaldo()));
  }

  actualizarSaldo();

  $('#withdrawForm').on('submit', function(e){
    e.preventDefault();
    const monto = Number($('#montoRetiro').val());
    const metodo = $('#metodoRetiro').val();
    const mensaje = $('#withdrawMsg');
    if(!Number.isInteger(monto) || monto < 1000 || !metodo){
      mensaje.removeClass('d-none alert-success').addClass('alert-danger').text('Complete todos los campos. Monto entero mínimo $1.000.');
      return;
    }
    const saldo = getSaldo();
    if(monto > saldo){
      mensaje.removeClass('d-none alert-success').addClass('alert-danger').text(`Saldo insuficiente. Su saldo es ${formato(saldo)}.`);
      return;
    }
    const nuevoSaldo = saldo - monto;
    localStorage.setItem(STORAGE.saldo, String(nuevoSaldo));
    const txs = JSON.parse(localStorage.getItem(STORAGE.transacciones) || '[]');
    txs.push({tipo:'Retiro', monto:-monto, fecha:new Date().toLocaleString('es-CL'), detalle:`Retiro vía ${metodo}`});
    localStorage.setItem(STORAGE.transacciones, JSON.stringify(txs));
    actualizarSaldo();
    actualizarSaldoUI();
    mensaje.removeClass('d-none alert-danger').addClass('alert-success').text(`Retiro de ${formato(monto)} realizado. Nuevo saldo: ${formato(nuevoSaldo)}.`);
    this.reset();
  });
});