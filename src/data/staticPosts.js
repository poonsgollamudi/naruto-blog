// Static posts data for GitHub Pages deployment
// Since GitHub Pages can't run a backend, we'll use static JSON data

export const staticPosts = [
  {
    _id: "1",
    title: "Welcome to the Naruto Blog!",
    content: `# Welcome to our Naruto Universe Blog! 🍥

This is a static version of our Naruto blog, deployed on GitHub Pages. While we can't have dynamic post creation here, you can still enjoy reading about the amazing world of Naruto!

## What You'll Find Here

- **Character Analysis**: Deep dives into our favorite ninja
- **Episode Reviews**: Thoughts on key moments in the series
- **Ninja Techniques**: Explanations of jutsu and abilities
- **Story Arcs**: Breaking down the major plot lines

## Featured Characters

- **Naruto Uzumaki** 🦊 - The hyperactive ninja with a dream to become Hokage
- **Sasuke Uchiha** ⚡ - The last surviving member of the Uchiha clan
- **Sakura Haruno** 🌸 - The medical ninja with incredible strength
- **Kakashi Hatake** 👁️ - The Copy Ninja and Team 7's sensei

Stay tuned for more amazing content about the Hidden Leaf Village!`,
    tags: ["welcome", "naruto", "introduction"],
    author: "Blog Admin",
    date: "2025-10-25T00:00:00Z"
  },
  {
    _id: "2", 
    title: "The Power of Friendship in Naruto",
    content: `# The Power of Friendship in Naruto 🤝

One of the most compelling themes throughout the Naruto series is the power of friendship and bonds between characters.

## Naruto and Sasuke's Bond

The relationship between Naruto and Sasuke forms the emotional core of the entire series. From rivals to friends to enemies and back to friends, their bond transcends typical friendship.

### Key Moments:
- **Valley of the End (Part 1)**: Their first major confrontation
- **Final Battle**: The ultimate test of their friendship
- **The Promise**: Naruto's unwavering dedication to bringing Sasuke home

## Team 7's Evolution

Team 7 starts as three genin who can barely work together, but grows into one of the strongest teams in ninja history.

### Growth Through Trials:
1. **Land of Waves Mission**: Learning to work as a team
2. **Chunin Exams**: Individual growth within the team dynamic
3. **Sasuke Retrieval**: Fighting for a teammate
4. **War Arc**: Fighting alongside each other as equals

The series shows us that true strength comes not just from individual power, but from the bonds we forge with others.

*"I won't run away anymore... I won't go back on my word... that is my ninja way!"* - Naruto Uzumaki`,
    tags: ["friendship", "naruto", "sasuke", "team7"],
    author: "Ninja Philosopher",
    date: "2025-10-24T00:00:00Z"
  },
  {
    _id: "3",
    title: "Understanding Chakra: The Ninja Energy System",
    content: `# Understanding Chakra: The Ninja Energy System ⚡

Chakra is the fundamental energy source that powers all ninja techniques in the Naruto universe.

## What is Chakra?

Chakra is created by mixing physical energy (身体エネルギー) and spiritual energy (精神エネルギー). This combination allows ninja to perform jutsu.

### The Two Components:

1. **Physical Energy (Stamina)**
   - Drawn from the body's cells
   - Increased through training and exercise
   - Depleted through physical exertion

2. **Spiritual Energy (Mental Power)**
   - Drawn from experience and willpower
   - Grows through meditation and mental training
   - Affected by emotions and state of mind

## Chakra Nature Types

There are five basic nature transformations:

- 🔥 **Fire (Katon)** - Offensive, explosive techniques
- 💨 **Wind (Futon)** - Sharp, cutting attacks  
- ⚡ **Lightning (Raiton)** - Fast, piercing strikes
- 🌍 **Earth (Doton)** - Defensive, solid techniques
- 💧 **Water (Suiton)** - Fluid, adaptive methods

## Advanced Applications

### Kekkei Genkai
Some ninja can combine multiple nature types:
- **Ice Release** (Water + Wind)
- **Wood Release** (Earth + Water) 
- **Lava Release** (Fire + Earth)

### Special Chakra Forms
- **Sage Mode**: Natural energy integration
- **Tailed Beast Chakra**: Massive chakra reserves
- **Six Paths Chakra**: Divine-level energy

Understanding chakra is essential to appreciating the depth of the ninja arts!`,
    tags: ["chakra", "jutsu", "ninja", "techniques"],
    author: "Academy Instructor",
    date: "2025-10-23T00:00:00Z"
  }
];

// Helper function to simulate API calls for static deployment
export const getStaticPosts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(staticPosts.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }, 100); // Simulate network delay
  });
};

export const getStaticPost = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = staticPosts.find(p => p._id === id);
      if (post) {
        resolve(post);
      } else {
        reject(new Error('Post not found'));
      }
    }, 100);
  });
};