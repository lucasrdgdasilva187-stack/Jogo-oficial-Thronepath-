import com.lucasrodrigues.thronepath.UpdatePolicy;
public class UpdatePolicyTest {
 public static void main(String[] args) {
  if(UpdatePolicy.versionCode("Release\nTHRONEPATH_VERSION_CODE=9\n")!=9) throw new AssertionError();
  for(String b:new String[]{"9", "THRONEPATH_VERSION_CODE=-1", "THRONEPATH_VERSION_CODE=999999999999999"}) if(UpdatePolicy.versionCode(b)!=-1) throw new AssertionError(b);
  String good="https://github.com/"+UpdatePolicy.REPO+"/releases/download/v1.5.3/Thronepath.apk";
  if(!UpdatePolicy.allowed(good)) throw new AssertionError();
  for(String u:new String[]{good.replace("https:","http:"),good.replace("github.com","evil.com"),good+"?x=1",good.replace("Thronepath.apk","../bad.apk"),good.replace("Thronepath.apk","app.html")}) if(UpdatePolicy.allowed(u)) throw new AssertionError(u);
  System.out.println("Update metadata and download origin checks passed");
 }
}
