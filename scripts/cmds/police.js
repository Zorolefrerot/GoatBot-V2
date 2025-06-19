module.exports = {
  config: {
    name: "police",
    aliases: [],
    version: "1.1",
    author: "Merdi Madimba",
    countDown: 3,
    role: 0,
    shortDescription: {
      fr: "Transformer du texte en plusieurs styles"
    },
    longDescription: {
      fr: "Affiche un texte dans une police choisie parmi 10 styles différents"
    },
    category: "utilitaires",
    guide: {
      fr: "• !police → Voir les styles\n• !police <style> <texte> → Transformer le texte"
    }
  },

  onStart: async function ({ message, args }) {
    const fonts = {
      arial: (t) => t,
      bold: (t) => t.replace(/[a-zA-Z]/g, c =>
        String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 0x1D400 - 0x41 : 0x1D41A - 0x61))
      ),
      italic: (t) => t.replace(/[a-zA-Z]/g, c =>
        String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 0x1D434 - 0x41 : 0x1D44E - 0x61))
      ),
      monospace: (t) => t.replace(/[a-zA-Z]/g, c =>
        String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 0x1D670 - 0x41 : 0x1D68A - 0x61))
      ),
      serif: (t) => t.replace(/[a-zA-Z]/g, c =>
        String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 0x1D49C - 0x41 : 0x1D4B6 - 0x61))
      ),
      wide: (t) => t.split('').join(' '),
      reverse: (t) => t.split('').reverse().join(''),
      underline: (t) => [...t].map(c => c + '\u0332').join(''),
      strike: (t) => [...t].map(c => c + '\u0336').join(''),
      doublestrike: (t) => [...t].map(c => c + '\u033F').join('')
    };

    const fontList = Object.keys(fonts);

    if (args.length < 2) {
      const example = "exemple";
      const preview = fontList.map(f => {
        try {
          return `• ${f} : ${fonts[f](example)}`;
        } catch {
          return `• ${f} : erreur`;
        }
      }).join("\n");
      return message.reply(`🖋️ *Styles disponibles* :\n\n${preview}\n\n👉 Utilisation : !police <style> <texte>`);
    }

    const [style, ...contentArr] = args;
    const text = contentArr.join(" ");
    const formatter = fonts[style.toLowerCase()];

    if (!formatter) {
      return message.reply(`❌ Police "${style}" introuvable.\n✅ Styles dispo : ${fontList.join(", ")}`);
    }

    const result = formatter(text);
    return message.reply(`🖋️ Résultat avec "${style}" :\n${result}`);
  }
};
