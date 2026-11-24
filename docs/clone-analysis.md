# Fase 0 — Diagnóstico e análise do clone

Data da auditoria: 24/11/2026. Escopo desta fase: inventário e propostas. Nenhuma seção da landing page foi alterada.

## Lista de tarefas

- [x] Ler `AGENTS.md` e comparar o inventário com o código atual.
- [x] Mapear stack, estrutura, estilos, fontes, SSR, formulário, mídia e integrações.
- [x] Executar o build atual e medir Lighthouse mobile.
- [x] Inspecionar HTML, snapshot, CSS e bundles do clone capturado.
- [x] Registrar o mapeamento de movimento e as propostas de design por seção.
- [ ] Fase 1 — excluir explicitamente o diretório real do clone do tsconfig e confirmar build/saída.
- [ ] Fase 2 — tokens, biblioteca de animação, serviço e diretivas; aguarda respostas às perguntas no fim deste diagnóstico.
- [ ] Fases seguintes — aplicar animações, SEO, LGPD, acessibilidade e regressões após a aprovação do plano.

## Diagnóstico do projeto

| Área | Estado encontrado |
|---|---|
| Stack | Angular 21.2.x, TypeScript 5.9.x, Angular Material/CDK 21.2.x, Tailwind CSS 4.1/4.3. `package.json` declara Angular e CLI com faixas `^21.2`; TypeScript `~5.9.2`. |
| Aplicação | App de página única. `App` monta Header, Home, Advantages, HowItWorks, OurWork, About, Contact, Footer e o botão flutuante de WhatsApp. Os componentes de seção ficam em `src/app/pages/`; layout em `src/app/layout/`; componente compartilhado em `src/app/shared/`. |
| Angular | Componentes standalone e signals já aparecem no projeto. Não foi encontrada configuração geral de `OnPush`. Não há rotas de página configuradas; `app.routes.ts` está vazio e o conteúdo é montado diretamente no app root. |
| Estilos | Tailwind 4 em `src/styles.css`, com cores em `@theme`; estilos globais de reveal também ficam nesse arquivo. Tema Angular Material em `src/material-theme.scss`; há CSS por componente. As cores principais já correspondem à paleta da marca, com tokens de apoio. |
| Fontes | Roboto e Material Icons carregados de Google Fonts em `src/index.html`. Títulos usam a classe utilitária genérica `font-serif`; não há fonte serifada de marca declarada nem arquivo serifado local. Recomendo avaliar Fraunces Italic para a palavra de destaque, pelo contraste expressivo com a sans; não trocar sem sua aprovação. |
| SSR/prerender | Não configurado: `package.json`, `angular.json`, `src/main.ts` e configuração do app não indicam servidor Angular nem prerender. Os registros opcionais de `@angular/ssr` no lockfile são peer dependencies, não uma instalação/configuração ativa. |
| Formulário | FormGroup reativo com Nome, Cidade, Onde deseja instalar e Valor médio da conta. Valida obrigatoriedade, nome mínimo e valor positivo. Não usa endpoint nem `HttpClient`: monta texto e abre `https://api.whatsapp.com/send` com o número 55 71 92961-945. |
| Fotos e vídeos | `public/` tem imagens de instalações, `robert2.jpg`, `favicon.ico`, `video-home.mp4` e dois vídeos do carrossel. O carrossel lista 6 fotos e 2 vídeos. Imagens referenciadas pelo projeto vivem nesse diretório. |
| Integrações | Links de WhatsApp no formulário, footer e botão flutuante; Instagram `robertlazarosilvagomes`. Não encontrei código de Google Analytics, Tag Manager, Pixel, Clarity ou HubSpot no app. `angular.json` contém somente o identificador de analytics da CLI Angular. |
| SEO atual | `src/index.html` declara `lang="en"`, apesar do conteúdo em português, e título “Consultor de energia - Robert Lázaro”. Não encontrei meta description, canonical, OG/Twitter, JSON-LD, robots.txt ou sitemap.xml. O favicon atual é SVG inline em data URI. |
| Acessibilidade atual | O contato usa `mat-label` visível. As setas do carrossel têm `aria-label`. As abas não têm roles/teclado de setas; o menu móvel não expõe `aria-expanded`, não tem fechamento por Escape nem gestão de foco. Não encontrei link para pular ao conteúdo. |
| Animação existente | `RevealOnScrollDirective` usa `IntersectionObserver` e aplica opacidade/transform diretamente. O estado oculto é aplicado no `ngOnInit`, sem guarda de SSR nem preferência de movimento reduzido. Home também tem classes CSS de fade, float e bolinha. |

### Conferência das seções

O inventário geral do `AGENTS.md` confere com o app: nove áreas, na mesma ordem, com Header, Hero, Vantagens, Como funciona, Nosso trabalho, Sobre, Contato, Footer e WhatsApp flutuante. O código contém os textos principais, fotos e os quatro campos do formulário descritos.

Diferenças e observações que precisam ficar visíveis antes da implementação:

- O identificador informado no pedido como `src/clone/` não existe. O espelho está em `src/app/clone/`. `angular.json` copia apenas `public/` e usa `src/styles.css`/`src/material-theme.scss`; o clone não está listado como asset, estilo ou import do app. Para exclusão explícita no tsconfig, o caminho correto será `src/app/clone/**`.
- As etapas Diagnóstico, Projeto e Acompanhamento já têm conteúdo próprio e um card dinâmico em `how-it-works.ts`; não é necessário inventar textos nesta fase.
- A seção Nosso trabalho tem carrossel com setas, scroll snap e observador para reproduzir/pausar os dois vídeos. No celular, o próprio contêiner já permite swipe horizontal.
- O texto atual da descrição do card Economia é “Produza a propria energia e elimine a obrigatoriedade dos aumentos da tarifa elétrica.” Além da promessa forte, “própria” está sem acento. Não alterei o texto. Sugestão para aprovação: “Produza a própria energia e fique menos exposto aos aumentos da tarifa.”
- O formulário ainda não tem checkbox de consentimento LGPD nem página/modal de privacidade. O destino existente é WhatsApp, sem backend.

## Lighthouse mobile — linha de base

Executado com Lighthouse 12.8.2, servidor local na configuração de produção (`ng serve --configuration production`, `http://127.0.0.1:4400/`) e emulação mobile Android 11 / Moto G Power (2022). Os resultados são uma linha de base local; uma nova execução pode variar conforme a máquina e rede.

| Performance | Acessibilidade | Boas práticas | SEO |
|---:|---:|---:|---:|
| 40 | 95 | 96 | 91 |

Métricas registradas: FCP 19,5 s; LCP 19,9 s; TBT 580 ms; CLS 0; Speed Index 19,5 s; TTI 20,4 s. O build `npm run build` termina sem erro, mas já excede o orçamento inicial: 603,54 kB contra 500 kB, aviso de 103,54 kB acima do limite configurado.

## O clone: escopo e bibliotecas observadas

O pedido chama a referência de `src/clone`, mas a cópia arquivada está em `src/app/clone/`. É um espelho VibeCloner da página Echo Camp/White Desert, capturado em 15/11/2026. A pasta contém `index.html`, snapshot renderizado, CSS e JS compilados em `mirror/`, 17 SVGs, mídia, screenshots e documentação. O relatório do espelho indica 360 recursos em `mirror/` e 400 arquivos no diretório todo.

O HTML e os bundles apontam para um site Next.js/React. O runtime dos bundles expõe GSAP 3.11.0, `@gsap/react`/`useGSAP`, ScrollTrigger e Lenis 1.3.15 (`window.lenisVersion`). Não há `package.json` do site original; portanto as versões vêm dos marcadores embutidos no runtime, não de um lockfile preservado. O espelho informa Tailwind e Smooth Scroll. Os 55 chunks JavaScript/CSS incluem código compartilhado com outras páginas do site, então o inventário abaixo separa o que aparece no snapshot/componentes da rota do que são apenas recursos da biblioteca.

### Inventário de movimento e interação

| Padrão observado no clone | Gatilho e parâmetros detectados | Mobile / limite da evidência | Seção existente da Robert Solar | Implementação Angular proposta |
|---|---|---|---|---|
| Smooth scroll Lenis | ReactLenis/useLenis inicia o loop de rolagem; há integração de componentes com Lenis e chamada de refresh/resize após atualização de conteúdo. Duração/easing dependem das opções do provider, não foram recuperáveis em um manifesto. | Há breakpoint específico para hover/desktop nos componentes; o bundle não preserva configuração completa do provider. Para a Robert, desligar em `prefers-reduced-motion` e em telas/touch onde necessário. | Âncoras do Header e CTAs | `ScrollAnimationService` gerencia Lenis e atualiza posições de âncora sob o header fixo. |
| Reveal de conteúdo | Componentes marcam conteúdo com `data-reveal`; GSAP/ScrollTrigger é a infraestrutura. O espelho não preserva um único tempo/easing comum para todos os reveals. Um filtro de cards usa `.6s`, `power2.out`, stagger `.1s` após mudança de filtro — esse parâmetro pertence àquela interação, não prova o timing de todo reveal. | Respeitar redução de movimento e conteúdo visível sem JS. | Todas as seções; com prioridade em Hero, Vantagens, Sobre, Contato e Footer | `appReveal` com inputs de distância, duração e stagger; substituir o `appRevealOnScroll` atual após o serviço estar pronto. |
| Hero com escurecimento/parallax | Hero aplica overlay de transparente a preto 60% sincronizado ao scroll (`scrub: true`, `ease: none`), entre o topo do hero e o topo da próxima seção. Elementos marcados `data-scroll-speed` recebem deslocamento vertical por scroll. | O comportamento usa altura de viewport; simplificar para reveal sem scrub/parallax em telas menores. | Hero (vídeo/foto solar existente) | `appParallax` + `appImageMask` no vídeo/overlay; `appReveal` sequencial no conteúdo. |
| Parallax de conteúdo | Componente `data-scroll-scrub` usa `fromY=10`, `toY=-10` (unidade `em`), início `top bottom`, fim `bottom top`, `scrub=true`, easing `none`. | Está associado a mídia/conteúdo do clone; não replicar deslocamentos grandes na versão mobile. | Hero e foto do Robert | `appParallax` configurável, com range pequeno e desativado no mobile/reduced motion. |
| Máscara/clip-path em imagem | O bundle anima `clipPath` com ScrollTrigger e scrub, transicionando `inset()`/raio; um uso detectado percorre `top 80%` até `top 50%`. | CSS inclui breakpoints para 768/767 px; parâmetros do elemento específico não devem ser transplantados sem adaptação. | Fotos de instalações e retrato de Robert | `appImageMask` e `appImageZoom`, aplicadas às imagens existentes e com `aspect-ratio`. |
| Pin de seção/texto | ScrollTrigger usa `pin: true`, início `top top`, fim calculado a partir da distância do conteúdo, `scrub: true` e `invalidateOnRefresh`. Um módulo fixa um bloco até o próximo bloco alcançar o topo. | O clone usa `matchMedia` e regras desktop; para a Robert, sem pin longo abaixo de 768 px. | Como funciona (progresso pelas três etapas) | `appPinSection` + ligação das etapas existentes ao card e barra de progresso; manter tabs acionáveis e acessíveis. |
| Scroll horizontal | `.horizontal-scroll_wrapper` fica sticky em `top: 0`, altura `100svh`; `.horizontal-scroll_container` é flex e recebe atualização via GSAP/ScrollTrigger. | O CSS tem regras móveis próprias, mas o bundle capturado não fornece um fallback semântico completo. Na Robert, manter swipe/carrossel em mobile e aplicar pin horizontal só em desktop. | Nosso trabalho | `appHorizontalScroll` no desktop, com swipe/setas atuais como fallback mobile. |
| Troca de tom da navegação | ScrollTrigger em seções atualiza `body[data-nav-theme]` ao entrar/voltar e remove o atributo ao sair; limites usam `clamp(top 40px)`/`bottom 40px`. Isso troca o tema da navegação, não anima o fundo de todas as seções. | Mecanismo ligado à rolagem e às seções. Não encontrei uma transição geral de fundo verde/creme no clone. | Header sobre Hero e atualização do link ativo | `appNavTheme` ou serviço com `IntersectionObserver`; manter a paleta Robert e criar a transição de seção apenas como proposta visual própria. |
| Menu/flyout | Menu abre um flyout. Timelines observados combinam opacidade `0.4s` e deslocamento `0.8s` com `expo.inOut`; outra troca de layout move elementos em `0.3s`, `sine.inOut`. | CSS apresenta navegação móvel separada. Preservar acessibilidade, Escape e foco no app; o clone não é prova de acessibilidade equivalente. | Menu móvel do Header | `appMenuTransition` ou estado Angular com CSS/GSAP; aria-expanded, Escape e foco são requisitos independentes. |
| Hover e cursor | Cursor personalizado reage a `cursorLabel`/`cursorReset` e a `data-cursor-text`, com animação GSAP dentro do breakpoint de ponteiro hover. Botões e imagens também têm transições/escala CSS. | O próprio código condiciona cursor a um breakpoint de hover; não usar cursor customizado em mobile. | Botões, links e cards de Vantagens/Trabalho | Microinterações CSS com transform/opacity; não adicionar cursor customizado se não melhorar a navegação da marca. |
| Pré-carregador | CSS contém um `.preloader` fixo. Não foi possível confirmar no snapshot/fluxo capturado um loader inicial específico da página nem uma animação de logo. | Não há base suficiente para copiar loader ou exibir conteúdo escondido até ele terminar. | Nenhuma por enquanto; o sol do logo pode receber reveal leve sem bloquear conteúdo. | Sem diretiva de loader nesta fase. |
| Zoom, texto dividido, marquee e contadores | Não achei uma animação de zoom progressivo separada, plugin/uso SplitText, marquee ou contador na página-alvo. Há zoom CSS de hover. `strokeDashoffset` ocorre no código de propriedades/plugin do GSAP, sem prova de um desenho SVG usado por esta página. | Não adicionar efeitos ausentes apenas por constarem da lista de possibilidades. | Zoom leve no hover de fotos já existentes; nenhum contador ou marquee | `appImageZoom` só se suportar a composição; sem diretivas de contador, marquee, split text ou desenho SVG até haver evidência/necessidade. |
| Reduced motion | Não encontrei regra `prefers-reduced-motion` nos CSS do espelho. | O app Robert deve implementar a preferência mesmo que o clone não a respeite. | Todas | Serviço/directivas com caminho estático para `prefers-reduced-motion: reduce`; o conteúdo permanece visível sem JS. |

## Propostas de design por seção

| Seção | Proposta para validação — sem alterar ainda |
|---|---|
| Header | Transparentemente integrado ao Hero, depois fundo creme translúcido/blur; indicador da seção atual; botão com preenchimento e seta sutis; menu mobile em tela cheia apenas se mantiver navegação por teclado e foco. |
| Hero | Entrada em sequência de eyebrow, título e destaque “economia.”; revelar a foto/vídeo com máscara e zoom inicial curto; gradiente quente como luz do sol; rolagem suaviza e escurece a mídia. Sem loader bloqueante. |
| Vantagens | Transição visual gradual para creme; título e palavra “Todos os dias.” em momentos separados; cards sobem em stagger leve; hover com elevação e brilho amarelo discreto. Sem contador: não há números de negócio confirmados. |
| Como funciona | Desktop pode fixar brevemente a seção enquanto as três etapas existentes avançam e atualizam o card; tabs continuam selecionáveis. Mobile mantém tabs normais. Não trocar os textos existentes nesta fase. |
| Nosso trabalho | Desktop pode usar scroll horizontal preso se os testes de leitura e teclado ficarem claros; manter o carrossel com setas e swipe no mobile. Aplicar máscara/zoom às fotos reais; não adicionar legendas sem cidade/tipo confirmados. |
| Sobre | Máscara ascendente e parallax muito leve no retrato em arco, selo com entrada atrasada e texto em etapas. A assinatura pode receber reveal simples; não há vetor de assinatura confirmado para desenhar. |
| Contato | Fundo verde integra-se gradualmente; formulário aparece com campos em sequência, estado de foco visível e estados claros de envio. Incluir checkbox LGPD e link de privacidade somente após definir o conteúdo/destino da política; manter WhatsApp como destino do envio. |
| Footer | Entrada leve das colunas, links com sublinhado/contraste/foco evidentes. Marquee fica como opção, mas não é padrão observado no clone. |
| WhatsApp flutuante | Entrada depois do Hero, sem pulso constante; validar posição em mobile para não cobrir campos/CTA. |

## Decisões confirmadas e escopo atualizado

O responsável aprovou a nova frase do card Economia: “Produza a própria energia e fique menos exposto aos aumentos da tarifa.” A área de atendimento informada foi “Salvador, Bahia e regiões”; os metadados usam a forma “Salvador, Bahia e regiões próximas” sem enumerar cidades. Não foram confirmados números ou depoimentos, então nenhum foi criado. O domínio canônico informado foi `https://robertsolar.com.br/`; SSR e prerender foram autorizados. Também foi autorizada a criação da política de privacidade.

A preferência tipográfica para trocar a fonte serifada dos destaques continua pendente de amostra e aprovação. Por isso, a tipografia não foi substituída.

## Implementação concluída

- O caminho real do clone, `src/app/clone/**`, está excluído da compilação Angular; build e arquivos públicos não referenciam nem copiam a pasta de estudo.
- SSR e prerender publicam `/` e `/privacidade`; APIs do navegador e animações são iniciadas apenas no cliente, e as diretivas de reveal deixam o conteúdo visível no HTML servido.
- GSAP/ScrollTrigger e Lenis implementam reveals, parallax leve no desktop e rolagem suave em ponteiro fino. As bibliotecas são carregadas sob demanda, liberadas ao sair da landing e desativadas com `prefers-reduced-motion`.
- A seção Economia recebeu a frase aprovada. Nenhum contador, depoimento ou parceiro foi adicionado.
- O formulário mantém o destino WhatsApp, agora com consentimento obrigatório, link para a política, máscara de moeda e validações. A política descreve o fluxo sem alegar armazenamento próprio dos envios.
- Navegação mobile tem estado ARIA, fechamento por Escape e contenção de foco; as etapas do processo usam tabs ARIA com setas, Home e End; os vídeos do carrossel só reproduzem por ação do visitante.
- Foram configurados title/description, canonical, Open Graph/Twitter, JSON-LD sem endereço ou avaliação inventados, robots/sitemap, favicon/manifest e imagem social 1200×630 baseada em foto de instalação existente.
- Fotos do carrossel têm variantes JPEG responsivas, `srcset`, carregamento tardio e dimensões estáveis. No mobile, a mídia do Hero usa uma imagem estática prioritária; o vídeo decorativo permanece disponível em desktop.

## Lighthouse mobile — comparação

O Lighthouse foi executado na landing prerenderizada com Lighthouse 12.8.2, Edge, emulação Android 11 / Moto G Power (2022). Pontuações podem variar entre execuções locais.

| Execução | Performance | Acessibilidade | Boas práticas | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Linha de base | 40 | 95 | 96 | 91 | 19,5 s | 19,9 s | 580 ms | 0 |
| Após implementação | 53 | 100 | 100 | 100 | 5,8 s | 14,5 s | 310 ms | 0 |

O FCP, LCP e TBT medidos melhoraram em relação à linha de base; a performance ainda não atinge a meta de 95. O build manteve o aviso de orçamento inicial já presente na linha de base: 647,01 kB contra o limite configurado de 500 kB (linha de base: 603,54 kB). O bundle gzip estimado é 153,07 kB. Essa pendência deve ser resolvida antes de considerar a meta de performance alcançada.

## Verificações

- `npm run build`: concluído; prerenderizou 2 rotas. Permanece o aviso de orçamento acima descrito.
- SSR HTTP: `/`, `/privacidade`, `/robots.txt` e `/sitemap.xml` retornaram conteúdo/código 200; a landing e a política estão presentes no HTML servido.
- Viewports 320, 375, 414, 768, 1024, 1280, 1440, 1920 e 2560 px: `documentElement.scrollWidth` igual à largura do viewport, sem overflow horizontal.
- Interação verificada no navegador: menu abre, fecha com Escape; a seta direita seleciona a etapa seguinte; rota da política retorna 200.
- Lighthouse acessibilidade: 100 após correção de contraste e hierarquia dos títulos.
- Nenhuma suíte de testes unitários foi executada; as verificações acima foram build, navegador e Lighthouse.
