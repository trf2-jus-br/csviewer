import Head from 'next/head';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons'
import ModalError from './modalError'
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import { useSession, signIn, signOut } from "next-auth/react"

export const siteTitle = 'CSViewer';

export default function Layout({ children, errorMessage, setErrorMessage }) {
    const { data: session } = useSession()

    return (<>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
                name="description"
                content="Learn how to build a personal website using Next.js"
            />
            <meta
                property="og:image"
                content={`https://og-image.vercel.app/${encodeURI(
                    siteTitle,
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large_image" />
            <title>{siteTitle}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
            <div className="navbar navbar-dark bg-dark shadow-sm mb-4 navbar-expand-lg">
                <div className="container-fluid">
                    <div className="navbar-brand d-flex align-items-center">
                        <a href="/">
                            <span className="text-success font-weight-bold" style={{ fontSize: "150%" }}><FontAwesomeIcon icon={faCheckToSlot} /></span></a>&nbsp;&nbsp;
                        <strong>CSViewer</strong>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    </div>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {session
                            ? <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#" onClick={() => signOut()}>{session.user.nome} | Logout</a>
                            </li>
                            : session === null
                                ? <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#" onClick={() => signIn()}>Login</a>
                                </li>
                                : <></>}
                    </ul>
                </div>
            </div>
        </header>

        {session
            ? <div className="container-fluid mb-3">{children}</div>
            : session === null
                ? <div className="container mb-3"><div className="mt-5 text-center">
                    <p className="alert alert-warning">Você não está logado no sistema. Clique no botão abaixo para fazer o login.</p>
                    <div className="mt-5">
                        <button className="btn btn-primary" onClick={() => signIn()}>Sign in</button>
                    </div>
                </div></div >
                : <></>}
        <ModalError show={errorMessage} onOk={() => setErrorMessage(undefined)} onCancel={() => setErrorMessage(undefined)} title="Atenção" text={errorMessage} />
    </>
    )

}