
export default {
    pk(table, row) {
        const key = []
        table.meta.pk.forEach(s => key.push(row[s]))
        return key.join('|')
    }
}