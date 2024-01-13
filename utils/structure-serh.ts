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
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - SITUAÇÃO', meta: { pk: ['id_situacao'], descr: 'nome' } },
        { directory: process.env.DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - ORIGEM CRIAÇÃO', meta: { pk: ['id_origem_criacao'], descr: 'descricao' } },

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
                    'movimentacao_magistrados_final',
                    'afastamentos_magistrados_final',
                    // 'afastamentos_saldos_magistrados_final',
                    // 'concessoes_magistrados_final',
                    // 'desligamento_magistrados_final',
                ],
                ui: [
                    { column: "identificador_sistema_origem_ingresso" },
                    { column: "id_tipo_pessoa" },
                    { column: "nome_pessoa" },
                    { column: "nome_social_pessoa" },
                    { column: "dta_nascimento_pessoa" },
                    { column: "id_tipo_sanguineo_pessoa" },
                    { column: "nome_mae_pessoa" },
                    { column: "nome_pai_pessoa" },
                    { column: "nome_conjuge_pessoa" },
                    { column: "id_nacionalidade_pessoa" },
                    { column: "codigo_ibge_municipio_naturalidade_pessoa" },
                    { column: "nome_municipio_exterior_naturalidade" },
                    { column: "sexo_pessoa" },
                    { column: "sin_doador" },
                    { column: "sin_porte_arma" },
                    { column: "sin_quitacao_eleitoral" },
                    { column: "sin_deficiente_pessoa" },
                    { column: "sin_deficiente" },
                    { column: "dta_falecimento_pessoa" },

                    { column: "registro_cnh_pessoa", group: 'Identificação' },
                    { column: "dta_emissao_cnh_pessoa" },
                    { column: "dta_primeira_cnh_pessoa" },
                    { column: "dta_validade_cnh_pessoa" },
                    { column: "categoria_cnh_pessoa" },
                    { column: "cpf_pessoa" },
                    { column: "rg_pessoa" },
                    { column: "dta_expedicao_rg_pessoa" },
                    { column: "orgao_expedidor_rg_pessoa" },
                    { column: "uf_rg_pessoa" },
                    { column: "pis_pasep_pessoa" },
                    { column: "registro_conselho_profissional" },
                    { column: "uf_conselho_profissional" },
                    { column: "titulo_eleitor" },
                    { column: "zona_eleitoral" },
                    { column: "secao_eleitoral" },
                    { column: "dta_ultima_votacao" },
                    { column: "dta_emissao_titulo" },
                    { column: "cidade_titulo" },
                    { column: "uf_titulo" },
                    { column: "certificado_reservista" },
                    { column: "categoria_militar" },
                    { column: "regiao_militar" },


                    { column: "id_cor_raca_pessoa" },
                    { column: "id_estado_civil_pessoa" },

                    { column: "classificacao" },

                    { column: "telefone_pessoa" },
                    { column: "telefone_funcional_pessoa" },
                    { column: "email_pessoa", group: 'Contato' },
                    { column: "email_pessoal_pessoa" },
                    { column: "celular_pessoa" },
                    { column: "ramal_pessoal_pessoa" },
                    { column: "sin_mostra_celular" },
                    { column: "sin_mostra_telefone" },

                    { column: "id_tipo_logradouro_pessoa", group: 'Endereço' },
                    { column: "logradouro_pessoa" },
                    { column: "numero_logradouro_pessoa" },
                    { column: "complemento_logradouro_pessoa" },
                    { column: "bairro_pessoa" },
                    { column: "codigo_ibge_municipio_endereco_pessoa" },
                    { column: "nome_municipio_exterior_endereco" },
                    { column: "cep_pessoa" },

                    { column: "id_grau_instrucao_pessoa", group: 'Formação' },
                    { column: "id_area_curso_grad_estagio" },

                    { column: "id_forma_ingresso", group: 'Ingresso' },
                    { column: "id_tipo_ingresso" },
                    { column: "identificador_sistema_origem_orgao_ingresso" },
                    { column: "identificador_sistema_origem_orgao_origem" },
                    { column: "matricula" },
                    { column: "matricula_original" },
                    { column: "ato_nomeacao" },
                    { column: "num_edital_concurso" },
                    { column: "identificador_sistema_origem_orgao_concurso" },
                    { column: "dta_edital_concurso" },
                    { column: "dta_validade_concurso" },
                    { column: "sta_cota" },
                    { column: "dta_efetivo_orgao" },
                    { column: "dta_exercicio" },
                    { column: "dta_exercicio_ferias" },
                    { column: "dta_homologacao_concurso" },
                    { column: "dta_nomeacao" },
                    { column: "dta_publ_nomeacao" },
                    { column: "dta_posse" },
                    { column: "identificador_sistema_origem_pessoa" },
                    { column: "observacao_ingresso" },
                    { column: "divulgacao_nomeacao" },

                    { column: "id_situacao", group: 'Situação' },
                    { column: "dta_situacao" },
                    { column: "dta_publ_situacao" },
                    { column: "id_regime_trabalho" },
                    { column: "sigla" },
                    { column: "dta_ato_situacao" },
                    { column: "numero_ato_situacao" },
                    { column: "identificador_sistema_origem_cargo" },
                    { column: "sta_regime_previdencia" },
                    { column: "dta_migracao_rpps_teto" },
                    { column: "sta_vinculo_ininterrupto" },
                    { column: "sin_tempo_especial" },
                    { column: "sin_universo_magistrado" },
                    { column: "divulgacao_situacao" },


                    { column: "categoria_trabalhador_esocial", group: 'eSocial' },
                    { column: "cod_esocial_pais_endereco_pessoa" },
                    { column: "cod_esocial_pais_nacionalidade_pessoa" },
                    { column: "cod_esocial_pais_nascimento_pessoa" },
                    { column: "condicao_ingresso_imigrante_esocial" },
                    { column: "prazo_residencia_imigrante_esocial" },
                    { column: "data_chegada_imigrante_esocial" },
                    { column: "sin_possui_filho_brasileiro_imigrante_esocial" },
                    { column: "sin_deficiente_visual_esocial" },
                    { column: "sin_deficiente_auditivo_esocial" },
                    { column: "sin_deficiente_fisico_esocial" },
                    { column: "sin_deficiente_mental_esocial" },
                    { column: "sin_deficiente_intelectual_esocial" },
                    { column: "sin_reabilitado_deficiencia_esocial" },
                ]
            }
        },

        {
            directory: 'c:/Tmp/csviewer',
            table: 'afastamentos_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_afastamento'],
                enums: [
                    { key: 'id_tipo_afastamento_afastamento', table: 'Tabela Básica - TIPO AFASTAMENTO' },
                    { key: 'id_situacao_afastamento', table: 'Tabela Básica - SITUAÇÃO' },
                    { key: 'id_origem_criacao_afastamento', table: 'Tabela Básica - ORIGEM CRIAÇÃO' },
                ],
                fks: [{ column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' }],
                ui: [
                    { column: "identificador_sistema_origem_afastamento" },
                    { column: "id_situacao_afastamento" },
                    { column: "inicio" },
                    { column: "final" },
                    { column: "id_tipo_afastamento_afastamento" },
                    { column: "despacho_afastamento" },
                    { column: "justificativa_afastamento_afastamento" },
                    { column: "competencia_afastamento" },
                    { column: "sin_comprovacao_afastamento" },
                    { column: "sin_prejuizo_jurisdicao_afastamento" },
                    { column: "sin_atestado_medico_visivel_afastamento" },
                    { column: "email_enviado_afastamento" },
                    { column: "portaria_afastamento" },
                    { column: "codigo_ibge_municipio" },
                    { column: "id_origem_criacao_afastamento" },
                    { column: "identificador_sistema_origem_pessoa" },
                ]
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
                descr: 'nome',
                fks: [{
                    table: 'lotacoes_final', fk: 'identificador_sistema_origem_lotacao_pai'
                }],
            }
        },

        {
            table: 'movimentacao_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso', 'inicio'],
                enums: [
                    { key: 'identificador_sistema_origem_lotacao', table: 'lotacoes_final' },
                ],
                fks: [
                    { column: 'identificador_sistema_origem_ingresso', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_ingresso' },
                    { column: 'identificador_sistema_origem_lotacao', relatedTable: 'lotacao_final', relatedColumn: 'identificador_sistema_origem' },
                ],
                ui: [
                    { column: "identificador_sistema_origem_ingresso" },
                    { column: "inicio" },
                    { column: "final" },
                    { column: "exercicio_vara" },
                    { column: "id_natureza_movimentacao" },
                    { column: "identificador_sistema_origem_lotacao" },
                    { column: "observacao" },
                    { column: "processo_administrativo" },
                    { column: "sessao" },
                    { column: "numero_ato" },
                    { column: "data_ato" },
                    { column: "publicacao_ato" },
                ]
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
