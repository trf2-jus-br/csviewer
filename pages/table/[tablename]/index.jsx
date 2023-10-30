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
import { Table as BTable, Pagination, Form } from 'react-bootstrap'

import { useContext } from '../../../utils/context'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]"

export async function getServerSideProps({ req, res, params }) {
  if (!await getServerSession(req, res, authOptions)) return { redirect: { destination: '/auth/signin', permanent: false } }
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

  let review = context.rv.data[params.tablename]
  props.review = review

  return { props: Serialize.removeUndefineds(props) };
}



export default function Table(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      {DbTable(props.table, props.review)}
    </Layout>
)

}
