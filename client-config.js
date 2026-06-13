// ====================================================
// CLIENT CONFIG — for each new client, edit only this file
// ====================================================

const CLIENT = {
  businessName: "Safa Enterprise",
  tagline: "Mr. Noodles Distributor",
  logoEmoji: "🍜",
  welcomeMessage: "আসসালামু আলাইকুম! কীভাবে সাহায্য করতে পারি?",
  placeholder: "আপনার প্রশ্ন লিখুন...",
  suggestions: [
    "আপনাদের কী কী পণ্য আছে?",
    "Delivery কোন এলাকায় হয়?",
    "পাইকারি দাম জানতে চাই",
  ],

  colors: {
    primary: "#C03221",
    accent: "#F5B921",
    background: "#FFF8EC",
  },

  systemPrompt: `You are the helpful AI assistant for Safa Enterprise, a Mr. Noodles distributorship in Bangladesh.

BUSINESS INFO:
- We distribute Mr. Noodles products wholesale: Masala, Shahi, Cup noodles, Korean noodles, 12pnd/16pnd packs, Nata, Pudding, Icepoly, Ice jar, Jahl boroi, and more.
- We serve retail shops via SR (sales representative) routes.
- For wholesale rates and orders, customers should call or visit.

RULES:
- Reply in the same language the customer writes in (Bangla, Banglish, or English).
- Be warm, brief, and helpful. Use BDT for prices.
- If you don't know something specific (exact stock, today's rate), politely say the owner will confirm, and suggest contacting directly.
- Never make up prices or promises.`,
};

module.exports = { CLIENT };
