// ==========================
// UTILS
// ==========================
function lerp(start, end, t) {
  return start + (end - start) * t;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ==========================
// DOM CONTENT LOADED
// ==========================
document.addEventListener("DOMContentLoaded", () => {



  // ==========================
  // ANIMATION ON SCROLL
  // ==========================
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    },
    { threshold: 0.2 }
  );
  reveals.forEach(el => revealObserver.observe(el));

  // ==========================
  // HERO PARALLAX & MOUSE
  // ==========================
  const hero = document.querySelector('header');
  const heroContent = document.querySelector('.content-header');
  const motif = document.querySelector('.motif');
  const headerEl = document.querySelector('header');

  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    if(heroContent) heroContent.style.transform = `translate(${x/1.5}px, ${y/1.5}px)`;
    if(motif) motif.style.transform = `translate(${x}px, ${y}px) rotate(${x}deg)`;
  });

  if(hero){
    hero.addEventListener('mouseleave', () => {
      heroContent.style.transform = 'translate(0,0)';
      motif.style.transform = 'translate(0,0) rotate(0deg)';
    });
  }

  // ==========================
  // TYPEWRITER JOB TITLE
  // ==========================
  const jobTitle = document.querySelector('.job');
  const jobText = "Développeur web";
  let i = 0;

  function typeWriter() {
    if(!jobTitle) return;
    if (i < jobText.length) {
      jobTitle.textContent += jobText.charAt(i);
      i++;
      setTimeout(typeWriter, 120);
    } else {
      setTimeout(() => {
        jobTitle.textContent = "";
        i = 0;
        typeWriter();
      }, 2000);
    }
  }
  typeWriter();

  // ==========================
  // REVIEWS ANIMATION
  // ==========================
  const reviews = document.querySelectorAll('.review-card');
  reviews.forEach((review, index) => {
    review.style.opacity = 0;
    review.style.transform = 'translateY(40px)';
    setTimeout(() => {
      review.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      review.style.opacity = 1;
      review.style.transform = 'translateY(0)';
    }, index * 200);
  });

  // ==========================
  // PROJECTS (Hover 3D + Modal)
  // ==========================
  const projectsGrid = document.getElementById('projects-grid');
  const modal = document.getElementById('project-modal');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;

  function truncateText(text, maxLength = 100) {
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  }

  function updateTransform(wrapper) {
    const offset = wrapper.dataset.offset || 0;
    const rotateX = wrapper.dataset.rotateX || 0;
    const rotateY = wrapper.dataset.rotateY || 0;
    const card = wrapper.querySelector('.project-card');
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${offset}px)`;
  }

  function openModal(p) {
    if(!modal) return;
    document.getElementById('modal-image').src = p.image;
    document.getElementById('modal-tag').innerHTML = p.tag;
    document.getElementById('modal-title').innerHTML = p.title;
    document.getElementById('modal-overview').innerHTML = p.overview;
    document.getElementById('modal-overview2').innerHTML = p.overview2;
    document.getElementById('modal-dates').innerHTML = p.dates;
    document.getElementById('modal-skills').innerHTML = p.skills;
    document.getElementById('modal-software').innerHTML = p.software;
    document.getElementById('modal-context').innerHTML = p.context;
    document.getElementById('modal-btn').onclick = () => window.open(p.link, '_blank');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if(!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  if(modalClose) modalClose.addEventListener('click', closeModal);
  window.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  if(projectsGrid){
    fetch('json/projects.json')
      .then(res => res.json())
      .then(projects => {
        projects.slice(0, 5).forEach(p => {
          const wrapper = document.createElement('div');
          wrapper.classList.add('project-card-wrapper');
          wrapper.innerHTML = `
            <article class="project-card">
              <div class="project-media">
                <img src="${p.image}" alt="${p.title}">
              </div>
              <div class="project-content">
                <span class="project-tag">${p.tag}</span>
                <h3>${p.title}</h3>
                <p>${truncateText(p.overview)}</p>
                <button class="project-btn">Voir le projet</button>
              </div>
            </article>
          `;
          projectsGrid.appendChild(wrapper);

          const card = wrapper.querySelector('.project-card');

          // Hover 3D
          wrapper.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            wrapper.dataset.rotateX = ((y / rect.height) - 0.5) * 8;
            wrapper.dataset.rotateY = ((x / rect.width) - 0.5) * -8;
            wrapper.style.zIndex = 9999;
            updateTransform(wrapper);
          });

          wrapper.addEventListener('mouseleave', () => {
            wrapper.dataset.rotateX = 0;
            wrapper.dataset.rotateY = 0;
            wrapper.style.zIndex = 1;
            updateTransform(wrapper);
          });

          wrapper.querySelector('.project-btn')
            .addEventListener('click', () => openModal(p));
        });
      });
  }

  // ==========================
  // SCROLL / NAV / PARALLAX
  // ==========================
  const nav = document.querySelector('.main-nav');
  let lastScrollY = window.scrollY;

  const parallaxSection = document.querySelector('.interests-jobs');
  const about = document.querySelector('.about-me');
  const aboutImg = document.querySelector('.about-visual img');
  const projectSection = document.querySelector('.projects-grid');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero BG
    if(headerEl){
      const scrollRatio = clamp(scrollY / window.innerHeight, 0, 1);
      headerEl.style.backgroundColor = `rgb(${lerp(0,20,scrollRatio)}, ${lerp(157,127,scrollRatio)}, ${lerp(255,195,scrollRatio)})`;
    }

    // Parallax
    if(parallaxSection) parallaxSection.style.transform = `translateY(${scrollY*0.08}px)`;
    if(projectSection) projectSection.style.transform = `translateY(${projectSection.getBoundingClientRect().top*0.02}px)`;
    if(about && aboutImg){
      const rect = about.getBoundingClientRect();
      const offset = rect.top * 0.05;
      if(rect.top < window.innerHeight && rect.bottom > 0) aboutImg.style.transform = `translateY(${offset}px)`;
    }

    // Nav hide/show
    if(nav){
      if(scrollY > lastScrollY && scrollY > 50){
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
    }
    lastScrollY = scrollY;

    // Projects parallax + z-index
    const projectWrappers = document.querySelectorAll('.project-card-wrapper');
    if(projectWrappers.length){
      let closestWrapper = null;
      let closestDistance = Infinity;
      projectWrappers.forEach(wrapper => {
        const rect = wrapper.getBoundingClientRect();
        const offset = rect.top * 0.02;
        wrapper.dataset.offset = offset;
        const distance = Math.abs(rect.top + rect.height/2 - window.innerHeight/2);
        if(distance < closestDistance){
          closestDistance = distance;
          closestWrapper = wrapper;
        }
        updateTransform(wrapper);
      });
      projectWrappers.forEach(w => {
        if(w !== closestWrapper && !w.matches(':hover')) w.style.zIndex = 1;
      });
      if(closestWrapper && !closestWrapper.matches(':hover')) closestWrapper.style.zIndex = 9999;
    }
  });

  // ==========================
  // TYPOGRAPHY ANIMATION
  // ==========================
  const title = document.querySelector('.main-job');
  if(title){
    const text = title.textContent;
    title.textContent = '';
    [...text].forEach((letter, i) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.animationDelay = `${i*0.05}s`;
      title.appendChild(span);
    });
  }

}); // DOMContentLoaded
