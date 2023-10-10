const api_url = "http://localhost:5678/api/users/login"


const user = {
    email: document.querySelector("#email"),
    password: document.querySelector("#password")
}

const loginForm = document.querySelector("#login-form")
const loginBtn = document.querySelector("#login-btn")
const emailError = document.querySelector("#email-error")
const passwordError = document.querySelector("#password-error")
const formError = document.querySelector("#form-error")

let isValid = false
let loginData = new Set()

const login = () => {
    fetch(api_url, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: user.email.value,
            password: user.password.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "user not found") {
                formError.style.display = "block"
            } else {
                if (data.token) {
                    window.localStorage.setItem("token", data.token)
                    window.location.href = "index.html"
                }else {
                    formError.style.display = "block"
                }
            }
        })
}
loginBtn.addEventListener("click", (e) => {
    e.preventDefault()
    checkForm()
})

const checkForm = () => {
    if (user.email.value === "") {
        emailError.style.display = "block"
        isValid = false
    } else {
        emailError.style.display = "none"
        isValid = true
    }
    if (user.password.value === "") {
        passwordError.style.display = "block"
        isValid = false
    }else {
        passwordError.style.display = "none"
        isValid = true
    }
    if (isValid) {
        login()
    }

}