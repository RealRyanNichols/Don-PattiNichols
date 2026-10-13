#!/usr/bin/env python3
"""Publish the versioned gallery and restrict delivery to its playback assets.

Run on the existing DigitalOcean host AFTER the matching Next release is live.
Preserves original video files and makes reversible backups outside the web root.
"""
import datetime
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

SOURCE = Path(__file__).resolve().parent / "ore-city-ministry"
DEST = Path("/mnt/archive/public-media/donandpatti/ore-city-ministry")
CONFIG = Path("/etc/caddy/sites/donandpatti.caddy")
FILES = ["index.html", "styles.css", "share.js", "manifest.json"]


def prepare_config(before, manifest):
    paths = ["/", "/index.html", "/styles.css", "/share.js", "/manifest.json"]
    for video in manifest["videos"]:
        for key in ["playback", "poster", "vtt"]:
            name = video[key]
            if not re.fullmatch(r"[a-z0-9.-]+", name):
                raise ValueError("Unexpected public media filename")
            paths.append("/" + name)
    result, count = re.subn(r"@donOreCityPrivate not path[^\n]+", "@donOreCityPrivate not path " + " ".join(paths), before)
    if count != 1:
        raise ValueError("Expected exactly one existing media allowlist")
    result, count = re.subn(r"@donOreCityDownload query download=[^\n]+\n\s*(?:header @donOreCityDownload Content-Disposition \"attachment\"|respond @donOreCityDownload 404)", "@donOreCityDownload query download=*\n\t\trespond @donOreCityDownload 404", result)
    if count != 1:
        raise ValueError("Expected exactly one existing download handler")
    result = re.sub(r"@donOreCityStyles path[^\n]+", "@donOreCityStyles path /styles.css /share.js", result)
    # Playback files remain available for the player; originals and ZIP/SRT
    # exports are deliberately absent from the exact allowlist above.
    return result


def main():
    manifest = json.loads((SOURCE / "manifest.json").read_text())
    assert len(manifest["videos"]) == 11
    for video in manifest["videos"]:
        for key in ["playback", "poster", "vtt"]:
            assert (DEST / video[key]).is_file(), "Missing playback asset"
    before = CONFIG.read_text()
    after = prepare_config(before, manifest)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup = Path("/root") / ("donandpatti-video-gallery-backup-" + stamp)
    backup.mkdir(mode=0o700)
    shutil.copy2(CONFIG, backup / "donandpatti.caddy")
    present = {name for name in FILES if (DEST / name).exists()}
    for name in present:
        shutil.copy2(DEST / name, backup / name)
    try:
        CONFIG.write_text(after)
        subprocess.run(["caddy", "validate", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"], check=True)
        for name in FILES:
            temp = DEST / ("." + name + ".next")
            shutil.copyfile(SOURCE / name, temp)
            temp.chmod(0o644)
            os.replace(temp, DEST / name)
        subprocess.run(["systemctl", "reload", "caddy"], check=True)
    except BaseException:
        shutil.copy2(backup / "donandpatti.caddy", CONFIG)
        for name in FILES:
            if name in present:
                shutil.copy2(backup / name, DEST / name)
            else:
                (DEST / name).unlink(missing_ok=True)
        subprocess.run(["systemctl", "reload", "caddy"], check=False)
        raise
    print(json.dumps({"status": "published", "backup": str(backup), "videos": 11, "original_files": "preserved; public delivery blocked"}))


if __name__ == "__main__":
    main()
