package fun.vexnetwork.store;

import fun.vexnetwork.store.tasks.PollTask;
import org.bukkit.plugin.java.JavaPlugin;

public class VexStorePlugin extends JavaPlugin {

    private String apiUrl;
    private String secretKey;

    @Override
    public void onEnable() {
        // Save default config if not exists
        saveDefaultConfig();

        // Load config values
        apiUrl = getConfig().getString("api-url", "https://store.vexnetwork.fun/api/plugin");
        secretKey = getConfig().getString("secret-key", "CHANGE_ME");

        if (secretKey.equals("CHANGE_ME")) {
            getLogger().warning("Secret key is not configured! Store integration will not work. Please update config.yml.");
        }

        // Schedule the polling task every 20 seconds (400 ticks)
        long intervalTicks = 20L * 20L; 
        new PollTask(this).runTaskTimerAsynchronously(this, 100L, intervalTicks);

        getLogger().info("VexStorePlugin enabled! Polling " + apiUrl + " for commands.");
    }

    @Override
    public void onDisable() {
        getLogger().info("VexStorePlugin disabled.");
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public String getSecretKey() {
        return secretKey;
    }
}
