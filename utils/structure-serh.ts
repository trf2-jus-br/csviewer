import fs from 'fs/promises'
import { maiusculasEMinusculas } from './text';
import { dateFromDDMMYYYY } from './date';

export default async function buildStructure() {

    const files = await fs.readdir(process.env.CSVIEWER_DIR_SERH || '');

    const regex = /^(?<ano>\d{4})(?<mes>\d{2})(?<dia>\d{2})\.(?<hora>\d{2})(?<minuto>\d{2})(?<segundo>\d{2})$/

    let mostRecent = ''
    files.forEach((file) => {
        // console.log(`${file}`);
        const m = file.match(regex)
        if (m !== null) {
            // console.log(`${file} - ${m.groups.ano}-${m.groups.mes}-${m.groups.dia} ${m.groups.hora}:${m.groups.minuto}:${m.groups.segundo}`);
            if (file > mostRecent) mostRecent = file
        }
    });
    console.log(`Mais recente: ${mostRecent}`);

    const dir = process.env.CSVIEWER_DIR_SERH + '/' + mostRecent

    console.log(`CSVIEWER_DIR_SERH: ${dir}`);

    const m = regex.exec(mostRecent);
    const mes = m !== null && m.groups !== undefined ? Number(m.groups.mes) : 1;
    const ano = m !== null && m.groups !== undefined ? Number(m.groups.ano) : 1900;
    console.log(`Data: ${mes}/${ano}`);

    const struc = [
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - ÓRGÃO TIPO', meta: { pk: ['id_orgao_tipo'], descr: 'nome' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - ÓRGÃO PODER', meta: { pk: ['id_orgao_poder'], descr: 'nome' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - TIPO AFASTAMENTO', meta: { pk: ['id_tipo_afastamento'], descr: 'nome' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - CARGOS', meta: { pk: ['id_cargo'], descr: 'NOME' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - COR-RAÇA', meta: { pk: ['id_cor_raca'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - ESTADO CIVIL', meta: { pk: ['TRF4'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - FORMA INGRESSO', meta: { pk: ['id_forma_ingresso'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - GRAU INSTRUÇÃO', meta: { pk: ['id_grau_instrucao'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - NACIONALIDADE', meta: { pk: ['id_nacionalidade'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - PAÍS', meta: { pk: ['cod_esocial'], descr: 'nome' } },

        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - REGIME TRABALHO', meta: { pk: ['id_regime_trabalho'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - SITUAÇÃO PESSOA', meta: { pk: ['TRF4'], descr: 'nome' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela-Básica-TIPO-INGRESSO', meta: { pk: ['id_tipo_ingresso'], descr: 'nome' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela-Básica-TIPO-LOGRADOURO', meta: { pk: ['id_tipo_logradouro'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela-Básica-TIPO-PESSOA', meta: { pk: ['id_tipo_pessoa'], descr: 'nome' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela-Básica-TIPO-SANGUÍNEO', meta: { pk: ['id_tipo_sanguineo'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - SITUAÇÃO', meta: { pk: ['id_situacao'], descr: 'nome' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - ORIGEM CRIAÇÃO', meta: { pk: ['id_origem_criacao'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - NATUREZA MOVIMENTAÇÃO', meta: { pk: ['id_natureza_movimentacao'], descr: 'descricao' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - TIPO SALDO DIAS MAGISTRADOS', meta: { pk: ['ID'], descr: 'NOME' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - TIPO DÉBITO PERÍODO AQUISITIVO', meta: { pk: ['ID'], descr: 'NOME' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - TIPO DESIGNAÇÃO', meta: { pk: ['id_tipo_designacao'], descr: 'nome' } },
        { directory: process.env.CSVIEWER_DIR_TABELAS_BASICAS_SERH, table: 'Tabela Básica - DOCUMENTO LEGAL TIPO', meta: { pk: ['id_documento_legal_tipo'], descr: 'nome' } },

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
            table: 'lotacoes_final', meta: {
                pk: ['identificador_sistema_origem'],
                descr: 'nome',
                // fks: [
                //     { column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' }
                // ],
                ui: [
                    { "column": "identificador_sistema_origem" },
                    { "column": "identificador_sistema_origem_lotacao_pai" },
                    { "column": "identificador_sistema_origem_orgao_lotacao" },
                    { "column": "num_ordem_circunscricao" },
                    { "column": "num_ordenacao" },
                    { "column": "nome" },
                    { "column": "sigla" },
                    { "column": "nome_extenso" },
                    { "column": "telefone" },
                    { "column": "ramal" },
                    { "column": "email" },
                    { "column": "fax" },
                    { "column": "dta_inicio" },
                    { "column": "dta_final" },
                    { "column": "sin_lotacao_desligado_informacao_lotacao" },
                    { "column": "identificador_sistema_origem_informacao_lotacao" },
                    { "column": "codigo_ibge_cidade" },
                    { "column": "sta_restricao_vaga" },
                    { "column": "sta_tipo_judicial_unidade" }],
                related: [
                    'movimentacao_magistrados_final',
                    'designacao_magistrados_final',
                ],
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
                related: [
                    'movimentacao_magistrados_final',
                    'designacao_magistrados_final',

                    'afastamentos_magistrados_final',
                    'afastamentos_folgas_magistrados_final',
                    'afastamentos_saldos_magistrados_final',

                    'ferias_abono_magistrados_final',
                    'ferias_debitos_final',
                    'ferias_magistrados_final',
                    'ferias_primeiroperiodo_final',

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
                ],
                timeline: {
                    start: row => dateFromDDMMYYYY(row.inicio),
                    end: row => dateFromDDMMYYYY(row.final) || new Date(),
                    position: (row) => 'Afastamentos',
                    name: (row) => (maiusculasEMinusculas(row._id_tipo_afastamento_afastamento || '')),
                }
            }
        },

        {
            table: 'afastamentos_folgas_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_juiz_ingresso', 'inicial'],
                enums: [
                    {
                        key: 'sta_tipo',
                        values: {
                            I: 'Fim de Semana',
                            E: 'Feriado',
                            A: 'Feriadão'
                        }
                    },
                ],
                fks: [
                    { column: 'identificador_sistema_origem_juiz_ingresso', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_ingresso' },
                ],

                ui: [
                    { "column": "identificador_sistema_origem_juiz_ingresso" },
                    { "column": "inicial" },
                    { "column": "final" },
                    { "column": "numero_dias" },
                    { "column": "sin_deferido" },
                    { "column": "homologacao" },
                    { "column": "sta_tipo" },
                    { "column": "documento_sei" },
                    { "column": "identificador_sistema_origem_diretor_ingresso" },
                    { "column": "identificador_sistema_origem_homologador_ingresso" }]
            }
        },

        {
            table: 'afastamentos_saldos_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_pessoa', 'inicial'],
                enums: [
                    { key: 'id_tipo_saldo_dias_magistrado', table: 'Tabela Básica - TIPO SALDO DIAS MAGISTRADOS' },
                    {
                        key: 'sta_situacao',
                        values: {
                            D: 'Deferido',
                            I: 'Indeferido',
                            N: 'Não Avaliado'
                        }
                    },
                ],
                fks: [
                    { column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' },
                ],
                ui: [
                    { "column": "identificador_sistema_origem_pessoa" },
                    { "column": "inicial" },
                    { "column": "final" },
                    { "column": "id_tipo_saldo_dias_magistrado" },
                    { "column": "saldo" },
                    { "column": "concessao" },
                    { "column": "observacao" },
                    { "column": "sta_situacao" },
                ]
            },
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
                enums: [
                    { key: 'id_tipo_designacao', table: 'Tabela Básica - TIPO DESIGNAÇÃO' },
                    { key: 'id_situacao_designacao', table: 'Tabela Básica - SITUAÇÃO' },
                    { key: 'id_tipo_documento_inicial_designacao', table: 'Tabela Básica - DOCUMENTO LEGAL TIPO' },
                    { key: 'id_tipo_documento_final_designacao', table: 'Tabela Básica - DOCUMENTO LEGAL TIPO' },
                    { key: 'id_tipo_afastamento_designacao', table: 'Tabela Básica - TIPO AFASTAMENTO' },
                    { key: 'id_origem_criacao_designacao', table: 'Tabela Básica - ORIGEM CRIAÇÃO' },
                    { key: 'identificador_sistema_origem_id_lotacao', table: 'lotacoes_final' },
                    //{ key: 'identificador_sistema_origem_pessoa_afastada', table: 'Tabela Básica - TIPO SALDO DIAS MAGISTRADOS' },
                ],
                fks: [
                    { column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' },
                    { column: 'identificador_sistema_origem_id_lotacao', relatedTable: 'lotacoes_final', relatedColumn: 'identificador_sistema_origem' },
                ],
                ui: [
                    { "column": "identificador_sistema_origem_designacao" },
                    { "column": "identificador_sistema_origem_pessoa" },
                    { "column": "identificador_sistema_origem_pessoa_afastada" },
                    { "column": "identificador_sistema_origem_id_lotacao" },
                    { "column": "id_tipo_designacao" },
                    { "column": "id_situacao_designacao" },
                    { "column": "portaria" },
                    { "column": "competencia_designacao" },
                    { "column": "observacao_designacao" },
                    { "column": "despacho_designacao" },
                    { "column": "inicial" },
                    { "column": "final" },
                    { "column": "sta_prejuizo_jurisdicao" },
                    { "column": "sta_tipo_revogacao_designacao" },
                    { "column": "sin_titularidade_plena" },
                    { "column": "sin_com_grat_acumulo_manual_designacao" },
                    { "column": "num_documento_inicial_designacao" },
                    { "column": "num_documento_final_designacao" },
                    { "column": "id_tipo_documento_inicial_designacao" },
                    { "column": "documento_inicial_designacao" },
                    { "column": "publicacao_inicial_designacao" },
                    { "column": "id_tipo_documento_final_designacao" },
                    { "column": "documento_final_designacao" },
                    { "column": "publicacao_final_designacao" },
                    { "column": "email_enviado_designacao" },
                    { "column": "id_origem_criacao_designacao" },
                    { "column": "id_tipo_afastamento_designacao" },
                    { "column": "nome_orgao_emissor_designacao" },
                    { "column": "sigla_orgao_emissor_designacao" },
                ],
                timeline: {
                    start: row => dateFromDDMMYYYY(row.inicial),
                    end: row => dateFromDDMMYYYY(row.final) || new Date(),
                    position: (row) => maiusculasEMinusculas(row._identificador_sistema_origem_id_lotacao),
                    name: (row) => (maiusculasEMinusculas(row.observacao_designacao || '').replace(/^.*?Motivo:(.+?)\s*Data Expediente.+$/gm, '$1')),
                    tooltips: (row) => [{ label: 'Observação', value: row.observacao_designacao }]
                }
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
                enums: [
                    {
                        key: 'sta_tipo',
                        values: {
                            A: 'Anterior',
                            P: 'Posterior'
                        }
                    },
                ],
                fks: [
                    { column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' },
                ],
                ui: [
                    { "column": "identificador_sistema_origem_pessoa" },
                    { "column": "periodo_aquisitivo" },
                    { "column": "sta_sequencial" },
                    { "column": "sta_tipo" },
                    { "column": "inicial" },
                    { "column": "final" },
                    { "column": "codigo_folha" },
                    { "column": "identificador_sistema_origem_orgao_folha" },
                ]
            }
        },

        {


            table: 'ferias_debitos_final', meta: {
                pk: ['identificador_sistema_origem_pessoa', 'periodo_aquisitivo', 'sta_sequencial', 'parte', 'quantidade_dias', 'justificativa'],
                enums: [
                    { key: 'id_tipo_debito_periodo_aquisit', table: 'Tabela Básica - TIPO DÉBITO PERÍODO AQUISITIVO' },
                ],
                fks: [
                    { column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' },
                ],
                ui: [
                    { "column": "identificador_sistema_origem_pessoa" },
                    { "column": "id_tipo_debito_periodo_aquisit" },
                    { "column": "periodo_aquisitivo" },
                    { "column": "sta_sequencial" },
                    { "column": "parte" },
                    { "column": "quantidade_dias" },
                    { "column": "justificativa" },
                ]
            }
        },

        {
            table: 'ferias_magistrados_final', meta: {
                pk: ['identificador_sistema_origem'],
                enums: [
                    { key: 'id_situacao', table: 'Tabela Básica - SITUAÇÃO' },
                    {
                        key: 'sta_tipo_ferias',
                        values: {
                            M: 'Marcação',
                            R: 'Remarcação',
                            C: 'Cancelamento',
                            I: 'Interrupção',
                        }
                    },
                    {
                        key: 'sta_abono_pecuniario',
                        values: {
                            N: 'Sem Abono Pecuniário',
                            A: 'Anterior',
                            P: 'Posterior',
                        }
                    },
                ],
                fks: [
                    { column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' },
                ],
                ui: [
                    { "column": "identificador_sistema_origem" },
                    { "column": "identificador_sistema_origem_pessoa" },
                    { "column": "id_situacao" },
                    { "column": "sta_tipo_ferias" },
                    { "column": "periodo_aquisitivo" },
                    { "column": "sta_sequencial" },
                    { "column": "inicio" },
                    { "column": "final" },
                    { "column": "sin_gratificacao_natalina" },
                    { "column": "sin_antecipacao_ferias" },
                    { "column": "justificativa" },
                    { "column": "sta_abono_pecuniario" },
                    { "column": "portaria" },
                    { "column": "despacho" },
                    { "column": "competencia" },
                    { "column": "email_enviado" },
                    { "column": "escala" },
                ],
                timeline: {
                    start: row => dateFromDDMMYYYY(row.inicio),
                    end: row => dateFromDDMMYYYY(row.final) || new Date(),
                    position: (row) => 'Férias',
                    name: (row) => `${row.periodo_aquisitivo}-${row.sta_sequencial}`,
                    tooltips: (row) => [{ label: 'Despacho', value: row.despacho }]
                }
            }
        },

        {
            table: 'ferias_primeiroperiodo_final', meta: {
                pk: ['identificador_sistema_origem_pessoa', 'periodo_aquisitivo', 'sta_sequencial'],
                fks: [
                    { column: 'identificador_sistema_origem_pessoa', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_pessoa' },
                ],
                ui: [
                    { "column": "identificador_sistema_origem_pessoa" },
                    { "column": "periodo_aquisitivo" },
                    { "column": "sta_sequencial" },
                    { "column": "inicio" },
                    { "column": "observacao" },
                ]
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
            table: 'movimentacao_magistrados_final', meta: {
                pk: ['identificador_sistema_origem_ingresso', 'inicio'],
                enums: [
                    { key: 'identificador_sistema_origem_lotacao', table: 'lotacoes_final' },
                    { key: 'id_natureza_movimentacao', table: 'Tabela Básica - NATUREZA MOVIMENTAÇÃO' },

                ],
                fks: [
                    { column: 'identificador_sistema_origem_ingresso', relatedTable: 'ingresso_magistrados_final', relatedColumn: 'identificador_sistema_origem_ingresso' },
                    { column: 'identificador_sistema_origem_lotacao', relatedTable: 'lotacoes_final', relatedColumn: 'identificador_sistema_origem' },
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
                ],
                timeline: {
                    start: row => dateFromDDMMYYYY(row.inicio),
                    end: row => dateFromDDMMYYYY(row.final),
                    position: (row) => 'Movimentacao',
                    name: (row) => (maiusculasEMinusculas(row._identificador_sistema_origem_lotacao || '')),
                }
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

    struc.forEach((s) => s.directory = s.directory || dir)

    return {
        directory: dir,
        month: mes,
        year: ano,
        reviewFilename: `${process.env.CSVIEWER_DIR_DATA}/review_serh.json`,
        tables: struc
    }
}
