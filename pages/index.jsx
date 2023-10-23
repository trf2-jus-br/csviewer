import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'
import { useContext } from '../utils/context'

export async function getServerSideProps({ params }) {
  const context = await useContext()

  // console.log('CORRENTE')
  // console.log(context.db)
  return {
    props: {
      API_URL_BROWSER: process.env.API_URL_BROWSER,
      tables: context.db.tableNames.map((i, idx) => {
        return {
          meta: JSON.parse(JSON.stringify(context.db.tables[i].meta)),
          rows: context.db.tables[i].data.length
        }
      })
    },
  };
}

const tableNameRows = (tables) =>
  tables.map((i, idx) => {
    return (
      <tr key={i.meta.name}>
        <th style={{ textAlign: 'right' }}>{idx + 1}</th>
        <td><a href={`table/${i.meta.name}`}>{i.meta.name}</a></td>
        <td style={{ textAlign: 'right' }}>{i.rows}</td>
        <td style={{ textAlign: 'right' }}></td>
        <td style={{ textAlign: 'right' }}></td>
        <td style={{ textAlign: 'right' }}></td>
        <td style={{ textAlign: 'right' }}></td>
        <td style={{ textAlign: 'right' }}></td>
      </tr>
    );
  });

export default function Home(props) {
  return (
    <div className="container content">
      <div className="px-4 my-3 text-center">
        <h1 className="text-success font-weight-bold" style={{ fontSize: "400%" }}><FontAwesomeIcon icon={faCheckToSlot} /></h1>
        <h1 className="display-5 fw-bold">CSViewer</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">CSViewer é um sistema desenvolvido para visualizar os dados que serão exportados para o SERH do Tribunal Regional Federal da 2&ordf; Região.</p>
        </div>
      </div>

      <h3 className="mb-1">Tabelas</h3>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th style={{ textAlign: 'right' }}>#</th>
            <th>Nome</th>
            <th style={{ textAlign: 'right' }}>Linhas</th>
            <th style={{ textAlign: 'right' }}>Novas</th>
            <th style={{ textAlign: 'right' }}>Aprovadas</th>
            <th style={{ textAlign: 'right' }}>Reprovadas</th>
            <th style={{ textAlign: 'right' }}>Alteradas</th>
            <th style={{ textAlign: 'right' }}>Excluídas</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {tableNameRows(props.tables)}
        </tbody>
      </table>
    </div >
  )
}