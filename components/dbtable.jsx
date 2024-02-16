import React from 'react'
import DebouncedInput from './debouncedInput'
import { humanize } from '../utils/text'
import Func from '../utils/func'
import { consultarStatusPorPk } from '../utils/rv-util'

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

export default function DbTable(dbtable, review) {

    const columns = dbtable.meta.ui.filter(c => c.column).map((c, idx) => {
        const col = {
            accessorFn: (originalRow, index) => originalRow[`_${c.column}`] || originalRow[c.column],
            header: c.caption,
            enableSorting: true,
        }
        if (dbtable.meta.pk.includes(c.column))
            col.cell = data => <a href={`/table/${dbtable.meta.name}/record/${encodeURIComponent(Func.pk(dbtable, data.row.original))}`}>{data.getValue()}</a>
        return col
    })

    const [sorting, setSorting] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    // console.log(columns)
    const table = useReactTable({
        data: dbtable.data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    // console.log(columns)

    return (
        <>
            <div className="row" key={`table header: ${dbtable.meta.name}`}>
                <div className="col"><h3>{humanize(dbtable.meta.name)}</h3></div>
                <div className="col col-6 col-md-2">
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder="Pesquisar"
                    />
                </div>
                <div className="col col-auto">
                    <Pagination>
                        <Pagination.First onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()} />
                        <Pagination.Prev onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()} />
                        <Pagination.Item> {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}</Pagination.Item>
                        <Pagination.Next onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()} />
                        <Pagination.Last onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()} />
                    </Pagination>
                </div>
                <div className="col col-auto"><Form.Select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50, 100, 200, 500, 1000].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Exibir {pageSize}
                        </option>
                    ))}
                </Form.Select></div>
            </div>
            <BTable striped bordered hover size="sm" key={`table: ${dbtable.meta.name}`}>
                <thead className="table-dark">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    <div
                                        {...{
                                            className: header.column.getCanSort()
                                                ? 'cursor-pointer select-none'
                                                : '',
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted()] ?? null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        const pk = Func.pk(dbtable, row.original)
                        return (
                            <tr key={row.id} className={'table-' + consultarStatusPorPk(review, pk, row.original)}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </BTable>
        </>
    )
}