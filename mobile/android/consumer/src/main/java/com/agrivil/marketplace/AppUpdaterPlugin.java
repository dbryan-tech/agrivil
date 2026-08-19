package com.agrivil.marketplace;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "AppUpdater")
public class AppUpdaterPlugin extends Plugin {
    private static final long MAX_APK_BYTES = 150L * 1024L * 1024L;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @PluginMethod
    public void getInstalledVersion(PluginCall call) {
        try {
            PackageInfo info = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0);
            JSObject result = new JSObject();
            result.put("versionCode", getVersionCode(info));
            result.put("versionName", info.versionName == null ? "" : info.versionName);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Unable to read the installed app version", error);
        }
    }

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String url = call.getString("url", "");
        String expectedSha = call.getString("sha256", "").toLowerCase(Locale.US);
        Integer expectedVersion = call.getInt("versionCode");

        if (!url.startsWith("https://github.com/dbryan-tech/agrivil-releases/") ||
                !expectedSha.matches("^[a-f0-9]{64}$") || expectedVersion == null) {
            call.reject("Invalid update metadata");
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                !getContext().getPackageManager().canRequestPackageInstalls()) {
            Intent permissionIntent = new Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + getContext().getPackageName())
            );
            getActivity().startActivity(permissionIntent);
            JSObject result = new JSObject();
            result.put("needsPermission", true);
            call.resolve(result);
            return;
        }

        executor.execute(() -> {
            File updateFile = null;
            try {
                File updateDir = new File(getContext().getCacheDir(), "updates");
                if (!updateDir.exists() && !updateDir.mkdirs()) {
                    throw new IllegalStateException("Unable to prepare update storage");
                }
                updateFile = new File(updateDir, "agrivil-update.apk");
                download(url, updateFile);

                String actualSha = sha256(updateFile);
                if (!actualSha.equals(expectedSha)) throw new SecurityException("Update checksum mismatch");

                PackageInfo archive = getArchiveInfo(updateFile);
                if (archive == null || !getContext().getPackageName().equals(archive.packageName)) {
                    throw new SecurityException("Update package identity mismatch");
                }
                long installedVersion = getInstalledVersionCode();
                long archiveVersion = getVersionCode(archive);
                if (archiveVersion != expectedVersion.longValue() || archiveVersion <= installedVersion) {
                    throw new SecurityException("Update version is not newer than the installed app");
                }

                File finalUpdateFile = updateFile;
                getActivity().runOnUiThread(() -> {
                    try {
                        Uri apkUri = FileProvider.getUriForFile(
                                getContext(),
                                getContext().getPackageName() + ".fileprovider",
                                finalUpdateFile
                        );
                        Intent install = new Intent(Intent.ACTION_VIEW);
                        install.setDataAndType(apkUri, "application/vnd.android.package-archive");
                        install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                        getActivity().startActivity(install);
                        JSObject result = new JSObject();
                        result.put("started", true);
                        call.resolve(result);
                    } catch (Exception error) {
                        call.reject("Unable to open the Android installer", error);
                    }
                });
            } catch (Exception error) {
                if (updateFile != null) updateFile.delete();
                call.reject("Update download or verification failed", error);
            }
        });
    }

    private void download(String source, File target) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(source).openConnection();
        connection.setInstanceFollowRedirects(true);
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(30000);
        connection.setRequestProperty("Accept", "application/vnd.android.package-archive");
        connection.connect();
        if (connection.getResponseCode() < 200 || connection.getResponseCode() >= 300) {
            throw new IllegalStateException("Update server returned " + connection.getResponseCode());
        }
        long declaredLength = connection.getContentLengthLong();
        if (declaredLength > MAX_APK_BYTES) throw new SecurityException("Update is too large");

        long total = 0;
        try (InputStream input = connection.getInputStream(); FileOutputStream output = new FileOutputStream(target)) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = input.read(buffer)) != -1) {
                total += count;
                if (total > MAX_APK_BYTES) throw new SecurityException("Update is too large");
                output.write(buffer, 0, count);
            }
            output.getFD().sync();
        } finally {
            connection.disconnect();
        }
    }

    private String sha256(File file) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (FileInputStream input = new FileInputStream(file)) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = input.read(buffer)) != -1) digest.update(buffer, 0, count);
        }
        StringBuilder value = new StringBuilder();
        for (byte item : digest.digest()) value.append(String.format(Locale.US, "%02x", item));
        return value.toString();
    }

    @SuppressWarnings("deprecation")
    private PackageInfo getArchiveInfo(File apk) {
        PackageManager manager = getContext().getPackageManager();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return manager.getPackageArchiveInfo(apk.getAbsolutePath(), PackageManager.PackageInfoFlags.of(0));
        }
        return manager.getPackageArchiveInfo(apk.getAbsolutePath(), 0);
    }

    @SuppressWarnings("deprecation")
    private long getVersionCode(PackageInfo info) {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.P ? info.getLongVersionCode() : info.versionCode;
    }

    private long getInstalledVersionCode() throws Exception {
        PackageInfo info = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0);
        return getVersionCode(info);
    }
}
