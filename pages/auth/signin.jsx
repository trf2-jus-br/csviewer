import { useRef } from "react";
import { getProviders, getSession, signIn } from "next-auth/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'
import { Button, Form } from 'react-bootstrap';
import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    const providers = await getProviders()
    if (session) {
        return {
            redirect: { destination: "/" },
        };
    }
    return {
        props: {
            providers,
        },
    }
}

const Signin = ({ providers }) => {
    const [errorMessage, setErrorMessage] = useState(undefined)
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    const email = useRef("");
    const password = useRef("");
    const router = useRouter()


    const handleSignInWithCredentials = async () => {
        const r = await signIn("credentials", {
            email: matricula, password: senha, redirect: false
        })
        if (r.ok) {
            console.log(r)
            router.replace('/')
            return
        }
        setErrorMessage('Erro: credenciais inválidas.')
    }

    return (
        <div className="p-5 bg-white md:flex-1">
            <div className="container content">
                <div className="px-4 my-3 text-center">
                    <h1 className="text-success font-weight-bold" style={{ fontSize: "400%" }}><FontAwesomeIcon icon={faCheckToSlot} /></h1>
                    <h1 className="display-5 fw-bold">CSViewer</h1>
                </div>

                <div className="px-4 py-1 my-1 text-center">
                    <div className="col-lg-6 mx-auto">
                        <h4>Login com credenciais do Siga-Doc</h4>
                        {errorMessage
                            ? <p className="alert alert-danger">{errorMessage}</p>
                            : <></>}
                        <form onSubmit={(event) => logar(event)}>
                            <Form.Control placeholder='Matricula SIGA' className='mt-2 w-100 text-center' type='input' value={matricula} onChange={e => setMatricula(e.target.value)}></Form.Control>
                            <Form.Control placeholder='Senha SIGA' className='mt-1 w-100 text-center' type='password' value={senha} onChange={e => setSenha(e.target.value)}></Form.Control>
                            <Button variant="primary" onClick={handleSignInWithCredentials} className="mt-2 w-100">Entrar</Button>
                        </form>
                    </div>
                </div>
            </div >

            <div className="text-center mt-3">
                {providers &&
                    Object.values(providers).map(provider => {
                        if (provider.name !== "Credentials") {
                            return (
                                <div key={provider.name} style={{ marginBottom: 0 }}>
                                    <a href="#" onClick={() => signIn(provider.id)}>
                                        <span>Acessar com {provider.name}</span>
                                    </a>
                                </div>
                            )
                        }
                    })}
            </div>
        </div>
    )
}
export default Signin
