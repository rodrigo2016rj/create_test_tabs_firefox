browser.runtime.onMessage.addListener(function(objeto_mensagem){
  var campos = objeto_mensagem.campos;
  for(var i = 0; i < campos.length; i++){
    var campo = document.querySelector("[name='" + campos[i].name + "']");
    if(campo === null){
      continue;
    }
    campo.value = campos[i].value;
  }
  
  var objeto_resposta = {};
  objeto_resposta.id_da_aba = objeto_mensagem.id_da_aba;
  return Promise.resolve(objeto_resposta);
});
