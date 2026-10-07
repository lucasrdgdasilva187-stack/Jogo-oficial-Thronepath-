package com.lucasrodrigues.thronepath;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import java.io.ByteArrayInputStream;

public final class MainActivity extends Activity {
    private static final String GAME_URL = "https://appassets.androidplatform.net/assets/index.html";
    private WebView game;
    private boolean updateChecked;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        game = new WebView(this);
        game.setBackgroundColor(Color.rgb(20, 34, 45));
        game.setOverScrollMode(View.OVER_SCROLL_NEVER);
        setContentView(game);

        WebSettings settings = game.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setUserAgentString(settings.getUserAgentString() + " ThronepathAndroid");
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        game.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                WebResourceResponse local = loader.shouldInterceptRequest(request.getUrl());
                if (local != null) return local;
                // The complete game is offline: unexpected network requests are blocked.
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null,
                        new ByteArrayInputStream(new byte[0]));
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !"appassets.androidplatform.net".equals(request.getUrl().getHost());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                view.evaluateJavascript("window.THRONEPATH_ANDROID=true", null);
                immersive();
                view.evaluateJavascript("document.querySelectorAll('#versionLabel,#buildLabel').forEach(e=>e.textContent='v1.6.0')", null);
                if (!updateChecked) {
                    updateChecked = true;
                    UpdateChecker.check(BuildConfig.VERSION_CODE, (version, download) -> runOnUiThread(() -> {
                        if (isFinishing() || isDestroyed()) return;
                        game.evaluateJavascript("window.ThronepathHost && window.ThronepathHost.suspend()", null);
                        new AlertDialog.Builder(MainActivity.this)
                            .setTitle("Nova versão disponível!")
                            .setMessage("Thronepath " + version + " está disponível. Atualize para receber as melhorias.")
                            .setPositiveButton("Atualizar", (dialog, which) -> {
                                try { startActivity(new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(download))); }
                                catch (android.content.ActivityNotFoundException e) { android.widget.Toast.makeText(MainActivity.this, "Abra o GitHub do jogo para baixar a atualização.", android.widget.Toast.LENGTH_LONG).show(); }
                            })
                            .setNegativeButton("Depois", null).show();
                    }));
                }
            }
        });
        game.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
                new AlertDialog.Builder(MainActivity.this).setTitle("Thronepath").setMessage(message)
                        .setPositiveButton("Confirmar", (dialog, button) -> result.confirm())
                        .setNegativeButton("Cancelar", (dialog, button) -> result.cancel())
                        .setOnCancelListener(dialog -> result.cancel()).show();
                return true;
            }
        });
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::back);
        }
        game.loadUrl(GAME_URL);
        immersive();
    }

    private void back() {
        if (game == null) return;
        game.evaluateJavascript("window.ThronepathHost ? window.ThronepathHost.back() : false", handled -> {
            if (!"true".equals(handled) && !isFinishing()) {
                new AlertDialog.Builder(this).setTitle("Thronepath")
                        .setMessage("Fechar o jogo? Seu progresso já está salvo.")
                        .setPositiveButton("Fechar", (dialog, button) -> finish())
                        .setNegativeButton("Continuar", null).show();
            }
        });
    }

    @Override
    public void onBackPressed() { back(); }

    @Override
    protected void onPause() {
        if (game != null) {
            game.evaluateJavascript("window.ThronepathHost && window.ThronepathHost.suspend()", null);
            game.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (game != null) game.onResume();
        immersive();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) immersive();
    }

    private void immersive() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    @Override
    protected void onDestroy() {
        if (game != null) { game.destroy(); game = null; }
        super.onDestroy();
    }
}
