const api_url = "http://localhost:5678/api/"


let works = new Set()
let selectedWorks = new Set()
let categories = new Set()
let selectedCat = 0

const gallery = document.querySelector(".gallery")
const logBtn = document.querySelector("#log-btn")
let token = window.localStorage.getItem("token")
let modal = null

initWorks()
initCategories()

async function getWorks() {
    const url = api_url + "works"
    const response = await fetch(url)
    var data = await response.json()
    return data
}

async function getCategories() {
    const url = api_url + "categories"
    const response = await fetch(url)
    var data = await response.json()
    return data
}
async function initCategories() {
    categories.clear()
    const data = await getCategories(api_url)
    data.forEach(cat => {
        categories.add(cat)
    })
    displayCatsBtn()
}

async function initWorks() {
    works.clear()
    const data = await getWorks(api_url)
    data.forEach(work => {
        works.add(work)
    })
    displayWorks(selectedCat)
}

const displayWorks = (selectedCat) => {
    selectedWorks.clear()
    gallery.innerHTML = ""
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

const deleteWork = (e) => {
    const workId = e.currentTarget.value
    const url = api_url + "works/" + workId
    fetch(url, {
        headers: { "Authorization": "Bearer " + token },
        method: "DELETE",
    }).then(response => {
        if (response.status === 204) {
            initWorks().then(() => {
                displayModalImages()
            })
        }

    })
}
const displayCatsBtn = () => {
    const categoriesHtml = document.querySelector(".categories")
    categoriesHtml.innerHTML = `<button class='cats-btn ${selectedCat == 0 ? "cats-btn-selected" : ""}' id='0'>Tous</button>`
    categories.forEach(cat => {
        categoriesHtml.innerHTML += `<button class="cats-btn ${selectedCat == cat.id ? "cats-btn-selected" : ""} " id="${cat.id}">${cat.name}</button>`
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


const openAddModal = () => {
    if (modal === null) return
    document.querySelector("#titlemodal").innerHTML = "Ajout photo"
    document.querySelector(".modal-gallery").style.display = "none"
    document.querySelector(".modal-content").style.display = "none"
    document.querySelector(".modal-form").style.display = "flex"
    document.querySelector(".back-modal").style.display = "flex"
    document.querySelector(".back-modal").addEventListener("click", closeAddModal)
    document.querySelector("#form-category").innerHTML = "<option value='0'></option>"
    categories.forEach(cat => {
        document.querySelector("#form-category").innerHTML += `<option value="${cat.id}">${cat.name}</option>`
    })
    document.querySelector("#form-submit").addEventListener("click", (e) => {
        e.preventDefault()
        addWork()
    })
}
const closeAddModal = () => {
    if (modal === null) return
    document.querySelector("#titlemodal").innerHTML = "Modifier la galerie"
    document.querySelector(".modal-gallery").style.display = "grid"
    document.querySelector(".modal-content").style.display = "block"
    document.querySelector(".modal-form").style.display = "none"
    document.querySelector(".back-modal").style.display = "none"
    document.querySelector("#form-category").innerHTML = ""
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
    displayModalImages()
    modal.querySelector(".modal-btn").addEventListener("click", openAddModal)

}

const closeModal = (e) => {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    closeAddModal()
    modal.querySelector(".close-modal").removeEventListener("click", closeModal)
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = (e) => {
    e.stopPropagation()
}

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

/** display images on modal */
const displayModalImages = () => {
    if (modal !== null) {
        if (works.size == 0) return
        const modalGallery = document.querySelector(".modal-gallery")
        modalGallery.innerHTML = ""
        works.forEach(work => {
            modalGallery.innerHTML += `
                <figure>
                <button class='modal-delete-btn' value="${work.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none">
                <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
                </svg>
                </button>
                <img src="${work.imageUrl}" alt="${work.title}">
                </figure>`
        })
        document.querySelectorAll(".modal-delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault()
                deleteWork(e)
            })
        })
    }
}

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

/*** add work ***/
const addWork = () => {
    const image = document.querySelector("#form-image").files[0]
    const title = document.querySelector("#form-title").value
    const category = document.querySelector("#form-category").value
    const formData = new FormData()
    formData.append("image", image)
    formData.append("title", title)
    formData.append("category", category)
    formData.append("useId", 1)

    //validation du formulaire avant envoie à faire
    
    const url = api_url + "works"
    fetch(url, {
        headers: { "Authorization": "Bearer " + token },
        method: "POST",
        body: formData
    }).then(response => {
        if (response.status === 201) {
            initWorks().then(() => {
                displayModalImages()
                closeAddModal()
            })
        }
    })
}