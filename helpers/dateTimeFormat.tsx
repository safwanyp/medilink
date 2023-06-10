export function IsoDateToString(isoDate: string) {
    const date = new Date(isoDate);
    console.log(date);

    var dateString = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    // remove comma in date
    const dateArr = dateString.split(' ');
    dateArr[1] = dateArr[1].replace(',', '');
    dateString = dateArr.join(' ');
    
    return dateString;
}