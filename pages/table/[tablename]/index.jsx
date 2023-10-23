import React from 'react'
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
import { Table as BTable, Pagination, Form } from 'react-bootstrap'

import { useContext } from '../../../utils/context'

export async function getServerSideProps({ params }) {
  const context = await useContext()

  // console.log('TABLE ' + params.tablename)
  // console.log(context.db.tables[params.tablename])

  const props = {
    API_URL_BROWSER: process.env.API_URL_BROWSER
  }

  let table = context.db.tables[params.tablename]
  if (!table)
    table = { meta: { name: '', headers: [] }, data: [] }
  props.table = table

  return { props: Serialize.removeUndefineds(props) };
}



export default function Dashboard(props) {

  return (
    <Layout>
      {DbTable(props.table)}
    </Layout>
)

}
