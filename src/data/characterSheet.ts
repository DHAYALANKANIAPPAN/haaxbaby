import type { CharacterSheetData, ProjectItem, StoryScene } from '../types';

/**
 * Section 04: 5-Point Character Sheet Data
 * Canonical lore for Pluto: The Cosmic Sprout Baby & Apprentice Dream-Weaver
 */
export const characterSheet: CharacterSheetData = {
  name: "Pluto",
  whatTheyAre: "Cosmic Sprout Baby",
  whatTheyDo: "Apprentice Dream-Weaver",
  story: "Born from a sneezed star",
  tagline: "Even the smallest star lights up the biggest dream!"
};

/**
 * Section 05: Visual Story Scenes
 * Rules: Strictly < 150 words per scene.
 */
export const storyScenes: StoryScene[] = [
  {
    id: 1,
    title: "Scene 1: The Cosmic Sneeze",
    subtitle: "Where starlight found a heartbeat",
    text: "Deep in the quiet universe, where galaxies whisper in shades of lavender and midnight blue, a tiny slumbering star sneezed. A sparkling burst of golden stardust billowed across the celestial nursery, coalescing into Pluto—a round-cheeked baby crowned with a soft green sprout. Wrapped in pastel pajamas speckled with miniature constellations, Pluto opened enormous, glossy eyes to a sea of shimmering wonder. Every drifting comet and glowing nebula seemed to hum an invitation. With a curious wiggle and a joyful gurgle, the little apprentice reached out chubby hands, discovering that starlight felt warm and gentle, like a newborn smile."
  },
  {
    id: 2,
    title: "Scene 2: Gathering Stardust",
    subtitle: "Weaving kindness into glowing dreams",
    text: "As Pluto floated through the milky nebulae, the little dream-weaver noticed something wondrous: rogue stardust was alive with feelings. Whenever Pluto shared a soft giggle or whispered words of gentle encouragement, scattered sparks of mint and lavender drifted closer, dancing in rhythm with Pluto's heart. Pluto gathered the glowing particles into fluffy cloud-baskets, spinning the radiant dust into shimmering spools of dream-yarn. For the weary stars that flickered in the cold dark, and the lonely clouds drifting between moonbeams, Pluto knit glowing tapestries of comfort and warmth, turning restless celestial static into sweet lullabies."
  },
  {
    id: 3,
    title: "Scene 3: The Cradle of Dreams",
    subtitle: "Comfort and wonder for an enormous universe",
    text: "With tender care, Pluto gathered woven starlight, crescent moonbeams, and pillowy cloud-fluff to build a magical celestial cradle. Resting at the crossroads of quiet galaxies, the cradle caught wayward fears and spun them into peaceful daydreams that drifted softly down toward sleeping worlds. Looking out across the vast expanse, where sleepy stars began to glow with gentle warmth, Pluto cuddled a radiant little star and smiled. Though the cosmos was endlessly deep and mysterious, the little sprout understood a sacred truth: even the smallest being can bring comfort, wonder, and boundless love to an enormous universe."
  }
];

/**
 * Section 05: What They Made - Interactive Projects Showcase (Day 2 consume)
 */
export const projects: ProjectItem[] = [
  {
    id: "cloud-fluff-weaver",
    title: "The Cloud-Fluff Weaver",
    tag: "Procedural Canvas",
    description: "Spins gossamer nebula yarn into soft sleeping clouds. Drag or click to fluff and seed star-clouds that drift gently across the sky.",
    demoType: "cloud"
  },
  {
    id: "constellation-color-sorter",
    title: "Constellation Color-Sorter",
    tag: "Interactive Drag/Sort",
    description: "Catches rogue twinkling asteroids and sorts them into harmonic color spectrums (Lavender, Solar Gold, Mint Stardust) to tune cosmic radio frequencies.",
    demoType: "stars"
  },
  {
    id: "midnight-slumber-box",
    title: "The Midnight Slumber Box",
    tag: "Harmonic Soundscape",
    description: "A vintage wooden music box humming with theta-wave cosmic lullabies. Interactive frequency switches and music-box chimes designed to calm anxious spirits.",
    demoType: "sound"
  }
];
