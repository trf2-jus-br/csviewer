export default {
    humanize(str) {
        if (!str || !(typeof str === 'string')) return str

        str = str.replace(/_sistema_origem_/g, '_')
        str = str.replace(/^sin_/g, '')
        str = str.replace(/^dta_/g, 'data_')

        var i, frags = str.split('_');
        for (i = 0; i < frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(' ');
    }
}