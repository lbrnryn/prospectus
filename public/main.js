if (location.pathname === "/") {
    const loginForm = document.querySelector(".loginForm");
    const registerForm = document.querySelector(".registerForm");
    const showRegisterFormBtn = document.querySelector(".showRegisterFormBtn");
    const showLoginFormBtn = document.querySelector(".showLoginFormBtn");

    // showRegisterFormBtn.addEventListener("click", () => {
    //     loginForm.classList.add("d-none");
    //     registerForm.classList.remove("d-none");
    // });

    // showLoginFormBtn.addEventListener("click", () => {
    //     registerForm.classList.add("d-none");
    //     loginForm.classList.remove("d-none");
    // })
}

if (location.pathname === "/dashboard") {
    const searchBar = document.querySelector("#searchBar");
    const studentList = document.querySelector("#studentList");
    const studentListItems = Array.from(studentList.children);
    // console.log(searchBar)
    // console.log(studentLists)

    searchBar.addEventListener("keyup", (e) => {
        studentListItems.forEach(student => {
            // console.log(student.innerText)
            // console.log(student.innerText.includes(e.target.value))

            if (student.innerText.includes(e.target.value) && e.target.value !== "" ) {
                // console.log(student)
                student.style.display = "block";
            } else {
                student.style.display = "none";
            }
        })
    });

    // studentListItems.forEach(student => {
    //     student.addEventListener("click", (e) => {
    //         // console.log(e.target.innerText)
    //         searchBar.value = e.target.innerText;
    //         studentListItems.forEach(student => {
    //             student.style.display = "none";
    //         })
            
    //     })
    // })
}

// const subjectBtns = document.querySelectorAll(".subjectBtn");
// const forms = document.querySelectorAll(".subjectBtn + form");
// // console.log(forms)

// subjectBtns.forEach(subjectBtn => {
//     subjectBtn.addEventListener("click", (e) => {
//         // console.log(e.target.nextElementSibling)
//         e.target.nextElementSibling.style.display = "flex";
//         forms.forEach(form => {
//             // console.log(form.previousElementSibling.innerText)
//             if (form.previousElementSibling.innerText !== e.target.innerText) {
//                 form.style.display = "none";
//             }
//         })
//     });
// });

const editGradeBtns = document.querySelectorAll(".editGradeBtn");

if (editGradeBtns) {
    editGradeBtns.forEach(editGradeBtn => {
        editGradeBtn.addEventListener("click", (e) => {
            const editBtn = e.target.tagName !== "BUTTON" ?  e.target.parentElement: e.target;
            const form = editBtn.parentElement.parentElement;
            // http://localhost:1000/grade/subject/640460d189b2fd718b90e693
            // console.log(form.action)
            // console.log(new URL(form.action).pathname)
            form.action = `${new URL(form.action).pathname}?_method=PUT`;
            editBtn.classList.add("d-none");
            // console.log(editBtn.previousElementSibling)
            editBtn.previousElementSibling.disabled = false;
            editBtn.previousElementSibling.focus();
            // console.log(editBtn.nextElementSibling)
            // console.log(editBtn.nextElementSibling.classList)
            editBtn.nextElementSibling.classList.remove("d-none")
            // console.log(editBtn.nextElementSibling.nextElementSibling)
            // console.log(editBtn.nextElementSibling.nextElementSibling.classList)
            editBtn.nextElementSibling.nextElementSibling.classList.remove("d-none");
        });
    });
}

const editGradeCancelBtns = document.querySelectorAll(".editGradeCancelBtn");

if (editGradeCancelBtns) {
    editGradeCancelBtns.forEach(editGradeCancelBtn => {
        editGradeCancelBtn.addEventListener("click", (e) => {
            // console.log(e.target)
            const cancelBtn = e.target.tagName !== "BUTTON" ?  e.target.parentElement: e.target;
            // console.log(cancelBtn.previousElementSibling)
            cancelBtn.previousElementSibling.previousElementSibling.previousElementSibling.disabled = true;
            cancelBtn.previousElementSibling.previousElementSibling.classList.remove("d-none");
            cancelBtn.previousElementSibling.classList.add("d-none");
            cancelBtn.classList.add("d-none");
        });
    });
}