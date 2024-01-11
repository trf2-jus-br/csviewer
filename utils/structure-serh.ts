export default async function buildStructure() {
    const mes = 1
    const ano = 2024

    const struc = [
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - ÓRGÃO TIPO', meta: { pk: ['id_orgao_tipo'], descr: 'nome' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - ÓRGÃO PODER', meta: { pk: ['id_orgao_poder'], descr: 'nome' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - TIPO AFASTAMENTO', meta: { pk: ['id_tipo_afastamento'], descr: 'nome' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - CARGOS', meta: { pk: ['id_cargo'], descr: 'NOME' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - COR-RAÇA', meta: { pk: ['id_cor_raca'], descr: 'descricao' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - ESTADO CIVIL', meta: { pk: ['TRF4'], descr: 'descricao' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - FORMA INGRESSO', meta: { pk: ['id_forma_ingresso'], descr: 'descricao' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - GRAU INSTRUÇÃO', meta: { pk: ['id_grau_instrucao'], descr: 'descricao' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - NACIONALIDADE', meta: { pk: ['id_nacionalidade'], descr: 'descricao' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - PAÍS', meta: { pk: ['cod_esocial'], descr: 'nome' } },

        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - REGIME TRABALHO', meta: { pk: ['id_regime_trabalho'], descr: 'descricao' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - SITUAÇÃO PESSOA', meta: { pk: ['TRF4'], descr: 'nome' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela-Básica-TIPO-INGRESSO', meta: { pk: ['id_tipo_ingresso'], descr: 'nome' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela-Básica-TIPO-LOGRADOURO', meta: { pk: ['id_tipo_logradouro'], descr: 'descricao' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela-Básica-TIPO-PESSOA', meta: { pk: ['id_tipo_pessoa'], descr: 'nome' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela-Básica-TIPO-SANGUÍNEO', meta: { pk: ['id_tipo_sanguineo'], descr: 'descricao' } },

        {
            table: 'orgaos_final', meta: {
                pk: ['identificador_sistema_origem_orgao'],
                descr: 'nome_orgao',
                enums: [
                    { key: 'id_orgao_tipo_orgao', table: 'Tabela Básica - ÓRGÃO TIPO' },
                    { key: 'id_orgao_poder_orgao', table: 'Tabela Básica - ÓRGÃO PODER' },
                    {
                        key: 'sin_ativo_orgao',
                        values: {
                            S: 'Sim',
                            N: 'Não',
                        }
                    },
                    {
                        key: 'sta_especialidade_jud_federal_orgao',
                        values: {
                            F: 'Justiça Federal',
                            M: 'Justiça Militar',
                            T: 'Justiça do Trabalho',
                            E: 'Justiça Eleitoral'
                        }
                    },
                ]
            }
        },


        {
            table: 'ingresso_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso'],
                descr: 'nome_pessoa',
                enums: [
                    { key: 'identificador_sistema_origem_cargo', table: 'Tabela Básica - CARGOS' },
                    { key: 'id_cor_raca_pessoa', table: 'Tabela Básica - COR-RAÇA' },
                    { key: 'id_estado_civil_pessoa', table: 'Tabela Básica - ESTADO CIVIL' },
                    { key: 'id_forma_ingresso', table: 'Tabela Básica - FORMA INGRESSO' },
                    { key: 'id_grau_instrucao_pessoa', table: 'Tabela Básica - GRAU INSTRUÇÃO' },
                    { key: 'id_nacionalidade_pessoa', table: 'Tabela Básica - NACIONALIDADE' },
                    { key: 'identificador_sistema_origem_orgao_ingresso', table: 'orgaos_final' },
                    { key: 'identificador_sistema_origem_orgao_concurso', table: 'orgaos_final' },
                    { key: 'identificador_sistema_origem_orgao_origem', table: 'orgaos_final' },

                    { key: 'cod_esocial_pais_endereco_pessoa', table: 'Tabela Básica - PAÍS' },
                    { key: 'cod_esocial_pais_nacionalidade_pessoa', table: 'Tabela Básica - PAÍS' },
                    { key: 'cod_esocial_pais_nascimento_pessoa', table: 'Tabela Básica - PAÍS' },
                    { key: 'id_regime_trabalho', table: 'Tabela Básica - REGIME TRABALHO' },
                    { key: 'id_situacao', table: 'Tabela Básica - SITUAÇÃO PESSOA' },
                    { key: 'id_tipo_ingresso', table: 'Tabela-Básica-TIPO-INGRESSO' },
                    { key: 'id_tipo_logradouro_pessoa', table: 'Tabela-Básica-TIPO-LOGRADOURO' },
                    { key: 'id_tipo_pessoa', table: 'Tabela-Básica-TIPO-PESSOA' },
                    { key: 'id_tipo_sanguineo_pessoa', table: 'Tabela-Básica-TIPO-SANGUÍNEO' },
                ],
                fks: [{
                    table: 'orgaos_final', fk: 'identificador_sistema_origem_orgao'
                }],
                related: [
                    'afastamentos_magistrados_final',
                    // 'afastamentos_saldos_magistrados_final',
                    // 'concessoes_magistrados_final',
                    // 'desligamento_magistrados_final',
                ],
                // related: [
                //     {column: 'identificador_sistema_origem_ingresso', foreignTable: 'afastamentos_magistrados_final', foreignColumn: 'identificador_sistema_origem_pessoa'},
                //     'afastamentos_saldos_magistrados_final',
                //     'concessoes_magistrados_final',
                //     'desligamento_magistrados_final',
                // ]
            }
        },

        {
            directory: 'c:/Tmp/csviewer',
            table: 'afastamentos_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_afastamento'],
                enums: [
                    { key: 'id_tipo_afastamento_afastamento', table: 'Tabela Básica - TIPO AFASTAMENTO' }],
                fks: [{ column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' }],
            }
        },

        {
            table: 'afastamentos_folgas_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso', 'efetivo_desligamento'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_ingresso'
                }],
            }
        },

        {
            table: 'afastamentos_saldos_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso', 'efetivo_desligamento'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_ingresso'
                }],
            }
        },

        {
            table: 'concessoes_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso_inativo', 'efetivo_desligamento'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_ingresso'
                }],
            }
        },

        {
            table: 'designacao_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_designacao'],
                descr: 'nome_pessoa',
                fks: [{
                    table: 'orgaos_final', fk: 'identificador_sistema_origem_orgao'
                }]
            }
        },

        {
            table: 'desligamento_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso', 'efetivo_desligamento'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_pessoa'
                }],
            }
        },

        {
            table: 'ferias_abono_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_pessoa', 'periodo_aquisitivo', 'sta_sequencial', 'sta_tipo', 'inicial', 'final'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_pessoa'
                }],
            }
        },

        {
            table: 'ferias_debitos_final', meta: {
                pk: ['identificador_sistema_origem_pessoa', 'periodo_aquisitivo', 'sta_sequencial', 'parte', 'quantidade_dias', 'justificativa'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_pessoa'
                }],
            }
        },

        {
            table: 'ferias_magistrados_final', meta: {
                pk: ['identificador_sistema_origem'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_pessoa'
                }],
            }
        },

        {
            table: 'ferias_primeiroperiodo_final', meta: {
                pk: ['identificador_sistema_origem_pessoa'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_pessoa'
                }],
            }
        },

        {
            table: 'ingresso_pensionistas_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_pessoa'
                }],
            }
        },

        {
            table: 'lotacoes_final', meta: {
                pk: ['identificador_sistema_origem'],
                fks: [{
                    table: 'lotacoes_final', fk: 'identificador_sistema_origem_lotacao_pai'
                }],
            }
        },

        {
            table: 'movimentacao_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso', 'inicio'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_ingresso'
                }],
            }
        },

        {
            table: 'orgao_pagador_final', meta: {
                pk: ['identificador_sistema_origem_pessoa', 'dta_inicial'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_ingresso'
                }],
            }
        },

        {
            table: 'relacao_dependencia_final', meta: {
                pk: ['identificador_sistema_origem'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_ingresso'
                }],
            }
        },

        {
            table: 'substituicoes_magistrados_final', meta: {
                pk: ['identificador_sistema_origem'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_ingresso'
                }],
            }
        },

        {
            table: 'vantagens_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_concessao_revisao'],
                fks: [{
                    table: 'ingresso_magistrados_final', fk: 'identificador_sistema_origem_ingresso'
                }],
            }
        },


    ]

    struc.forEach((s) => s.directory = s.directory || process.env.DIR_CORRENTE_SERH)

    return {
        month: mes,
        year: ano,
        reviewFilename: `${process.env.CSVIEWER_DIR_DATA}/review_serh_${mes}_${ano}.json`,
        tables: struc
    }
}
