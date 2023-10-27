// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { SessionProvider } from "next-auth/react"
config.autoAddCss = false



// own css files here
// import "../css/customcss.css";
export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}