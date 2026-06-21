package fun.vexnetwork.store.tasks;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import fun.vexnetwork.store.VexStorePlugin;
import org.bukkit.Bukkit;
import org.bukkit.scheduler.BukkitRunnable;

import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class PollTask extends BukkitRunnable {

    private final VexStorePlugin plugin;
    private final Gson gson;

    public PollTask(VexStorePlugin plugin) {
        this.plugin = plugin;
        this.gson = new Gson();
    }

    @Override
    public void run() {
        String secretKey = plugin.getSecretKey();
        if (secretKey == null || secretKey.equals("CHANGE_ME")) {
            return;
        }

        try {
            // 1. Fetch pending commands
            URL url = new URL(plugin.getApiUrl() + "/fetch-commands");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "Bearer " + secretKey);
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            if (conn.getResponseCode() == 200) {
                InputStreamReader reader = new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8);
                JsonArray commandsArray = gson.fromJson(reader, JsonArray.class);
                reader.close();

                if (commandsArray.size() > 0) {
                    List<String> executedCommandIds = new ArrayList<>();

                    // 2. Execute commands on the main thread
                    Bukkit.getScheduler().runTask(plugin, () -> {
                        for (JsonElement element : commandsArray) {
                            JsonObject cmdObj = element.getAsJsonObject();
                            String commandString = cmdObj.get("command").getAsString();
                            String id = cmdObj.get("_id").getAsString();

                            plugin.getLogger().info("Executing store command: " + commandString);
                            
                            // Remove leading slash if accidentally added in admin panel
                            if (commandString.startsWith("/")) {
                                commandString = commandString.substring(1);
                            }

                            try {
                                Bukkit.dispatchCommand(Bukkit.getConsoleSender(), commandString);
                                executedCommandIds.add(id);
                            } catch (Exception e) {
                                plugin.getLogger().severe("Failed to execute command: " + commandString);
                                e.printStackTrace();
                            }
                        }

                        // 3. Acknowledge commands asynchronously
                        if (!executedCommandIds.isEmpty()) {
                            Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> acknowledgeCommands(executedCommandIds));
                        }
                    });
                }
            } else if (conn.getResponseCode() == 401 || conn.getResponseCode() == 403) {
                plugin.getLogger().severe("Store authentication failed! Check your secret-key.");
            }
            conn.disconnect();

        } catch (Exception e) {
            // Silently catch connection errors to avoid spamming console if backend is offline
            // plugin.getLogger().warning("Could not connect to store API: " + e.getMessage());
        }
    }

    private void acknowledgeCommands(List<String> commandIds) {
        try {
            URL url = new URL(plugin.getApiUrl() + "/ack-commands");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + plugin.getSecretKey());
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setDoOutput(true);
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            JsonObject payload = new JsonObject();
            JsonArray idsArray = new JsonArray();
            for (String id : commandIds) {
                idsArray.add(id);
            }
            payload.add("commandIds", idsArray);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = gson.toJson(payload).getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            if (conn.getResponseCode() == 200) {
                plugin.getLogger().info("Successfully acknowledged " + commandIds.size() + " commands.");
            }
            conn.disconnect();
        } catch (Exception e) {
            plugin.getLogger().severe("Failed to acknowledge commands: " + e.getMessage());
        }
    }
}
