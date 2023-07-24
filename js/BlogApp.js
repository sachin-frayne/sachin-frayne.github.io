import { loadBlogContent, displayDefaultContent } from './HTMLUtils.js';

export default class BlogApp {
    constructor() {
        this.blogsLocation = "https://api.github.com/repos/sachin-frayne/sachin-frayne.github.io/contents/blogs";
    }

    loadSpecificBlogOrContent() {
        var urlParams = new URLSearchParams(window.location.search);
        var blogName = urlParams.get("b");
        if (blogName) {
            loadBlogContent(this.blogsLocation, blogName);
        } else {
            displayDefaultContent(this.blogsLocation);
        }
    }
}
