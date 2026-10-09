import com.lucasrodrigues.thronepath.InstallPolicy;
public final class InstallPolicyTest {
    static void check(boolean ok) { if (!ok) throw new AssertionError("Invalid installer decision"); }
    public static void main(String[] args) {
        byte[][] own = { {1, 2, 3} }, other = { {9, 8, 7} };
        check(InstallPolicy.compatible("game", "game", 14, 15, own, own));
        check(InstallPolicy.compatible("game", "game", 14, 14, own, own));
        check(!InstallPolicy.compatible("game", "another", 14, 15, own, own));
        check(!InstallPolicy.compatible("game", "game", 14, 13, own, own));
        check(!InstallPolicy.compatible("game", "game", 14, 15, own, other));
        check(!InstallPolicy.compatible("game", "game", 14, 15, own, null));
        check(!InstallPolicy.compatible("game", "game", 14, 15, new byte[0][], new byte[0][]));
        System.out.println("Installer accepts own updates and rejects wrong package, signer and downgrade");
    }
}
