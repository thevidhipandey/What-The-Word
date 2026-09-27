/** English-only answers and short, self-contained meanings for the end-of-round reveal. */
export const WORDLISTS = {
  4: {
    easy: ["love", "blue", "moon", "star", "tree", "book", "fish", "bird"],
    medium: ["glow", "fern", "dusk", "tide", "moss", "hush", "peel", "sway"],
    tough: ["quay", "lilt", "wisp", "gild", "brim", "rift", "fawn", "mire"],
  },
  5: {
    easy: ["mango", "lemon", "chair", "table", "water", "plant", "music", "smile"],
    medium: ["bloom", "crisp", "fable", "grace", "whirl", "ember", "petal", "ripple"],
    tough: ["wryly", "quill", "gloam", "sleet", "brisk", "mirth", "knoll", "droll"],
  },
  6: {
    easy: ["garden", "cotton", "sunset", "family", "sister", "summer", "winter", "bridge"],
    medium: ["canopy", "meadow", "murmur", "velvet", "wander", "bright", "breeze", "tangle"],
    tough: ["quaint", "zephyr", "goblet", "mottle", "fathom", "riddle", "dapple", "whimsy"],
  },
} as const;

export const WORD_MEANINGS: Record<string, string> = {
  love: "A deep feeling of affection.", blue: "The color of a clear sky.", moon: "Earth’s natural satellite.", star: "A bright point of light in the night sky.",
  tree: "A tall plant with a woody trunk.", book: "Pages bound together for reading.", fish: "An animal that lives and breathes in water.", bird: "A feathered animal with wings.",
  glow: "To shine with a soft, steady light.", fern: "A leafy plant that grows without flowers.", dusk: "The dim light just after sunset.", tide: "The regular rise and fall of the sea.",
  moss: "A small, soft green plant that grows in damp places.", hush: "A sudden quiet or silence.", peel: "To remove the outer skin of something.", sway: "To move gently from side to side.",
  quay: "A platform beside water where boats can dock.", lilt: "A light, cheerful rhythm in speech or music.", wisp: "A thin, delicate strand or trail.", gild: "To cover something with a thin layer of gold.",
  brim: "The projecting edge of a hat or container.", rift: "A crack or a serious disagreement.", fawn: "A young deer.", mire: "Deep mud; also, a difficult situation.",
  mango: "A sweet, juicy tropical fruit.", lemon: "A sour yellow citrus fruit.", chair: "A seat for one person, usually with a back.", table: "Furniture with a flat top supported by legs.",
  water: "The clear liquid essential to life.", plant: "A living thing that usually grows in soil.", music: "Sounds arranged in rhythm and melody.", smile: "A happy expression made with your mouth.",
  bloom: "A flower, or the act of flowering.", crisp: "Firm and pleasantly crunchy.", fable: "A short story that teaches a lesson.", grace: "Elegance and ease of movement.",
  whirl: "To spin around quickly.", ember: "A small, glowing piece of coal or wood.", petal: "One of the soft, colored parts of a flower.", ripple: "A small wave on the surface of water.",
  wryly: "In a dry, amused, or slightly ironic way.", quill: "A large feather once used as a pen.", gloam: "Twilight; the dim light of evening.", sleet: "Rain mixed with snow or ice.",
  brisk: "Quick, energetic, and lively.", mirth: "Laughter and cheerful amusement.", knoll: "A small, rounded hill.", droll: "Oddly amusing in a dry way.",
  garden: "A place where flowers, vegetables, or other plants grow.", cotton: "A soft plant fiber used to make cloth.", sunset: "The time when the sun disappears below the horizon.", family: "People related to one another, or living as a close group.",
  sister: "A female sibling.", summer: "The warmest season of the year.", winter: "The coldest season of the year.", bridge: "A structure built to cross a river, road, or gap.",
  canopy: "A covering above something, such as a roof of leaves.", meadow: "An open field of grass and wildflowers.", murmur: "A soft, low, continuous sound.", velvet: "A soft fabric with a thick, smooth surface.",
  wander: "To walk without a fixed destination.", bright: "Giving off or reflecting plenty of light.", breeze: "A gentle wind.", tangle: "A twisted or knotted mess.",
  quaint: "Attractively unusual or old-fashioned.", zephyr: "A gentle, mild breeze.", goblet: "A drinking cup with a stem and base.", mottle: "To mark with irregular patches of color.",
  fathom: "To understand something deeply.", riddle: "A puzzling question with a clever answer.", dapple: "To mark with spots or patches of light and shade.", whimsy: "Playful, fanciful imagination.",
};
