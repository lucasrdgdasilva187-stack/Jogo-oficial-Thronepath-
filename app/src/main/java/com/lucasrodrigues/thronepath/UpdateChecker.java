package com.lucasrodrigues.thronepath;
import org.json.JSONObject;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
public final class UpdateChecker {
    public interface Result { void available(String version, String url); }
    public static void check(int current, Result result) {
        Thread worker = new Thread(() -> {
            HttpURLConnection c = null;
            try {
                c = (HttpURLConnection)new URL("https://api.github.com/repos/"+UpdatePolicy.REPO+"/releases/latest").openConnection();
                c.setConnectTimeout(5000); c.setReadTimeout(5000); c.setInstanceFollowRedirects(false);
                c.setRequestProperty("Accept", "application/vnd.github+json");
                c.setRequestProperty("User-Agent", "Thronepath-Android");
                if(c.getResponseCode()!=200) return;
                ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                try(var input = c.getInputStream()) {
                    byte[] block = new byte[4096]; int n;
                    while((n=input.read(block))!=-1) { if(buffer.size()+n>262144) return; buffer.write(block,0,n); }
                }
                JSONObject release = new JSONObject(new String(buffer.toByteArray(), StandardCharsets.UTF_8));
                if(release.optBoolean("draft") || release.optBoolean("prerelease") || UpdatePolicy.versionCode(release.optString("body"))<=current) return;
                var assets=release.optJSONArray("assets"); if(assets==null) return;
                for(int i=0;i<assets.length();i++) {
                    String url=assets.getJSONObject(i).optString("browser_download_url");
                    if(UpdatePolicy.allowed(url)) { result.available(release.optString("tag_name","nova"),url); return; }
                }
            } catch(Exception ignored) { /* Offline and API errors must never block the game. */ }
            finally { if(c!=null) c.disconnect(); }
        }, "Thronepath-update-check");
        worker.setDaemon(true); worker.start();
    }
}
