import { useRouter } from 'next/navigation'

export function refreshData() {
    const router = useRouter()
    router.refresh()
    // router.replace(router.asPath);
}