export default {
    removeUndefineds(o) {
        if (process.env.NODE_ENV !== 'production')
            return JSON.parse(JSON.stringify(o))
        return o
    }
}