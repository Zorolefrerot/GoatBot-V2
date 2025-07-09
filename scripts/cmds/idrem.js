import fs from "fs";
import path from "path";

let enabledGroups = new Set();
let memory = {}; // { chatId: [{user, message, response}, ...] }

// Charge le fichier JSON localement dans le même dossier que ce script
const jsonPath = path.join(path.dirname(new URL(import.meta.url).pathname), "idrem.json");

let discussionsData = {};

try {
  const dataRaw = fs.readFileSync(jsonPath, "utf-8");
  discussionsData = JSON.parse(dataRaw);
} catch (e) {
  console.error("Erreur lecture idrem.json :", e);
}

export async function onStart(msg, conn) {
  const chatId = msg.chat;
  const sender = msg.sender;
  const isAdmin = await conn.isAdmin(msg.chat, msg.sender);
  const text = (msg.body || "").toLowerCase();

  if (msg.body?.startsWith("/idrem")) {
    // Commande d'activation/désactivation uniquement par admin
    if (!isAdmin) {
      return conn.sendMessage(chatId, "❌ 𝗦𝗲𝘂𝗹𝗲𝗺𝗲𝗻𝘁 𝗹'𝗮𝗱𝗺𝗶𝗻 𝗽𝗲𝘂𝘁 𝗰𝗼𝗻𝘁𝗿𝗼̂𝗹𝗲𝗿 𝗹𝗲 𝗯𝗼𝘁.", { quoted: msg });
    }
    const args = msg.body.trim().split(/\s+/);
    if (args.length < 2) {
      return conn.sendMessage(chatId,
        "**Usage :** /idrem on  ou  /idrem off",
        { quoted: msg });
    }
    const cmdArg = args[1].toLowerCase();
    if (cmdArg === "on") {
      enabledGroups.add(chatId);
      memory[chatId] = [];
      return conn.sendMessage(chatId, "✅ 𝗗𝗶𝘀𝗰𝘂𝘀𝘀𝗶𝗼𝗻 𝗮𝗰𝘁𝗶𝘃𝗲́𝗲 𝗽𝗼𝘂𝗿 𝗰𝗲 𝗴𝗿𝗼𝘂𝗽𝗲.", { quoted: msg });
    } else if (cmdArg === "off") {
      enabledGroups.delete(chatId);
      delete memory[chatId];
      return conn.sendMessage(chatId, "⛔ 𝗗𝗶𝘀𝗰𝘂𝘀𝘀𝗶𝗼𝗻 𝗱𝗲𝘀𝗮𝗰𝘁𝗶𝘃𝗲́𝗲 𝗽𝗼𝘂𝗿 𝗰𝗲 𝗴𝗿𝗼𝘂𝗽𝗲.", { quoted: msg });
    } else {
      return conn.sendMessage(chatId,
        "❌ 𝗨𝘀𝗮𝗴𝗲 𝗶𝗻𝘃𝗮𝗹𝗶𝗱𝗲. 𝘂𝘁𝗶𝗹𝗶𝘀𝗲𝗿 /idrem on 𝗼𝘂 /idrem off",
        { quoted: msg });
    }
  }

  // Si la discussion n'est pas activée dans ce groupe, on ignore
  if (!enabledGroups.has(chatId)) return;

  // Ignore les messages de type commande (commencent par /idrem ou autres commandes)
  if (msg.body?.startsWith("/")) return;

  // Recherche mot-clé et réponse
  const foundCategory = Object.entries(discussionsData).find(([cat, entries]) => {
    return entries.some(({ keywords }) =>
      keywords.some(k => text.includes(k.toLowerCase()))
    );
  });

  let reply = null;

  if (foundCategory) {
    const [category, entries] = foundCategory;
    // Trouve toutes les réponses associées à un mot clé correspondant
    const matchedEntries = entries.filter(({ keywords }) =>
      keywords.some(k => text.includes(k.toLowerCase()))
    );
    if (matchedEntries.length > 0) {
      // Prend une réponse aléatoire parmi tous les matching entries
      const allResponses = matchedEntries.flatMap(e => e.responses);
      reply = allResponses[Math.floor(Math.random() * allResponses.length)];
    }
  }

  // Si pas de mot clé trouvé, réponse aléatoire dans la catégorie random si existante
  if (!reply && discussionsData.random) {
    if (Array.isArray(discussionsData.random)) {
      // random peut être un tableau simple de phrases
      if (typeof discussionsData.random[0] === "string") {
        reply = discussionsData.random[Math.floor(Math.random() * discussionsData.random.length)];
      } else {
        // Si random est tableau d'objets avec responses
        const allResps = discussionsData.random.flatMap(r => r.responses || []);
        reply = allResps[Math.floor(Math.random() * allResps.length)];
      }
    }
  }

  // Si aucune réponse, message générique
  if (!reply) reply = "🤔 Je ne sais pas quoi répondre là...";

  // Enregistre dans la mémoire temporaire (max 50 échanges)
  if (!memory[chatId]) memory[chatId] = [];
  memory[chatId].push({ user: sender, message: msg.body, response: reply });
  if (memory[chatId].length > 50) memory[chatId].shift();

  // Envoie la réponse
  await conn.sendMessage(chatId, reply, { quoted: msg });
}
