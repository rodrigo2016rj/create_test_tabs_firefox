browser.runtime.onMessage.addListener(function(objeto_mensagem){
  var campos = objeto_mensagem.campos;
  for(var i = 0; i < campos.length; i++){
    var campo = document.querySelector("[name='" + campos[i].name + "']");
    if(campo === null){
      continue;
    }
    
    var nome_da_tag = campo.tagName.toLowerCase();
    if(nome_da_tag === "select"){
      campo.value = campos[i].value;
      campo.dispatchEvent(new Event("change"));
    }else if(nome_da_tag === "input"){
      var tipo_do_input = campo.getAttribute("type");
      switch(tipo_do_input){
        case "radio":
          var botao_de_radio = document.querySelector("input[name='" + campos[i].name + "'][value='" + campos[i].value + "']");
          if(botao_de_radio === null){
            continue;
          }
          botao_de_radio.click();
        break;
        case "checkbox":
          campo.click();
        break;
        default:
          campo.value = campos[i].value;
          campo.dispatchEvent(new Event("input"));
        break;
      }
    }
  }
  
  var objeto_resposta = {};
  objeto_resposta.id_da_aba = objeto_mensagem.id_da_aba;
  return Promise.resolve(objeto_resposta);
});
