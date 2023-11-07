import fs from 'fs/promises'

export default async function buildStructure() {

    let ano = '2000'
    let mes = '01'
    const files = await fs.readdir(process.env.CSVIEWER_DIR_JUI + '/../gajufolha');

    const regex = /^Gaju_Folha_(?<mes>\d\d)_(?<ano>20\d\d)\.csv$/;

    files.forEach((file) => {
        // console.log(`${file}`);
        const m = file.match(regex)
        if (m !== null) {
            // console.log(m)
            // console.log(`${file} - ${m.groups.mes} - ${m.groups.ano}`);
            if (m[2] > ano) ano = m[2]
        }
    });
    // console.log(`${mes}_${ano}`)

    files.forEach((file) => {
        const m = regex.exec(file)
        if (m !== null && m[2] === ano) {
            // console.log(`${file} - ${m[1]} - ${m[2]}`);
            if (m[1] > mes) mes = m[1]
        }
    });

    // console.log(`${mes}_${ano}`)

    const month = `${mes}_${ano}`

    const csvsGajuMini = [
        `ES_Capital_SERRA_Cível_JEF Cível_${month}`,
        `ES_Capital_Vitória_Juizados Especiais Federais_${month}`,
        `ES_Capital_Vitória_Núcleo de Justiça 4.0 Previdenciária_${month}`,
        `ES_Capital_Vitória_Turma Recursal dos Juizados Especiais _${month}`,
        `ES_Capital_Vitória_Varas Criminais_${month}`,
        `ES_Capital_Vitória_Varas Cíveis Especializadas_${month}`,
        `ES_Capital_Vitória_Varas Cíveis_${month}`,
        `ES_Capital_Vitória_Varas de Execução Fiscal_${month}`,
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
        `RJ_Baixada Fluminense_Nova Iguaçu_Varas Federais Mistas_${month}`,
        `RJ_Baixada Fluminense_São João de Meriti_Varas Federais Criminais_${month}`,
        `RJ_Baixada Fluminense_São João de Meriti_Varas Federais Cíveis Especializadas_${month}`,
        `RJ_Baixada Fluminense_São João de Meriti_Varas Mistas_${month}`,
        `RJ_Capital_Rio de Janeiro_Juizados Especiais Federais_${month}`,
        `RJ_Capital_Rio de Janeiro_Núcleo de Justiça 4.0 Previdenciária_${month}`,
        `RJ_Capital_Rio de Janeiro_Turma Recursal dos Juizados Especiais _${month}`,
        `RJ_Capital_Rio de Janeiro_Varas Federais Criminais_${month}`,
        `RJ_Capital_Rio de Janeiro_Varas Federais Cíveis_${month}`,
        `RJ_Capital_Rio de Janeiro_Varas Federais de Execução Fiscal_${month}`,
        `RJ_Capital_Rio de Janeiro_Varas Federais Previdenciárias_${month}`,
        `RJ_Norte Fluminense_Campos_Juizados Especiais Federais_${month}`,
        `RJ_Norte Fluminense_Campos_Varas Federais Cíveis_${month}`,
        `RJ_Norte Fluminense_Campos_Varas Federais Previdenciárias_${month}`,
        `RJ_Norte Fluminense_Campos_Varas Mistas_${month}`,
        `RJ_Norte Fluminense_Itaperuna_Varas Mistas_${month}`,
        `RJ_Norte Fluminense_Macaé_Varas Mistas_${month}`,
        `RJ_Região Serrana_Magé_Varas Mistas_${month}`,
        `RJ_Região Serrana_Nova Friburgo_Juizados Especiais Federais_${month}`,
        `RJ_Região Serrana_Nova Friburgo_Varas Federais Cíveis_${month}`,
        `RJ_Região Serrana_Nova Friburgo_Varas Mistas_${month}`,
        `RJ_Região Serrana_Petrópolis_Varas Mistas_${month}`,
        `RJ_Região Serrana_Teresópolis_Varas Federais Mistas_${month}`,
        `RJ_Região Serrana_Três Rios_Varas Mistas_${month}`,
        `RJ_Sul Fluminense_Angra dos Reis_Varas Mistas_${month}`,
        `RJ_Sul Fluminense_Barra do Piraí_Varas Federais Mistas_${month}`,
        `RJ_Sul Fluminense_Resende_Juizados Especiais Federais_${month}`,
        `RJ_Sul Fluminense_Resende_Varas Mistas_${month}`,
        `RJ_Sul Fluminense_Volta Redonda_Juizados Especiais Federais_${month}`,
        `RJ_Sul Fluminense_Volta Redonda_Varas Mistas_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_Itaboraí_Varas Mistas_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Juizados Especiais Federais_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Federais Criminais_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Federais Cíveis_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Federais de Execução Fiscal_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Mistas_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_São Gonçalo_Varas Federais de Execução Fiscal_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_São Gonçalo_Varas Federais Mistas_${month}`,
        `RJ_Varas Federais de Niterói e Baixada Litorânea_São Pedro da Aldeia_Varas Mistas_${month}`,]

    const struc = csvsGajuMini.map(i => ({
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

    const monthnlz = `${mes.replace(/^0+/, "")}_${ano}`

    const csvsSubstituicaoMini = [
        `Substituição ES_Capital_SERRA_Cível_JEF Cível_${monthnlz}`,
        `Substituição ES_Capital_Vitória_Juizados Especiais Federais_${monthnlz}`,
        `Substituição ES_Capital_Vitória_Núcleo de Justiça 4.0 Previdenciária_${monthnlz}`,
        `Substituição ES_Capital_Vitória_Turma Recursal dos Juizados Especiais _${monthnlz}`,
        `Substituição ES_Capital_Vitória_Varas Criminais_${monthnlz}`,
        `Substituição ES_Capital_Vitória_Varas Cíveis Especializadas_${monthnlz}`,
        `Substituição ES_Capital_Vitória_Varas Cíveis_${monthnlz}`,
        `Substituição ES_Capital_Vitória_Varas de Execução Fiscal_${monthnlz}`,
        `Substituição ES_Norte - São Matheus, Linhares ou Colatina_Colatina_Varas Mistas_${monthnlz}`,
        `Substituição ES_Norte - São Matheus, Linhares ou Colatina_Linhares_Varas Mistas_${monthnlz}`,
        `Substituição ES_Norte - São Matheus, Linhares ou Colatina_São Mateus_Varas Mistas_${monthnlz}`,
        `Substituição ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Criminal_JEF Criminal_Execução Fiscal_${monthnlz}`,
        `Substituição ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Cível_Execução Fiscal_Ações Tributárias_${monthnlz}`,
        `Substituição ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Cível_JEF Cível_${monthnlz}`,
        `Substituição ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Juizados Especiais Federais_${monthnlz}`,
        `Substituição ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Varas Federais de Execução Fiscal_${monthnlz}`,
        `Substituição ES_Sul - Cachoeiro de Itapemirim_Cachoeiro de Itapemirim_Varas Federais Mistas_${monthnlz}`,
        `Substituição RJ_Baixada Fluminense_Duque de Caxias_Varas Federais Mistas_${monthnlz}`,
        `Substituição RJ_Baixada Fluminense_Nova Iguaçu_Varas Federais Mistas_${monthnlz}`,
        `Substituição RJ_Baixada Fluminense_São João de Meriti_Varas Federais Criminais_${monthnlz}`,
        `Substituição RJ_Baixada Fluminense_São João de Meriti_Varas Federais Cíveis Especializadas_${monthnlz}`,
        `Substituição RJ_Baixada Fluminense_São João de Meriti_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Capital_Rio de Janeiro_Juizados Especiais Federais_${monthnlz}`,
        `Substituição RJ_Capital_Rio de Janeiro_Núcleo de Justiça 4.0 Previdenciária_${monthnlz}`,
        `Substituição RJ_Capital_Rio de Janeiro_Turma Recursal dos Juizados Especiais _${monthnlz}`,
        `Substituição RJ_Capital_Rio de Janeiro_Varas Federais Criminais_${monthnlz}`,
        `Substituição RJ_Capital_Rio de Janeiro_Varas Federais Cíveis_${monthnlz}`,
        `Substituição RJ_Capital_Rio de Janeiro_Varas Federais de Execução Fiscal_${monthnlz}`,
        `Substituição RJ_Capital_Rio de Janeiro_Varas Federais Previdenciárias_${monthnlz}`,
        `Substituição RJ_Norte Fluminense_Campos_Juizados Especiais Federais_${monthnlz}`,
        `Substituição RJ_Norte Fluminense_Campos_Varas Federais Cíveis_${monthnlz}`,
        `Substituição RJ_Norte Fluminense_Campos_Varas Federais Previdenciárias_${monthnlz}`,
        `Substituição RJ_Norte Fluminense_Campos_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Norte Fluminense_Itaperuna_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Norte Fluminense_Macaé_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Região Serrana_Magé_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Região Serrana_Nova Friburgo_Juizados Especiais Federais_${monthnlz}`,
        `Substituição RJ_Região Serrana_Nova Friburgo_Varas Federais Cíveis_${monthnlz}`,
        `Substituição RJ_Região Serrana_Nova Friburgo_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Região Serrana_Petrópolis_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Região Serrana_Teresópolis_Varas Federais Mistas_${monthnlz}`,
        `Substituição RJ_Região Serrana_Três Rios_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Sul Fluminense_Angra dos Reis_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Sul Fluminense_Barra do Piraí_Varas Federais Mistas_${monthnlz}`,
        `Substituição RJ_Sul Fluminense_Resende_Juizados Especiais Federais_${monthnlz}`,
        `Substituição RJ_Sul Fluminense_Resende_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Sul Fluminense_Volta Redonda_Juizados Especiais Federais_${monthnlz}`,
        `Substituição RJ_Sul Fluminense_Volta Redonda_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_Itaboraí_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Juizados Especiais Federais_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Federais Criminais_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Federais Cíveis_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Federais de Execução Fiscal_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_Niterói_Varas Mistas_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_São Gonçalo_Varas Federais de Execução Fiscal_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_São Gonçalo_Varas Federais Mistas_${monthnlz}`,
        `Substituição RJ_Varas Federais de Niterói e Baixada Litorânea_São Pedro da Aldeia_Varas Mistas_${monthnlz}`]

    struc.push(...csvsSubstituicaoMini.map(i => ({
        table: i,
        directory: ``,
        alsoUpdate: ``,
        meta: {
            pk: [`NOME COMPLETO`],
            descr: `NOME COMPLETO`
        }
    })))

    // struc.push({
    //     table: `Gaju_Folha_${month}`,
    //     directory: `../gajufolha/`,
    //     alsoUpdate: ``,
    //     meta: {
    //         pk: [`Nome do Magistrado`],
    //         descr: `Nome do Magistrado`
    //     }
    // })

    return {
        month: mes,
        year: ano,
        reviewFilename: `${process.env.CSVIEWER_DIR_DATA}/review_gaju_${mes}_${ano}.json`,
        tables: struc
    }
}