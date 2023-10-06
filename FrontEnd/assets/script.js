const api_url = "http://localhost:5678/api/"


let works = new Set()
let selectedWorks = new Set()
let selectedCat = 0

const gallery = document.querySelector(".gallery")
const categories = document.querySelector(".categories")
const logBtn = document.querySelector("#log-btn")
let token = window.localStorage.getItem("token")

initWorks()
displayCatsBtn()
displayLogBtn()

async function getWorks(api_url) {
    const url = api_url + "works"
    const response = await fetch(url)
    var data = await response.json()
    data.forEach(element => {
        works.add(element)
    });
    return data
}

async function getCats(api_url) {
    const url = api_url + "categories"
    const response = await fetch(url)
    var data = await response.json()
    return data
}

async function initWorks() {
    const data = await getWorks(api_url)
    data.forEach(work => {
        works.add(work)
    })
    displayWorks(selectedCat)
}

function displayWorks(selectedCat) {
    selectedWorks.clear()
    if (selectedCat == 0) {
        works.forEach(work => {
            selectedWorks.add(work)
        })
    } else {
        works.forEach(work => {
            if (work.categoryId == selectedCat) {
                selectedWorks.add(work)
            }
        })
    }
        selectedWorks.forEach(work => {
            gallery.innerHTML += `<figure>
                        <img src="${work.imageUrl}" alt="${work.title}">
                        <figcaption>${work.title}</figcaption>
                        </figure>`
        })
}

async function displayCatsBtn() {
    const cats = await getCats(api_url)
    categories.innerHTML = `<button class='cats-btn ${selectedCat == 0 ? "cats-btn-selected" : ""}' id='0'>Tous</button>`
    cats.forEach(cat => {
        categories.innerHTML += `<button class="cats-btn ${selectedCat == cat.id ? "cats-btn-selected" : ""} " id="${cat.id}">${cat.name}</button>`
    })
    const catsBtn = document.querySelectorAll(".cats-btn")
    catsBtn.forEach(catBtn => {
        catBtn.addEventListener("click", (e) => {
            e.preventDefault()
            changeCat(catBtn.id)
        })
    })
}
function changeCat(catId) {
    selectedCat = catId
    gallery.innerHTML = ""
    displayWorks(selectedCat)
    displayCatsBtn()
}

function displayLogBtn() {
    if (token !== null) {
        logBtn.innerHTML = `<a class='logout-btn'>logout</a>`
        const logoutBtn = document.querySelector(".logout-btn")
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault()
            window.localStorage.removeItem("token")
            window.location.href = "index.html"
        })
    } else {
        logBtn.innerHTML = `<a class='login-btn' href='login.html'>login</a>`
    }
}