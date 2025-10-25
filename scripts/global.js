
// Color on scroll for nav links
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('header nav a'))
                        .filter(a => a.getAttribute('href')?.startsWith('#'));
  const sections = Array.from(document.querySelectorAll('section[id]'));

  let lastActiveLink = null;

  function highlightCurrentSection() {
    const scrollPos = window.scrollY;
    const pageBottom = window.scrollY + window.innerHeight;

    if (scrollPos === 0) {
      navLinks.forEach(link => link.style.color = '');
      lastActiveLink = null;
      return;
    }

    let found = false;

    sections.forEach((section, index) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
      if (!link) return;

      const isLastSection = index === sections.length - 1;

      if (!found && (scrollPos + 1 >= top && scrollPos < bottom || 
          (isLastSection && pageBottom >= document.body.scrollHeight - 10))) {

        if (lastActiveLink && lastActiveLink !== link) {
          lastActiveLink.style.color = '';
        }
        link.style.color = '#12cfa9';
        lastActiveLink = link;
        found = true;
      }
    });
  }

  window.addEventListener('scroll', highlightCurrentSection);
  highlightCurrentSection();
});

// adjust nav for mobile
document.addEventListener("DOMContentLoaded", function() {
  const navLinks = Array.from(document.querySelectorAll(
    'a[href="#aboutme"], a[href="#projects"], a[href="#setup"], a[href="#contact"]'
  ));
  const separatorLink = Array.from(document.querySelectorAll('a'))
    .find(a => a.textContent.trim() === "|");

  function hideForMobile() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const displayStyle = isMobile ? "none" : "inline-block";
    [...navLinks, separatorLink].forEach(el => {
      if (el) el.style.display = displayStyle;
    });
  }

  hideForMobile();

  window.addEventListener("resize", hideForMobile);
  window.addEventListener("orientationchange", hideForMobile);
});

// gooogle analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-VLDRNTTKV9');