// Get complaints from localStorage
let complaints = JSON.parse(
    localStorage.getItem("complaints")
) || [];


// Generate Complaint ID
function generateComplaintId() {

    const number = Math.floor(
        1000 + Math.random() * 9000
    );

    return "CMP" + number;
}


// Save complaints
function saveComplaints() {

    localStorage.setItem(
        "complaints",
        JSON.stringify(complaints)
    );
}


// Student complaint submission
document.getElementById("complaintForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const complaint = {

        id: generateComplaintId(),

        studentName:
            document.getElementById("studentName").value,

        studentId:
            document.getElementById("studentId").value,

        category:
            document.getElementById("category").value,

        priority:
            document.getElementById("priority").value,

        description:
            document.getElementById("description").value,

        department: "Not Assigned",

        status: "Submitted",

        date: new Date().toLocaleString()

    };


    complaints.push(complaint);

    saveComplaints();


    document.getElementById("complaintResult")
    .innerHTML = `
        <div class="success">
            <strong>Complaint submitted successfully!</strong>
            <br><br>
            Your Complaint ID is:
            <strong>${complaint.id}</strong>
            <br>
            Please save this ID to track your complaint.
        </div>
    `;


    document.getElementById("complaintForm").reset();

    updateDashboard();

    displayComplaints();

});


// Track complaint
function trackComplaint() {

    const id =
        document.getElementById("trackId").value
        .trim()
        .toUpperCase();


    const complaint =
        complaints.find(c => c.id === id);


    if (!complaint) {

        document.getElementById("trackingResult")
        .innerHTML = `
            <div class="error">
                Complaint not found.
                Please check your Complaint ID.
            </div>
        `;

        return;
    }


    document.getElementById("trackingResult")
    .innerHTML = `

        <div class="success">

            <h3>Complaint Details</h3>

            <p>
                <strong>Complaint ID:</strong>
                ${complaint.id}
            </p>

            <p>
                <strong>Category:</strong>
                ${complaint.category}
            </p>

            <p>
                <strong>Priority:</strong>
                ${complaint.priority}
            </p>

            <p>
                <strong>Department:</strong>
                ${complaint.department}
            </p>

            <p>
                <strong>Status:</strong>
                ${complaint.status}
            </p>

            <p>
                <strong>Description:</strong>
                ${complaint.description}
            </p>

            <p>
                <strong>Submitted:</strong>
                ${complaint.date}
            </p>

        </div>

    `;
}


// Display complaints in Admin Dashboard
function displayComplaints() {

    const search =
        document.getElementById("searchComplaint")
        .value.toLowerCase();

    const filter =
        document.getElementById("statusFilter").value;


    let filtered =
        complaints.filter(function(c) {

            const matchesSearch =
                c.id.toLowerCase().includes(search) ||
                c.studentName.toLowerCase().includes(search);

            const matchesStatus =
                filter === "All" ||
                c.status === filter;

            return matchesSearch && matchesStatus;

        });


    if (filtered.length === 0) {

        document.getElementById("complaintTable")
        .innerHTML = "<p>No complaints found.</p>";

        return;
    }


    let html = `

        <table>

            <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Department</th>
                <th>Status</th>
                <th>Update</th>
            </tr>

    `;


    filtered.forEach(function(c) {

        let statusClass =
            c.status.toLowerCase()
            .replace(" ", "");


        html += `

            <tr>

                <td>${c.id}</td>

                <td>
                    ${c.studentName}
                    <br>
                    ${c.studentId}
                </td>

                <td>${c.category}</td>

                <td>${c.priority}</td>

                <td>

                    <select
                        class="action-select"
                        onchange="updateDepartment('${c.id}', this.value)"
                    >

                        <option
                            ${c.department === "Not Assigned" ? "selected" : ""}
                        >
                            Not Assigned
                        </option>

                        <option
                            ${c.department === "Maintenance" ? "selected" : ""}
                        >
                            Maintenance
                        </option>

                        <option
                            ${c.department === "IT Department" ? "selected" : ""}
                        >
                            IT Department
                        </option>

                        <option
                            ${c.department === "Hostel Department" ? "selected" : ""}
                        >
                            Hostel Department
                        </option>

                        <option
                            ${c.department === "Transport Department" ? "selected" : ""}
                        >
                            Transport Department
                        </option>

                        <option
                            ${c.department === "Library" ? "selected" : ""}
                        >
                            Library
                        </option>

                    </select>

                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${c.status}
                    </span>
                </td>

                <td>

                    <select
                        class="action-select"
                        onchange="updateStatus('${c.id}', this.value)"
                    >

                        <option
                            ${c.status === "Submitted" ? "selected" : ""}
                        >
                            Submitted
                        </option>

                        <option
                            ${c.status === "Assigned" ? "selected" : ""}
                        >
                            Assigned
                        </option>

                        <option
                            ${c.status === "In Progress" ? "selected" : ""}
                        >
                            In Progress
                        </option>

                        <option
                            ${c.status === "Resolved" ? "selected" : ""}
                        >
                            Resolved
                        </option>

                    </select>

                </td>

            </tr>

        `;

    });


    html += "</table>";

    document.getElementById("complaintTable")
    .innerHTML = html;

}


// Update department
function updateDepartment(id, department) {

    const complaint =
        complaints.find(c => c.id === id);


    if (complaint) {

        complaint.department = department;

        if (department !== "Not Assigned" &&
            complaint.status === "Submitted") {

            complaint.status = "Assigned";
        }

        saveComplaints();

        displayComplaints();
        updateDashboard();
    }
}


// Update status
function updateStatus(id, status) {

    const complaint =
        complaints.find(c => c.id === id);


    if (complaint) {

        complaint.status = status;

        saveComplaints();

        displayComplaints();
        updateDashboard();
    }
}


// Dashboard counters
function updateDashboard() {

    document.getElementById("totalCount")
        .innerText = complaints.length;


    document.getElementById("pendingCount")
        .innerText =
        complaints.filter(
            c => c.status === "Submitted" ||
                 c.status === "Assigned"
        ).length;


    document.getElementById("progressCount")
        .innerText =
        complaints.filter(
            c => c.status === "In Progress"
        ).length;


    document.getElementById("resolvedCount")
        .innerText =
        complaints.filter(
            c => c.status === "Resolved"
        ).length;
}


// Switch between pages
function showPage(pageId) {

    document.querySelectorAll(".page")
        .forEach(page => {
            page.classList.add("hidden");
        });


    document.getElementById(pageId)
        .classList.remove("hidden");


    if (pageId === "adminPage") {

        updateDashboard();
        displayComplaints();

    }
}


// Initial dashboard update
updateDashboard();