export default [
    {
        table: 'Tabela Básica - ÓRGÃO TIPO', meta: { pk: ['id_orgao_tipo'], descr: 'nome' }
    },
    {
        table: 'Tabela Básica - ÓRGÃO PODER', meta: { pk: ['id_orgao_poder'], descr: 'nome' }
    },

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
        table: 'pessoas_ingressos_magistrados_meta', meta: {
            pk: ['identificador_sistema_origem_ingresso'],
            descr: 'nome_pessoa',
            fks: [{
                table: 'orgaos_meta', fk: 'identificador_sistema_origem_orgao'
            }],
            related: ['desligamento_magistrados_meta']
        }
    },

    {
        table: 'desligamento_magistrados_meta', meta: {
            pk: ['identificador_sistema_origem_ingresso', 'efetivo_desligamento'],
            fks: [{
                table: 'pessoas_ingressos_magistrados_meta', fk: 'identificador_sistema_origem_ingresso'
            }],
        }
    }
]