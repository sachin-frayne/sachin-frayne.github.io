export function decodeBase64ToJSON(base64String) {
    const decodedString = atob(base64String);
    const jsonObject = JSON.parse(decodedString);
    return jsonObject;
}

export function decodeBase64(base64String) {
    const decodedString = atob(base64String);
    return decodedString;
}

export function extractBlogName(downloadUrl) {
    var filename = downloadUrl.split("/").pop();
    var blogName = filename.replace(".md", "");
    return blogName;
}
