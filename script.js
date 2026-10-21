const header = document.getElementById('header');
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');

const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
} else {
  items.forEach(el => el.classList.add('visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();

// Modal das áreas de atuação
(() => {
  const AREAS = {
    clima: {
      title: 'Climatização e Ar Condicionado',
      lead: 'Residencial e comercial. Foco no conforto térmico de ambientes.',
      items: [
        ['Instalação e Manutenção de Ar Condicionado', 'Atendimento completo para modelos tradicionais (Split, Cassete, Piso-Teto).'],
        ['Limpeza e Higienização', 'Manutenção preventiva para garantir a qualidade do ar e economia de energia.'],
        ['Sistemas VRF (Fluxo de Refrigerante Variável)', 'Engenharia especializada em instalação e manutenção de sistemas VRF para grandes ambientes e edifícios.']
      ]
    },
    refri: {
      title: 'Refrigeração Comercial e Industrial',
      lead: 'Foco na conservação de produtos e cadeia do frio para comércios.',
      items: [
        ['Câmaras Frias', 'Projetos, instalação e manutenção corretiva/preventiva de câmaras de congelados e resfriados.'],
        ['Equipamentos Comerciais', 'Assistência técnica para ilhas de congelados, balcões expositores, freezers e geladeiras comerciais.'],
        ['Soluções em Refrigeração Geral', 'Atendimento sob medida para supermercados, padarias, açougues e restaurantes.']
      ]
    },
    pmoc: {
      title: 'Contratos Corporativos e Engenharia (PMOC)',
      lead: 'Foco no atendimento B2B, empresas e conformidade legal.',
      items: [
        ['Contratos de Manutenção Preventiva', 'Planos mensais de assistência técnica para frotas de aparelhos e sistemas industriais.'],
        ['Implantação de PMOC', 'Elaboração e execução do Plano de Manutenção, Operação e Controle, garantindo que a empresa cumpra as exigências da Vigilância Sanitária (Lei 13.589/18).']
      ]
    }
  };

  const modal = document.getElementById('areaModal');
  const title = document.getElementById('modalTitle');
  const lead = document.getElementById('modalLead');
  const list = document.getElementById('modalList');

  document.querySelectorAll('.area-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      const area = AREAS[btn.dataset.modal];
      title.textContent = area.title;
      lead.textContent = area.lead;
      list.innerHTML = '';
      area.items.forEach(([name, desc]) => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = name + ': ';
        li.append(strong, desc);
        list.appendChild(li);
      });
      modal.showModal();
    })
  );

  document.getElementById('modalClose').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
})();

// Carrossel: avança automaticamente a cada 2,5 s
(() => {
  const root = document.getElementById('carousel');
  const track = document.getElementById('carouselTrack');
  const dotsBox = document.getElementById('carouselDots');
  const slides = track.children;
  const INTERVAL = 2500;
  let index = 0;
  let timer = null;

  const perView = () => parseInt(getComputedStyle(root).getPropertyValue('--per-view'), 10) || 1;
  const maxIndex = () => slides.length - perView();

  const buildDots = () => {
    dotsBox.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Ir para posição ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dotsBox.appendChild(b);
    }
  };

  const go = (i) => {
    const max = maxIndex();
    index = i > max ? 0 : i < 0 ? max : i;
    const step = slides[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
    track.style.transform = `translateX(${-index * step}px)`;
    [...dotsBox.children].forEach((d, n) => d.classList.toggle('active', n === index));
  };

  const start = () => { stop(); timer = setInterval(() => go(index + 1), INTERVAL); };
  const stop = () => clearInterval(timer);
  const restart = () => start();

  document.getElementById('carouselNext').addEventListener('click', () => { go(index + 1); restart(); });
  document.getElementById('carouselPrev').addEventListener('click', () => { go(index - 1); restart(); });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  let lastPerView = perView();
  window.addEventListener('resize', () => {
    if (perView() !== lastPerView) { lastPerView = perView(); buildDots(); }
    go(Math.min(index, maxIndex()));
  });

  buildDots();
  go(0);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
})();
