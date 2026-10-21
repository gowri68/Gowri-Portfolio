// Mobile navigation and smooth scrolling
document.addEventListener("DOMContentLoaded", function () {
    console.log("Gowri Portfolio loaded successfully!");

    // Highlight the navigation link for the current section
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");

    function highlightNavLink() {
        let currentSection = "";

        sections.forEach(function (section) {
            if (window.scrollY >= section.offsetTop - 150) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(function (link) {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + currentSection
            );
        });
    }

    window.addEventListener("scroll", highlightNavLink);
    highlightNavLink();

    // Contact form validation, if a form exists
    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = contactForm.querySelector("[name='name']");
            const email = contactForm.querySelector("[name='email']");
            const message = contactForm.querySelector("[name='message']");

            if (
                !name || !email || !message ||
                !name.value.trim() ||
                !email.value.trim() ||
                !message.value.trim()
            ) {
                alert("Please fill in all contact form fields.");
                return;
            }

            alert("Thank you for contacting me!");
            contactForm.reset();
        });
    }
});