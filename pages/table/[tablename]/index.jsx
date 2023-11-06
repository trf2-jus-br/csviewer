import React, { useState } from 'react';
import Layout from '../../../components/layout'
import DbTable from '../../../components/dbtable'
import DebouncedInput from '../../../components/debouncedInput'
import TextUtils from '../../../utils/text'
import Serialize from '../../../utils/serialize'
import Func from '../../../utils/func'
import {
  flexRender,
  PaginationState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Table as BTable, Pagination, Form, Button } from 'react-bootstrap'
import { useContext } from '../../../utils/context'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]"
import Fetcher from '../../../utils/fetcher'
import { useRouter } from 'next/navigation'

export async function getServerSideProps({ req, res, params }) {
  if (!await getServerSession(req, res, authOptions)) return { redirect: { destination: '/auth/signin', permanent: false } }
  const context = await useContext()

  // console.log('TABLE ' + params.tablename)
  // console.log(context.db.tables[params.tablename])

  const props = {
    CSVIEWER_API_URL_BROWSER: process.env.CSVIEWER_API_URL_BROWSER,
    tablename: params.tablename
  }

  let table = context.db.tables[params.tablename]
  if (!table)
    table = { meta: { name: '', headers: [] }, data: [] }
  props.table = table

  let review = context.rv.data[params.tablename]
  props.review = review

  return { props: Serialize.removeUndefineds(props) };
}



export default function Table(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  const router = useRouter()

  const handleApprove = async () => {
    console.log(`Vou aprovar ${props.table.data.length}`)
    for (let i = 0; i<props.table.data.length; i++) {
      const record = props.table.data[i]
      await Fetcher.post(`${props.CSVIEWER_API_URL_BROWSER}api/addApprove`, {
        tablename: props.tablename,
        pk: Func.pk(props.table, record),
        record: record,
        message: undefined,
      }, { setErrorMessage })
    }
    router.back();
    console.log(`fetched`)
  }

  const handleRemoveApprove = async () => {
    await Fetcher.post(`${props.CSVIEWER_API_URL_BROWSER}api/removeApprove`, {
      tablename: props.tablename,
      pk: props.pk,
      record: props.record,
      message: undefined,
    }, { setErrorMessage })
    console.log(`fetched`)
    router.refresh();
  }


  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      {DbTable(props.table, props.review)}
      <div className="row mb-3">
        <div className="col"></div>
        <div className="col col-auto">
          <Button variant="success" onClick={handleApprove}>Aprovar Todos</Button> &nbsp;
          <Button variant="secondary" onClick={handleRemoveApprove}>Cancelar Aprovação de Todos</Button>
        </div>
      </div>
    </Layout>
  )

}
