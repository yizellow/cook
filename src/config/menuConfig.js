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
          name: "Brotzeitbredl",
          description: "Gemischte Jause mit den Spezialitäten der Umgebung.",
          parameters: [
            {
              id: "chrunchy",
              name: "Knusprig",
              type: "percentage",
              min: 0,
              max: 100,
              default: 20,
            },
            {
              id: "animals",
              name: "Tierisch",
              type: "percentage",
              min: 0,
              max: 100,
              default: 0,
            },
            {
              id: "spread",
              name: "Aufstrich",
              type: "single-choice",
              options: ["süß", "salzig", "ohne"],
              default: "salzig",
            },
            {
              id: "vegan",
              name: "Vegan",
              type: "boolean",
              default: true,
            },
          ],
        },
        {
          id: "sausage",
          name: "Wurschtteller",
          description: "Tierisch guter Aufschnitt aus Freilandhaltung.",
          parameters: [
            {
              id: "red",
              name: "Rotes Fleisch",
              type: "percentage",
              min: 0,
              max: 100,
              default: 80,
            },
            {
              id: "white",
              name: "Weißes Fleisch",
              type: "percentage",
              min: 0,
              max: 100,
              default: 40,
            },
            {
              id: "fish",
              name: "Fisch",
              type: "percentage",
              min: 1,
              max: 100,
              default: 0,
            },
          ],
        },
        {
          id: "aufschnitt",
          name: "Frängischer Aufschnitt",
          description: "So schmeckt Würzburg!",
          parameters: [
            {
              id: "schaeufele",
              name: "Schäufele",
              type: "boolean",
              default: true,
            },
            {
              id: "knoedel",
              name: "Knödel",
              type: "range",
              min: 1,
              max: 101,
              default: 3,
            },
            {
              id: "zipfel",
              name: "Blaue Zipfel",
              type: "range",
              min: 0,
              max: 11,
              default: "2",
            },
            {
              id: "wine",
              name: "Wein",
              type: "single-choice",
              options: [
                "Silvaner",
                "Domina",
                "Bachus",
                "Grauburgunder",
                "Federweißer",
              ],
              default: "Silvaner",
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
            "Dein persönlicher Aufmerksamkeitsknaller des Tages, herzhaft und pikant gewürzt und im World Wide Web serviert.",
          parameters: [
            {
              id: "peppery",
              name: "pfeffrig",
              type: "percentage",
              min: 1,
              max: 100,
              default: 70,
            },
            {
              id: "sweet",
              name: "süß",
              type: "percentage",
              min: 1,
              max: 100,
              default: 10,
            },
            {
              id: "slimy",
              name: "schleimig",
              type: "percentage",
              min: 1,
              max: 100,
              default: 0,
            },
            {
              id: "item",
              name: "Präsentationsobjekt",
              type: "single-choice",
              options: ["Event", "Produkt", "Statement"],
              default: "Event",
            },
          ],
        },
        {
          id: "binary",
          name: "Binäre Molekularküche",
          description:
            "Ein interaktives Genusserlebnis mit emergent ineinandergreifenden Geschmackssystemen (wird lebendig serviert).",
          parameters: [
            {
              id: "bubbles",
              name: "Blubbernd",
              type: "percentage",
              min: 0,
              max: 100,
              default: 60,
            },
            {
              id: "exotic",
              name: "Exotisch",
              type: "percentage",
              min: 0,
              max: 100,
              default: 40,
            },
            {
              id: "organic",
              name: "Organisch",
              type: "percentage",
              min: 0,
              max: 100,
              default: 10,
            },
            {
              id: "random",
              name: "Zufall",
              type: "percentage",
              min: 0,
              max: 100,
              default: 50,
            },
          ],
        },
        {
          id: "knoedel",
          name: "Knödeltris",
          description:
            "Dreierlei Klöße in einem perfekten Zusammenspiel aus emotional aufgeladenen Geschmacksrichtungen. Geformt und zubereitet nach Geheimrezept.",
          parameters: [
            {
              id: "euphoric",
              name: "Euphorisch",
              type: "percentage",
              min: 0,
              max: 100,
              default: 0,
            },
            {
              id: "restless",
              name: "Rastlos",
              type: "percentage",
              min: 0,
              max: 100,
              default: 0,
            },
            {
              id: "carefree",
              name: "Sorgenfrei",
              type: "percentage",
              min: 0,
              max: 100,
              default: 0,
            },
            // {
            //   id: "leaden",
            //   name: "Trist",
            //   type: "percentage",
            //   min: 0,
            //   max: 100,
            //   default: 0,
            // },
            {
              id: "electrified",
              name: "Elektrisch",
              type: "percentage",
              min: 0,
              max: 100,
              default: 0,
            },
            // {
            //   id: "sheltered",
            //   name: "Beschützt",
            //   type: "percentage",
            //   min: 0,
            //   max: 100,
            //   default: 0,
            // },
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
          description:
            "Verworrene Häppchen, spontan kreiert und farbenfroh abgeschmeckt.",
          parameters: [
            {
              id: "frightening",
              name: "Abgeschreckt",
              type: "percentage",
              min: 1,
              max: 100,
              default: 50,
            },
            {
              id: "spacious",
              name: "weitläufig",
              type: "percentage",
              min: 1,
              max: 100,
              default: 20,
            },
            {
              id: "character",
              name: "Charaktervoll",
              type: "percentage",
              min: 1,
              max: 100,
              default: 40,
            },
          ],
        },
        {
          id: "moody",
          name: "Moody Pasta",
          description:
            "Al dente gekocht und in stimmungsvoller Soße geschwenkt; traumhaft saisonal gewürzt.",
          parameters: [
            {
              id: "dryJuicy",
              name: "Saftig",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["trocken", "saftig"],
              default: 30,
            },
            {
              id: "dreamyness",
              name: "Traumhaftigkeit",
              type: "percentage",
              min: 0,
              max: 100,
              default: 50,
            },
            {
              id: "season",
              name: "Jahreszeit",
              type: "single-choice",
              options: ["Frühling", "Sommer", "Herbst", "Winter"],
              default: "Frühling",
            },
          ],
        },
        {
          id: "tagliatelle",
          name: "Tagliatelle al Struttura",
          description:
            "Diese handgemachten Nudelstreifen in diversen Geschmacksrichtungen werden direkt auf dem Teller zu optischen Strukturen verflochten.",
          parameters: [
            {
              id: "glow",
              name: "Leuchtend",
              type: "percentage",
              min: 0,
              max: 100,
              default: 70,
            },
            {
              id: "glass",
              name: "Gläsern",
              type: "percentage",
              min: 0,
              max: 100,
              default: 0,
            },
            {
              id: "spatial",
              name: "Vollmundig",
              type: "percentage",
              min: 0,
              max: 100,
              default: 50,
            },
          ],
        },
      ],
    },
    {
      id: "fresh",
      name: "Frisch & Zappelig",
      menuItems: [
        {
          id: "ramen",
          name: "Zitteraal-Ramen",
          description:
            "Bei jeder Ramen-Bestellung servieren wir 4 Einzelrahmen zum mitnehmen in würziger Brühe.",
          parameters: [
            {
              id: "strength",
              name: "Kräftig",
              type: "percentage",
              min: 1,
              max: 100,
              default: 100,
            },
            {
              id: "overcooked",
              name: "Übergekocht",
              type: "percentage",
              min: 1,
              max: 100,
              default: 50,
            },
            {
              id: "vitalizing",
              name: "Sanft Belebend",
              type: "percentage",
              min: 1,
              max: 100,
              default: 0,
            },
          ],
        },
        {
          id: "sushi",
          name: "Running Sushi",
          description:
            "Diese Kerlchen müssen im Wortsinn lange gehen gelassen werden. He, Bleib auf dem Teller!",
          parameters: [
            {
              id: "human",
              name: "Tierisch / Humanoid",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["Tierisch", "Humanoid"],
              default: 0,
            },
            {
              id: "flavour",
              name: "Geschmack",
              type: "spectrum",
              min: -50,
              max: 50,
              labels: ["süß", "scharf"],
              default: 0,
            },
          ],
        },
      ],
    },
  ],
};
