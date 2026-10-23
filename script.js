document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // 1. Letter-by-letter jumping animation
  const animatedName = $("#animatedName");
  if (animatedName) {
    const name = animatedName.textContent;
    animatedName.textContent = "";

    [...name].forEach((letter, index) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = letter === " " ? "\u00A0" : letter;
      span.style.animationDelay = `${index * 0.12}s`;
      animatedName.appendChild(span);
    });
  }

  // 2. Rotating subtitle words
  const changingWord = $("#changingWord");
  const words = ["Web Development", "Creative Design", "New Technologies", "Digital Ideas"];
  let wordIndex = 0;

  if (changingWord) {
    setInterval(() => {
      changingWord.classList.add("word-out");

      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        changingWord.textContent = words[wordIndex];
        changingWord.classList.remove("word-out");
      }, 250);
    }, 2400);
  }

  // 3. Profile: tap to reveal details (no flip)
  const profileCard = $("#profileCard");
  const profilePopover = $("#profilePopover");

  profileCard?.addEventListener("click", () => {
    const isOpen = profilePopover.classList.toggle("open");
    profileCard.setAttribute("aria-expanded", String(isOpen));
    profilePopover.setAttribute("aria-hidden", String(!isOpen));
    $("#profileHint").textContent = isOpen ? "✦ TAP TO CLOSE" : "✦ TAP TO DISCOVER";
  });

  // 4. Mobile navigation
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  $$(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // 5. About tabs: tap to replace the whole content
  const aboutContent = {
    story: {
      label: "MY STORY",
      title: "Curiosity is where my journey begins.",
      text: "I'm a B.Sc. Computer Science student who enjoys discovering how technology works. I like exploring web design, learning new skills and turning ideas into simple, useful digital experiences.",
      tags: ["Curiosity", "Creativity", "Learning"],
      icon: "✳"
    },
    education: {
      label: "MY EDUCATION",
      title: "Building my foundation in technology.",
      text: "I'm currently pursuing B.Sc. Computer Science. My studies introduce me to programming, computer fundamentals and the ideas behind modern digital systems.",
      tags: ["B.Sc. CS", "Student Life", "Knowledge"],
      icon: "⌘"
    },
    goals: {
      label: "MY GOALS",
      title: "Small steps. Bigger possibilities.",
      text: "My goal is to keep improving my technical knowledge, create practical projects and develop confidence in building useful and creative digital experiences.",
      tags: ["Growth", "Projects", "Future Ready"],
      icon: "✧"
    }
  };

  const aboutPanel = $("#aboutPanel");

  $$(".about-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".about-tab").forEach(item => item.classList.remove("active"));
      tab.classList.add("active");

      const content = aboutContent[tab.dataset.tab];
      aboutPanel.animate(
        [{ opacity: 1, transform: "translateY(0)" },
         { opacity: 0, transform: "translateY(10px)" }],
        { duration: 150, fill: "forwards" }
      ).onfinish = () => {
        aboutPanel.innerHTML = `
          <div class="panel-icon">${content.icon}</div>
          <p class="mini-label">${content.label}</p>
          <h3>${content.title}</h3>
          <p>${content.text}</p>
          <div class="panel-tags">
            ${content.tags.map(tag => `<span>${tag}</span>`).join("")}
          </div>
        `;

        aboutPanel.animate(
          [{ opacity: 0, transform: "translateY(14px)" },
           { opacity: 1, transform: "translateY(0)" }],
          { duration: 350, fill: "both" }
        );
      };
    });
  });

  // 6. Skill cards: tap to expand
  $$(".skill-card").forEach(card => {
    card.setAttribute("aria-expanded", "false");

    card.addEventListener("click", () => {
      const wasExpanded = card.classList.contains("expanded");

      $$(".skill-card").forEach(item => {
        item.classList.remove("expanded");
        item.setAttribute("aria-expanded", "false");
      });

      if (!wasExpanded) {
        card.classList.add("expanded");
        card.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 7. Project cards: tap to reveal more information
  $$(".details-btn").forEach(button => {
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const card = button.closest(".project-card");
      const isOpen = card.classList.toggle("open");

      button.setAttribute("aria-expanded", String(isOpen));
      button.firstChild.textContent = isOpen ? "Hide details " : "View details ";
    });
  });

  // 8. Contact card: tap to reveal email
  const contactReveal = $("#contactReveal");
  const contactDetails = $("#contactDetails");

  contactReveal?.addEventListener("click", () => {
    const isOpen = contactDetails.classList.toggle("open");

    contactReveal.classList.toggle("active", isOpen);
    contactReveal.setAttribute("aria-expanded", String(isOpen));
    contactDetails.setAttribute("aria-hidden", String(!isOpen));
    $(".contact-arrow", contactReveal).textContent = isOpen ? "×" : "↗";
  });

  // 9. Copy email
  $("#copyEmail")?.addEventListener("click", async () => {
    const email = $("#emailText").textContent;
    const status = $("#copyStatus");

    try {
      await navigator.clipboard.writeText(email);
      status.textContent = "Email copied successfully!";
    } catch {
      status.textContent = "Please select and copy the email manually: " + email;
    }
  });

  // 10. Scroll progress + back-to-top button
  const progressBar = $("#progressBar");
  const backToTop = $("#backToTop");

  function updateScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    progressBar.style.width = `${progress}%`;
    backToTop.classList.toggle("visible", window.scrollY > 400);
  }

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 11. Reveal sections when scrolling
  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 90}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // 12. Highlight the navigation link for the visible section
  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$(".nav-link").forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // 13. Gentle pointer glow on devices with a mouse
  const cursorGlow = $("#cursorGlow");

  if (window.matchMedia("(pointer: fine)").matches && cursorGlow) {
    window.addEventListener("pointermove", event => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });
  }

  // 14. Current year
  $("#currentYear").textContent = new Date().getFullYear();
});