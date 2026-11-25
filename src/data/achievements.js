// Data-driven achievements. Add an entry here, then grant rewards
// from CAR_COLORS / TRAILS / HORNS via the same unlock id.

export const ACHIEVEMENTS = [
  {
    id: 'zones',
    title: 'Tour guide',
    description: 'Visit About, Projects, Skills, Experience, Testimonials and Contact.',
    xp: 120,
  },
  {
    id: 'projects',
    title: 'Open every build',
    description: 'Open the case study for every project landmark.',
    xp: 150,
  },
  {
    id: 'honk',
    title: 'Friendly horn',
    description: 'Honk ten times.',
    xp: 40,
  },
  {
    id: 'flip',
    title: 'Upside down',
    description: 'Flip the car in the air.',
    xp: 80,
  },
  {
    id: 'secrets',
    title: 'Found the quiet corners',
    description: 'Find every hidden secret, including the button-code surprise.',
    xp: 100,
  },
  {
    id: 'pins',
    title: 'Strike',
    description: 'Knock over every bowling pin.',
    xp: 80,
  },
];

export const ZONE_IDS = ['about', 'projects', 'skills', 'experience', 'testimonials', 'contact'];
