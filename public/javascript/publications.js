function wrapWords(element) {
    const text = element.textContent.trim();
    element.innerHTML = "";
    const words = text.split(/\s+/);
    
    words.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = word;
        element.appendChild(span);
        
        // Add a space after each word except the last one
        if (index < words.length - 1) {
            element.appendChild(document.createTextNode(" "));
        }
    });
}

function animateElementsSequentially(elements, delay = 100) {
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, index * delay);
    });
}

// Scroll animation observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Animate heading
                const heading = card.querySelector('.card-inner h2');
                if (heading && !heading.classList.contains('scroll-animated')) {
                    heading.classList.add('scroll-animated');
                    const words = heading.querySelectorAll('.word');
                    animateElementsSequentially(words, 60);
                }
                
                // Animate paragraph
                const paragraph = card.querySelector('.card-inner p');
                if (paragraph && !paragraph.classList.contains('scroll-animated')) {
                    paragraph.classList.add('scroll-animated');
                    const words = paragraph.querySelectorAll('.word');
                    animateElementsSequentially(words, 30);
                }
                
                // Animate button
                const button = card.querySelector('.view-btn');
                if (button && !button.classList.contains('scroll-animated')) {
                    setTimeout(() => {
                        button.classList.add('scroll-animated');
                        button.classList.add('animate-in');
                    }, 600);
                }
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.publication-card').forEach(card => {
        scrollObserver.observe(card);
    });
}

// Scroll direction detection
let lastScrollTop = 0;
let scrollDirection = 'down';

function detectScrollDirection() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    if (st > lastScrollTop) {
        scrollDirection = 'down';
    } else {
        scrollDirection = 'up';
    }
    lastScrollTop = st <= 0 ? 0 : st;
}

// Enhanced scroll animations with direction
function initDirectionalScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    };

    const directionalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const heading = card.querySelector('.card-inner h2');
                const paragraph = card.querySelector('.card-inner p');
                
                if (heading && !heading.classList.contains('direction-animated')) {
                    heading.classList.add('direction-animated');
                    
                    // Add direction-based class
                    if (scrollDirection === 'down') {
                        heading.classList.add('scroll-down');
                    } else {
                        heading.classList.add('scroll-up');
                    }
                    
                    const words = heading.querySelectorAll('.word');
                    animateElementsSequentially(words, 70);
                }
                
                if (paragraph && !paragraph.classList.contains('direction-animated')) {
                    paragraph.classList.add('direction-animated');
                    
                    // Add direction-based class with delay
                    setTimeout(() => {
                        if (scrollDirection === 'down') {
                            paragraph.classList.add('scroll-down');
                        } else {
                            paragraph.classList.add('scroll-up');
                        }
                    }, 200);
                    
                    const words = paragraph.querySelectorAll('.word');
                    animateElementsSequentially(words, 35);
                }
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.publication-card').forEach(card => {
        directionalObserver.observe(card);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".publication-card");
    const headings = document.querySelectorAll(".card-inner h2");
    const paragraphs = document.querySelectorAll(".card-inner p");
    const buttons = document.querySelectorAll(".view-btn");
    
    // Wrap all headings and paragraphs by words
    headings.forEach(heading => wrapWords(heading));
    paragraphs.forEach(paragraph => wrapWords(paragraph));

    // Add initial animation delay to cards
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
    });

    // Animate cards on page load
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.add('animate-in');
        });
    }, 300);

    // Animate headings with staggered effect
    setTimeout(() => {
        headings.forEach(heading => {
            heading.classList.add('animate-in');
            
            // Animate words in heading with delay
            const words = heading.querySelectorAll('.word');
            animateElementsSequentially(words, 80);
        });
    }, 500);

    // Animate paragraphs with staggered effect
    setTimeout(() => {
        paragraphs.forEach(paragraph => {
            paragraph.classList.add('animate-in');
            
            // Animate words in paragraph with delay
            const words = paragraph.querySelectorAll('.word');
            animateElementsSequentially(words, 40);
        });
    }, 800);

    // Animate buttons
    setTimeout(() => {
        buttons.forEach(button => {
            button.classList.add('animate-in');
        });
    }, 1200);

    // Add pulse animation to buttons on hover
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('pulse-animation');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('pulse-animation');
        });
    });

    // Initialize scroll animations
    initScrollAnimations();
    initDirectionalScrollAnimations();

    // Track scroll direction
    window.addEventListener('scroll', detectScrollDirection, { passive: true });

    // Re-run wrapping logic on resize (debounced)
    let resizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reset and re-wrap all text
            headings.forEach(heading => {
                heading.innerHTML = heading.textContent;
                wrapWords(heading);
            });
            
            paragraphs.forEach(paragraph => {
                paragraph.innerHTML = paragraph.textContent;
                wrapWords(paragraph);
            });
        }, 180);
    });
});