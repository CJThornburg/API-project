




const dateF = (date) => {
    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }



    let d = new Date(date),
        dateFormatted = [(d.getMonth() + 1).padLeft(),
        d.getDate().padLeft(),
        d.getFullYear()].join('-') +
            ' ' +
            [d.getHours().padLeft(),
            d.getMinutes().padLeft(),
            d.getSeconds().padLeft()].join(':');
    return dateFormatted
}

// price formatter
const priceF = (price) => {
    let dec = price.toString().split(".")

    if (dec[1]) {
        if (dec[1].length === 1) {
            dec[1] += "0"

            let decF = dec.join(".")

            return decF
        }
    }
}




module.exports = {
    dateF, priceF
};
