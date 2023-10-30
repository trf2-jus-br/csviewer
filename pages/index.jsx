import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot, faRefresh, faUserAltSlash } from '@fortawesome/free-solid-svg-icons'
import { useContext } from '../utils/context'
import { consultarStatusPorPk } from '../utils/rv-util'
import Func from '../utils/func'
import React, { useState } from 'react'
import Fetcher from '../utils/fetcher'
import { useRouter } from 'next/navigation'
import Layout from '../components/layout'

import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"

export async function getServerSideProps({ req, res, params }) {
  if (!await getServerSession(req, res, authOptions)) return { redirect: { destination: '/auth/signin', permanent: false } }
  
  const context = await useContext()

  function consultarStatus(tablename, record) {
    const tablerv = context.rv.data[tablename]
    if (!tablerv) return undefined
    const recordpk = Func.pk(context.db.tables[tablename], record)
    const status = consultarStatusPorPk(tablerv, recordpk, record)
    return status
  }

  function consultarExcluidos(tablename) {
    const tablerv = context.rv.data[tablename]
    if (!tablerv) return ''
    return Object.keys(tablerv).reduce((acc, key) => context.db.tables[tablename].index[key] ? 0 : 1, 0);
  }

  return {
    props: {
      API_URL_BROWSER: process.env.API_URL_BROWSER,
      tables: context.db.tableNames.map((i, idx) => {
        return {
          meta: JSON.parse(JSON.stringify(context.db.tables[i].meta)),
          rows: context.db.tables[i].data.length,
          waiting: context.db.tables[i].data.reduce((acc, item) => consultarStatus(i, item) === undefined ? acc + 1 : acc, 0),
          approved: context.db.tables[i].data.reduce((acc, item) => consultarStatus(i, item) === 'success' ? acc + 1 : acc, 0),
          reproved: context.db.tables[i].data.reduce((acc, item) => consultarStatus(i, item) === 'danger' ? acc + 1 : acc, 0),
          altered: context.db.tables[i].data.reduce((acc, item) => consultarStatus(i, item) === 'warning' ? acc + 1 : acc, 0),
          removed: consultarExcluidos(i)
        }
      })
    },
  };
}

const tableNameRows = (tables) =>
  tables.map((i, idx) => {
    const modified = new Date(i.meta.modified)
    return (
      <tr key={i.meta.name}>
        <th style={{ textAlign: 'right' }}>{idx + 1}</th>
        <td><a href={`table/${i.meta.name}`}>{i.meta.name}</a></td>
        <td style={{ textAlign: 'right' }}>{modified.toLocaleDateString('pt-BR')}</td>
        <td style={{ textAlign: 'right' }}>{modified.toLocaleTimeString('pt-BR')}</td>
        <td style={{ textAlign: 'right' }}>{i.rows}</td>
        <td style={{ textAlign: 'right' }} className={'text-primary' + (i.waiting && !i.reproved && !i.altered && !i.removed ? ' table-primary' : '')}>{i.waiting ? i.waiting : ''}</td>
        <td style={{ textAlign: 'right' }} className={'text-success' + (i.approved && i.approved === i.rows ? ' table-success' : '')}>{i.approved ? i.approved : ''}</td>
        <td style={{ textAlign: 'right' }} className={'text-danger' + (i.reproved ? ' table-danger' : '')}>{i.reproved ? i.reproved : ''}</td>
        <td style={{ textAlign: 'right' }} className={'text-warning' + (i.altered ? ' table-warning' : '')}>{i.altered ? i.altered : ''}</td>
        <td style={{ textAlign: 'right' }} className={'text-secondary' + (i.removed ? ' table-secondary' : '')}>{i.removed ? i.removed : ''}</td>
      </tr>
    );
  });

export default function Home(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [reloading, setReloading] = useState(false)
  const router = useRouter()

  const handleReloadContext = async (field) => {
    setReloading(true)
    await Fetcher.post(`${props.API_URL_BROWSER}api/reloadContext`, {}, { setErrorMessage })
    console.log(`fetched`)
    router.refresh()
  }

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <div className="container-fluid content">
        <div className="row">
          <div className="col"><h3 className="mb-1">Tabelas</h3></div>
          <div className="col col-auto"><Button variant={reloading ? 'warning' : 'light'} onClick={handleReloadContext}><FontAwesomeIcon icon={faRefresh} /></Button></div>
        </div>

        <table className="table table-sm table-striped">
          <thead>
            <tr>
              <th style={{ textAlign: 'right' }}>#</th>
              <th>Nome</th>
              <th>Data</th>
              <th>Hora</th>
              <th style={{ textAlign: 'right' }}>Registros</th>
              <th style={{ textAlign: 'right' }}>Aguardando</th>
              <th style={{ textAlign: 'right' }}>Aprovados</th>
              <th style={{ textAlign: 'right' }}>Reprovados</th>
              <th style={{ textAlign: 'right' }}>Alterados</th>
              <th style={{ textAlign: 'right' }}>Excluídos</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {tableNameRows(props.tables)}
          </tbody>
        </table>
      </div ></Layout>
  )
}