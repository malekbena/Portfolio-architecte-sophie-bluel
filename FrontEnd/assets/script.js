const api_url = "http://localhost:5678/api/"

async function getWorks(api_url) {
    const url = api_url + "works"
    const response = await fetch(url)
    var data = await response.json()
    return data
}
displayWorks()

const gallery = document.querySelector(".gallery")

async function displayWorks() {
    const works = await getWorks(api_url)
    works.forEach(work => {
        gallery.innerHTML += `<figure>
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
    </figure>`
    })
}