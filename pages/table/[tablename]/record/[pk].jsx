import React, { useState } from 'react';
import Layout from '../../../../components/layout'
import DbTable from '../../../../components/dbtable'
import { humanize } from '../../../../utils/text'
import Serialize from '../../../../utils/serialize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug, faBugSlash } from '@fortawesome/free-solid-svg-icons'
import ModalText from '../../../../components/modalText'
// import Button from 'react-bootstrap/Button';
import {
  flexRender,
  PaginationState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Form, Row, Button } from 'react-bootstrap'
import Fetcher from '../../../../utils/fetcher'
import { useRouter } from 'next/navigation'

import { useContext } from '../../../../utils/context'
import { consultarStatus } from '../../../../utils/rv-util'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../api/auth/[...nextauth]"

export async function getServerSideProps({ req, res, params }) {
  if (!await getServerSession(req, res, authOptions)) return { redirect: { destination: '/auth/signin', permanent: false } }
  const context = await useContext()

  const props = {
    CSVIEWER_API_URL_BROWSER: process.env.CSVIEWER_API_URL_BROWSER,
    tablename: params.tablename,
    tablemeta: { name: '', headers: [] },
    record: {},
    related: []
  }

  if (context.db.tables[params.tablename]) {
    const table = context.db.tables[params.tablename]
    props.tablemeta = table.meta
    props.record = context.db.record(params.tablename, params.pk)
    props.pk = params.pk

    props.rv = context.rv.consultarPorPK(props.tablename, props.pk)

    // Add related table information
    if (table.meta.related) {
      table.meta.related.forEach(r => {
        let rtable = context.db.tables[r]
        if (!rtable) {
          rtable = { meta: { name: '', headers: [], fks: [] }, data: [] }
        } else {
          const fks = rtable.meta.fks.filter(fk => fk.relatedTable === props.tablename)
          if (!fks || fks.length === 0) throw new Error(`FK not found: ${rtable.meta.name} -> ${props.tablename}`)
          const fk = fks[0]
          // console.log(fk)
          const relatedColumns = fk.column.split('|')
          const myColumns = (fk.relatedColumn || fk.column).split('|')
          const filtered = rtable.data.filter(row => {
            for (let i = 0; i < relatedColumns.length; i++) {
              if (row[relatedColumns[i]] && props.record[myColumns[i]] === row[relatedColumns[i]]) {
                // console.log(`Equal: ${myColumns[i]}: ${props.record[myColumns[i]]} === ${relatedColumns[i]}: ${row[relatedColumns[i]]}`)
                continue
              }
              // console.log(row)
              // console.log(`Different: ${myColumns[i]}: ${props.record[myColumns[i]]} === ${relatedColumns[i]}: ${row[relatedColumns[i]]}`)
              return false
            }
            return true
          })

          props.related.push({
            meta: rtable.meta, data: filtered, review: context.rv.data[rtable.meta.name]
          })
        }
      })
    }
  }

  return { props: Serialize.removeUndefineds(props) };
}

export default function Record(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [selectedField, setSelectedField] = useState(undefined)
  const [showModalReportError, setShowModalReportError] = useState(false)
  const router = useRouter()

  const openModalReportError = (field) => {
    setSelectedField(field)
    setShowModalReportError(true)
  }

  const closeModalReportError = () => {
    setShowModalReportError(false)
    setSelectedField(undefined)
  }

  const handleReportError = async (text) => {
    try {
      await Fetcher.post(`${props.CSVIEWER_API_URL_BROWSER}api/addError`, {
        tablename: props.tablename,
        pk: props.pk,
        field: selectedField.name,
        value: props.record[selectedField.name],
        message: text,
      }, { setErrorMessage })
      // console.log(`fetched`)
      router.refresh();
    } catch (e) { }
    closeModalReportError()
  }

  const handleRemoveError = async (field) => {
    await Fetcher.post(`${props.CSVIEWER_API_URL_BROWSER}api/removeError`, {
      tablename: props.tablename,
      pk: props.pk,
      field: field.name,
      value: props.record[field.name],
      message: undefined,
    }, { setErrorMessage })
    // console.log(`fetched`)
    router.refresh();
  }

  const handleApprove = async () => {
    await Fetcher.post(`${props.CSVIEWER_API_URL_BROWSER}api/addApprove`, {
      tablename: props.tablename,
      pk: props.pk,
      record: props.record,
      message: undefined,
    }, { setErrorMessage })
    // console.log(`fetched`)
    router.back();
  }

  const handleRemoveApprove = async () => {
    await Fetcher.post(`${props.CSVIEWER_API_URL_BROWSER}api/removeApprove`, {
      tablename: props.tablename,
      pk: props.pk,
      record: props.record,
      message: undefined,
    }, { setErrorMessage })
    // console.log(`fetched`)
    router.refresh();
  }

  const events = (array) => {
    return (<>
      <h4>Eventos</h4>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th style={{ textAlign: 'right' }}>#</th>
            <th>Data/Hora</th>
            <th>Responsável</th>
            <th>Evento</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {array.map((i, idx) => {
            const date = new Date(i.date)
            return (
              <tr key={idx}>
                <th style={{ textAlign: 'right' }}>{idx + 1}</th>
                <td>{date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR')}</td>
                <td>{i.username}</td>
                <td>{i.kind}</td>
                <td>{i.message}</td>
              </tr>
            )
          })}
        </tbody>
      </table></>)
  }

  const pkValue = props.pk.split('|')
  const status = consultarStatus(props.rv, props.record)
  const statusClass = 'text-' + status

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <div className="row mb-3">
        <div className="col"><h3>
          <span className={statusClass}>{humanize(props.tablemeta.name)}</span>
          {props.tablemeta.pk.map((s, idx) => {
            return (<span className={statusClass} key={s}>, {humanize(s)}: {pkValue[idx]}</span>)
          })}
        </h3></div>
        <div className="col col-auto">
          <Button variant="success" onClick={handleApprove} hidden={status === 'success'}>Aprovar</Button>
          <Button variant="secondary" onClick={handleRemoveApprove} hidden={status !== 'success'}>Cancelar Aprovação</Button>
        </div>
      </div>
      <Form>
        <Row>
          {props.tablemeta.ui.map(h => {
            const error = props.rv && props.rv.error ? props.rv.error[h.column] : undefined
            //const error = false
            return (
              <>
                {h.group ? (<div className="col col-12"><h4>{h.group}</h4></div>) : ''}
                <Form.Group className={`mb-3 col ${h.width ? 'col-' + h.width : 'col-auto'}`} controlId={h.column} key={h.column}>
                  <Form.Label className="mb-0 w-100" style={{whiteSpace: 'nowrap'}}>
                    <div className="rowx">
                      <span className="colx me-autox">{h.caption}
                      {error
                        ? (<span className="colx col-autox" style={{ color: 'red' }}><a onClick={() => handleRemoveError(h)}><FontAwesomeIcon icon={faBug} /></a></span>)
                        : (<span className="colx col-autox" style={{ color: 'lightgray' }}><a onClick={() => openModalReportError(h)}><FontAwesomeIcon icon={faBugSlash} /></a></span>)
                      }
                      </span>
                    </div>
                  </Form.Label>
                  <span className="form-control" style={{whiteSpace: 'nowrap'}} dangerouslySetInnerHTML={{ __html: props.record[h.column] ? props.record[h.column] : '&nbsp' }} />
                  {props.rv && props.rv.approved && props.record[h.column] !== props.rv.approved[h.column]
                    ?
                    <><Form.Label className="mt-1 mb-0 w-100"><span className="text-warning">Valor Aprovado</span></Form.Label><span className="form-control bg-warning" dangerouslySetInnerHTML={{ __html: props.rv.approved[h.column] ? props.rv.approved[h.column] : '&nbsp' }} /></>
                    : ''}
                </Form.Group>
              </>
            )
          })}
        </Row>
      </Form>

      {props.related ? props.related.map(t => DbTable(t, t.review)) : ''}

      {props.rv && props.rv.event ? events(props.rv.event) : ''}

      <ModalText show={showModalReportError} onOk={handleReportError} onCancel={closeModalReportError} title="Reportar Problema" caption="Problema" text={`Descreva o problema encontrado no campo ${selectedField ? selectedField.caption : ''}.`} />
    </Layout >
  )
}
