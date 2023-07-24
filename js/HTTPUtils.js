export async function getURLResponseAsJson(url) {
    var response = await fetch(url);
    if (response.ok) {
        var content = response.json();
    } else {
        throw new Error("Error fetching response: " + response.status);
    }
    return content;
}
