const api_url = "http://localhost:5678/api/users/login"


const user = {
    email: document.querySelector("#email"),
    password: document.querySelector("#password")
}

const loginForm = document.querySelector("#login-form")
const loginBtn = document.querySelector("#login-btn")

let loginData = new Set()

function login() {
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
                alert("Email ou mot de passe incorrect") 
            }else {
                window.localStorage.setItem("token", data.token)
                window.location.href = "index.html"
            }
        })
}
loginBtn.addEventListener("click", (e) => {
    e.preventDefault()
    login()
})
