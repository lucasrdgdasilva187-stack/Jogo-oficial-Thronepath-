package com.lucasrodrigues.thronepath;
import java.util.Arrays;
public final class InstallPolicy {
    private InstallPolicy() {}
    public static boolean compatible(String currentPackage, String candidatePackage,
            long currentCode, long candidateCode, byte[][] currentSigners, byte[][] candidateSigners) {
        if (!currentPackage.equals(candidatePackage) || candidateCode < currentCode
                || currentSigners == null || candidateSigners == null
                || currentSigners.length == 0 || currentSigners.length != candidateSigners.length) return false;
        for (byte[] candidate : candidateSigners) {
            boolean found = false;
            for (byte[] current : currentSigners) if (Arrays.equals(current, candidate)) found = true;
            if (!found) return false;
        }
        return true;
    }
}
