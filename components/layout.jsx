import Head from 'next/head';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons'
import ModalError from './modalError'
import useSWR, { SWRConfig } from 'swr'
import Fetcher from '../utils/fetcher'
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

export const siteTitle = 'CSViewer';

export default function Layout({ children, errorMessage, setErrorMessage }) {
    const { data, error, isLoading } = useSWR(`/api/context`, Fetcher.fetcher, { refreshInterval: 2000 });
    if (error) return <div>falhou em carregar</div>
    if (isLoading) return <div>carregando...</div>
    if (data.loading) return <div>inicializando contexto...</div>

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
            <div className="navbar navbar-dark bg-dark shadow-sm mb-4">
                <div className="container-fluid">
                    <div className="navbar-brand d-flex align-items-center">
                        <a href="/">
                            <span className="text-success font-weight-bold" style={{ fontSize: "150%" }}><FontAwesomeIcon icon={faCheckToSlot} /></span></a>&nbsp;&nbsp;
                        <strong>CSViewer {data.loading}</strong>
                    </div>
                </div>
            </div>
        </header>

        <div className="container-fluid mb-3">
            {children}
        </div>
        <ModalError show={errorMessage} onOk={() => setErrorMessage(undefined)} onCancel={() => setErrorMessage(undefined)} title="Atenção" text={errorMessage} />
    </>
    );
}