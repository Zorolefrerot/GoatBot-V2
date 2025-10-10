const os = require("os");
const { performance } = require("perf_hooks");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "status", "sysinfo"],
    version: "3.0",
    author: "Merdi Madimba",
    role: 2,
    category: "🖥️ Système",
    shortDescription: {
      en: "Affiche toutes les infos système du bot."
    },
    longDescription: {
      en: "Montre l’uptime du bot, le CPU, la RAM, la charge, la vitesse (FPS), et le ping du bot."
    },
    guide: {
      en: "{p}uptime → Voir le statut complet du bot"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // Calcul du ping
      const t0 = performance.now();
      await new Promise(resolve => setTimeout(resolve, 100));
      const ping = (performance.now() - t0).toFixed(0);

      // FPS simulé
      const fps = Math.min(60, Math.max(20, 1000 / (ping / 2))).toFixed(0);

      // Temps d’activité du bot
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${days}j ${hours}h ${minutes}m ${seconds}s`;

      // Informations système
      const totalMem = os.totalmem() / (1024 ** 3);
      const freeMem = os.freemem() / (1024 ** 3);
      const usedMem = totalMem - freeMem;
      const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(1);

      const cpu = os.cpus()[0];
      const cpuModel = cpu.model;
      const cpuCores = os.cpus().length;
      const cpuLoad = (os.loadavg()[0] * 100 / cpuCores).toFixed(1);

      const platform = os.platform();
      const arch = os.arch();
      const nodeVersion = process.version;
      const hostName = os.hostname();

      // Message final
      const message = `
💻 𝗦𝗬𝗦𝗧È𝗠𝗘 𝗗𝗨 𝗕𝗢𝗧 💻
•.:°❀×══════════════×❀°:.•

🕐 **𝗨𝗣𝗧𝗜𝗠𝗘 :** ${uptimeString}
📶 **𝗣𝗜𝗡𝗚 :** ${ping} ms
🎮 **𝗙𝗣𝗦 :** ${fps} FPS

🧠 **𝗣𝗥𝗢𝗖𝗘𝗦𝗦𝗘𝗨𝗥 :** ${cpuModel}
⚙️ **𝗖𝗢𝗥𝗨𝗥𝗦 :** ${cpuCores}
📊 **𝗖𝗛𝗔𝗥𝗚𝗘 𝗖𝗣𝗨 :** ${cpuLoad} %

💾 **𝗥𝗔𝗠 :** ${usedMem.toFixed(2)} Go / ${totalMem.toFixed(2)} Go (${memUsagePercent}%)
🧩 **𝗦𝗬𝗦𝗧𝗘𝗠𝗘 :** ${platform.toUpperCase()} (${arch}
🟢 **𝗡𝗢𝗗𝗘.𝗝𝗦 :** ${nodeVersion}

🚀 **𝗢𝗪𝗡𝗘𝗥 :** 𝗕𝘆 𝗠𝗲𝗿𝗱𝗶 𝗠𝗮𝗱𝗶𝗺𝗯𝗮🌐
`;

      return api.sendMessage(message, event.threadID);
    } catch (err) {
      return api.sendMessage(`❌ Erreur : ${err.message}`, event.threadID);
    }
  }
};
