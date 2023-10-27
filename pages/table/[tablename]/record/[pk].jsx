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

export async function getServerSideProps({ params }) {
  const context = await useContext()

  const props = {
    API_URL_BROWSER: process.env.API_URL_BROWSER,
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
          rtable = { meta: { name: '', headers: [] }, data: [] }
        } else {
          const pkValues = params.pk.split('|')
          // console.log(pkValues)
          // console.log(table.meta.pk)
          const filtered = rtable.data.filter(row => {
            for (let i = 0; i < table.meta.pk.length; i++) {
              if (row[table.meta.pk[i]] === pkValues[i]) {
                // console.log(`Equal: ${row[table.meta.pk[i]]} === ${pkValues[i]}`)
                continue
              }
              return false
            }
            return true
          })

          props.related.push({
            meta: rtable.meta, data: filtered
          })
        }
      })
    }
  }

  return { props: Serialize.removeUndefineds(props) };
}

export default function Dashboard(props) {
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
      await Fetcher.post(`${props.API_URL_BROWSER}api/addError`, {
        tablename: props.tablename,
        pk: props.pk,
        field: selectedField.name,
        value: props.record[selectedField.name],
        message: text,
      }, { setErrorMessage })
      console.log(`fetched`)
      router.refresh();
    } catch (e) { }
    closeModalReportError()
  }

  const handleRemoveError = async (field) => {
    await Fetcher.post(`${props.API_URL_BROWSER}api/removeError`, {
      tablename: props.tablename,
      pk: props.pk,
      field: field.name,
      value: props.record[field.name],
      message: undefined,
    }, { setErrorMessage })
    console.log(`fetched`)
    router.refresh();
  }

  const handleApprove = async () => {
    await Fetcher.post(`${props.API_URL_BROWSER}api/addApprove`, {
      tablename: props.tablename,
      pk: props.pk,
      record: props.record,
      message: undefined,
    }, { setErrorMessage })
    console.log(`fetched`)
    router.back();
  }

  const handleRemoveApprove = async () => {
    await Fetcher.post(`${props.API_URL_BROWSER}api/removeApprove`, {
      tablename: props.tablename,
      pk: props.pk,
      record: props.record,
      message: undefined,
    }, { setErrorMessage })
    console.log(`fetched`)
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
                <td>{i.user}</td>
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
            return (<span className={statusClass}>, {humanize(s)}: {pkValue[idx]}</span>)
          })}
        </h3></div>
        <div className="col col-auto">
          <Button variant="success" onClick={handleApprove} hidden={status === 'success'}>Aprovar</Button>
          <Button variant="secondary" onClick={handleRemoveApprove} hidden={status !== 'success'}>Cancelar Aprovação</Button>
        </div>
      </div>
      <Form>
        <Row>
          {props.tablemeta.headers.map(h => {
            const error = props.rv && props.rv.error ? props.rv.error[h.name] : undefined
            //const error = false
            return (
              <Form.Group className="mb-3 col col-3" controlId={h.name} key={h.name}>
                <Form.Label className="mb-0 w-100">
                  <div className="row">
                    <div className="col me-auto">{h.caption}</div>
                    {error
                      ? (<div className="col col-auto" style={{ color: 'red' }}><a onClick={() => handleRemoveError(h)}><FontAwesomeIcon icon={faBug} /></a></div>)
                      : (<div className="col col-auto" style={{ color: 'lightgray' }}><a onClick={() => openModalReportError(h)}><FontAwesomeIcon icon={faBugSlash} /></a></div>)
                    }
                  </div>
                </Form.Label>
                <span className="form-control" dangerouslySetInnerHTML={{ __html: props.record[h.name] ? props.record[h.name] : '&nbsp' }} />
                {props.rv && props.rv.approved && props.record[h.name] !== props.rv.approved[h.name]
                  ?
                  <><Form.Label className="mt-1 mb-0 w-100"><span className="text-warning">Valor Aprovado</span></Form.Label><span className="form-control bg-warning" dangerouslySetInnerHTML={{ __html: props.rv.approved[h.name] ? props.rv.approved[h.name] : '&nbsp' }} /></>
                  : ''}
              </Form.Group>
            )
          })}
        </Row>
      </Form>

      {props.related ? props.related.map(t => DbTable(t)) : ''}

      {props.rv && props.rv.event ? events(props.rv.event) : ''}

      <ModalText show={showModalReportError} onOk={handleReportError} onCancel={closeModalReportError} title="Reportar Problema" caption="Problema" text={`Descreva o problema encontrado no campo ${selectedField ? selectedField.caption : ''}.`} />
    </Layout >
  )
}
