var menuButton = document.getElementById("menuButton");
var navLinks = document.getElementById("navLinks");

if (menuButton) {
    menuButton.onclick = function () {
        navLinks.classList.toggle("show");
    };
}

function showDateTime() {
    var now = new Date();
    var year = document.getElementById("year");
    var dateTime = document.getElementById("dateTime");

    if (year) {
        year.innerHTML = now.getFullYear();
    }

    if (dateTime) {
        dateTime.innerHTML = now.toLocaleString();
    }
}

showDateTime();
setInterval(showDateTime, 1000);

var currentUser = localStorage.getItem("rwandaNzizaCurrentUser");
var loginLink = document.getElementById("loginLink");
var signupLink = document.getElementById("signupLink");
var logoutLink = document.getElementById("logoutLink");
var userName = document.getElementById("userName");

function updateUserMenu() {
    if (currentUser) {
        var users = JSON.parse(localStorage.getItem("rwandaNzizaUsers") || "[]");
        var name = currentUser;

        for (var i = 0; i < users.length; i++) {
            if (users[i].email == currentUser) {
                name = users[i].fullName;
            }
        }

        if (loginLink) loginLink.style.display = "none";
        if (signupLink) signupLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "inline";
        if (userName) {
            userName.style.display = "inline";
            userName.innerHTML = "Hello, " + name;
        }
    }
}

updateUserMenu();

if (logoutLink) {
    logoutLink.onclick = function (event) {
        event.preventDefault();
        localStorage.removeItem("rwandaNzizaCurrentUser");
        window.location.href = "login.html";
    };
}

var search = document.getElementById("institutionSearch");

if (search) {
    search.onkeyup = function () {
        var word = search.value.toLowerCase();
        var cards = document.getElementsByClassName("institution-card");
        var found = 0;

        for (var i = 0; i < cards.length; i++) {
            var text = cards[i].innerText.toLowerCase();

            if (text.indexOf(word) != -1) {
                cards[i].style.display = "block";
                found++;
            } else {
                cards[i].style.display = "none";
            }
        }

        if (found == 0) {
            document.getElementById("noInstitution").style.display = "block";
        } else {
            document.getElementById("noInstitution").style.display = "none";
        }
    };
}

var description = document.getElementById("description");
var charCount = document.getElementById("charCount");

if (description) {
    description.onkeyup = function () {
        charCount.innerHTML = description.value.length + " / 300 characters";
    };
}

var reportForm = document.getElementById("reportForm");
var reportCounter = document.getElementById("reportCounter");
var totalReports = localStorage.getItem("rwandaNzizaReports");

if (totalReports == null) {
    totalReports = 0;
}

if (reportCounter) {
    reportCounter.innerHTML = totalReports;
}

if (reportForm) {
    reportForm.onsubmit = function (event) {
        event.preventDefault();
        totalReports++;
        localStorage.setItem("rwandaNzizaReports", totalReports);
        reportCounter.innerHTML = totalReports;

        var reports = JSON.parse(localStorage.getItem("rwandaNzizaReportList") || "[]");
        var imageInput = document.getElementById("image");
        var imageName = "No image selected";

        if (imageInput.files.length > 0) {
            imageName = imageInput.files[0].name;
        }

        var report = {
            id: "RN-" + new Date().getTime(),
            user: currentUser || "guest",
            fullName: document.getElementById("fullname").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            problemType: document.getElementById("problemType").value,
            institution: document.getElementById("institution").value,
            district: document.getElementById("district").value,
            sector: document.getElementById("sector").value,
            cell: document.getElementById("cell").value,
            image: imageName,
            description: document.getElementById("description").value,
            date: new Date().toLocaleString(),
            status: "Pending Review"
        };

        reports.push(report);
        localStorage.setItem("rwandaNzizaReportList", JSON.stringify(reports));
        document.getElementById("successMessage").innerHTML = "Your report was submitted successfully.";
        reportForm.reset();
        charCount.innerHTML = "0 / 300 characters";
    };
}

var signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.onsubmit = function (event) {
        event.preventDefault();
        var fullName = document.getElementById("signupFullName").value;
        var phone = document.getElementById("signupPhone").value;
        var email = document.getElementById("signupEmail").value.toLowerCase();
        var password = document.getElementById("signupPassword").value;
        var confirmPassword = document.getElementById("confirmPassword").value;
        var message = document.getElementById("signupMessage");

        if (password != confirmPassword) {
            message.innerHTML = "Passwords do not match.";
            return;
        }

        var users = JSON.parse(localStorage.getItem("rwandaNzizaUsers") || "[]");

        for (var i = 0; i < users.length; i++) {
            if (users[i].email == email || users[i].phone == phone) {
                message.innerHTML = "An account with this email or phone number already exists.";
                return;
            }
        }

        users.push({fullName: fullName, phone: phone, email: email, password: password});
        localStorage.setItem("rwandaNzizaUsers", JSON.stringify(users));
        message.innerHTML = "Account created successfully. You can now log in.";
        signupForm.reset();
    };
}

var loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.onsubmit = function (event) {
        event.preventDefault();
        var loginName = document.getElementById("loginName").value.toLowerCase();
        var password = document.getElementById("loginPassword").value;
        var users = JSON.parse(localStorage.getItem("rwandaNzizaUsers") || "[]");
        var found = false;

        for (var i = 0; i < users.length; i++) {
            if ((users[i].email == loginName || users[i].phone == loginName) && users[i].password == password) {
                localStorage.setItem("rwandaNzizaCurrentUser", users[i].email);
                found = true;
                window.location.href = "reports.html";
            }
        }

        if (!found) {
            document.getElementById("loginMessage").innerHTML = "Email, phone number or password is incorrect.";
        }
    };
}

var reportsList = document.getElementById("reportsList");
var reportsMessage = document.getElementById("reportsMessage");

if (reportsList) {
    if (!currentUser) {
        reportsMessage.innerHTML = "You must log in to view your reports.<br><a href='login.html'>Go to Login</a>";
    } else {
        var allReports = JSON.parse(localStorage.getItem("rwandaNzizaReportList") || "[]");
        var number = 0;

        for (var i = allReports.length - 1; i >= 0; i--) {
            if (allReports[i].user == currentUser) {
                number++;
                var box = document.createElement("div");
                box.className = "report-item";
                box.innerHTML = "<h3>" + allReports[i].problemType + "</h3>" +
                    "<span class='status'>" + allReports[i].status + "</span>" +
                    "<p><b>Report ID:</b> " + allReports[i].id + "</p>" +
                    "<p><b>Date:</b> " + allReports[i].date + "</p>" +
                    "<p><b>Institution:</b> " + allReports[i].institution + "</p>" +
                    "<p><b>Location:</b> " + allReports[i].cell + ", " + allReports[i].sector + ", " + allReports[i].district + "</p>" +
                    "<p><b>Image:</b> " + allReports[i].image + "</p>" +
                    "<p><b>Description:</b> " + allReports[i].description + "</p>";
                reportsList.appendChild(box);
            }
        }

        if (number == 0) {
            reportsMessage.innerHTML = "You have not submitted any reports yet.<br><a href='report.html'>Submit your first report</a>";
        } else {
            reportsMessage.innerHTML = "You have " + number + " report(s).";
        }
    }
}
