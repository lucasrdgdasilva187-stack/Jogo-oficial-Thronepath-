# Thronepath — site público

O menu original ocupa a tela toda, sem as faixas laterais desfocadas. O título público é Thronepath, sem versão. A lógica do jogo e as chaves do progresso local permanecem iguais.

`python3 scripts/build-website.py` monta o HTML original, verifica que ele corresponde ao arquivo enviado, extrai imagens e áudio sem alterar os bytes e escreve o site completo em `website-dist/`. Nenhum recurso depende de Lovable ou GitHub durante a partida. Não há badge da Lovable no site estático.

O service worker só informa disponibilidade offline depois de guardar todos os arquivos. É preciso carregar com internet na primeira vez. Se o navegador apagar seus dados, é necessário carregar novamente. O progresso do APK ou de outro domínio não é transferido automaticamente.

No iPhone, abra no Safari e use Compartilhar → Adicionar à Tela de Início. No Android, use o menu do navegador → Adicionar à tela inicial. Jogue com o celular deitado. A API de tela cheia e o bloqueio de orientação dependem do navegador; girar o aparelho funciona como alternativa.

Para GitHub Pages, selecione Settings → Pages → Source → GitHub Actions. O workflow `Publicar Thronepath` publica somente `website-dist/`. Para Vercel: framework Other, build command `python3 scripts/build-website.py`, output directory `website-dist`, sem instalação de dependências. O domínio próprio pode ser configurado no provedor de hospedagem.

O site foi preparado a partir de Thronepath_1_6_12.html, com SHA-256 `4967f2dde6c7ff06f18aebf17d6e9c7188e02b2e7e6f418424c4296fda5f2acc`. Apenas o invólucro de publicação e o CSS do fundo/menu são adicionados.
