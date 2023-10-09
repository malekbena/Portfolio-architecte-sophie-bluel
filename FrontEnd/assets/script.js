const api_url = "http://localhost:5678/api/"


let works = new Set()
let selectedWorks = new Set()
let selectedCat = 0

const gallery = document.querySelector(".gallery")
const categories = document.querySelector(".categories")
const logBtn = document.querySelector("#log-btn")
let token = window.localStorage.getItem("token")
let modal = null

initWorks()
displayCatsBtn()

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

const displayWorks=(selectedCat)=> {
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
const changeCat = (catId) => {
    selectedCat = catId
    gallery.innerHTML = ""
    displayWorks(selectedCat)
    displayCatsBtn()
}

/** modal ***/
const openModal = (e) => {
    e.preventDefault()
    const target = document.querySelector(e.target.hash)
    target.style.display = "flex"
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector(".close-modal").addEventListener("click", closeModal)
    modal.querySelector(".modal-wrapper").addEventListener("click", stopPropagation)
}

const closeModal = (e) => {
    if(modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".close-modal").removeEventListener("click", closeModal)
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = (e) => {
    e.stopPropagation()
}

window.addEventListener("keydown", (e) => {
    if(e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

/*** display login or logout btn ***/
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

/**** display edit btn if logged in ****/
if (token !== null) {
    const projectsTitle = document.querySelector(".projects-title")
    projectsTitle.innerHTML += `<a id="edit-gallery" href="#modal">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
            d="M13.5229 1.68576L13.8939 2.05679C14.1821 2.34503 14.1821 2.81113 13.8939 3.0963L13.0016 3.99169L11.5879 2.57808L12.4803 1.68576C12.7685 1.39751 13.2346 1.39751 13.5198 1.68576H13.5229ZM6.43332 7.73578L10.5484 3.61759L11.9621 5.03121L7.84387 9.14633C7.75494 9.23525 7.64455 9.29964 7.52496 9.33337L5.73111 9.84546L6.2432 8.05162C6.27693 7.93203 6.34133 7.82164 6.43025 7.73271L6.43332 7.73578ZM11.4408 0.646245L5.39074 6.6932C5.12397 6.95998 4.93078 7.28808 4.82959 7.64685L3.9526 10.7133C3.879 10.9708 3.94953 11.2468 4.13965 11.4369C4.32977 11.627 4.60574 11.6976 4.86332 11.624L7.92973 10.747C8.29156 10.6427 8.61967 10.4495 8.88338 10.1858L14.9334 4.13888C15.7951 3.27722 15.7951 1.87894 14.9334 1.01728L14.5624 0.646245C13.7007 -0.215415 12.3024 -0.215415 11.4408 0.646245ZM2.69844 1.84214C1.20816 1.84214 0 3.05031 0 4.54058V12.8812C0 14.3715 1.20816 15.5796 2.69844 15.5796H11.0391C12.5293 15.5796 13.7375 14.3715 13.7375 12.8812V9.44683C13.7375 9.039 13.4094 8.71089 13.0016 8.71089C12.5937 8.71089 12.2656 9.039 12.2656 9.44683V12.8812C12.2656 13.5589 11.7167 14.1078 11.0391 14.1078H2.69844C2.02076 14.1078 1.47188 13.5589 1.47188 12.8812V4.54058C1.47188 3.86291 2.02076 3.31402 2.69844 3.31402H6.13281C6.54065 3.31402 6.86875 2.98591 6.86875 2.57808C6.86875 2.17025 6.54065 1.84214 6.13281 1.84214H2.69844Z"
            fill="black" />
    </svg>
    modifier
    </a>`
    document.querySelector("#edit-gallery").addEventListener("click", (e) => {
        openModal(e)
    })
}