// Quem configurou o sistema para reduzir animações não recebe autoplay
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- CARROSSEL DO BANNER (HERO) ---
// Array com os caminhos das imagens do Banner Hero
const imagens = [
    "public/assets/images/img-header1.jpg",
    "public/assets/images/img-header2.jpg"
];

const HERO_INTERVALO = 5000; // troca a cada 5 segundos

let indexAtual = 0;
const heroElement = document.getElementById("hero-banner");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let heroInterval = null;
let heroHover = false;         // mouse em cima do banner
let heroKeyboardFocus = false; // foco por teclado dentro do banner

function atualizarFundo() {
    if (heroElement) {
        heroElement.style.backgroundImage = `
            linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
            url('${imagens[indexAtual]}')
        `;
    }
}

function proximaImagem() {
    indexAtual = (indexAtual + 1) % imagens.length;
    atualizarFundo();
}

function imagemAnterior() {
    indexAtual = (indexAtual - 1 + imagens.length) % imagens.length;
    atualizarFundo();
}

function pararHero() {
    clearInterval(heroInterval);
    heroInterval = null;
}

// Sempre limpa o temporizador anterior antes de criar outro
function iniciarHero() {
    pararHero();
    if (reduceMotion || heroHover || heroKeyboardFocus || imagens.length < 2) return;
    heroInterval = setInterval(proximaImagem, HERO_INTERVALO);
}

// Botões manuais: trocam a imagem e reiniciam a contagem
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        proximaImagem();
        iniciarHero();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        imagemAnterior();
        iniciarHero();
    });
}

if (heroElement) {
    // Pausa com o mouse em cima, retoma quando sai
    heroElement.addEventListener("mouseenter", () => {
        heroHover = true;
        pararHero();
    });

    heroElement.addEventListener("mouseleave", () => {
        heroHover = false;
        iniciarHero();
    });

    // Pausa também para quem navega pelo teclado (Tab)
    heroElement.addEventListener("focusin", (event) => {
        if (event.target.matches(":focus-visible")) {
            heroKeyboardFocus = true;
            pararHero();
        }
    });

    heroElement.addEventListener("focusout", () => {
        heroKeyboardFocus = false;
        iniciarHero();
    });
}

// Pré-carrega as imagens para a troca não "piscar"
imagens.forEach((src) => {
    const img = new Image();
    img.src = src;
});

// Carrega a primeira imagem logo que a página abre e inicia o automático
atualizarFundo();
iniciarHero();

// Formulário "Agende sua aula experimental": monta a mensagem e abre o WhatsApp
const whatsappForm = document.getElementById('whatsappForm');
if (whatsappForm) {
    whatsappForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const nome = document.getElementById('nome').value.trim();
        const selectHorario = document.getElementById('horario');
        const horario = selectHorario.options[selectHorario.selectedIndex].text;
        const mensagem = document.getElementById('mensagem').value.trim();

        const telefone = "5511916560389";

        let texto = `Olá! Meu nome é *${nome}* e quero agendar uma aula experimental.\nMelhor horário: ${horario}.`;
        if (mensagem) {
            texto += `\n\nMensagem:\n${mensagem}`;
        }

        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

        window.open(url, '_blank', 'noopener');
    });
}

// Script para o Menu Responsivo (Hambúrguer)
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha o menu automaticamente quando o usuário clica em algum link de âncora
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menu');
        });
    });
}

// --- CARROSSEL DA SEÇÃO SOBRE (autoplay com pausa) ---
const track = document.getElementById('about-track');
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('about-next');
    const prevButton = document.getElementById('about-prev');
    const carouselContainer = document.querySelector('.about-carousel');

    let currentIndex = 0;
    let slideInterval = null;
    let isHovering = false;       // mouse em cima do carrossel
    let hasKeyboardFocus = false; // foco por teclado dentro do carrossel

    function updateSlidePosition(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePosition(currentIndex);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
        slideInterval = null;
    }

    // Sempre limpa o temporizador anterior antes de criar outro (evita acumular)
    // e só roda se o usuário não estiver interagindo com o carrossel.
    function startSlideShow() {
        stopSlideShow();
        if (reduceMotion || isHovering || hasKeyboardFocus) return;
        slideInterval = setInterval(nextSlide, 4000);
    }

    // Botões manuais: troca o slide e reinicia a contagem
    nextButton.addEventListener('click', () => {
        nextSlide();
        startSlideShow();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        startSlideShow();
    });

    // Pausa com o mouse em cima, retoma quando sai
    carouselContainer.addEventListener('mouseenter', () => {
        isHovering = true;
        stopSlideShow();
    });

    carouselContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        startSlideShow();
    });

    // Pausa também para quem navega pelo teclado (Tab)
    carouselContainer.addEventListener('focusin', (event) => {
        if (event.target.matches(':focus-visible')) {
            hasKeyboardFocus = true;
            stopSlideShow();
        }
    });

    carouselContainer.addEventListener('focusout', () => {
        hasKeyboardFocus = false;
        startSlideShow();
    });

    // Arrancar o carrossel automaticamente ao carregar a página
    startSlideShow();
}

// --- DEPOIMENTOS: botão "Ler mais" ---
// Limita cada depoimento a 6 linhas (veja .is-clamped no CSS) e só cria o
// botão quando o texto realmente passa disso.
const cardsDepoimento = document.querySelectorAll('.testimonial-card');

function ajustarDepoimento(card, index) {
    const texto = card.querySelector('p');
    if (!texto) return;

    if (!texto.id) texto.id = `depoimento-texto-${index}`;

    let botao = card.querySelector('.testimonial-toggle');

    // Se o depoimento está aberto, não mexe
    if (botao && botao.getAttribute('aria-expanded') === 'true') return;

    texto.classList.add('is-clamped');
    const temExcesso = texto.scrollHeight > texto.clientHeight + 1;

    if (!temExcesso) {
        // Texto curto: mostra inteiro e não precisa de botão
        texto.classList.remove('is-clamped');
        if (botao) botao.remove();
        return;
    }

    if (!botao) {
        botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'testimonial-toggle';
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-controls', texto.id);
        botao.textContent = 'Ler mais';
        texto.insertAdjacentElement('afterend', botao);

        botao.addEventListener('click', () => {
            const abrir = botao.getAttribute('aria-expanded') !== 'true';
            texto.classList.toggle('is-clamped', !abrir);
            botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
            botao.textContent = abrir ? 'Ler menos' : 'Ler mais';
            // Ao fechar, mantém o card visível na tela
            if (!abrir) card.scrollIntoView({ block: 'nearest' });
        });
    }
}

function ajustarTodosDepoimentos() {
    cardsDepoimento.forEach(ajustarDepoimento);
}

// Roda já, e de novo quando as fontes terminam de carregar (mudam a medida do texto)
ajustarTodosDepoimentos();
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ajustarTodosDepoimentos);
}

// Reavalia ao girar/redimensionar a tela (o texto quebra em linhas diferentes)
let timerRedimensionar;
window.addEventListener('resize', () => {
    clearTimeout(timerRedimensionar);
    timerRedimensionar = setTimeout(ajustarTodosDepoimentos, 150);
});