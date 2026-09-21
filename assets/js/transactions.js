
'use strict';
// Lección 5 - Visualización transacciones recientes + Lección 6 - Filtro dinámico con jQuery
$(document).ready(function(){
  const STORAGE = {transacciones:'aw_transacciones'};
  function getTxs(){ return JSON.parse(localStorage.getItem(STORAGE.transacciones)||'[]'); }

  function renderTabla(filtro=''){
    const tbody = $('#tablaTransacciones');
    tbody.empty();
    let txs = getTxs().slice().reverse();
    if(filtro){
      const q = filtro.toLowerCase();
      txs = txs.filter(t=> (t.tipo+' '+t.detalle).toLowerCase().includes(q));
    }
    let ingresos=0, egresos=0;
    getTxs().forEach(t=>{ if(t.monto>0) ingresos+=t.monto; else egresos+=Math.abs(t.monto); });

    txs.forEach(t=>{
      const claseMonto = t.monto>0?'text-success':'text-danger';
      const icono = t.monto>0?'<i class="bi bi-arrow-down-left text-success"></i>':'<i class="bi bi-arrow-up-right text-danger"></i>';
      const tr = `<tr><td><small>${escapeHtml(t.fecha)}</small></td><td>${icono} ${escapeHtml(t.tipo)}</td><td>${escapeHtml(t.detalle)}</td><td class="text-end fw-bold ${claseMonto}">${new Intl.NumberFormat('es-CL').format(t.monto)}</td></tr>`;
      tbody.append(tr);
    });

    $('#totalMovimientos').text(txs.length+' movimientos');
    $('#totalIngresos').text(new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(ingresos));
    $('#totalEgresos').text(new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(egresos));
    $('#balanceNeto').text(new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(ingresos-egresos));
  }

  renderTabla();

  // Filtro Lección 6 - actualización dinámica
  $('#filtroTransacciones').on('input', function(){
    const q = $(this).val();
    renderTabla(q);
    $('#tablaTransacciones').hide().fadeIn(200);
  });
});
