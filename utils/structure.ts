const month = `10_2023`

const csvs = [
    `ES_Capital_Vitória_Juizados Especiais Federais_${month}`,
    `ES_Capital_Vitória_Núcleo de Justiça 4.0 Previdenciária_${month}`,
    `ES_Capital_Vitória_Turma Recursal dos Juizados Especiais _${month}`,
    `ES_Capital_Vitória_Varas Criminais_${month}`,
    `ES_Capital_Vitória_Varas Cíveis Especializadas_${month}`,
    `ES_Capital_Vitória_Varas Cíveis_${month}`,
    `ES_Capital_Vitória_Varas de Execução Fiscal_${month}`,
    `ES_Capital_SERRA_Cível_JEF Cível_${month}`,
    `ES_Norte - São Matheus, Linhares ou Colatina_Colatina_Varas Mistas_${month}`,
    `ES_Norte - São Matheus, Linhares ou Colatina_Linhares_Varas Mistas_${month}`,
    `ES_Norte - São Matheus, Linhares ou Colatina_São Mateus_Varas Mistas_${month}`,
    `ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Criminal_JEF Criminal_Execução Fiscal_${month}`,
    `ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Cível_Execução Fiscal_Ações Tributárias_${month}`,
    `ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Cível_JEF Cível_${month}`,
    `ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Juizados Especiais Federais_${month}`,
    `ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Varas Federais de Execução Fiscal_${month}`,
    `ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Varas Federais Mistas_${month}`,
    `RJ_Baixada Fluminense_Duque de Caxias_Varas Federais Mistas_${month}`,
    `RJ_Baixada Fluminense_São João de Meriti_Varas Mistas_${month}`,
    `RJ_Capital_Rio de Janeiro_Juizados Especiais Federais_${month}`,
    `RJ_Capital_Rio de Janeiro_Núcleo de Justiça 4.0 Previdenciária_${month}`,
    `RJ_Capital_Rio de Janeiro_Varas Federais Criminais_${month}`,
    `RJ_Capital_Rio de Janeiro_Varas Federais Cíveis_${month}`,
    `RJ_Capital_Rio de Janeiro_Varas Federais de Execução Fiscal_${month}`,
    `RJ_Capital_Rio de Janeiro_Turma Recursal dos Juizados Especiais _${month}`,
    `RJ_Norte Fluminense_Campos_Juizados Especiais Federais_${month}`,
    `RJ_Norte Fluminense_Campos_Varas Federais Cíveis_${month}`,
    `RJ_Norte Fluminense_Campos_Varas Federais Previdenciárias_${month}`,
    `RJ_Norte Fluminense_Campos_Varas Mistas_${month}`,
    `RJ_Norte Fluminense_Itaperuna_Varas Mistas_${month}`,
    `RJ_Norte Fluminense_Macaé_Varas Mistas_${month}`,
    `RJ_Região Serrana_Magé_Varas Mistas_${month}`,
    `RJ_Região Serrana_Nova Friburgo_Juizados Especiais Federais_${month}`,
    `RJ_Região Serrana_Nova Friburgo_Varas Mistas_${month}`,
    `RJ_Região Serrana_Petrópolis_Varas Mistas_${month}`,
    `RJ_Região Serrana_Teresópolis_Varas Federais Mistas_${month}`,
    `RJ_Região Serrana_Três Rios_Varas Mistas_${month}`,
    `RJ_Sul Fluminense_Angra dos Reis_Varas Mistas_${month}`,
    `RJ_Sul Fluminense_Barra do Piraí_Varas Federais Mistas_${month}`,
    `RJ_Sul Fluminense_Resende_Varas Mistas_${month}`,
    `RJ_Sul Fluminense_Volta Redonda_Juizados Especiais Federais_${month}`,
    `RJ_Sul Fluminense_Volta Redonda_Varas Mistas_${month}`,
    `RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Mistas_${month}`,
    `RJ_Varas Federais de Niterói e Baixada Litorânea_São Gonçalo_Varas Federais Mistas_${month}`,
    `RJ_Varas Federais de Niterói e Baixada Litorânea_São Pedro da Aldeia_Varas Mistas_${month}`,
]

const struc = csvs.map(i => ({
    table: i,
    directory: ``,
    alsoUpdate: `Gaju_Folha_${month}`,
    meta: {
        pk: [`NOME COMPLETO`],
        descr: `NOME COMPLETO`
    }
}))

struc.push({
    table: `Gaju_Folha_${month}`,
    directory: `../gajufolha/`,
    alsoUpdate: ``,
    meta: {
        pk: [`Nome do Magistrado`],
        descr: `Nome do Magistrado`
    }
})

export default struc