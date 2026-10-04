package com.lucasrodrigues.thronepath;
import java.net.URI;
import java.util.regex.Pattern;
public final class UpdatePolicy {
    public static final String REPO = "lucasrdgdasilva187-stack/Jogo-oficial-Thronepath-";
    public static int versionCode(String body) {
        var match = Pattern.compile("(?m)^THRONEPATH_VERSION_CODE=([0-9]+)\\s*$").matcher(body);
        if (!match.find()) return -1;
        try { return Integer.parseInt(match.group(1)); } catch (NumberFormatException e) { return -1; }
    }
    public static boolean allowed(String url) {
        try {
            URI u = new URI(url);
            return "https".equals(u.getScheme()) && "github.com".equals(u.getHost())
                && u.getPort() == -1 && u.getUserInfo() == null && u.getQuery() == null && u.getFragment() == null
                && u.getPath().startsWith("/" + REPO + "/releases/download/")
                && !u.getPath().contains("..") && u.getPath().endsWith(".apk");
        } catch (Exception e) { return false; }
    }
}
