import { useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VERSION_KEY = "kudagi_app_version";

/**
 * On web: fetches /version.json on mount.
 * If the server version is newer than the locally stored one → hard reload.
 * To push an update to clients: bump the version number in public/version.json
 * and redeploy to Vercel.
 */
export function useAutoUpdate() {
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const check = async () => {
      try {
        // Add cache-busting param so the browser never serves a stale version.json
        const res = await fetch(`/version.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return;

        const { version } = await res.json();
        if (typeof version !== "number") return;

        const stored = await AsyncStorage.getItem(VERSION_KEY);
        const localVersion = stored ? parseInt(stored, 10) : 0;

        if (version > localVersion) {
          // Save new version first so we don't get into a reload loop
          await AsyncStorage.setItem(VERSION_KEY, String(version));
          // Hard reload — clears all cached JS/CSS bundles
          window.location.reload();
        }
      } catch {
        // Network error or JSON parse error — silently ignore, don't break the app
      }
    };

    check();
  }, []);
}
