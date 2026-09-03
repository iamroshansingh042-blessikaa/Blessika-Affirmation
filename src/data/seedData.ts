import {
  Affirmation,
  ChallengeTrack,
  CircleMember,
  FeatureSlide,
  FinanceEntry,
  GardenPlant,
  LifeDate,
  MedicineItem,
  MoodLog,
  PetRecord,
  ScratchReward,
  SoundTrack,
  VaultDoc,
  VehicleRecord,
} from '../types';

export const FEATURE_SLIDES: FeatureSlide[] = [
  {
    id: 1,
    category: 'Daily Affirmations',
    title: 'Divine Mind & Sacred Words',
    subtitle: 'Awaken your inner strength through vibrational affirmations.',
    description:
      'Immerse in daily 528Hz-attuned mantras, speech synthesis recitations, and tactile 3D reflective journaling designed to cultivate unbreakable peace.',
    iconName: 'Sparkles',
    badgeColor: 'bg-[#A84457] text-white',
  },
  {
    id: 2,
    category: '21-Day Transformation',
    title: 'Daily Micro-Habit Quests',
    subtitle: 'Master your energy, physical vitality, and discipline.',
    description:
      'A structured 21-node milestone roadmap with milestone badges at Day 7, 14, and 21. Turn intentions into automatic, effortless rituals.',
    iconName: 'Compass',
    badgeColor: 'bg-[#8A6223] text-white',
  },
  {
    id: 3,
    category: 'Family Circle Safety',
    title: 'Life360 Smart Sanctuary',
    subtitle: 'Real-time protective awareness for those you cherish most.',
    description:
      'Monitor live battery levels, safe zone arrivals, send instant loving heart pings, and activate glowing SOS emergency beacon with 1-tap broadcast.',
    iconName: 'ShieldHeart',
    badgeColor: 'bg-[#476655] text-white',
  },
  {
    id: 4,
    category: 'Holistic Life Hub',
    title: '8 Universal Life Modules',
    subtitle: 'Streamline health, finances, vehicles, gardens, and documents.',
    description:
      'From pill dosage trackers and CBT mood wheels to encrypted vault storage and pet vaccines—everything in one elevated sanctuary.',
    iconName: 'Layers',
    badgeColor: 'bg-[#6D5999] text-white',
  },
];

export const INITIAL_AFFIRMATIONS: Affirmation[] = [
  {
    id: 'aff-1',
    theme: 'Radiant Vitality',
    quote: 'I am grounded in deep serenity, aligned with divine abundance, and radiating vibrant health.',
    author: 'Sanctuary Oracle',
    mantra: 'Om Shanti • I Am Light',
    frequencyHz: 528,
    journalPrompt: 'What is one blessing in my life today that I previously took for granted?',
    isFavorite: true,
    category: 'Mindfulness',
  },
  {
    id: 'aff-2',
    theme: 'Unshakable Courage',
    quote: 'Every breath I take clears doubt and fuels my purposeful action with calm confidence.',
    author: 'Sacred Heart',
    mantra: 'I Stand in Strength',
    frequencyHz: 432,
    journalPrompt: 'Where can I choose calm surrender instead of reactive control today?',
    isFavorite: false,
    category: 'Vitality',
  },
  {
    id: 'aff-3',
    theme: 'Family Protection & Harmony',
    quote: 'My home is a protected sanctuary of warmth, unconditional love, and safe belonging.',
    author: 'Life Guardian',
    mantra: 'Peace Enfolds My Circle',
    frequencyHz: 528,
    journalPrompt: 'How can I make someone in my family circle feel deeply cherished this evening?',
    isFavorite: true,
    category: 'Family Safety',
  },
  {
    id: 'aff-4',
    theme: 'Overflowing Abundance',
    quote: 'The universe endlessly provides. I welcome wealth, wisdom, and miraculous opportunities.',
    author: 'Golden Horizon',
    mantra: 'I Am Worthy & Receptive',
    frequencyHz: 963,
    journalPrompt: 'What creative idea or project is waiting for my focused energy this week?',
    isFavorite: false,
    category: 'Abundance',
  },
];

export const CHALLENGE_TRACKS: ChallengeTrack[] = [
  {
    id: 'morning-meditation',
    title: 'Sacred Morning Silence',
    subtitle: '15 minutes of 528Hz breathwork & alignment',
    icon: 'Sun',
    color: '#8A6223',
    category: 'Mindfulness',
    tasks: Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${
        [
          'Diaphragmatic Grounding Breath (5 mins)',
          '528Hz Solfeggio Body Scan',
          '3-Point Gratitude Whisper',
          'Loving-Kindness Blessing for Family',
          'Silent Visual Sanctuary Walk',
          'Release of Lingering Tension',
          'Week 1 Keystone: The Sacred Pause',
          'Gentle Morning Sunlight Absorption',
          'Chakra Heart Resonance',
          'Mindful Walking Without Phone',
          'Affirmation Mirror Recitation',
          'Breath Retention & Energy Lock',
          'Observing Thoughts Without Judgment',
          'Week 2 Keystone: Inner Fortress',
          'Pineal Gland Visualization',
          'Ancestral Grace & Forgiveness',
          'Sound Vibration Humming (Brahmari)',
          'Setting the Intention Shield',
          'Deep Surrender to Life Flow',
          'Gratitude for the 21-Day Journey',
          'Graduation: Mastery of Radiant Presence',
        ][i]
      }`,
      action: 'Complete your 15-minute sanctuary audio session before checking phone notifications.',
      reflection: 'Notice how calm energy carries throughout your entire morning.',
      completed: i < 3,
      xp: 50 + i * 10,
      badge: i === 6 ? '🥉 Bronze Seeker' : i === 13 ? '🥈 Silver Sage' : i === 20 ? '👑 Master of Sanctuary' : undefined,
    })),
  },
  {
    id: 'sugar-free',
    title: 'Vitality Cleanse & Clean Fuel',
    subtitle: 'Nourish the biological temple with pure vitality',
    icon: 'Apple',
    color: '#476655',
    category: 'Vitality',
    tasks: Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Sugar-Free Vitality Goal`,
      action: 'Replace all processed sugars with warm herbal infusions and whole fruits.',
      reflection: 'Observe your sustained mental clarity and steady metabolic stamina.',
      completed: i < 1,
      xp: 60,
      badge: i === 20 ? '🌱 Vitality Pure Champion' : undefined,
    })),
  },
  {
    id: 'gratitude-journal',
    title: 'Daily Abundance Journaling',
    subtitle: 'Write 3 blessings and unlock golden karma',
    icon: 'BookOpen',
    color: '#A84457',
    category: 'Abundance',
    tasks: Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Written Abundance Log`,
      action: 'Record three detailed moments of grace and heartfelt appreciation.',
      reflection: 'Abundance is not what you acquire, but what you realize you already hold.',
      completed: i < 4,
      xp: 50,
      badge: i === 20 ? '✨ Golden Scribe of Grace' : undefined,
    })),
  },
];

export const INITIAL_CIRCLE_MEMBERS: CircleMember[] = [
  {
    id: 'mem-1',
    name: 'Eleanor (Partner)',
    role: 'Partner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    battery: 88,
    isCharging: false,
    locationStatus: 'At Home',
    address: 'Sweet Home Sanctuary, Elm Grove',
    lastUpdated: 'Just now',
    loveCount: 14,
  },
  {
    id: 'mem-2',
    name: 'Liam (Son)',
    role: 'Child',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    battery: 64,
    isCharging: true,
    locationStatus: 'At School',
    address: 'Greenwood High Campus',
    lastUpdated: '4m ago',
    loveCount: 9,
  },
  {
    id: 'mem-3',
    name: 'Grandma Maya',
    role: 'Elderly Parent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    battery: 92,
    isCharging: false,
    locationStatus: 'Safe Zone',
    address: 'Botanical Garden Pavilion',
    lastUpdated: '12m ago',
    loveCount: 22,
  },
];

export const INITIAL_SCRATCH_REWARD: ScratchReward = {
  id: 'reward-today',
  title: 'Divine Synergy Blessing',
  rewardText: '+75 Golden Karma & 2x Streak Multiplier Activated!',
  bonusType: 'karma',
  amount: 75,
  isRevealed: false,
  code: 'BLESS-2026-SUN',
};

export const SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    name: 'Gentle Sanctuary Rain',
    frequency: 'Pink Noise Lowpass',
    description: 'Calms nervous system and blocks intrusive acoustic clutter.',
    icon: 'CloudRain',
  },
  {
    id: 'waves',
    name: 'Tidal Ocean Waves',
    frequency: '0.12 Hz LFO Wave',
    description: 'Rhythmic sea surge for breath alignment and deep REM prep.',
    icon: 'Waves',
  },
  {
    id: 'solfeggio',
    name: '528 Hz Miracles & Love',
    frequency: '528 Hz Pure Sine',
    description: 'The ancient Solfeggio frequency for DNA repair and heart clarity.',
    icon: 'Sparkles',
  },
  {
    id: 'crystal',
    name: '432 Hz Singing Bowl',
    frequency: '432 Hz Harmonics',
    description: 'Cosmic tuning frequency matching sacred geometry of nature.',
    icon: 'Bell',
  },
  {
    id: 'birds',
    name: 'Sunrise Forest Chorus',
    frequency: 'Natural Chirp Sweep',
    description: 'Awakens dopamine and focus without morning anxiety.',
    icon: 'TreePine',
  },
];

// Initial datasets for the 8 Universal Life Services
export const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: 'med-1',
    name: 'Vitamin D3 + K2 Complex',
    dosage: '5000 IU with breakfast',
    time: '08:30 AM',
    remainingPills: 42,
    takenToday: true,
  },
  {
    id: 'med-2',
    name: 'Omega-3 Wild Fish Oil',
    dosage: '1000mg EPA/DHA',
    time: '01:00 PM',
    remainingPills: 28,
    takenToday: false,
  },
  {
    id: 'med-3',
    name: 'Magnesium Glycinate',
    dosage: '400mg before sleep',
    time: '09:30 PM',
    remainingPills: 60,
    takenToday: false,
  },
];

export const INITIAL_MOOD_LOGS: MoodLog[] = [
  {
    id: 'mood-1',
    timestamp: 'Today, 8:15 AM',
    mood: 'Peaceful',
    energyLevel: 8,
    cbtThought: 'I noticed morning rush tension and chose to breathe into spacious calm.',
    gratitudeNote: 'Grateful for the morning sun streaming through the kitchen window.',
  },
  {
    id: 'mood-2',
    timestamp: 'Yesterday, 9:30 PM',
    mood: 'Grounded',
    energyLevel: 7,
    cbtThought: 'Acknowledged work challenges as growth opportunities.',
    gratitudeNote: 'The warm tea shared with family before bedtime.',
  },
];

export const INITIAL_GARDEN_PLANTS: GardenPlant[] = [
  {
    id: 'plant-1',
    name: 'Holy Basil (Tulsi)',
    variety: 'Rama Sacred Herb',
    lastWatered: 'Yesterday',
    nextWaterInDays: 0,
    daysToHarvest: 14,
    health: 'Needs Water',
  },
  {
    id: 'plant-2',
    name: 'Heirloom Cherry Tomatoes',
    variety: 'Sun Gold Sweet',
    lastWatered: 'Today',
    nextWaterInDays: 2,
    daysToHarvest: 28,
    health: 'Flowering',
  },
  {
    id: 'plant-3',
    name: 'Medicinal Aloe Vera',
    variety: 'Barbadensis Miller',
    lastWatered: '3 days ago',
    nextWaterInDays: 4,
    daysToHarvest: 60,
    health: 'Thriving',
  },
];

export const INITIAL_VEHICLES: VehicleRecord[] = [
  {
    id: 'veh-1',
    name: 'Sanctuary Hybrid Wagon',
    plate: 'BLESS-888',
    fuelLevel: 78,
    mileage: 24350,
    nextOilChangeMiles: 29000,
    insuranceExpiry: 'Nov 2026',
  } as unknown as VehicleRecord,
];

export const INITIAL_PETS: PetRecord[] = [
  {
    id: 'pet-1',
    petName: 'Luna',
    species: 'Dog',
    nextMealTime: '06:00 PM',
    nextVaccineDate: 'Dec 15, 2026',
    vetContact: 'Dr. Harper (555-0199)',
    weightKg: 26.4,
  },
];

export const INITIAL_FINANCES: FinanceEntry[] = [
  {
    id: 'fin-1',
    title: 'Organic Market & Wellness Food',
    category: 'Sanctuary',
    amount: 142.5,
    type: 'expense',
    date: 'Today',
  },
  {
    id: 'fin-2',
    title: 'Monthly Tithe & Animal Rescue Donation',
    category: 'Charity',
    amount: 100.0,
    type: 'expense',
    date: 'Sep 01',
  },
  {
    id: 'fin-3',
    title: 'Wellness Workshop Stride',
    category: 'Wellness',
    amount: 350.0,
    type: 'income',
    date: 'Aug 28',
  },
];

export const INITIAL_LIFE_DATES: LifeDate[] = [
  {
    id: 'date-1',
    title: 'Eleanor’s Birthday & Celebration',
    date: 'Oct 14, 2026',
    type: 'Birthday',
    giftIdea: 'Handmade pottery teapot & 528Hz crystal chime set',
    daysRemaining: 43,
  },
  {
    id: 'date-2',
    title: 'Wedding Anniversary',
    date: 'Nov 02, 2026',
    type: 'Anniversary',
    giftIdea: 'Weekend mountain retreat cabin booking',
    daysRemaining: 62,
  },
];

export const INITIAL_VAULT_DOCS: VaultDoc[] = [
  {
    id: 'doc-1',
    title: 'Family Health Insurance Policy Scan',
    category: 'Medical',
    expiryDate: 'Dec 2027',
    isEncrypted: true,
    size: '2.4 MB',
  },
  {
    id: 'doc-2',
    title: 'Emergency Medical Directives & Powers',
    category: 'Identity',
    expiryDate: 'Permanent',
    isEncrypted: true,
    size: '1.1 MB',
  },
  {
    id: 'doc-3',
    title: 'Vehicle Registration & Clean Title',
    category: 'Property',
    expiryDate: 'Jan 2027',
    isEncrypted: true,
    size: '850 KB',
  },
];
