/*
    ERROR LOGGING (Sentry)
    1. Sign up for a free account at https://sentry.io
    2. Create a new project and get your "DSN" key.
    3. Uncomment the code below and paste your DSN.
    
    This will automatically catch and report JavaScript errors from your site
    to your Sentry dashboard, helping you fix bugs.
*/
// import * as Sentry from "@sentry/browser";

// Sentry.init({
//   dsn: "YOUR_SENTRY_DSN_HERE",
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration(),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });


// --- Burger Menu ---
function toggleMenu() {
    const menu = document.getElementById("nav-menu");
    const burger = document.querySelector(".burger");
    
    menu.classList.toggle("active");
    burger.classList.toggle("active");
}

// --- Scroll Animations ---
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");

    // Initially hide sections
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    const revealSections = () => {
        const triggerBottom = window.innerHeight / 5 * 4;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.style.opacity = 1;
                section.style.transform = "translateY(0)";
            }
        });
    };

    window.addEventListener("scroll", revealSections);
    revealSections(); // Initial check
});
