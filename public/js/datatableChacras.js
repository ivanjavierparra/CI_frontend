/*$(function () {
    
    // Hago una consulta a la api de OpenStreetMap
    $.ajax({
        url: 'http://localhost:8000/chacras',                      
        dataType: 'json',
        method: 'GET',
        async: false,
        success: function(response, status, xhr) {
            if ( response.length == 0 ){ // if(content != '' && (content) && content!='[]') {
                console.log(response);  
                 
            }
            else {
                
                console.log(response);
               
            }
        },
        error: function(jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'No estas conectado/a. Verifica la conexion.';
            } else if (jqXHR.status == 404) {
                msg = 'Pagina no encontrada. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Error interno del servidor [500].';
            } else if (exception === 'parsererror') {
                msg = 'Error de parsing.';
            } else if (exception === 'timeout') {
                msg = 'Tiempo de espera agotado.';
            } else if (exception === 'abort') {
                msg = 'Se aborto la llamada Ajax.';
            } else {
                msg = 'Error no identificado: ' + jqXHR.responseText;
            }
            console.log(msg);
        },
    });
    
    $('#tabla-chacras').DataTable({
      data : [
        ['1','1','1','1','1'],
        ['2','2','2','2','2'],
        ['3','3','3','3','3'],
        ['4','4','4','4',"<button onclick='hola()'>click</button>"],
      ],
      
    });



  });

  

  function hola() {
    $('#modal').show();
  }

  */