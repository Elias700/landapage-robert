Guia de trabalho para qualquer agente de IA (Claude, Codex, Cursor etc.) neste repositório. Leia este arquivo inteiro antes de qualquer alteração.
Landing page já existente e funcionando da Robert Solar, consultoria de energia solar de Robert Lázaro. Este trabalho é uma atualização (redesign + animações), não um site novo.
- Todo o conteúdo e a estrutura de seções atuais (ver seção 3): textos, ordem, âncoras do menu, fotos dos projetos, foto do Robert, formulário e seus campos, links, WhatsApp e Instagram.
- A identidade visual: 
  - verde-petróleo profundo #0B2D2F (e variação #153B3D);
  - amarelo-sol #F6B93B;
  - creme #F7F5ED;
  - branco #FFFFFF;
  - títulos sans com a palavra de destaque em serifada itálica amarela ("economia.", "Todos os dias.", "seu telhado.", "projetos e instalações.", "Robert Lázaro.", "boa conversa."). Esse padrão é a assinatura da marca: mantenha e valorize.
- Toda a lógica que já funciona: envio do formulário, integrações, analytics, pixel, rotas e links. Não quebre nada.
O site está correto, mas simples e estático. O objetivo é elevá-lo ao padrão premium dos outros projetos:
1. animações de scroll do clone em src/clone, que são a prioridade número um;
2. acabamento de design mais sofisticado (ritmo, profundidade, microinterações, tipografia mais expressiva);
3. SEO, acessibilidade e desempenho no mesmo nível dos outros projetos.
- Use a stack que o projeto já tem. Antes de qualquer coisa, leia package.json, angular.json (ou equivalente) e a estrutura de src/. Não migre de framework, não troque de versão maior e não reescreva o que funciona.
- Se o projeto for Angular (padrão dos outros projetos): 
  - standalone components, signals, inject(), control flow nativo (@if, @for, @defer) e OnPush;
  - ao tocar num componente antigo, você pode modernizá-lo nesse padrão, desde que o comportamento continue igual;
  - SSR e prerender com @angular/ssr: se o projeto ainda não tiver, adicione (ng add @angular/ssr) com prerender da rota /. Confirme comigo antes, se isso exigir mudanças grandes;
  - imagens com NgOptimizedImage;
  - TypeScript strict.
- Se não for Angular, aplique os mesmos princípios com as ferramentas equivalentes da stack e me avise.
- Estilos: mantenha a abordagem atual (SCSS/CSS). Centralize as cores e fontes em design tokens (CSS custom properties). Se já existirem, reaproveite e complete.
- Não adicione dependências sem justificar. Bibliotecas de animação só se o clone já usar a mesma.
- Commits pequenos e por etapa (se for um repositório git), para facilitar a revisão e reverter.
Seções atuais, na ordem:
1. Header: logo (sol + "Robert Solar"), menu (Início, Vantagens, Como funciona, Nosso trabalho, Sobre) e botão "Falar com Robert".
2. Hero (fundo verde com foto de painéis): 
   - eyebrow "Energia inteligente para o seu futuro";
   - título "Transforme luz do sol em economia.";
   - texto de apoio;
   - CTAs "Quero uma análise gratuita" e "Conhecer as vantagens";
   - indicador "Descubra";
   - card "Energia que se paga".
3. Vantagens (fundo creme): "O sol trabalha por você. Todos os dias." e 3 cards numerados: Economia ("Sua conta de luz suave"), Valorização ("Um imóvel mais valorizado") e Sustentabilidade ("Energia limpa todos os dias"), cada um com "Quero saber mais".
4. Como funciona (fundo verde): "Da sua conta de luz à energia do seu telhado.", com abas 01 Diagnóstico, 02 Projeto e 03 Acompanhamento, mais um card de etapa ("Entendo o seu consumo", "Conversa simples, sem compromisso").
5. Nosso trabalho: "Confira alguns dos nossos projetos e instalações.", carrossel de fotos reais com setas.
6. Sobre: "Olá, eu sou Robert Lázaro.", foto em arco, selo "Consultoria personalizada", texto de missão e assinatura.
7. Contato (fundo verde): "Seu projeto começa com uma boa conversa.", selo "Sem compromisso", formulário "Solicite sua Análise" (Nome, Cidade, Onde deseja instalar, Valor médio da conta) e botão "Solicitar análise gratuita".
8. Footer: logo, descrição, navegação, "Fale comigo", Instagram, copyright e slogan "Energia limpa. Futuro brilhante."
9. Botão flutuante de WhatsApp.
O agente deve confirmar este inventário no código na Fase 0 e corrigir esta lista se houver diferenças.
1. Só para estudo. Nunca importe, referencie ou empacote arquivos de src/clone no app. Garanta que ela fique fora do build: 
   - em tsconfig.app.json: "exclude": ["src/clone/**"];
   - não inclua src/clone em assets nem em styles.
2. Aproveite apenas o comportamento de movimento e de interação: timings, easings, sequências e padrões de scroll (pin, parallax, reveal, split text, máscara de imagem, scrub, scroll horizontal, troca de cor de fundo, zoom, marquee, contadores, smooth scroll, loader, transições de menu e hovers).
3. Não copie a identidade do site original: nenhum texto, imagem, logo, fonte licenciada ou layout idêntico. A identidade continua sendo a da Robert Solar.
4. Antes de alterar qualquer seção, gere docs/clone-analysis.md (ver PROMPT.md, Fase 0).
5. Código minificado do clone deve ser reescrito em TypeScript limpo e tipado.
- Centralize em src/app/core/animations/ (ou na pasta equivalente do projeto): 
  - scroll-animation.service.ts: inicializa a biblioteca (ex.: GSAP + ScrollTrigger, Lenis), registra plugins, faz o refresh;
  - diretivas reutilizáveis, por exemplo appReveal, appParallax, appSplitText, appPinSection, appImageMask, appImageZoom, appHorizontalScroll, appBgShift, appMarquee, appCounter, appDrawSvg, configuráveis por input().
- Aplique as diretivas nos templates existentes, mudando o mínimo de HTML necessário.
- Luz e calor: revelações que lembram a luz do sol se espalhando (máscaras que se abrem a partir de um ponto, brilho amarelo suave, gradientes que "acendem").
- O ícone do sol do logo pode girar muito devagar no scroll (scrub), servir de loader ou pulsar suavemente nos destaques. Não exagere: no máximo um elemento girando por tela.
- A palavra em itálico amarelo de cada título é o momento-chave: ela entra por último, com um reveal próprio (máscara de baixo para cima, sublinhado ou "acender" em amarelo).
- Transições entre fundo verde e creme feitas com a troca de cor de fundo do clone, em vez de cortes secos.
- Durações de 0,7–1,2s, easings expo.out/power3.out e stagger leve.
- Compatível com SSR: nada de window, document ou gsap no servidor. Use afterNextRender() ou isPlatformBrowser().
- Fora da zona do Angular: use NgZone.runOutsideAngular() nos loops e listeners de scroll.
- Limpeza: destrua tudo no DestroyRef.onDestroy (gsap.context() + ctx.revert()).
- Conteúdo visível sem JS: o estado inicial "escondido" só é aplicado depois que o JS iniciar (ex.: classe .js-anim no <html>).
- prefers-reduced-motion: reduce: sem parallax, pin, scrub, zoom, marquee, giro do sol e smooth scroll.
- Desempenho: anime só transform, opacity e clip-path. Meta: 60 fps num celular intermediário. Boa parte dos clientes vem do Instagram e do WhatsApp, no celular.
- Sem CLS: use aspect-ratio nas imagens.
- Mobile: abaixo de 768px, pins longos e scroll horizontal viram reveals ou carrossel com swipe.
- Âncoras: os links do menu rolam até a seção certa, compensando o header fixo.
- Recalcule os gatilhos depois que imagens e fontes carregarem (ScrollTrigger.refresh()).
- Mantenha a paleta e o padrão de títulos da seção 1. Pode refinar os tons (ex.: um verde intermediário, um amarelo mais claro para brilhos), mas sem trocar a identidade.
- Tipografia: confirme as fontes atuais. Se a serifada itálica for genérica, sugira uma mais expressiva (ex.: Fraunces Italic, Instrument Serif ou DM Serif Display Italic) e mostre antes de trocar. Use títulos maiores e fluidos com clamp().
- Profundidade: grão/ruído sutil nos fundos verdes, gradientes radiais quentes (sol) atrás de elementos-chave, sombras suaves nos cards e bordas mais finas.
- Microinterações: 
  - botões com preenchimento animado e seta que desliza;
  - cards com leve elevação e brilho amarelo no hover;
  - links com sublinhado animado;
  - cursor customizado só se o clone tiver, e só em pointer: fine.
- Imagens: use as fotos que já estão no projeto e em public/. Nunca invente caminhos. Fotos reais de instalações valem mais que banco de imagens.
- Responsividade total: teste em 320, 375, 414, 768, 1024, 1280, 1440, 1920 e 2560px. Mobile-first, áreas de toque com no mínimo 44×44px e sem rolagem horizontal involuntária.
- Não invente números: nada de "economize até 95%", "+500 instalações", "retorno em 3 anos", kWh gerados ou "X anos de experiência" sem dado real do Robert. Contadores animados só com números confirmados.
- Precisão sobre economia: a geração distribuída é regulada pela Lei 14.300/2022, e a conta de luz não "zera" (há custo de disponibilidade e encargos). Evite "zere sua conta" ou "nunca mais pague luz". 
  - O texto atual do card Economia ("elimine a obrigatoriedade dos aumentos da tarifa elétrica") promete demais. Sugira uma versão mais precisa (ex.: "Produza a própria energia e fique menos exposto aos aumentos da tarifa.") e peça minha aprovação antes de trocar.
- "Análise gratuita" pode continuar, porque é uma oferta real do Robert.
- Parceiros, marcas de painéis e inversores, certificações e garantias só entram se eu confirmar.
- Depoimentos só com textos reais fornecidos por mim, sem inventar.
- Qualquer mudança de texto além de ajustes mínimos de clareza deve ser listada no relatório final para eu aprovar.
- <html lang="pt-BR">, um único <h1> (no hero: "Transforme luz do sol em economia." está ótimo; complemente o contexto com o eyebrow e o subtítulo), hierarquia de headings correta e HTML semântico.
- SeoService (ou equivalente) com title, meta description, canonical, robots e theme-color (#0B2D2F): 
  - title sugerido: Robert Solar | Energia Solar com Consultoria Personalizada (inclua a cidade/região quando eu informar);
  - description sugerida: "Reduza sua conta de luz com energia solar. Robert Lázaro faz o diagnóstico, o projeto e o acompanhamento da sua instalação. Solicite uma análise gratuita."
- Open Graph e Twitter Card com og-image.jpg (1200×630), usando uma foto real de instalação.
- JSON-LD no SSR: 
  - LocalBusiness (ou ProfessionalService) com nome, logo, imagem, areaServed (TODO: cidades atendidas), sameAs (Instagram) e founder/employee Robert Lázaro;
  - Service ("Instalação de energia solar fotovoltaica");
  - FAQPage, se houver FAQ;
  - WebSite.
  - Sem endereço, telefone ou avaliações inventados.
- robots.txt, sitemap.xml e favicons completos (gerados a partir do ícone do sol).
- Palavras-chave naturais: "energia solar", "energia solar residencial", "energia solar para empresas", "placas solares", "instalação de energia solar", "reduzir conta de luz", mais a cidade/região quando eu informar.
- Core Web Vitals: LCP < 2,5s, CLS < 0,1, INP < 200ms. Meta de Lighthouse ≥ 95 em todas as categorias (mobile).
- Formulário (LGPD): adicione o checkbox de consentimento com link para a política de privacidade, labels visíveis e acessíveis (hoje parecem ser só placeholders), máscara de moeda no campo de valor da conta e validação com mensagens claras. Mantenha o destino atual do envio. Crie a página ou modal de política de privacidade se não existir.
- WCAG 2.2 AA: 
  - contraste ≥ 4.5:1 (atenção ao amarelo #F6B93B sobre branco ou creme em texto pequeno: use o amarelo só em texto grande ou escureça-o);
  - foco visível e navegação completa por teclado;
  - link "Pular para o conteúdo".
- Abas de "Como funciona" com role="tablist"/tab/tabpanel e setas do teclado.
- Carrossel de projetos acessível (botões com aria-label, teclado, swipe e sem autoplay forçado).
- Menu mobile acessível (aria-expanded, trap de foco, fechar com Esc).
Uma tarefa só está pronta quando:
- [ ] npm run build termina sem erros nem warnings novos;
- [ ] tudo o que funcionava continua funcionando (formulário enviando, WhatsApp, links, âncoras, carrossel, abas);
- [ ] nenhum texto foi alterado sem estar listado no relatório;
- [ ] as animações funcionam, são destruídas corretamente e respeitam prefers-reduced-motion;
- [ ] o layout foi verificado em todas as larguras da seção 6;
- [ ] nada de src/clone foi parar no bundle;
- [ ] SEO, LGPD e acessibilidade das seções 8 e 9 foram aplicados;
- [ ] os números de Lighthouse de antes e depois foram informados.