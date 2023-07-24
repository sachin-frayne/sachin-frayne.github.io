import { parseDate } from './DateUtils.js';
import { extractBlogName, decodeBase64ToJSON, decodeBase64 } from './StringUtils.js';
import { getURLResponseAsJson } from './HTTPUtils.js';
import { getLatest10Blogs } from './SortUtils.js';

export function write404Message(error) {
    var blogContent = document.getElementById("blog-content");
    blogContent.innerHTML = `
        <p>Sorry that blog has not been found.</p>
        <p>The best way to find what you are looking is to know where you put it in the first place!</p>
        <img src="images/404.png" alt="404">
    `;
    console.error("Error 404 not found:", error);
}

export function removeHtmlContainer(container) {
    var introContainer = document.querySelector(container);
    if (introContainer) {
        introContainer.remove();
    }
}

export function writeBlogContentToPage(imageJson, blogJson, blogContent) {
    var blogContentElement = document.getElementById("blog-content");
    var decodedBlog = decodeBase64(blogContent.content);
    blogContentElement.innerHTML = `
        <h2>${blogJson.title}</h2>
        <img src="data:image/jpeg;base64,${imageJson.content}" alt="${blogJson.title}">
        <div class="content">${decodedBlog}</div>
    `;
}

export function createImageNode(imageJson) {
    var imageNode = document.createElement("img");
    imageNode.src = "data:image/jpeg;base64," + imageJson.content;
    imageNode.alt = "Blog Image";
    imageNode.classList.add("blog-image");
    return imageNode;
}

export function createSummaryElement(content) {
    var summary = document.createElement("p");
    summary.textContent = content.summary;
    return summary;
}

export function createTimestampElement(content) {
    var timestamp = document.createElement("p");
    var date = parseDate(content.timestamp);
    var options = { year: "numeric", month: "long", day: "numeric" };
    timestamp.textContent = date.toLocaleDateString("en-US", options);
    return timestamp;
}

export function createTitleElement(content) {
    var title = document.createElement("h2");
    var blogName = extractBlogName(content.content);
    var url = `?b=${blogName}`;
    title.innerHTML = `<a href="${url}">${content.title}</a>`;
    return title;
}

export function createContentWrapper(content) {
    var contentWrapper = document.createElement("div");
    contentWrapper.classList.add("content-wrapper");

    var title = createTitleElement(content);
    var timestamp = createTimestampElement(content);
    var summary = createSummaryElement(content);

    contentWrapper.appendChild(title);
    contentWrapper.appendChild(timestamp);
    contentWrapper.appendChild(summary);

    return contentWrapper;
}

export function createBlogItem(content, imageJson) {
    var blogDiv = document.createElement("div");
    var imageNode = createImageNode(imageJson);
    var contentWrapper = createContentWrapper(content);

    blogDiv.classList.add("blog-item");
    blogDiv.appendChild(imageNode);
    blogDiv.appendChild(contentWrapper);
    return blogDiv;
}

export async function displayBlogFeed(blogs, blogsLocation) {
    try {
        var blogItems = [];

        for (const blog of blogs) {
            try {
                var content = await getURLResponseAsJson(blog.download_url);
                var imageJson = await getURLResponseAsJson(blogsLocation + "/images/" + content.image);
                var blogItem = createBlogItem(content, imageJson);
                if (blogItem) {
                    blogItems.push(blogItem);
                }
            } catch (error) {
                console.error("Error loading blog content:", error);
            }
        }

        var blogFeed = document.getElementById("blog-feed");
        for (const item of blogItems) {
            blogFeed.appendChild(item);
        }
    } catch (error) {
        console.error("Error displaying blog feed:", error);
    }
}

export async function displayDefaultContent(blogsLocation) {
    try {
        var blogsUrl = blogsLocation + "/jsons?ref=main";
        var blogs = await getURLResponseAsJson(blogsUrl);
        var latest10Blogs = getLatest10Blogs(blogs);

        await displayBlogFeed(latest10Blogs, blogsLocation);
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

export async function loadBlogContent(blogsLocation, blogName) {
    removeHtmlContainer(".intro-container");
    removeHtmlContainer(".blog-feed-container");
    var blogJsonUrl = blogsLocation + "/jsons/" + blogName + ".json";
    var imageUrl = blogsLocation + "/images/" + blogName + ".jpg";
    var blogUrl = blogsLocation + "/htmls/" + blogName + ".html";
    try {
        var content = await getURLResponseAsJson(blogJsonUrl);
        var imageJson = await getURLResponseAsJson(imageUrl);
        var blogContent = await getURLResponseAsJson(blogUrl);
        var blogJson = decodeBase64ToJSON(content.content);
        writeBlogContentToPage(imageJson, blogJson, blogContent);
    } catch (error) {
        write404Message(error);
    }
}
