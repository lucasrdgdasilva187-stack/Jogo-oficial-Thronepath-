# Thronepath — site público

O menu original ocupa a tela toda, sem as faixas laterais desfocadas. O título público é Thronepath, sem versão. A lógica do jogo e as chaves do progresso local permanecem iguais.

`python3 scripts/build-website.py` monta o HTML original, verifica o checksum da revisão atual do repositório, extrai imagens e áudio sem alterar os bytes e escreve o site completo em `website-dist/`. Nenhum recurso depende de Lovable ou GitHub durante a partida. Não há badge da Lovable no site estático.

O service worker só informa disponibilidade offline depois de guardar todos os arquivos. É preciso carregar com internet na primeira vez. Se o navegador apagar seus dados, é necessário carregar novamente. O progresso do APK ou de outro domínio não é transferido automaticamente.

No iPhone, abra no Safari e use Compartilhar → Adicionar à Tela de Início. No Android, use o menu do navegador → Adicionar à tela inicial. Jogue com o celular deitado. A API de tela cheia e o bloqueio de orientação dependem do navegador; girar o aparelho funciona como alternativa.

Para GitHub Pages, selecione Settings → Pages → Source → GitHub Actions. O workflow `Publicar Thronepath` publica somente `website-dist/`. Para Vercel: framework Other, build command `python3 scripts/build-website.py`, output directory `website-dist`, sem instalação de dependências. O domínio próprio pode ser configurado no provedor de hospedagem.

O site usa a revisão 1.6.12 atual do repositório, preservando os presets de áudio e as opções de opacidade, com SHA-256 `bfe791305ec6b8e6fea52203740d3e24104d370aa4a7275ec50b913e9ed77b9c`. O invólucro de publicação ajusta o canvas e a interface à mesma área de `visualViewport`. Ao abrir/fechar a barra do navegador, girar ou entrar em tela cheia, ele recalcula o enquadramento. Os botões do menu têm pelo menos 44 px e passam a duas colunas se a altura for insuficiente. Painéis têm rolagem como alternativa para telas muito pequenas. O fundo original continua cobrindo a tela sem faixas desfocadas.

Verificação local: `node tests/website-viewport.cjs`, `GAME_HTML=website-dist/index.html node tests/website-canvas.cjs` e `GAME_HTML=website-dist/index.html node tests/options1612.cjs`. Esses testes simulam tamanhos e barras do navegador; não substituem a validação visual em aparelhos reais.
