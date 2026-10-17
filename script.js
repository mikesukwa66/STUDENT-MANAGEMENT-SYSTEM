const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentNumber = document.getElementById("studentNumber");
const studentCourse = document.getElementById("studentCourse");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const totalStudents = document.getElementById("totalStudents");
const totalCourses = document.getElementById("totalCourses");

// Load saved students from the browser
let students = JSON.parse(localStorage.getItem("students")) || [];

// Save students
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Display students in the table
function displayStudents(search = "") {
    studentTable.innerHTML = "";

    const query = search.trim().toLowerCase();
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.number.toLowerCase().includes(query)
    );

    filteredStudents.forEach(student => {
        const row = document.createElement("tr");

        [student.name, student.number, student.course].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            students = students.filter(s => s.id !== student.id);
            saveStudents();
            displayStudents(searchInput.value);
            updateDashboard();
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        studentTable.appendChild(row);
    });
}

// Update dashboard figures
function updateDashboard() {
    totalStudents.textContent = students.length;

    const uniqueCourses = new Set(
        students
            .map(student => student.course.trim().toLowerCase())
            .filter(course => course)
    );

    totalCourses.textContent = uniqueCourses.size;
}

// Add a new student
studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = studentName.value.trim();
    const number = studentNumber.value.trim();
    const course = studentCourse.value.trim();

    if (!name || !number || !course) {
        alert("Please fill in all fields.");
        return;
    }

    students.push({
        id: crypto.randomUUID(),
        name: name,
        number: number,
        course: course
    });

    saveStudents();
    studentForm.reset();
    displayStudents(searchInput.value);
    updateDashboard();

    alert("Student added successfully!");
});

// Search students
searchInput.addEventListener("input", function() {
    displayStudents(searchInput.value);
});

// Show saved records when the page opens
displayStudents();
updateDashboard();