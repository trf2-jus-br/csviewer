export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function temErro(review) {
    if (!review) return undefined
    const error = review.error
    if (!error || isEmptyObject(error)) return undefined
    return error
}

export function removeValoresDeEnums(record) {
    if (!record) return undefined
    const recordWithoutEnums = Object.keys(record).reduce(function (obj, k) {
        if (!k.startsWith('_')) obj[k] = record[k]
        return obj
    }, {})
    return recordWithoutEnums
}

export function temAlteracao(review, record) {
    const approved = temAprovacao(review)
    if (!approved) return undefined

    const altered = JSON.stringify(removeValoresDeEnums(approved)) !== JSON.stringify(removeValoresDeEnums(record))
    if (altered) {
        // console.log('ALTERED')
        // console.log(JSON.stringify(record))
        // console.log(JSON.stringify(approved))
    }
    return altered
}

export function temAprovacao(review) {
    if (!review) return undefined
    const approved = review.approved
    if (!approved || isEmptyObject(approved)) return undefined
    return approved
}

export function consultarStatusPorPk(tabledata, pk, record) {
    if (!tabledata || !pk || !tabledata[pk]) return undefined
    return consultarStatus(tabledata[pk], record)
}

export function consultarStatus(review, record) {
    if (temErro(review)) return 'danger'
    if (temAlteracao(review, record)) return 'warning'
    if (temAprovacao(review)) return 'success'
}

export function consultarErro(tabledata, pk) {
    if (!tabledata || !pk || !tabledata[pk]) return undefined
    return temErro(tabledata[pk])
}

export function consultarAprovacao(tabledata, pk) {
    if (!tabledata || !pk || !tabledata[pk]) return undefined
    return temAprovacao(tabledata[pk])
}
