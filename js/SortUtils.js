import { parseDate } from './DateUtils.js';

export function getLatest10Blogs(blogs) {
    blogs.sort((a, b) => {
        var dateA = a.timestamp ? parseDate(a.timestamp) : null;
        var dateB = b.timestamp ? parseDate(b.timestamp) : null;
        return dateB - dateA;
    });
    return blogs.slice(0, Math.min(10, blogs.length));
}
