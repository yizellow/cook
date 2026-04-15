// menuConfig.js - Expanded menu configuration with snacks, chefs, menuItems, and parameters
export const menuConfig = {
  // Layer 1: Snacks (independent state, doesn't affect right panel)
  snacks: [
    { id: "small", name: "klein", description: "Standard menu flow" },
    { id: "large", name: "groß", description: "Quick snack option" },
  ],

  // Layer 2: Chefs/Media (determines menuItems and right panel scope)
  chefs: [
    {
      id: "landscape",
      name: "Wildfang",
      menuItems: [
        {
          id: "brotzeit",
          name: "Brotzeitbrettl",
          parameters: [
            {
              id: "trees",
              name: "Trees",
              type: "percentage",
              min: 0,
              max: 100,
              default: 30,
            },
            {
              id: "stones",
              name: "Stones",
              type: "percentage",
              min: 0,
              max: 100,
              default: 20,
            },
            {
              id: "mountains",
              name: "Mountains",
              type: "range",
              min: 1,
              max: 10,
              default: 6,
            },
            {
              id: "waterFeatures",
              name: "Water Features",
              type: "boolean",
              default: false,
            },
          ],
        },
        {
          id: "wurst",
          name: "Wurschtteller",
          parameters: [
            {
              id: "trees",
              name: "Trees",
              type: "percentage",
              min: 0,
              max: 100,
              default: 30,
            },
            {
              id: "stones",
              name: "Stones",
              type: "percentage",
              min: 0,
              max: 100,
              default: 20,
            },
            {
              id: "mountains",
              name: "Mountains",
              type: "range",
              min: 1,
              max: 10,
              default: 6,
            },
            {
              id: "waterFeatures",
              name: "Water Features",
              type: "boolean",
              default: false,
            },
          ],
        },
        {
          id: "aufschnitt",
          name: "Frängischer Aufschnitt",
          parameters: [
            {
              id: "gender",
              name: "Gender",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["Female", "Male"],
              default: 0,
            },
            {
              id: "age",
              name: "Age",
              type: "range",
              min: 1,
              max: 101,
              default: 25,
            },
            {
              id: "frame",
              name: "Frame",
              type: "single-choice",
              options: ["Full Body", "Portrait", "Close-up"],
              default: "Portrait",
            },
            {
              id: "emotion",
              name: "Emotion",
              type: "single-choice",
              options: ["Sad", "Happy", "Confused", "Suspicious", "Focused"],
              default: "Happy",
            },
          ],
        },
      ],
    },
    {
      id: "bits",
      name: "Bits & Bites",
      menuItems: [
        {
          id: "reklame",
          name: "Reklame Häppchen",
          description:
            "Dein persönlicher Aufmerksamkeitsknaller des Tages, herzhaft und pikant gewürzt und im world wide web serviert.",
          parameters: [
            {
              id: "category",
              name: "Category",
              type: "single-choice",
              options: ["Event", "Product"],
              default: "Product",
            },
            {
              id: "language",
              name: "Language",
              type: "single-choice",
              options: ["Deutsch", "English"],
              default: "English",
            },
            {
              id: "seriousness",
              name: "Seriousness",
              type: "percentage",
              min: 0,
              max: 100,
              default: 50,
            },
            {
              id: "loudness",
              name: "Loudness",
              type: "percentage",
              min: 0,
              max: 100,
              default: 30,
            },

            // {
            //   id: "description",
            //   name: "Description",
            //   type: "text",
            //   placeholder: "Tell the artist what you want to advertise",
            //   default: "",
            // },
          ],
        },
        {
          id: "binary",
          name: "Binäre Molekularküche",
          parameters: [
            {
              id: "speed",
              name: "Speed",
              type: "percentage",
              min: 0,
              max: 100,
              default: 60,
            },
            {
              id: "abstraction",
              name: "Abstraction",
              type: "percentage",
              min: 0,
              max: 100,
              default: 40,
            },
            {
              id: "interactivity",
              name: "Interactivity",
              type: "single-choice",
              options: ["Interactive", "Autonomous"],
              default: "Interactive",
            },
          ],
        },
        {
          id: "knoedel",
          name: "Knödeltris",
          parameters: [
            {
              id: "angry",
              name: "Angry",
              type: "percentage",
              min: 0,
              max: 100,
              default: 20,
            },
            {
              id: "excited",
              name: "Excited",
              type: "percentage",
              min: 0,
              max: 100,
              default: 30,
            },
            {
              id: "bored",
              name: "Bored",
              type: "percentage",
              min: 0,
              max: 100,
              default: 10,
            },
          ],
        },
      ],
    },
    {
      id: "doodle",
      name: "Doodle Noodle",
      menuItems: [
        {
          id: "spaghetti",
          name: "Spaghetti Monsters",
          parameters: [
            {
              id: "category",
              name: "Category",
              type: "single-choice",
              options: ["Character", "Monster", "Landscape", "Other"],
              default: "Character",
            },
          ],
        },
        {
          id: "moody",
          name: "Moody Pasta",
          parameters: [
            {
              id: "moistDry",
              name: "Moist ↔ Dry",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["Moist", "Dry"],
              default: 0,
            },
            {
              id: "realityDream",
              name: "Reality ↔ Dream",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["Reality", "Dream"],
              default: 0,
            },
            {
              id: "seasons",
              name: "Seasons",
              type: "single-choice",
              options: ["Spring", "Summer", "Autumn", "Winter"],
              default: "Spring",
            },
          ],
        },
        {
          id: "tagliatelle",
          name: "Tagliatelle al Struttura",
          parameters: [
            {
              id: "moistDry",
              name: "Moist ↔ Dry",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["Moist", "Dry"],
              default: 0,
            },
            {
              id: "realityDream",
              name: "Reality ↔ Dream",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["Reality", "Dream"],
              default: 0,
            },
            {
              id: "seasons",
              name: "Seasons",
              type: "single-choice",
              options: ["Spring", "Summer", "Autumn", "Winter"],
              default: "Spring",
            },
          ],
        },
      ],
    },
    {
      id: "fresh",
      name: "Fangfrisch",
      menuItems: [
        {
          id: "ramen",
          name: "Zitteraal-Ramen",
          parameters: [
            {
              id: "category",
              name: "Category",
              type: "single-choice",
              options: ["Character", "Monster", "Landscape", "Other"],
              default: "Character",
            },
          ],
        },
        {
          id: "sushi",
          name: "Running Sushi",
          parameters: [
            {
              id: "moistDry",
              name: "Moist ↔ Dry",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["Moist", "Dry"],
              default: 0,
            },
            {
              id: "realityDream",
              name: "Reality ↔ Dream",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["Reality", "Dream"],
              default: 0,
            },
            {
              id: "seasons",
              name: "Seasons",
              type: "single-choice",
              options: ["Spring", "Summer", "Autumn", "Winter"],
              default: "Spring",
            },
          ],
        },
      ],
    },
  ],
};
