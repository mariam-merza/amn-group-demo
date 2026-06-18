const elements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.05,
  rootMargin: "0px 0px -100px 0px"
});

elements.forEach(el => observer.observe(el));

function toggleMenu() {
    document.querySelector('.mobile-menu').classList.toggle('active');
    document.querySelector('.menu-overlay').classList.toggle('active');
    document.body.classList.toggle('menu-open');
    document.querySelector('.menu-toggle').classList.toggle('active');
}

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
    });
});

const backToTopButton = document.createElement("button");
backToTopButton.textContent = "Back to Top";
backToTopButton.className = "back-to-top";
backToTopButton.style.position = "fixed";
backToTopButton.style.bottom = "20px";
backToTopButton.style.right = "20px";
backToTopButton.style.padding = "10px 15px";
backToTopButton.style.display = "none";

document.body.appendChild(backToTopButton);

backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
});

function toggleFAQ(header) {
    const dropdown = header.parentElement.querySelector(".faq-content");
    const button = header.querySelector(".chevron");

    if (dropdown.style.maxHeight) {
        dropdown.style.maxHeight = null;
        button.textContent = "+";
    } else {
        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
        button.textContent = "−";
    }
}

const form = document.getElementById("contact-form");

const fields = ["name", "email", "phone", "message"];

fields.forEach(id => {
    const field = document.getElementById(id);

    field.addEventListener("input", () => validateField(id));
    field.addEventListener("blur", () => validateField(id));
});

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    let errorMessage = "";

    if (value === "") {
        displayFieldState(fieldId, "");
        return false;
    }

    if (fieldId === "name") {
        if (value.length < 2) errorMessage = "Enter a valid name";
    }

    if (fieldId === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errorMessage = "Enter a valid email";
    }

    if (fieldId === "phone") {
        const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
        if (!phoneRegex.test(value)) errorMessage = "Enter a valid phone number";
    }

    if (fieldId === "message") {
        if (value.length < 10) errorMessage = "Minimum 10 characters required";
    }

    displayFieldState(fieldId, errorMessage);
    return errorMessage === "";
}

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const existingMsg = document.querySelector(".form-message");
    if (existingMsg) existingMsg.remove();

    const isValid =
        validateField("name") &&
        validateField("email") &&
        validateField("phone") &&
        validateField("message");

    if (!isValid) return;

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            showSuccess("Message sent successfully.");
            form.reset();

            document.querySelectorAll("input, textarea").forEach(el => {
                el.classList.remove("valid", "invalid");
            });

        } else {
            showSuccess("Submission failed. Try again.", true);
        }

    } catch {
        showSuccess("Network error. Please try again.", true);
    }
});

function displayFieldState(fieldId, message) {
    const field = document.getElementById(fieldId);
    let error = field.nextElementSibling;

    if (!error || !error.classList.contains("error")) {
        error = document.createElement("div");
        error.className = "error";
        field.parentNode.insertBefore(error, field.nextSibling);
    }

    if (message) {
        error.textContent = message;
        field.classList.add("invalid");
        field.classList.remove("valid");
    } else {
        error.textContent = "";
        field.classList.remove("invalid");
        field.classList.add("valid");
    }
}

function showSuccess(message, isError = false) {
    let msg = document.createElement("div");
    msg.className = "form-message";
    msg.textContent = message;
    msg.style.color = isError ? "red" : "green";

    form.appendChild(msg);
}
