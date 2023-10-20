import React, { useState } from 'react';
import Layout from '../../../../components/layout'
import DbTable from '../../../../components/dbtable'
import context from '../../../../utils/context'
import TextUtils from '../../../../utils/text'
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

export function getServerSideProps({ params }) {
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
      router.refresh()
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
    router.refresh()
  }

  const pkValue = props.pk.split('|')

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <div className="row mb-3">
        <div className="col"><h3>
          {TextUtils.humanize(props.tablemeta.name)}
          {props.tablemeta.pk.map((s, idx) => {
            return (<span>, {TextUtils.humanize(s)}: {pkValue[idx]}</span>)
          })}
        </h3></div>
        <div className="col col-auto"><Button variant="primary" onClick={props.onOk}>Aprovar</Button></div>
      </div>
      <Form>
        <Row>
          {props.tablemeta.headers.map(h => {
            const erro = props.rv && props.rv.erro ? props.rv.erro[h.name] : undefined
            //const erro = false
            return (
              <Form.Group className="mb-3 col col-2" controlId={h.name} key={h.name}>
                <Form.Label className="mb-0 w-100">
                  <div className="row">
                    <div className="col me-auto">{h.caption}</div>
                    {erro
                      ? (<div className="col col-auto" style={{ color: 'red' }}><a onClick={() => handleRemoveError(h)}><FontAwesomeIcon icon={faBug} /></a></div>)
                      : (<div className="col col-auto" style={{ color: 'lightgray' }}><a onClick={() => openModalReportError(h)}><FontAwesomeIcon icon={faBugSlash} /></a></div>)
                    }

                  </div>
                </Form.Label>
                <span className="form-control" dangerouslySetInnerHTML={{ __html: props.record[h.name] ? props.record[h.name] : '&nbsp' }} />
              </Form.Group>
            )
          })}
        </Row>
      </Form>

      {props.related ? props.related.map(t => DbTable(t)) : ''}

      <ModalText show={showModalReportError} onOk={handleReportError} onCancel={closeModalReportError} title="Reportar Problema" caption="Problema" text={`Descreva o problema encontrado no campo ${selectedField ? selectedField.caption : ''}.`} />
    </Layout >
  )
}
