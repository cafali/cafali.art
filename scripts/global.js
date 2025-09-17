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
