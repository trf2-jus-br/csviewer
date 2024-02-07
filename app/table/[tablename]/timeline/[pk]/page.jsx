import { useContext } from '../../../../../utils/context'
import { consultarStatus } from '../../../../../utils/rv-util'
import Timeline from '../../../../timeline'
import { renderToStringServer } from '../../../../../utils/text'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'

export default async function Record({ params }) {
  // console.log(params)
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
      const related = [...table.meta.related]
      const removed = related.splice(related.indexOf('designacao_magistrados_final'), 1)
      if (removed.length > 0) related.push(removed[0])
      // console.log(related)
      related.forEach(r => {
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

  const pkValue = props.pk.split('|')
  const status = consultarStatus(props.rv, props.record)
  const statusClass = 'text-' + status

  const data = [[
    { type: "string", id: "Position" },
    { type: "string", id: "Name" },
    { type: "string", role: "tooltip" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" }]]

  if (props.related) {
    let maxDate = new Date(0, 0, 0)

    // Find the max date
    props.related.forEach(r => {
      if (r.meta.timeline) {
        const tl = r.meta.timeline;
        r.data
          .filter(d => tl.start(d))
          .forEach(d => {
            if (tl.start(d) && tl.start(d) > maxDate) maxDate = tl.start(d)
            if (tl.end(d) && tl.end(d) > maxDate) maxDate = tl.end(d)
          })
      }
    });

    const tooltip2 = (position, name, start, end, d) => {
      return `<div style="padding:.5em .5em .5em .5em;">${name}<br>${start.toLocaleDateString()} - ${end.toLocaleDateString()}</div>`
    }

    // Method that computes the difference between two dates in days, months and years as a string
    // shows only the units of time that are not zero
    const dateDiff = (start, end) => {
      const diff = end - start
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const months = Math.floor(days / 30)
      const years = Math.floor(months / 12)
      let s = ''
      if (years > 0) s += `${years} ano${years > 1 ? 's' : ''}`
      if (months > 0) s += `${s ? (days > 0 ? ', ' : ' e ') : ''}${months} mês${months > 1 ? 'es' : ''}`
      if (days > 0) s += `${s ? ' e ' : ''}${days} dia${days > 1 ? 's' : ''}`
      return s ? s : undefined
    }

    const tooltip = (position, name, start, end, tooltips) => {
      return renderToStringServer(
        <div style={{ minWidth: '15em', maxWidth: '20em', backgroundColor: 'white', border: '1px solid black', fontFamily: 'sans-serif' }}>
          <div style={{ padding: '.5em .5em .5em .5em', fontWeight: 'bold', textAlign: 'left', backgroundColor: 'lightgray' }}>
            {position}
          </div>
          <hr c style={{ margin: '0' }} />
          <div style={{ padding: '.5em .5em .5em .5em', fontWeight: 'bold' }}>
            {name}
          </div>
          <hr c style={{ margin: '0' }} />
          <div style={{ padding: '.5em .5em .5em .5em' }}>
            <b>De:</b> {start.toLocaleDateString()} <b>a:</b> {end.toLocaleDateString()}
            {dateDiff(start, end)
              ? <><br /><b>Duração:</b> {dateDiff(start, end)}</>
              : <></>}
          </div>
          {tooltips.filter(t => t.value).map(t =>
            <>
              <hr key={`hr-${t.label}`} style={{ margin: '0' }} />
              <div key={`div-${t.label}`} style={{ padding: '.5em .5em .5em .5em' }}><b>{t.label}:</b> {t.value}</div>
            </>
          )}
        </div>)
    }

    props.related.forEach(r => {
      if (r.meta.timeline) {
        const tl = r.meta.timeline;
        r.data
          .filter(d => tl.start(d))
          .sort((a, b) => (tl.end(b) || maxDate) - (tl.end(a) || maxDate))
          .forEach(d => {
            const position = tl.position(d)
            const name = tl.name(d)
            const start = tl.start(d)
            const end = tl.end(d) || maxDate
            const tooltips = tl.tooltips ? tl.tooltips(d) : []
            data.push([position, name, tooltip(position, name, start, end, tooltips), start, end]);
          })
      }
    });
  }

  // console.log(data);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark shadow-sm mb-4 navbar-expand-lg" >
        <div className="container-fluid">
          <div className="navbar-brand d-flex align-items-center">
            <a href="/">
              <span className="text-success font-weight-bold" style={{ fontSize: "150%" }}><FontAwesomeIcon icon={faCheckToSlot} /></span></a>&nbsp;&nbsp;
            <strong>Timeline</strong>
          </div>
        </div>
      </nav>

      <h2 className='mt-3 mb-3' style={{ textAlign: 'center' }}>{props.record[props.tablemeta.descr]}</h2>
      <div className="container-fluid content h-100">
        <Timeline data={data} />
      </div>

    </>
  )
}
