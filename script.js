document.addEventListener('DOMContentLoaded', () => {
    const accordionBtns = document.querySelectorAll('.task-accordion-btn');
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            
            btn.classList.toggle('active');
            btn.setAttribute('aria-expanded', !isExpanded);
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
        
        // Add keyboard support
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const code = btn.previousElementSibling.textContent;
            
            try {
                // Try modern Clipboard API first
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(code);
                } else {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = code;
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-999999px';
                    textarea.style.top = '-999999px';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }

                // Visual feedback
                btn.textContent = 'Copied!';
                btn.classList.add('copy-btn-copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copy-btn-copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                btn.textContent = 'Failed';
                btn.classList.add('bg-red-500');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('bg-red-500');
                }, 2000);
            }
        });
    });
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    const archDiagram = document.getElementById('architecture-diagram');
    const infoBox = document.getElementById('arch-info-box');
    const archComponents = document.querySelectorAll('.arch-component, .arch-layer');
    const defaultInfoText = infoBox.textContent;

    archComponents.forEach(comp => {
        comp.addEventListener('mouseover', (e) => {
            e.stopPropagation();
            const info = comp.dataset.info;
            if (info) {
                infoBox.textContent = info;
                infoBox.style.opacity = 1;
            }
        });
    });
    
    archDiagram.addEventListener('mouseout', () => {
        infoBox.textContent = defaultInfoText;
        infoBox.style.opacity = 0;
    });

    const chartContainer = document.querySelector('.chart-container');
    const chartLoading = document.getElementById('chart-loading');
    const tasksChartCanvas = document.getElementById('tasksChart');
    const ctx = tasksChartCanvas.getContext('2d');
    const tasksChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Intro & Use Case',
                'AWS Infrastructure Setup',
                'Moodle Installation',
                'Securing the Instance',
                'Backup & Monitoring',
                'Report & Reflection'
            ],
            datasets: [{
                label: 'Assessment Marks',
                data: [2, 3, 4, 4, 3, 4],
                backgroundColor: [
                    '#0d9488',
                    '#0f766e',
                    '#115e59',
                    '#f59e0b',
                    '#d97706',
                    '#b45309'
                ],
                borderColor: '#fdfbf7',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#44403c'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + ' marks';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Show chart and hide loading
    chartLoading.style.display = 'none';
    tasksChartCanvas.classList.remove('hidden');

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('hidden') === false) {
                 mobileMenu.classList.add('hidden');
            }
        });
    });

    // Progress bar functionality
    const progressBar = document.getElementById('progress-bar');
    const updateProgress = () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    // Search functionality
    const searchToggle = document.getElementById('search-toggle');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchToggle.addEventListener('click', () => {
        searchModal.classList.remove('hidden');
        searchInput.focus();
    });

    searchClose.addEventListener('click', () => {
        searchModal.classList.add('hidden');
    });

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.classList.add('hidden');
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            searchResults.innerHTML = '<p class="text-stone-500 text-center">Type to search...</p>';
            return;
        }

        const sections = document.querySelectorAll('section');
        const results = [];

        sections.forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('h2')?.textContent || '';
            const content = section.textContent.toLowerCase();
            
            if (content.includes(query)) {
                const matches = content.match(new RegExp(query, 'gi'));
                const matchCount = matches ? matches.length : 0;
                results.push({
                    id: sectionId,
                    title: sectionTitle,
                    matchCount: matchCount,
                    content: content.substring(0, 200) + '...'
                });
            }
        });

        // Sort by match count
        results.sort((a, b) => b.matchCount - a.matchCount);

        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-stone-500 text-center">No results found</p>';
        } else {
            const resultsHtml = results.map(result => `
                <div class="mb-4 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer" 
                     onclick="document.querySelector('#${result.id}').scrollIntoView({behavior: 'smooth'}); searchModal.classList.add('hidden');">
                    <h4 class="font-semibold text-teal-700">${result.title}</h4>
                    <p class="text-sm text-stone-600 mt-1">${result.content}</p>
                    <p class="text-xs text-stone-500 mt-2">${result.matchCount} match${result.matchCount > 1 ? 'es' : ''}</p>
                </div>
            `).join('');
            searchResults.innerHTML = resultsHtml;
        }
    });

}); 