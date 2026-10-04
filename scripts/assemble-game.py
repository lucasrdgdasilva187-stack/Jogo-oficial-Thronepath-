from pathlib import Path
import hashlib
p=Path(__file__).resolve().parents[1]
data=b"".join(f.read_bytes() for f in sorted((p/"game-parts").glob("index.*.part")))
assert hashlib.sha256(data).hexdigest()=="3bbd55fa7b23d0c649e75d058a6d579d845ae6a46b3b8312739e6ea8fb95e69e", "Game checksum mismatch"
(p/"web").mkdir(exist_ok=True)
(p/"web/index.html").write_bytes(data)
print("Game assembled and checksum verified")
