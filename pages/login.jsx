import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'
import React, { useState, FormEvent } from 'react'
import Fetcher from '../utils/fetcher'
import { useRouter } from 'next/navigation'
import { Button, Form } from 'react-bootstrap';

export async function getServerSideProps({ params }) {
  return {
    props: {
      API_URL_BROWSER: process.env.API_URL_BROWSER,
    },
  };
}



export default function Login(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [senha, setSenha] = useState("");
  const [matricula, setMatricula] = useState("");
  const router = useRouter()


  const handleLogin = async (event) => {
    event.preventDefault();
    const auth = 'Basic ' + btoa(matricula.toUpperCase() + ':' + senha)
    await Fetcher.post(`${props.API_URL_BROWSER}api/login`, {}, {
      headers: {
        Authorization: auth
      }, setErrorMessage
    })
    window.location.href = '/'
    // router.back();
  }

  return (
    <div className="container content">
      <div className="px-4 my-3 text-center">
        <h1 className="text-success font-weight-bold" style={{ fontSize: "400%" }}><FontAwesomeIcon icon={faCheckToSlot} /></h1>
        <h1 className="display-5 fw-bold">CSViewer</h1>
      </div>

      <div className="px-4 py-1 my-1 text-center">
        <div className="col-lg-6 mx-auto">
          <h4>Login com credenciais do Siga-Doc</h4>
          <form onSubmit={(event) => logar(event)}>
            <Form.Control placeholder='Matricula SIGA' className='mt-2 w-100 text-center' type='input' value={matricula} onChange={e => setMatricula(e.target.value)}></Form.Control>
            <Form.Control placeholder='Senha SIGA' className='mt-1 w-100 text-center' type='password' value={senha} onChange={e => setSenha(e.target.value)}></Form.Control>
            <Button variant="primary" onClick={handleLogin} className="mt-2 w-100">Entrar</Button>
          </form>
        </div>
      </div>
    </div >
  )
}



