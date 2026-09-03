export type AppStage =
  | 'splash'
  | 'language'
  | 'features'
  | 'onboarding'
  | 'auth'
  | 'pin_lock'
  | 'home';

export type NavTab = 'home' | 'category' | 'magic_max' | 'my_art' | 'profile';

export interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  color: string;
  bgGradient: string;
  affirmationCount: number;
  tags: string[];
  description: string;
}

export interface ArtCard {
  id: string;
  title: string;
  quote: string;
  category: string;
  bgGradient: string;
  fontStyle: string;
  aspectRatio: string;
  likes: number;
  isFavorite: boolean;
  themeColor: string;
  createdDate: string;
}

export type ThemeCategory = 'all' | 'colors' | 'gradients' | 'images';

export interface ArtTheme {
  id: string;
  name: string;
  category: 'colors' | 'gradients' | 'images';
  type: 'color' | 'gradient' | 'image' | 'special';
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  patternType?: 'none' | 'butterfly' | 'stars' | 'botanical' | 'waves' | 'rainbow' | 'clouds';
  textColor: string;
  fontFamily: string;
  fontWeight?: string;
  textShadow?: string;
  accentColor?: string;
  sampleText?: string;
  isCustom?: boolean;
}

export type ProfileType = 'personal' | 'partner' | 'child' | 'caregiver' | 'elderly';

export interface UserProfile {
  id: string;
  name: string;
  role: ProfileType;
  avatar: string;
  email?: string;
  phone?: string;
  streakCount: number;
  karmaPoints: number;
  pinCode?: string;
  biometricsEnabled: boolean;
  selectedTrackId: string;
  currentDay: number;
  completedDays: number[];
  intentions: string[];
  preferredFrequency: number;
  reminderTimes: string[];
  circleCode: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  phonetic: string;
  previewQuote: string;
  dir: 'ltr' | 'rtl';
}

export interface FeatureSlide {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badgeColor: string;
}

export interface Affirmation {
  id: string;
  theme: string;
  quote: string;
  author: string;
  mantra: string;
  frequencyHz: number;
  journalPrompt: string;
  isFavorite: boolean;
  category: 'Mindfulness' | 'Abundance' | 'Family Safety' | 'Vitality' | 'Gratitude';
}

export interface QuestTask {
  day: number;
  title: string;
  action: string;
  reflection: string;
  completed: boolean;
  xp: number;
  badge?: string;
}

export interface ChallengeTrack {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  category: string;
  tasks: QuestTask[];
}

export interface CircleMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  battery: number;
  isCharging: boolean;
  locationStatus: 'At Home' | 'In Transit' | 'At Work' | 'At School' | 'Safe Zone';
  address: string;
  lastUpdated: string;
  loveCount: number;
}

export interface ScratchReward {
  id: string;
  title: string;
  rewardText: string;
  bonusType: 'karma' | 'streak' | 'blessing' | 'gem';
  amount: number;
  isRevealed: boolean;
  code: string;
}

export type SoundType = 'rain' | 'waves' | 'birds' | 'solfeggio' | 'crystal';

export interface SoundTrack {
  id: SoundType;
  name: string;
  frequency: string;
  description: string;
  icon: string;
}

// 8 Universal Services Types
export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  time: string;
  remainingPills: number;
  takenToday: boolean;
}

export interface MoodLog {
  id: string;
  timestamp: string;
  mood: 'Joyful' | 'Peaceful' | 'Grounded' | 'Anxious' | 'Fatigued';
  energyLevel: number; // 1-10
  cbtThought: string;
  gratitudeNote: string;
}

export interface GardenPlant {
  id: string;
  name: string;
  variety: string;
  lastWatered: string;
  nextWaterInDays: number;
  daysToHarvest: number;
  health: 'Thriving' | 'Needs Water' | 'Flowering';
}

export interface VehicleRecord {
  id: string;
  vehicleName: string;
  plate: string;
  fuelLevel: number; // percentage
  mileage: number;
  nextOilChangeMiles: number;
  insuranceExpiry: string;
}

export interface PetRecord {
  id: string;
  petName: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Rabbit';
  nextMealTime: string;
  nextVaccineDate: string;
  vetContact: string;
  weightKg: number;
}

export interface FinanceEntry {
  id: string;
  title: string;
  category: 'Sanctuary' | 'Family' | 'Wellness' | 'Savings' | 'Charity';
  amount: number;
  type: 'expense' | 'income';
  date: string;
}

export interface LifeDate {
  id: string;
  title: string;
  date: string;
  type: 'Birthday' | 'Anniversary' | 'Ceremony' | 'Milestone';
  giftIdea: string;
  daysRemaining: number;
}

export interface VaultDoc {
  id: string;
  title: string;
  category: 'Identity' | 'Medical' | 'Insurance' | 'Property';
  expiryDate: string;
  isEncrypted: boolean;
  size: string;
}
