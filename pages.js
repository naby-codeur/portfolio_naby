// ===== PAGES JAVASCRIPT =====
// Script spécifique aux pages du portfolio multi-page

document.addEventListener('DOMContentLoaded', function() {
    // ===== INITIALISATION DES PAGES =====
    initPageAnimations();
    initSkillsAnimation();
    initFAQ();
    initProjectFilter();
    initContactForm();
    initProcessSteps();
    initTechAnimation();
    initStatsAnimation();
});

// ===== ANIMATIONS DES PAGES =====
function initPageAnimations() {
    // Animation d'entrée pour les éléments de page
    const pageElements = document.querySelectorAll('.page-header, .section-header, .service-card, .project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    pageElements.forEach(el => observer.observe(el));
}

// ===== ANIMATION DES COMPÉTENCES =====
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                // Animation de la barre de progression
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 200);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Fermer tous les autres items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle l'item actuel
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// ===== FILTRE DES PROJETS =====
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Mettre à jour le bouton actif
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrer les projets avec animation
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== FORMULAIRE DE CONTACT =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation du formulaire
            if (validateContactForm()) {
                submitContactForm();
            }
        });
        
        // Validation en temps réel
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

function validateContactForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    // Supprimer les anciens messages d'erreur
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation selon le type de champ
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Ce champ est obligatoire';
    } else if (fieldName === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Veuillez entrer une adresse email valide';
    } else if (fieldName === 'phone' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Veuillez entrer un numéro de téléphone valide';
    }
    
    // Afficher l'erreur si nécessaire
    if (!isValid) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#ef4444';
    } else {
        field.style.borderColor = '#10b981';
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function submitContactForm() {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Animation de chargement
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simuler l'envoi
    setTimeout(() => {
        showNotification('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
        
        // Réinitialiser le formulaire
        document.getElementById('contactForm').reset();
        
        // Restaurer le bouton
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Réinitialiser les styles des champs
        const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }, 2000);
}

// ===== ANIMATION DES ÉTAPES DU PROCESSUS =====
function initProcessSteps() {
    const processSteps = document.querySelectorAll('.process-step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animation du numéro d'étape
                const stepNumber = entry.target.querySelector('.step-number');
                if (stepNumber) {
                    animateNumber(stepNumber);
                }
            }
        });
    }, { threshold: 0.5 });

    processSteps.forEach(step => observer.observe(step));
}

function animateNumber(element) {
    const targetNumber = parseInt(element.textContent);
    let currentNumber = 0;
    const increment = targetNumber / 20;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            element.textContent = targetNumber.toString().padStart(2, '0');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentNumber).toString().padStart(2, '0');
        }
    }, 50);
}

// ===== ANIMATION DES TECHNOLOGIES =====
function initTechAnimation() {
    const techItems = document.querySelectorAll('.tech-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                entry.target.style.animationDelay = Math.random() * 0.5 + 's';
            }
        });
    }, { threshold: 0.1 });

    techItems.forEach(item => observer.observe(item));
}

// ===== ANIMATION DES STATISTIQUES =====
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateStatNumber(element) {
    const text = element.textContent;
    const isPercentage = text.includes('%');
    const isPlus = text.includes('+');
    const number = parseInt(text.replace(/[^\d]/g, ''));
    
    let currentNumber = 0;
    const increment = number / 30;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= number) {
            let finalText = number.toString();
            if (isPlus) finalText += '+';
            if (isPercentage) finalText += '%';
            element.textContent = finalText;
            clearInterval(timer);
        } else {
            let displayText = Math.floor(currentNumber).toString();
            if (isPlus) displayText += '+';
            if (isPercentage) displayText += '%';
            element.textContent = displayText;
        }
    }, 50);
}

// ===== ANIMATION DES ÉLÉMENTS FLOTTANTS =====
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Animation aléatoire pour chaque élément
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;
        
        element.style.animation = `float ${randomDuration}s ease-in-out infinite`;
        element.style.animationDelay = `${randomDelay}s`;
    });
}

// ===== ANIMATION DES TIMELINE =====
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animation du marqueur
                const marker = entry.target.querySelector('.timeline-marker');
                if (marker) {
                    marker.style.animation = 'pulse 1s ease-in-out';
                }
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => observer.observe(item));
}

// ===== ANIMATION DES VALEURS =====
function initValuesAnimation() {
    const valueCards = document.querySelectorAll('.value-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                entry.target.style.animationDelay = Math.random() * 0.3 + 's';
            }
        });
    }, { threshold: 0.1 });

    valueCards.forEach(card => observer.observe(card));
}

// ===== GESTION DES NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animation de sortie
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ===== INITIALISATION DES ANIMATIONS SUPPLÉMENTAIRES =====
document.addEventListener('DOMContentLoaded', function() {
    initFloatingElements();
    initTimelineAnimation();
    initValuesAnimation();
});

// ===== GESTION DU SCROLL SMOOTH =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== LAZY LOADING DES IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce pour les événements de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle pour les événements de resize
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== CONSOLE MESSAGE POUR LES PAGES =====
console.log(`
%c📄 Page Portfolio Multi-page
%cMouhamed Ndiaye - Développeur Web
%c
%cMerci de visiter cette page !
%cPour toute collaboration, contactez-moi.
`,
'color: #6366f1; font-size: 16px; font-weight: bold;',
'color: #10b981; font-size: 12px; font-weight: bold;',
'',
'color: #6b7280; font-size: 10px;',
'color: #6b7280; font-size: 10px;'
);
