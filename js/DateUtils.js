export function parseDate(timestamp) {
    var parts = timestamp.split('-');
    var day = parseInt(parts[0]);
    var month = parseInt(parts[1]) - 1;
    var year = parseInt(parts[2]);
    return new Date(year, month, day);
}
