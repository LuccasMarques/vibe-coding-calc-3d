(() => {
  const api = Object.freeze({
    DB_NAME: 'calc3d-db',
    DB_VERSION: 4,
    printerFields: ['valor_maq','vida_util','horas_dia','consumo_w','tarifa_kwh','valor_hora','custo_fixo','projetos_mes','manut_ano','insumos_mes'],
    printerProfileFields: ['default_material','default_pos_proc','default_taxa_perda','default_embalagem','default_perfil_tributario','default_impostos','default_taxa_plat','default_custom_plat_val'],
    printerProfileDefaults: {default_material:'100',default_pos_proc:.5,default_taxa_perda:15,default_embalagem:1.5,default_perfil_tributario:'cpf',default_impostos:0,default_taxa_plat:0,default_custom_plat_val:0},
    productFields: ['nome_proj','material','tempo_h','tempo_m','filamento_g','pos_proc','qtd_pecas','taxa_perda','embalagem','emb_protecao','emb_etiqueta','emb_brinde','frete','outros','modo_preco','base_preco','margem','preco_venda_input','perfil_tributario','impostos','taxa_plat','custom_plat_val','shopee_cpf_extra_on','shopee_cpf_extra','shopee_campanha','shopee_devolucao','shopee_cupom','shopee_ads','shopee_frete'],
    productDefaults: {nome_proj:'',material:'100',tempo_h:4,tempo_m:30,filamento_g:80,pos_proc:.5,qtd_pecas:1,taxa_perda:15,embalagem:1.5,emb_protecao:0,emb_etiqueta:0,emb_brinde:0,frete:0,outros:0,modo_preco:'margem',base_preco:'peca',margem:40,preco_venda_input:0,perfil_tributario:'cpf',impostos:0,taxa_plat:0,custom_plat_val:0,shopee_cpf_extra_on:1,shopee_cpf_extra:3,shopee_campanha:0,shopee_devolucao:0,shopee_cupom:0,shopee_ads:0,shopee_frete:0},
    autoProfileStorageKey: 'calc3d-auto-profile',
    compactStorageKey: 'calc3d-project-compact',
    authApiBaseUrl: '',
  });

  if(typeof window !== 'undefined') window.CALC3D_APP = api;
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})();
