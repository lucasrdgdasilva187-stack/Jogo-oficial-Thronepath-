package com.lucasrodrigues.thronepath;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import java.io.File;

/** Downloads a user-requested official APK and hands it to Android's installer. */
public final class ApkUpdater {
    private final Activity activity;
    private final DownloadManager manager;
    private final SharedPreferences prefs;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private AlertDialog progress;
    private boolean awaitingPermission;
    private File ready;
    private final Runnable tick = () -> poll();

    public ApkUpdater(Activity activity) {
        this.activity = activity;
        manager = (DownloadManager) activity.getSystemService(Context.DOWNLOAD_SERVICE);
        prefs = activity.getSharedPreferences("thronepath-apk-update", Context.MODE_PRIVATE);
        awaitingPermission = prefs.getBoolean("permission", false);
        if (prefs.getBoolean("ready", false)) ready = new File(activity.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "Thronepath-update.apk");
    }

    public void start(String url) {
        if (!UpdatePolicy.allowed(url)) { error("O endereço da atualização não é válido."); return; }
        if (manager == null) { error("O gerenciador de downloads do Android não está disponível."); return; }
        if (ready != null && verified(ready)) { installReady(); return; }
        if (prefs.getLong("download", -1) >= 0) { showProgress(); resume(); return; }
        try {
            File folder = activity.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
            if (folder == null) throw new IllegalStateException("Sem espaço para salvar a atualização.");
            File apk = new File(folder, "Thronepath-update.apk");
            if (apk.exists() && !apk.delete()) throw new IllegalStateException("Não foi possível preparar o arquivo.");
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url))
                .setTitle("Atualização do Thronepath")
                .setDescription("Baixando a nova versão do jogo")
                .setMimeType("application/vnd.android.package-archive")
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                .setDestinationInExternalFilesDir(activity, Environment.DIRECTORY_DOWNLOADS, apk.getName());
            prefs.edit().putLong("download", manager.enqueue(request)).apply();
            showProgress(); resume();
        } catch (Exception e) { error("Não foi possível iniciar o download. Confira sua conexão e tente novamente."); }
    }

    private void showProgress() {
        if (progress != null && progress.isShowing()) return;
        progress = new AlertDialog.Builder(activity).setTitle("Baixando atualização")
            .setMessage("Preparando o download…")
            .setNegativeButton("Continuar jogando", (d, w) -> {}).create();
        progress.show();
    }

    public void resume() {
        handler.removeCallbacks(tick);
        if (awaitingPermission && ready != null) {
            awaitingPermission = false;
            prefs.edit().remove("permission").apply();
            if (Build.VERSION.SDK_INT < 26 || activity.getPackageManager().canRequestPackageInstalls()) installReady();
            else error("A instalação não foi autorizada. Toque em Atualizar para tentar novamente.");
        }
        if (prefs.getLong("download", -1) >= 0) handler.post(tick);
    }
    public void pause() { handler.removeCallbacks(tick); }
    public void destroy() { pause(); if (progress != null) progress.dismiss(); }

    private void poll() {
        long id = prefs.getLong("download", -1);
        if (id < 0 || activity.isFinishing() || activity.isDestroyed()) return;
        try (Cursor c = manager.query(new DownloadManager.Query().setFilterById(id))) {
            if (c == null || !c.moveToFirst()) { failed("O download foi removido. Tente atualizar novamente."); return; }
            int status = c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
            if (status == DownloadManager.STATUS_FAILED) { failed("O download falhou. Confira a conexão e o espaço disponível."); return; }
            if (status == DownloadManager.STATUS_SUCCESSFUL) {
                prefs.edit().remove("download").apply();
                if (progress != null) progress.dismiss();
                ready = new File(activity.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "Thronepath-update.apk");
                if (!verified(ready)) { ready.delete(); ready = null; error("Este arquivo não é uma atualização compatível do Thronepath."); return; }
                prefs.edit().putBoolean("ready", true).apply();
                installReady(); return;
            }
            long total = c.getLong(c.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
            long downloaded = c.getLong(c.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
            if (progress != null && progress.isShowing()) progress.setMessage(total > 0
                ? "Baixando… " + (downloaded * 100 / total) + "%\nO Android pedirá sua confirmação para instalar."
                : "Aguardando a conexão para baixar…");
            handler.postDelayed(tick, 1000);
        } catch (Exception e) { failed("Não foi possível conferir o download. Tente novamente."); }
    }

    private boolean verified(File file) {
        try {
            PackageManager pm = activity.getPackageManager();
            int flags = Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES;
            PackageInfo candidate = pm.getPackageArchiveInfo(file.getAbsolutePath(), flags);
            PackageInfo installed = pm.getPackageInfo(activity.getPackageName(), flags);
            return candidate != null && InstallPolicy.compatible(installed.packageName, candidate.packageName,
                version(installed), version(candidate), signers(installed), signers(candidate));
        } catch (Exception e) { return false; }
    }
    private static long version(PackageInfo p) { return Build.VERSION.SDK_INT >= 28 ? p.getLongVersionCode() : p.versionCode; }
    private static byte[][] signers(PackageInfo p) {
        Signature[] values = Build.VERSION.SDK_INT >= 28 && p.signingInfo != null
            ? p.signingInfo.getApkContentsSigners() : p.signatures;
        if (values == null) return null;
        byte[][] result = new byte[values.length][];
        for (int i = 0; i < values.length; i++) result[i] = values[i].toByteArray();
        return result;
    }

    private void installReady() {
        if (ready == null || !ready.isFile()) return;
        if (!verified(ready)) { prefs.edit().remove("ready").remove("permission").apply(); ready = null; error("A atualização não tem a assinatura do Thronepath."); return; }
        if (Build.VERSION.SDK_INT >= 26 && !activity.getPackageManager().canRequestPackageInstalls()) {
            new AlertDialog.Builder(activity).setTitle("Permitir atualização do jogo")
                .setMessage("Autorize o Thronepath a abrir o instalador. Depois, volte ao jogo para confirmar a atualização.")
                .setPositiveButton("Permitir", (d, w) -> {
                    try {
                        awaitingPermission = true;
                        prefs.edit().putBoolean("permission", true).apply();
                        activity.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:" + activity.getPackageName())));
                    } catch (Exception e) { awaitingPermission = false; error("Não foi possível abrir a autorização do Android."); }
                }).setNegativeButton("Depois", null).show(); return;
        }
        try {
            Uri uri = FileProvider.getUriForFile(activity, activity.getPackageName() + ".updates", ready);
            Intent intent = new Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            prefs.edit().remove("ready").remove("permission").apply();
            activity.startActivity(intent);
            ready = null;
        } catch (Exception e) { error("Não foi possível abrir o instalador do Android. Tente atualizar novamente."); }
    }
    private void failed(String message) { prefs.edit().remove("download").apply(); if (progress != null) progress.dismiss(); error(message); }
    private void error(String message) {
        if (!activity.isFinishing() && !activity.isDestroyed()) new AlertDialog.Builder(activity)
            .setTitle("Atualização do Thronepath").setMessage(message).setPositiveButton("OK", null).show();
    }
}
