# Thronepath Android 1.5.2

Projeto para gerar APK do jogo HTML completo: 51 fases e 150 conquistas. Mantém nome, ícones e identificador com.lucasrodrigues.thronepath. O HTML é idêntico ao entregue na versão 1.5.2.

## Gerar pelo GitHub
Coloque o conteúdo deste ZIP na raiz de um repositório autorizado. O workflow .github/workflows/ compila ao enviar para main/master ou pelo botão Run workflow em Actions. Ao terminar, baixe o artefato Thronepath-APK e extraia o APK.

Sem chave de produção configurada, gera APK debug instalável para testes. A chave debug de um runner temporário pode mudar entre compilações: não usar para distribuir atualizações definitivas. Para release e atualizações que preservam a instalação, configure os secrets THRONEPATH_KEYSTORE_BASE64, THRONEPATH_STORE_PASSWORD, THRONEPATH_KEY_ALIAS e THRONEPATH_KEY_PASSWORD com a mesma chave privada em todas as versões. Nunca publique a chave no repositório.

O progresso do navegador não é importado automaticamente. O aplicativo guarda progresso próprio no WebView. Mantém orientação horizontal, tela cheia, pausa e botão voltar.

## Estado
Testes automatizados do HTML executados; compilação Android ainda pendente. Não há APK compilado neste ZIP. GitHub consulta o repositório, mas nega gravação com erro 403; Gradle e SDK Android indisponíveis neste ambiente.

Requisitos: Java 17, Gradle 8.13, AGP 8.13.2, SDK 36, Build Tools 35.0.0, WebKit 1.16.0. O workflow prepara essas ferramentas.
Fontes: https://developer.android.com/build/releases/agp-8-13-0-release-notes e https://developer.android.com/jetpack/androidx/releases/webkit
