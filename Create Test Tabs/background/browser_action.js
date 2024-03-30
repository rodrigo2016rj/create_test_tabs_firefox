browser.action.onClicked.addListener(function(aba){
  var propriedades_da_nova_aba = {};
  propriedades_da_nova_aba.url = "background/painel_do_create_test_tabs.html";
  browser.tabs.create(propriedades_da_nova_aba);
});
