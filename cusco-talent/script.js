document.addEventListener('DOMContentLoaded', () => {
  // Parallax Effect for Floating Elements
  const floatingElements = document.querySelectorAll('.float-icon');
  
  if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      floatingElements.forEach((el) => {
        const speed = el.getAttribute('data-speed');
        const offsetX = (window.innerWidth / 2 - e.clientX) * speed * 0.01;
        const offsetY = (window.innerHeight / 2 - e.clientY) * speed * 0.01;
        
        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    });
  }

  // Category Tag Selection Simulation
  const categoryTags = document.querySelectorAll('.category-tag');
  const searchInput = document.getElementById('search-input');

  categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Remove active from all
      categoryTags.forEach(t => {
        t.style.background = 'rgba(255, 255, 255, 0.05)';
        t.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        t.style.color = 'var(--text-light)';
      });
      
      // Add active to clicked
      tag.style.background = 'rgba(212, 175, 55, 0.15)';
      tag.style.borderColor = 'var(--inca-gold)';
      tag.style.color = 'var(--inca-gold)';
      
      // Auto-fill search
      const text = tag.textContent.trim();
      searchInput.value = text;
      
      searchInput.focus();
    });
  });

  // Search form submission
  const searchForm = document.querySelector('.smart-search');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(searchInput.value.trim() !== '') {
      // Using Inca gold style for an alert simulation would be neat, but standard alert is fine.
      alert(`Buscando especialistas en: ${searchInput.value}`);
    }
  });
});
