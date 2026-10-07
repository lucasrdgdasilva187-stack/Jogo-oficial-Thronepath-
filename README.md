# Thronepath Android 1.6.0-alpha

Atualização do jogo existente em HTML: 51 fases, 150 conquistas e progresso local preservados. Controles por toque, teclado e gamepad; APK para Android 7.0 ou superior, em ambas as orientações horizontais.

## Compilação
O workflow `.github/workflows/android-apk.yml` monta o HTML original, aplica os módulos revisados, executa testes de física e navegador e compila o APK. `scripts/package-android-web.py` extrai imagens e áudio sem alterar os bytes, mantendo tudo offline e reduzindo o HTML inicial.

Sem os secrets de assinatura, o artefato é **release sem assinatura**, que precisa ser assinado antes da instalação. Para gerar release assinado automaticamente, configure `THRONEPATH_KEYSTORE_BASE64`, `THRONEPATH_STORE_PASSWORD`, `THRONEPATH_KEY_ALIAS` e `THRONEPATH_KEY_PASSWORD`. Sempre reutilize a mesma chave privada. Nunca publique a chave ou as senhas no repositório.

## Atualizações
O aplicativo consulta a última Release deste repositório. A descrição precisa conter `THRONEPATH_VERSION_CODE=11` (ou o código superior correspondente), com um APK assinado anexado. O aviso permite atualizar ou deixar para depois. Android solicita autorização para instalação externa; o aplicativo não ignora as proteções do sistema.

APK anterior assinado com outra chave não aceita atualização no lugar. Preserve o progresso antes de remover qualquer instalação antiga. Progresso do navegador não é importado automaticamente no APK.

## Verificação
Testes cobrem rotas, molas, encontros com armadilhas, reinício de gravidade, controles invertidos, câmera, qualidade sem alterar física, costuras de fundo e tutorial em três tamanhos de tela. Teste real em celulares e controles físicos ainda é necessário antes de declarar compatibilidade com modelos específicos.

Java 17, Gradle 8.13, SDK 36 e Build Tools 35.0.0 são preparados pelo workflow.
