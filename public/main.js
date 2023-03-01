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

const subjectBtns = document.querySelectorAll(".subjectBtn");
const forms = document.querySelectorAll(".subjectBtn + form");
// console.log(forms)

subjectBtns.forEach(subjectBtn => {
    subjectBtn.addEventListener("click", (e) => {
        // console.log(e.target.nextElementSibling)
        e.target.nextElementSibling.style.display = "flex";
        forms.forEach(form => {
            // console.log(form.previousElementSibling.innerText)
            if (form.previousElementSibling.innerText !== e.target.innerText) {
                form.style.display = "none";
            }
        })
    });
});