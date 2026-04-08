export function compareDate (prop, align) {
    return function (a, b) {
        const value1 = a[prop];
        const value2 = b[prop];
        const temp1 = new Date(value1);
        const temp2 = new Date(value2);
        if (align === 'positive') {//  正序
            return temp1 - temp2
        } else if (align === 'inverted') {//倒序
            return temp2 - temp1
        }
    }
}