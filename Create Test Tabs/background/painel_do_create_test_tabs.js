window.addEventListener("load", function(){
  /* Definindo alguns valores */
  var frase_ocultar_instrucoes = "▼ Instructions:";
  var frase_expandir_instrucoes = "► Instructions:";
  var frase_ocultar_opcoes = "▼ ▼ ▼ Hide options ▼ ▼ ▼";
  var frase_expandir_opcoes = "► ► ► Expand options ◄ ◄ ◄";
  
  /* Comportamento do span_expandir_instrucoes */
  var span_expandir_instrucoes = document.getElementById("span_expandir_instrucoes");
  var div_conteudo_das_instrucoes = document.getElementById("div_conteudo_das_instrucoes");
  
  span_expandir_instrucoes.innerText = frase_ocultar_instrucoes;
  
  span_expandir_instrucoes.addEventListener("click", function(){
    if(div_conteudo_das_instrucoes.classList.contains("instrucoes_encolhidas")){
      div_conteudo_das_instrucoes.classList.remove("instrucoes_encolhidas");
      div_conteudo_das_instrucoes.classList.add("instrucoes_expandidas");
      span_expandir_instrucoes.innerText = frase_ocultar_instrucoes;
    }else{
      div_conteudo_das_instrucoes.classList.remove("instrucoes_expandidas");
      div_conteudo_das_instrucoes.classList.add("instrucoes_encolhidas");
      setTimeout(function(){
        span_expandir_instrucoes.innerText = frase_expandir_instrucoes;
      }, 350);
    }
  });
  
  /* Recuperando as páginas que já haviam sido registradas */
  var paginas_registradas = null;
  var peguei_paginas_registradas = browser.storage.local.get("paginas_registradas");
  
  peguei_paginas_registradas.then(function(valor){
    paginas_registradas = valor.paginas_registradas;
    
    if(Array.isArray(paginas_registradas)){
      atualizar_lista_de_paginas(paginas_registradas);
    }else{
      paginas_registradas = Array();
      browser.storage.local.set({paginas_registradas: paginas_registradas});
    }
  });
  
  peguei_paginas_registradas.catch(function(erro){
    console.error("Create Test Tabs - " + erro);
  });
  
  /* Comportamento do formulário que registra uma página */
  var span_mensagem_do_campo_nome_da_pagina = document.getElementById("span_mensagem_do_campo_nome_da_pagina");
  var campo_nome_da_pagina = document.getElementById("campo_nome_da_pagina");
  var botao_registrar_pagina = document.getElementById("botao_registrar_pagina");
  var span_mensagem_do_campo_endereco_da_pagina = document.getElementById("span_mensagem_do_campo_endereco_da_pagina");
  var campo_endereco_da_pagina = document.getElementById("campo_endereco_da_pagina");
  
  var backup_do_nome_da_pagina = "";
  var backup_do_endereco_da_pagina = "";
  
  campo_nome_da_pagina.addEventListener("keyup", function(){
    if(campo_nome_da_pagina.value !== backup_do_nome_da_pagina){
      span_mensagem_do_campo_nome_da_pagina.classList.add("tag_oculta");
      backup_do_nome_da_pagina = campo_nome_da_pagina.value;
    }
  });
  campo_endereco_da_pagina.addEventListener("keyup", function(){
    if(campo_endereco_da_pagina.value !== backup_do_endereco_da_pagina){
      span_mensagem_do_campo_endereco_da_pagina.classList.add("tag_oculta");
      backup_do_endereco_da_pagina = campo_endereco_da_pagina.value;
    }
  });
  
  botao_registrar_pagina.addEventListener("click", function(){
    span_mensagem_do_campo_nome_da_pagina.classList.add("tag_oculta");
    span_mensagem_do_campo_endereco_da_pagina.classList.add("tag_oculta");
    
    var quantidade_de_campos_vazios = 0;
    
    var nome_da_pagina = campo_nome_da_pagina.value.trim();
    campo_nome_da_pagina.value = nome_da_pagina;
    if(nome_da_pagina === ""){
      span_mensagem_do_campo_nome_da_pagina.classList.remove("tag_oculta");
      span_mensagem_do_campo_nome_da_pagina.innerText = "Required";
      quantidade_de_campos_vazios++;
    }
    
    var endereco_da_pagina = campo_endereco_da_pagina.value.trim();
    campo_endereco_da_pagina.value = endereco_da_pagina;
    if(endereco_da_pagina === ""){
      span_mensagem_do_campo_endereco_da_pagina.classList.remove("tag_oculta");
      span_mensagem_do_campo_endereco_da_pagina.innerText = "Required";
      quantidade_de_campos_vazios++;
    }
    
    if(quantidade_de_campos_vazios > 0){
      return;
    }
    
    if(paginas_registradas === null){
      return;
    }
    
    var quantidade_de_informacao_repetida = 0;
    for(var i = 0; i < paginas_registradas.length; i++){
      if(nome_da_pagina.toLowerCase() === paginas_registradas[i].nome.toLowerCase()){
        span_mensagem_do_campo_nome_da_pagina.classList.remove("tag_oculta");
        span_mensagem_do_campo_nome_da_pagina.innerText = "This name has already been registered";
        quantidade_de_informacao_repetida++;
      }
      
      if(endereco_da_pagina.toLowerCase() === paginas_registradas[i].endereco.toLowerCase()){
        span_mensagem_do_campo_endereco_da_pagina.classList.remove("tag_oculta");
        span_mensagem_do_campo_endereco_da_pagina.innerText = "This url has already been registered";
        quantidade_de_informacao_repetida++;
      }
      
      if(quantidade_de_informacao_repetida == 2){
        break;
      }
    }
    
    if(quantidade_de_informacao_repetida > 0){
      return;
    }
    
    if(nome_da_pagina.length > 36){
      span_mensagem_do_campo_nome_da_pagina.classList.remove("tag_oculta");
      span_mensagem_do_campo_nome_da_pagina.innerText = "Max length 36 chars, you typed " + nome_da_pagina.length;
      return;
    }
    
    if(endereco_da_pagina.length > 600){
      span_mensagem_do_campo_endereco_da_pagina.classList.remove("tag_oculta");
      span_mensagem_do_campo_endereco_da_pagina.innerText = "Max length 600 chars, you typed " + endereco_da_pagina.length;
      return;
    }
    
    var pagina = {};
    pagina.nome = nome_da_pagina;
    pagina.endereco = endereco_da_pagina;
    pagina.lista_de_combinacoes = Array();
    pagina.expandir_opcoes = false;
    paginas_registradas.push(pagina);
    browser.storage.local.set({paginas_registradas: paginas_registradas});
    atualizar_lista_de_paginas(paginas_registradas);
  });
  
  /* Comportamento dos popups */
  var popups = document.getElementsByClassName("popup");
  var div_popup = document.getElementById("div_popup");
  var div_texto_do_popup = document.getElementById("div_texto_do_popup");
  var botao_ok_do_popup = document.getElementById("botao_ok_do_popup");
  
  var div_popup_editar_pagina_registrada = document.getElementById("div_popup_editar_pagina_registrada");
  var span_mensagem_do_campo_nome_da_pagina_registrada = document.getElementById("span_mensagem_do_campo_nome_da_pagina_registrada");
  var campo_nome_da_pagina_registrada = document.getElementById("campo_nome_da_pagina_registrada");
  var botao_editar_pagina_registrada = document.getElementById("botao_editar_pagina_registrada");
  var span_mensagem_do_campo_endereco_da_pagina_registrada = document.getElementById("span_mensagem_do_campo_endereco_da_pagina_registrada");
  var campo_endereco_da_pagina_registrada = document.getElementById("campo_endereco_da_pagina_registrada");
  
  var numero_da_pagina_registrada_para_editar = null;
  var backup_do_nome_da_pagina_registrada_para_editar = "";
  var backup_do_endereco_da_pagina_registrada_para_editar = "";
  
  campo_nome_da_pagina_registrada.addEventListener("keyup", function(){
    if(campo_nome_da_pagina_registrada.value !== backup_do_nome_da_pagina_registrada_para_editar){
      span_mensagem_do_campo_nome_da_pagina_registrada.classList.add("tag_oculta");
      backup_do_nome_da_pagina_registrada_para_editar = campo_nome_da_pagina_registrada.value;
    }
  });
  campo_endereco_da_pagina_registrada.addEventListener("keyup", function(){
    if(campo_endereco_da_pagina_registrada.value !== backup_do_endereco_da_pagina_registrada_para_editar){
      span_mensagem_do_campo_endereco_da_pagina_registrada.classList.add("tag_oculta");
      backup_do_endereco_da_pagina_registrada_para_editar = campo_endereco_da_pagina_registrada.value;
    }
  });
  
  var ocultar_popup = true;
  
  for(var i = 0; i < popups.length; i++){
    popups[i].addEventListener("click", function(){
      ocultar_popup = false;
    });
  }
  
  botao_ok_do_popup.addEventListener("click", function(evento){
    evento.stopPropagation();
    div_popup.classList.add("tag_oculta");
    ocultar_popup = true;
  });
  
  botao_editar_pagina_registrada.addEventListener("click", function(evento){
    evento.stopPropagation();
    
    if(paginas_registradas === null){
      return;
    }
    
    var pagina_registrada = paginas_registradas[numero_da_pagina_registrada_para_editar];
    
    var quantidade_de_campos_vazios = 0;
    
    var nome_da_pagina_registrada = campo_nome_da_pagina_registrada.value.trim();
    campo_nome_da_pagina_registrada.value = nome_da_pagina_registrada;
    if(nome_da_pagina_registrada === ""){
      span_mensagem_do_campo_nome_da_pagina_registrada.classList.remove("tag_oculta");
      span_mensagem_do_campo_nome_da_pagina_registrada.innerText = "Required";
      quantidade_de_campos_vazios++;
    }
    
    var endereco_da_pagina_registrada = campo_endereco_da_pagina_registrada.value.trim();
    campo_endereco_da_pagina_registrada.value = endereco_da_pagina_registrada;
    if(endereco_da_pagina_registrada === ""){
      span_mensagem_do_campo_endereco_da_pagina_registrada.classList.remove("tag_oculta");
      span_mensagem_do_campo_endereco_da_pagina_registrada.innerText = "Required";
      quantidade_de_campos_vazios++;
    }
    
    if(quantidade_de_campos_vazios > 0){
      return;
    }
    
    var quantidade_de_informacao_repetida = 0;
    for(var i = 0; i < paginas_registradas.length; i++){
      if(nome_da_pagina_registrada.toLowerCase() === paginas_registradas[i].nome.toLowerCase()
         && i !== numero_da_pagina_registrada_para_editar){
        span_mensagem_do_campo_nome_da_pagina_registrada.classList.remove("tag_oculta");
        span_mensagem_do_campo_nome_da_pagina_registrada.innerText = "This name has already been registered";
        quantidade_de_informacao_repetida++;
      }
      
      if(endereco_da_pagina_registrada.toLowerCase() === paginas_registradas[i].endereco.toLowerCase()
         && i !== numero_da_pagina_registrada_para_editar){
        span_mensagem_do_campo_endereco_da_pagina_registrada.classList.remove("tag_oculta");
        span_mensagem_do_campo_endereco_da_pagina_registrada.innerText = "This url has already been registered";
        quantidade_de_informacao_repetida++;
      }
      
      if(quantidade_de_informacao_repetida == 2){
        break;
      }
    }
    
    if(quantidade_de_informacao_repetida > 0){
      return;
    }
    
    if(nome_da_pagina_registrada.length > 36){
      span_mensagem_do_campo_nome_da_pagina_registrada.classList.remove("tag_oculta");
      span_mensagem_do_campo_nome_da_pagina_registrada.innerText = "Max length 36 chars, you typed " + nome_da_pagina_registrada.length;
      return;
    }
    
    if(endereco_da_pagina_registrada.length > 600){
      span_mensagem_do_campo_endereco_da_pagina_registrada.classList.remove("tag_oculta");
      span_mensagem_do_campo_endereco_da_pagina_registrada.innerText = "Max length 600 chars, you typed " + endereco_da_pagina_registrada.length;
      return;
    }
    
    pagina_registrada.nome = nome_da_pagina_registrada;
    pagina_registrada.endereco = endereco_da_pagina_registrada;
    
    backup_do_nome_da_pagina_registrada_para_editar = nome_da_pagina_registrada;
    backup_do_endereco_da_pagina_registrada_para_editar = endereco_da_pagina_registrada;
    
    browser.storage.local.set({paginas_registradas: paginas_registradas});
    atualizar_lista_de_paginas(paginas_registradas);
    
    div_popup_editar_pagina_registrada.classList.add("tag_oculta");
    ocultar_popup = true;
  });
  
  document.addEventListener("click", function(){
    if(ocultar_popup){
      ocultar_todos_os_popups();
    }else{
      ocultar_popup = true;
    }
  });
  
  function ocultar_todos_os_popups(){
    ocultar_popup = true;
    for(var i = 0; i < popups.length; i++){
      popups[i].classList.add("tag_oculta");
    }
  }
  
  /* Comportamento da lista de páginas registradas */
  var div_modelo_pagina_registrada = document.getElementById("div_modelo_pagina_registrada");
  var span_modelo_nome_da_pagina = document.getElementById("span_modelo_nome_da_pagina");
  var link_modelo_endereco_da_pagina = document.getElementById("link_modelo_endereco_da_pagina");
  var div_modelo_combinacao = document.getElementById("div_modelo_combinacao");
  var div_modelo_campo_adicionado = document.getElementById("div_modelo_campo_adicionado");
  var div_lista_de_paginas = document.getElementById("div_lista_de_paginas");
  
  function atualizar_lista_de_paginas(paginas_registradas){
    div_lista_de_paginas.innerHTML = "";
    if(paginas_registradas.length == 0){
      div_lista_de_paginas.style.marginTop = "0px";
    }else{
      div_lista_de_paginas.style.marginTop = "20px";
    }
    
    for(var i = paginas_registradas.length - 1; i > -1; i--){
      span_modelo_nome_da_pagina.innerText = paginas_registradas[i].nome;
      link_modelo_endereco_da_pagina.innerText = paginas_registradas[i].endereco;
      link_modelo_endereco_da_pagina.setAttribute("href", paginas_registradas[i].endereco);
      
      var novo_elemento = div_modelo_pagina_registrada.cloneNode(true);
      novo_elemento.id = novo_elemento.id.replace("modelo_", "") + "_" + i;
      novo_elemento.classList.remove("tag_oculta");
      
      var tags_do_novo_elemento = novo_elemento.querySelectorAll("*");
      for(var j = 0; j < tags_do_novo_elemento.length; j++){
        if(tags_do_novo_elemento[j].id === "botao_modelo_remover_pagina"){
          tags_do_novo_elemento[j].removeEventListener("click", remover_pagina_registrada);
          tags_do_novo_elemento[j].addEventListener("click", remover_pagina_registrada);
        }else if(tags_do_novo_elemento[j].id === "botao_modelo_create_test_tabs"){
          tags_do_novo_elemento[j].removeEventListener("click", create_test_tabs);
          tags_do_novo_elemento[j].addEventListener("click", create_test_tabs);
        }else if(tags_do_novo_elemento[j].id === "botao_modelo_expandir_opcoes_da_pagina"){
          if(paginas_registradas[i].expandir_opcoes){
            tags_do_novo_elemento[j].innerText = frase_ocultar_opcoes;
          }else{
            tags_do_novo_elemento[j].innerText = frase_expandir_opcoes;
          }
          tags_do_novo_elemento[j].removeEventListener("click", expandir_ou_ocultar_opcoes_da_pagina);
          tags_do_novo_elemento[j].addEventListener("click", expandir_ou_ocultar_opcoes_da_pagina);
        }else if(tags_do_novo_elemento[j].id === "div_modelo_opcoes_da_pagina_mais_lista_de_combinacoes" && paginas_registradas[i].expandir_opcoes){
          tags_do_novo_elemento[j].classList.remove("tag_oculta");
        }else if(tags_do_novo_elemento[j].id === "botao_modelo_editar_pagina"){
          tags_do_novo_elemento[j].removeEventListener("click", mostrar_popup_editar_pagina);
          tags_do_novo_elemento[j].addEventListener("click", mostrar_popup_editar_pagina);
        }else if(tags_do_novo_elemento[j].id === "botao_modelo_criar_combinacao"){
          tags_do_novo_elemento[j].removeEventListener("click", criar_combinacao);
          tags_do_novo_elemento[j].addEventListener("click", criar_combinacao);
        }else if(tags_do_novo_elemento[j].id === "div_modelo_lista_de_combinacoes"){
          var lista_de_combinacoes = paginas_registradas[i].lista_de_combinacoes;
          
          if(lista_de_combinacoes.length == 0){
            tags_do_novo_elemento[j].style.marginTop = "0px";
          }else{
            tags_do_novo_elemento[j].style.marginTop = "10px";
          }
          
          for(var k = lista_de_combinacoes.length - 1; k > -1; k--){
            var numero_da_combinacao = k + 1;
            var nome_da_combinacao = "Combination " + numero_da_combinacao;
            
            var novo_elemento_combinacao = div_modelo_combinacao.cloneNode(true);
            novo_elemento_combinacao.id = novo_elemento_combinacao.id.replace("modelo_", "") + "_" + i + "_" + k;
            novo_elemento_combinacao.classList.remove("tag_oculta");
            
            var tags_do_novo_elemento_combinacao = novo_elemento_combinacao.querySelectorAll("*");
            for(var l = 0; l < tags_do_novo_elemento_combinacao.length; l++){
              if(tags_do_novo_elemento_combinacao[l].id === "span_modelo_nome_da_combinacao"){
                tags_do_novo_elemento_combinacao[l].innerText = nome_da_combinacao;
              }else if(tags_do_novo_elemento_combinacao[l].id === "botao_modelo_remover_combinacao"){
                tags_do_novo_elemento_combinacao[l].removeEventListener("click", remover_combinacao);
                tags_do_novo_elemento_combinacao[l].addEventListener("click", remover_combinacao);
              }else if(tags_do_novo_elemento_combinacao[l].id === "label_modelo_name_da_entrada"){
                var alvo_do_label = tags_do_novo_elemento_combinacao[l].getAttribute("for");
                alvo_do_label = alvo_do_label.replace("modelo_", "") + "_" + i + "_" + k;
                tags_do_novo_elemento_combinacao[l].setAttribute("for", alvo_do_label);
              }else if(tags_do_novo_elemento_combinacao[l].id === "campo_modelo_name_da_entrada"){
                tags_do_novo_elemento_combinacao[l].removeEventListener("keyup", apagar_mensagem_do_campo_name_da_entrada);
                tags_do_novo_elemento_combinacao[l].addEventListener("keyup", apagar_mensagem_do_campo_name_da_entrada);
              }else if(tags_do_novo_elemento_combinacao[l].id === "label_modelo_value_da_entrada"){
                var alvo_do_label = tags_do_novo_elemento_combinacao[l].getAttribute("for");
                alvo_do_label = alvo_do_label.replace("modelo_", "") + "_" + i + "_" + k;
                tags_do_novo_elemento_combinacao[l].setAttribute("for", alvo_do_label);
              }else if(tags_do_novo_elemento_combinacao[l].id === "campo_modelo_value_da_entrada"){
                tags_do_novo_elemento_combinacao[l].removeEventListener("keyup", apagar_mensagem_do_campo_value_da_entrada);
                tags_do_novo_elemento_combinacao[l].addEventListener("keyup", apagar_mensagem_do_campo_value_da_entrada);
              }else if(tags_do_novo_elemento_combinacao[l].id === "botao_modelo_adicionar_name_e_value"){
                tags_do_novo_elemento_combinacao[l].removeEventListener("click", adicionar_entrada_de_formulario);
                tags_do_novo_elemento_combinacao[l].addEventListener("click", adicionar_entrada_de_formulario);
              }else if(tags_do_novo_elemento_combinacao[l].id === "div_modelo_lista_de_campos_adicionados"){
                var lista_de_entradas_de_formulario = paginas_registradas[i].lista_de_combinacoes[k].lista_de_entradas_de_formulario;
                
                if(lista_de_entradas_de_formulario.length == 0){
                  tags_do_novo_elemento_combinacao[l].innerHTML = "None.";
                }
                
                for(var m = lista_de_entradas_de_formulario.length - 1; m > -1; m--){
                  var novo_elemento_entrada = div_modelo_campo_adicionado.cloneNode(true);
                  novo_elemento_entrada.id = novo_elemento_entrada.id.replace("modelo_", "") + "_" + i + "_" + k + "_" + m;
                  novo_elemento_entrada.classList.remove("tag_oculta");
                  
                  var tags_do_novo_elemento_entrada = novo_elemento_entrada.querySelectorAll("*");
                  for(var n = 0; n < tags_do_novo_elemento_entrada.length; n++){
                    if(tags_do_novo_elemento_entrada[n].id === "span_modelo_valor_do_name_do_campo_adicionado"){
                      tags_do_novo_elemento_entrada[n].innerText = lista_de_entradas_de_formulario[m].name;
                    }else if(tags_do_novo_elemento_entrada[n].id === "span_modelo_valor_do_value_do_campo_adicionado"){
                      tags_do_novo_elemento_entrada[n].innerText = lista_de_entradas_de_formulario[m].value;
                    }
                    
                    if(tags_do_novo_elemento_entrada[n].hasAttribute("id")){
                      tags_do_novo_elemento_entrada[n].id = tags_do_novo_elemento_entrada[n].id.replace("modelo_", "") + "_" + i + "_" + k + "_" + m;
                    }
                  }
                  tags_do_novo_elemento_combinacao[l].appendChild(novo_elemento_entrada);
                }
              }
              
              if(tags_do_novo_elemento_combinacao[l].hasAttribute("id")){
                tags_do_novo_elemento_combinacao[l].id = tags_do_novo_elemento_combinacao[l].id.replace("modelo_", "") + "_" + i + "_" + k;
              }
            }
            
            tags_do_novo_elemento[j].appendChild(novo_elemento_combinacao);
          }
        }
        
        if(tags_do_novo_elemento[j].hasAttribute("id")){
          tags_do_novo_elemento[j].id = tags_do_novo_elemento[j].id.replace("modelo_", "") + "_" + i;
        }
      }
      
      div_lista_de_paginas.appendChild(novo_elemento);
      
      span_modelo_nome_da_pagina.innerText = "";
      link_modelo_endereco_da_pagina.innerText = "";
      link_modelo_endereco_da_pagina.removeAttribute("href");
    }
  }
  
  function remover_pagina_registrada(evento){
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicao_no_array = id_desta_tag.replace("botao_remover_pagina_", "");
    posicao_no_array = parseInt(posicao_no_array, 10);
    
    paginas_registradas.splice(posicao_no_array, 1);
    browser.storage.local.set({paginas_registradas: paginas_registradas});
    atualizar_lista_de_paginas(paginas_registradas);
  }
  
  var contador = 0;
  var array_mensagens_das_abas = Array();
  var array_ids_das_abas_que_ja_receberam = Array();
  var endereco_alvo = "";
  var tentativa_com_disparo_de_evento_update = 0;
  
  function create_test_tabs(evento){
    evento.stopPropagation();
    ocultar_todos_os_popups();
    
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicao_no_array = id_desta_tag.replace("botao_create_test_tabs_", "");
    posicao_no_array = parseInt(posicao_no_array, 10);
    
    var pagina_registrada = paginas_registradas[posicao_no_array];
    var lista_de_combinacoes = pagina_registrada.lista_de_combinacoes;
    if(lista_de_combinacoes.length < 1){
      div_popup.classList.remove("tag_oculta");
      
      div_texto_do_popup.innerHTML = "<p>In the options below, create new form input combinations first and then create test tabs.</p>";
      
      var quantidade_rolada = document.documentElement.scrollTop;
      var altura_que_esta_sendo_visualizada = window.innerHeight;
      var estilo_computado = window.getComputedStyle(div_popup);
      var altura = 0;
      altura += parseInt(estilo_computado.marginTop, 10);
      altura += parseInt(estilo_computado.marginBottom, 10);
      altura += parseInt(estilo_computado.borderTopWidth, 10);
      altura += parseInt(estilo_computado.borderBottomWidth, 10);
      altura += parseInt(estilo_computado.paddingTop, 10);
      altura += parseInt(estilo_computado.paddingBottom, 10);
      altura += parseInt(estilo_computado.height, 10);
      var posicao_y = quantidade_rolada + altura_que_esta_sendo_visualizada / 2 - altura / 2;
      div_popup.style.top = posicao_y + "px";
      return;
    }
    
    contador = 0;
    array_mensagens_das_abas = Array();
    array_ids_das_abas_que_ja_receberam = Array();
    endereco_alvo = pagina_registrada.endereco;
    tentativa_com_disparo_de_evento_update = 0;
    browser.tabs.onUpdated.removeListener(enviar_mensagem_para_outra_aba);
    browser.tabs.onUpdated.addListener(enviar_mensagem_para_outra_aba);
    criar_aba(pagina_registrada);
  }
  
  function enviar_mensagem_para_outra_aba(id_da_aba, atributos, aba){
    if(atributos.status === "complete" && aba.url === endereco_alvo){
      for(var i = 0; i < array_mensagens_das_abas.length; i++){
        if(array_mensagens_das_abas[i].id_da_aba === id_da_aba 
           && array_ids_das_abas_que_ja_receberam.indexOf(id_da_aba) == -1){
          browser.tabs.sendMessage(id_da_aba, array_mensagens_das_abas[i]).then(function(objeto_resposta){
            array_ids_das_abas_que_ja_receberam.push(objeto_resposta.id_da_aba);
          }).catch(function(erro){
            div_popup.classList.remove("tag_oculta");
            
            if(aba.url.indexOf("http://localhost/") != 0
               && aba.url.indexOf("https://localhost/") != 0
               && aba.url.indexOf("http://127.0.0.1/") != 0
               && aba.url.indexOf("https://127.0.0.1/") != 0
               && aba.url.indexOf("http://[::1]/") != 0
               && aba.url.indexOf("https://[::1]/") != 0){
              div_texto_do_popup.innerHTML = "<p>One or more tabs did not receive the form entries filled in, because do not start with one of the strings:</p>";
              div_texto_do_popup.innerHTML += "<p>http://localhost/</p>";
              div_texto_do_popup.innerHTML += "<p>https://localhost/</p>";
              div_texto_do_popup.innerHTML += "<p>http://127.0.0.1/</p>";
              div_texto_do_popup.innerHTML += "<p>https://127.0.0.1/</p>";
              div_texto_do_popup.innerHTML += "<p>http://[::1]/</p>";
              div_texto_do_popup.innerHTML += "<p>https://[::1]/</p>";
            }else{
              console.error("Create Test Tabs - " + erro);
              if(tentativa_com_disparo_de_evento_update > 5){
                return;
              }
              tentativa_com_disparo_de_evento_update++;
              div_texto_do_popup.innerHTML = "<p>For some reason, one or more tabs did not receive the form entries filled. To solve, this addon's script fired an update event for them.</p>";
              browser.tabs.update(id_da_aba, {url: endereco_alvo}).catch(function(erro){
                console.error("Create Test Tabs - " + erro);
              });
            }
            
            var quantidade_rolada = document.documentElement.scrollTop;
            var altura_que_esta_sendo_visualizada = window.innerHeight;
            var estilo_computado = window.getComputedStyle(div_popup);
            var altura = 0;
            altura += parseInt(estilo_computado.marginTop, 10);
            altura += parseInt(estilo_computado.marginBottom, 10);
            altura += parseInt(estilo_computado.borderTopWidth, 10);
            altura += parseInt(estilo_computado.borderBottomWidth, 10);
            altura += parseInt(estilo_computado.paddingTop, 10);
            altura += parseInt(estilo_computado.paddingBottom, 10);
            altura += parseInt(estilo_computado.height, 10);
            var posicao_y = quantidade_rolada + altura_que_esta_sendo_visualizada / 2 - altura / 2;
            div_popup.style.top = posicao_y + "px";
          });
          return;
        }
      }
    }
  }
  
  function criar_aba(pagina_registrada){
    var lista_de_combinacoes = pagina_registrada.lista_de_combinacoes;
    if(contador >= lista_de_combinacoes.length){
      return;
    }
    
    var campos = lista_de_combinacoes[contador].lista_de_entradas_de_formulario;
    
    var propriedades_da_nova_aba = {};
    propriedades_da_nova_aba.url = pagina_registrada.endereco;
    browser.tabs.create(propriedades_da_nova_aba).then(function(aba){
      var objeto_mensagem = {};
      objeto_mensagem.id_da_aba = aba.id;
      objeto_mensagem.campos = campos;
      array_mensagens_das_abas.push(objeto_mensagem);
      
      contador++;
      if(contador < lista_de_combinacoes.length){
        criar_aba(pagina_registrada);
      }
    }).catch(function(erro){
      console.error("Create Test Tabs - " + erro);
    });
  }
  
  function expandir_ou_ocultar_opcoes_da_pagina(evento){
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicao_no_array = id_desta_tag.replace("botao_expandir_opcoes_da_pagina_", "");
    posicao_no_array = parseInt(posicao_no_array, 10);
    
    var pagina_registrada = paginas_registradas[posicao_no_array];
    
    var div_opcoes_da_pagina_mais_lista_de_combinacoes = document.getElementById("div_opcoes_da_pagina_mais_lista_de_combinacoes_" + posicao_no_array);
    if(div_opcoes_da_pagina_mais_lista_de_combinacoes.classList.contains("tag_oculta")){
      div_opcoes_da_pagina_mais_lista_de_combinacoes.classList.remove("tag_oculta");
      tag_que_disparou_o_evento.innerText = frase_ocultar_opcoes;
      pagina_registrada.expandir_opcoes = true;
    }else{
      div_opcoes_da_pagina_mais_lista_de_combinacoes.classList.add("tag_oculta");
      tag_que_disparou_o_evento.innerText = frase_expandir_opcoes;
      pagina_registrada.expandir_opcoes = false;
    }
    browser.storage.local.set({paginas_registradas: paginas_registradas});
  }
  
  function mostrar_popup_editar_pagina(evento){
    evento.stopPropagation();
    ocultar_todos_os_popups();
    
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicao_no_array = id_desta_tag.replace("botao_editar_pagina_", "");
    posicao_no_array = parseInt(posicao_no_array, 10);
    
    numero_da_pagina_registrada_para_editar = posicao_no_array;
    
    var pagina_registrada = paginas_registradas[posicao_no_array];
    campo_nome_da_pagina_registrada.value = pagina_registrada.nome;
    campo_endereco_da_pagina_registrada.value = pagina_registrada.endereco;
    
    span_mensagem_do_campo_nome_da_pagina_registrada.classList.add("tag_oculta");
    span_mensagem_do_campo_endereco_da_pagina_registrada.classList.add("tag_oculta");
    
    div_popup_editar_pagina_registrada.classList.remove("tag_oculta");
    
    var quantidade_rolada = document.documentElement.scrollTop;
    var altura_que_esta_sendo_visualizada = window.innerHeight;
    var estilo_computado = window.getComputedStyle(div_popup_editar_pagina_registrada);
    var altura = 0;
    altura += parseInt(estilo_computado.marginTop, 10);
    altura += parseInt(estilo_computado.marginBottom, 10);
    altura += parseInt(estilo_computado.borderTopWidth, 10);
    altura += parseInt(estilo_computado.borderBottomWidth, 10);
    altura += parseInt(estilo_computado.paddingTop, 10);
    altura += parseInt(estilo_computado.paddingBottom, 10);
    altura += parseInt(estilo_computado.height, 10);
    var posicao_y = quantidade_rolada + altura_que_esta_sendo_visualizada / 2 - altura / 2;
    div_popup_editar_pagina_registrada.style.top = posicao_y + "px";
  }
  
  function criar_combinacao(evento){
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicao_no_array = id_desta_tag.replace("botao_criar_combinacao_", "");
    posicao_no_array = parseInt(posicao_no_array, 10);
    
    var pagina_registrada = paginas_registradas[posicao_no_array];
    var combinacao = {};
    combinacao.lista_de_entradas_de_formulario = Array();
    pagina_registrada.lista_de_combinacoes.push(combinacao);
    browser.storage.local.set({paginas_registradas: paginas_registradas});
    atualizar_lista_de_paginas(paginas_registradas);
  }
  
  function apagar_mensagem_do_campo_name_da_entrada(evento){
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicoes_no_array = id_desta_tag.match(/campo_name_da_entrada_(\d+)?_(\d+)?/);
    var posicao_da_pagina_registrada = parseInt(posicoes_no_array[1], 10);
    var posicao_da_combinacao = parseInt(posicoes_no_array[2], 10);
    
    var span_mensagem_do_campo_name_da_entrada = document.getElementById("span_mensagem_do_campo_name_da_entrada_" + posicao_da_pagina_registrada + "_" + posicao_da_combinacao);
    span_mensagem_do_campo_name_da_entrada.classList.add("tag_oculta");
  }
  
  function apagar_mensagem_do_campo_value_da_entrada(evento){
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicoes_no_array = id_desta_tag.match(/campo_value_da_entrada_(\d+)?_(\d+)?/);
    var posicao_da_pagina_registrada = parseInt(posicoes_no_array[1], 10);
    var posicao_da_combinacao = parseInt(posicoes_no_array[2], 10);
    
    var span_mensagem_do_campo_name_da_entrada = document.getElementById("span_mensagem_do_campo_value_da_entrada_" + posicao_da_pagina_registrada + "_" + posicao_da_combinacao);
    span_mensagem_do_campo_name_da_entrada.classList.add("tag_oculta");
  }
  
  function remover_combinacao(evento){
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicoes_no_array = id_desta_tag.match(/botao_remover_combinacao_(\d+)?_(\d+)?/);
    var posicao_da_pagina_registrada = parseInt(posicoes_no_array[1], 10);
    var posicao_da_combinacao = parseInt(posicoes_no_array[2], 10);
    
    var lista_de_combinacoes = paginas_registradas[posicao_da_pagina_registrada].lista_de_combinacoes;
    
    lista_de_combinacoes.splice(posicao_da_combinacao, 1);
    browser.storage.local.set({paginas_registradas: paginas_registradas});
    atualizar_lista_de_paginas(paginas_registradas);
  }
  
  function adicionar_entrada_de_formulario(evento){
    if(paginas_registradas === null){
      return;
    }
    
    var tag_que_disparou_o_evento = evento.currentTarget;
    var id_desta_tag = tag_que_disparou_o_evento.id;
    var posicoes_no_array = id_desta_tag.match(/botao_adicionar_name_e_value_(\d+)?_(\d+)?/);
    var posicao_da_pagina_registrada = parseInt(posicoes_no_array[1], 10);
    var posicao_da_combinacao = parseInt(posicoes_no_array[2], 10);
    
    var span_mensagem_do_campo_name_da_entrada = document.getElementById("span_mensagem_do_campo_name_da_entrada_" + posicao_da_pagina_registrada + "_" + posicao_da_combinacao);
    var campo_name_da_entrada = document.getElementById("campo_name_da_entrada_" + posicao_da_pagina_registrada + "_" + posicao_da_combinacao);
    var name_da_entrada = campo_name_da_entrada.value.trim();
    campo_name_da_entrada.value = name_da_entrada;
    
    var span_mensagem_do_campo_value_da_entrada = document.getElementById("span_mensagem_do_campo_value_da_entrada_" + posicao_da_pagina_registrada + "_" + posicao_da_combinacao);
    var campo_value_da_entrada = document.getElementById("campo_value_da_entrada_" + posicao_da_pagina_registrada + "_" + posicao_da_combinacao);
    var value_da_entrada = campo_value_da_entrada.value.trim();
    campo_value_da_entrada.value = value_da_entrada;
    
    if(name_da_entrada === ""){
      span_mensagem_do_campo_name_da_entrada.classList.remove("tag_oculta");
      span_mensagem_do_campo_name_da_entrada.innerText = "Required";
      return;
    }
    
    if(name_da_entrada.length > 60){
      span_mensagem_do_campo_name_da_entrada.classList.remove("tag_oculta");
      span_mensagem_do_campo_name_da_entrada.innerText = "Max length 60";
      return;
    }
    if(value_da_entrada.length > 2500){
      span_mensagem_do_campo_value_da_entrada.classList.remove("tag_oculta");
      span_mensagem_do_campo_value_da_entrada.innerText = "Max length 2500";
      return;
    }
    
    var pagina_registrada = paginas_registradas[posicao_da_pagina_registrada];
    var combinacao = pagina_registrada.lista_de_combinacoes[posicao_da_combinacao];
    
    var entrada_de_formulario = {};
    entrada_de_formulario.name = name_da_entrada;
    entrada_de_formulario.value = value_da_entrada;
    
    combinacao.lista_de_entradas_de_formulario.push(entrada_de_formulario);
    browser.storage.local.set({paginas_registradas: paginas_registradas});
    atualizar_lista_de_paginas(paginas_registradas);
  }
});
