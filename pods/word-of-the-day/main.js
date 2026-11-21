// World Word of the Day: one word from the world's languages each day, chosen by the date, so it's
// the same all day. No network permission at all; "Another" shows the next one in the list.

const WORDS = [
  ["hygge", "Danish", "A cosy, contented feeling of warmth and good company."],
  ["sobremesa", "Spanish", "The time spent talking at the table after a meal."],
  ["komorebi", "Japanese", "Sunlight filtering through the leaves of trees."],
  ["gezellig", "Dutch", "Pleasantly sociable, snug and welcoming."],
  ["saudade", "Portuguese", "A longing for something or someone absent."],
  ["fernweh", "German", "A longing for faraway places you've never been."],
  ["ubuntu", "Zulu", "The belief that a person is a person through other people."],
  ["lagom", "Swedish", "Just the right amount: not too much, not too little."],
  ["hiraeth", "Welsh", "Homesickness for a home you can't return to."],
  ["meraki", "Greek", "Doing something with soul, creativity and love."],
  ["sisu", "Finnish", "Quiet, stubborn determination in hard times."],
  ["dépaysement", "French", "The feeling of being somewhere unfamiliar."],
  ["mångata", "Swedish", "The road-like reflection of the moon on water."],
  ["waldeinsamkeit", "German", "The feeling of being alone in the woods."],
  ["tsundoku", "Japanese", "Buying books and letting them pile up unread."],
  ["jayus", "Indonesian", "A joke so badly told that you can't help laughing."],
  ["shemomedjamo", "Georgian", "Eating on past fullness because it's so good."],
  ["cafuné", "Brazilian Portuguese", "Running your fingers tenderly through someone's hair."],
  ["iktsuarpok", "Inuktitut", "Going outside again and again to see if someone is coming."],
  ["mamihlapinatapai", "Yaghan", "A look shared by two people who each hope the other will act."],
  ["kilig", "Tagalog", "The fluttery rush of a romantic moment."],
  ["gigil", "Tagalog", "The urge to squeeze something unbearably cute."],
  ["yūgen", "Japanese", "A deep, mysterious sense of the beauty of the universe."],
  ["friluftsliv", "Norwegian", "Open-air living: time spent outdoors for its own sake."],
  ["tarab", "Arabic", "Musical rapture: being carried away by music."],
  ["sprezzatura", "Italian", "Studied carelessness: making the difficult look easy."],
  ["utepils", "Norwegian", "The first beer drunk outside in the sun of the year."],
  ["boketto", "Japanese", "Gazing into the distance, thinking of nothing."],
  ["fika", "Swedish", "A break for coffee, cake and conversation."],
  ["querencia", "Spanish", "The place where you feel most at home and strongest."],
  ["l'appel du vide", "French", "The call of the void: the sudden urge to jump from heights."],
  ["toska", "Russian", "A spiritual anguish, a longing with nothing to long for."],
  ["wabi-sabi", "Japanese", "Finding beauty in imperfection and impermanence."],
  ["gökotta", "Swedish", "Waking early to go outside and hear the first birdsong."],
  ["pochemuchka", "Russian", "Someone who asks a great many questions."],
  ["kummerspeck", "German", "Grief bacon: weight gained from emotional eating."],
  ["hanyauku", "Rukwangali", "Walking on tiptoes across warm sand."],
  ["sólarfrí", "Icelandic", "A sun holiday: time off work given for an unusually sunny day."],
  ["ya'aburnee", "Arabic", "You bury me: hoping to die before someone you love."],
  ["goya", "Urdu", "The suspension of disbelief that good storytelling brings."],
  ["tíma", "Icelandic", "To be willing to spend time or money on something."],
  ["koi no yokan", "Japanese", "The sense on meeting someone that you'll fall in love."],
  ["pana po'o", "Hawaiian", "Scratching your head to help you remember."],
  ["resfeber", "Swedish", "The restless race of the heart before a journey."],
  ["torschlusspanik", "German", "Gate-closing panic: fear that time is running out."],
  ["vacilando", "Spanish", "Wandering where the journey matters more than the destination."],
  ["age-otori", "Japanese", "Looking worse after a haircut."],
  ["culaccino", "Italian", "The mark a cold glass leaves on a table."]
];

function dayIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000) + now.getFullYear() * 366;
}

function show(offset) {
  const [word, language, meaning] = WORDS[(dayIndex() + offset) % WORDS.length];
  const day = new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  monorail.state.set({ word, language, meaning, day });
}

function refresh() {
  if (monorail.storage.get("day") !== dayIndex()) {
    monorail.storage.set("day", dayIndex());
    monorail.storage.set("offset", 0);
  }
  show(monorail.storage.get("offset") || 0);
}

function onAction(action) {
  if (action !== "next") return;
  const offset = (monorail.storage.get("offset") || 0) + 1;
  monorail.storage.set("offset", offset);
  show(offset);
}
