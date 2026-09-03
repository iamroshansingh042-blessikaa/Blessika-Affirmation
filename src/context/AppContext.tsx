import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Affirmation,
  AppStage,
  ArtTheme,
  ChallengeTrack,
  CircleMember,
  FinanceEntry,
  GardenPlant,
  Language,
  LifeDate,
  MedicineItem,
  MoodLog,
  NavTab,
  PetRecord,
  ProfileType,
  ScratchReward,
  SoundType,
  UserProfile,
  VaultDoc,
  VehicleRecord,
} from '../types';
import { ART_THEMES } from '../data/artThemesData';
import { SUPPORTED_LANGUAGES, UI_STRINGS } from '../i18n/translations';
import {
  CHALLENGE_TRACKS,
  INITIAL_AFFIRMATIONS,
  INITIAL_CIRCLE_MEMBERS,
  INITIAL_FINANCES,
  INITIAL_GARDEN_PLANTS,
  INITIAL_LIFE_DATES,
  INITIAL_MEDICINES,
  INITIAL_MOOD_LOGS,
  INITIAL_PETS,
  INITIAL_SCRATCH_REWARD,
  INITIAL_VAULT_DOCS,
  INITIAL_VEHICLES,
} from '../data/seedData';
import { soundEngine } from '../services/audioSynthesizer';

interface AppContextType {
  // Navigation & Screen flow
  stage: AppStage;
  setStage: (stage: AppStage) => void;
  navTab: NavTab;
  setNavTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Audio mute
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  toggleMute: () => boolean;

  // i18n
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Profile & Auth
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchProfile: (role: ProfileType) => void;
  setPinCode: (pin: string) => void;
  verifyPin: (pin: string) => boolean;

  // Art Theme & Custom Themes
  activeThemeId: string;
  setActiveThemeId: (id: string) => void;
  customThemes: ArtTheme[];
  addCustomTheme: (theme: ArtTheme) => void;
  activeArtTheme: ArtTheme;

  // Affirmation Deck
  affirmations: Affirmation[];
  activeAffirmationIndex: number;
  setActiveAffirmationIndex: (idx: number) => void;
  toggleFavoriteAffirmation: (id: string) => void;
  journalEntries: Record<string, string>;
  saveJournalEntry: (affId: string, entry: string) => void;

  // 21-Day Challenge
  challengeTracks: ChallengeTrack[];
  activeTrackId: string;
  setActiveTrackId: (id: string) => void;
  toggleTaskCompletion: (day: number) => void;

  // Scratch Reward
  scratchReward: ScratchReward;
  claimScratchReward: () => void;

  // Life360 Circle
  circleMembers: CircleMember[];
  sendLoveToMember: (id: string) => void;
  broadcastSos: () => void;
  isSosActive: boolean;
  setIsSosActive: (val: boolean) => void;

  // Audio Studio
  activeAmbient: SoundType | null;
  ambientVolume: number;
  playAmbientSound: (type: SoundType) => void;
  stopAmbientSound: () => void;
  setAmbientVolume: (vol: number) => void;
  sleepTimer: number; // in mins, 0 for off
  setSleepTimer: (mins: number) => void;

  // 8 Life Services State & Handlers
  medicines: MedicineItem[];
  toggleMedicineTaken: (id: string) => void;
  addMedicine: (item: Omit<MedicineItem, 'id'>) => void;

  moodLogs: MoodLog[];
  addMoodLog: (log: Omit<MoodLog, 'id' | 'timestamp'>) => void;

  gardenPlants: GardenPlant[];
  waterPlant: (id: string) => void;
  addGardenPlant: (plant: Omit<GardenPlant, 'id'>) => void;

  vehicles: VehicleRecord[];
  updateVehicleMileage: (id: string, newMiles: number) => void;

  pets: PetRecord[];
  feedPet: (id: string) => void;

  finances: FinanceEntry[];
  addFinanceEntry: (entry: Omit<FinanceEntry, 'id' | 'date'>) => void;

  lifeDates: LifeDate[];
  addLifeDate: (date: Omit<LifeDate, 'id'>) => void;

  vaultDocs: VaultDoc[];
  addVaultDoc: (doc: Omit<VaultDoc, 'id'>) => void;

  // Onboarding Helpers
  completeOnboarding: (data: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'BLESSIKAA_STATE_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [stage, setStage] = useState<AppStage>(() => {
    try {
      const onboarded = localStorage.getItem('BLESSIKAA_ONBOARDED');
      if (onboarded === 'true') {
        return 'home';
      }
    } catch {
      // fallback
    }
    return 'splash';
  });

  const [navTab, setNavTab] = useState<NavTab>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMuted, setIsMutedState] = useState<boolean>(() => soundEngine.getMuted());

  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const savedCode = localStorage.getItem(LOCAL_STORAGE_KEY + '_LANG');
      if (savedCode) {
        const found = SUPPORTED_LANGUAGES.find((l) => l.code === savedCode);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return SUPPORTED_LANGUAGES[0];
  });

  const setIsMuted = (val: boolean) => {
    setIsMutedState(val);
    soundEngine.setMuted(val);
  };

  const toggleMute = (): boolean => {
    const next = soundEngine.toggleMute();
    setIsMutedState(next);
    return next;
  };

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_USER');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      id: 'usr-1',
      name: 'Elena Vance',
      role: 'personal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: 'elena.vance@sanctuary.app',
      streakCount: 5,
      karmaPoints: 420,
      pinCode: '1234',
      biometricsEnabled: true,
      selectedTrackId: 'morning-meditation',
      currentDay: 4,
      completedDays: [1, 2, 3],
      intentions: ['Mindfulness', 'Family Safety', 'Habit Discipline'],
      preferredFrequency: 528,
      reminderTimes: ['08:00 AM', '09:00 PM'],
      circleCode: 'BLESSED-7749',
    };
  });

  const [affirmations, setAffirmations] = useState<Affirmation[]>(INITIAL_AFFIRMATIONS);
  const [activeAffirmationIndex, setActiveAffirmationIndex] = useState<number>(0);
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});

  const [challengeTracks, setChallengeTracks] = useState<ChallengeTrack[]>(CHALLENGE_TRACKS);
  const [activeTrackId, setActiveTrackId] = useState<string>('morning-meditation');

  const [scratchReward, setScratchReward] = useState<ScratchReward>(INITIAL_SCRATCH_REWARD);
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>(INITIAL_CIRCLE_MEMBERS);
  const [isSosActive, setIsSosActive] = useState<boolean>(false);

  const [activeAmbient, setActiveAmbient] = useState<SoundType | null>(null);
  const [ambientVolume, setAmbientVol] = useState<number>(0.65);
  const [sleepTimer, setSleepTimerMins] = useState<number>(0);

  // 8 Life Directory states
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(INITIAL_MOOD_LOGS);
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>(INITIAL_GARDEN_PLANTS);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(INITIAL_VEHICLES);
  const [pets, setPets] = useState<PetRecord[]>(INITIAL_PETS);
  const [finances, setFinances] = useState<FinanceEntry[]>(INITIAL_FINANCES);
  const [lifeDates, setLifeDates] = useState<LifeDate[]>(INITIAL_LIFE_DATES);
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>(INITIAL_VAULT_DOCS);

  // Art Theme & Custom Themes State
  const [customThemes, setCustomThemes] = useState<ArtTheme[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_CUSTOM_THEMES');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [activeThemeId, setActiveThemeIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_ACTIVE_THEME');
      if (saved) return saved;
    } catch {
      // fallback
    }
    return 'theme-all-ivory-script';
  });

  const setActiveThemeId = (id: string) => {
    setActiveThemeIdState(id);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_ACTIVE_THEME', id);
    } catch {
      // ignore
    }
  };

  const addCustomTheme = (theme: ArtTheme) => {
    setCustomThemes((prev) => {
      const updated = [theme, ...prev.filter((t) => t.id !== theme.id)];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY + '_CUSTOM_THEMES', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setActiveThemeId(theme.id);
  };

  const allAvailableThemes = [...customThemes, ...ART_THEMES];
  const activeArtTheme = allAvailableThemes.find((t) => t.id === activeThemeId) || ART_THEMES[ART_THEMES.length - 1];

  // Sync user state to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_USER', JSON.stringify(user));
  }, [user]);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync RTL direction
  useEffect(() => {
    document.documentElement.setAttribute('dir', currentLang.dir);
  }, [currentLang]);

  // Translation helper
  const t = (key: string): string => {
    const langKey = currentLang.code;
    if (UI_STRINGS[langKey] && UI_STRINGS[langKey][key]) {
      return UI_STRINGS[langKey][key];
    }
    return UI_STRINGS['en'][key] || key;
  };

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_LANG', lang.code);
    } catch {
      // ignore
    }
    soundEngine.playHapticTone();
  };

  const switchProfile = (role: ProfileType) => {
    soundEngine.playTone(600, 0.2);
    const roleNames: Record<ProfileType, { name: string; avatar: string }> = {
      personal: {
        name: 'Elena (Personal)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      partner: {
        name: 'Julian (Partner)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      child: {
        name: 'Liam (Child)',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      },
      caregiver: {
        name: 'Nurse Sarah (Caregiver)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
      elderly: {
        name: 'Grandma Maya (Elderly)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      },
    };

    const target = roleNames[role];
    setUser((prev) => ({
      ...prev,
      role,
      name: target.name,
      avatar: target.avatar,
    }));
  };

  const setPinCode = (pin: string) => {
    setUser((prev) => ({ ...prev, pinCode: pin }));
  };

  const verifyPin = (pin: string): boolean => {
    return (user.pinCode || '1234') === pin;
  };

  const toggleFavoriteAffirmation = (id: string) => {
    soundEngine.playTone(880, 0.15);
    setAffirmations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const saveJournalEntry = (affId: string, entry: string) => {
    setJournalEntries((prev) => ({ ...prev, [affId]: entry }));
    setUser((prev) => ({ ...prev, karmaPoints: prev.karmaPoints + 15 }));
    soundEngine.playSingingBowl(528);
  };

  const toggleTaskCompletion = (day: number) => {
    setChallengeTracks((prev) =>
      prev.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          tasks: track.tasks.map((task) => {
            if (task.day === day) {
              const nowCompleted = !task.completed;
              if (nowCompleted) {
                soundEngine.playSingingBowl(528);
                setUser((u) => ({
                  ...u,
                  karmaPoints: u.karmaPoints + task.xp,
                  completedDays: Array.from(new Set([...u.completedDays, day])),
                  streakCount: u.streakCount + 1,
                }));
              } else {
                setUser((u) => ({
                  ...u,
                  completedDays: u.completedDays.filter((d) => d !== day),
                }));
              }
              return { ...task, completed: nowCompleted };
            }
            return task;
          }),
        };
      })
    );
  };

  const claimScratchReward = () => {
    if (scratchReward.isRevealed) return;
    setScratchReward((prev) => ({ ...prev, isRevealed: true }));
    setUser((prev) => ({
      ...prev,
      karmaPoints: prev.karmaPoints + scratchReward.amount,
      streakCount: prev.streakCount + 1,
    }));
    soundEngine.playSingingBowl(528);
  };

  const sendLoveToMember = (id: string) => {
    soundEngine.playTone(784, 0.25);
    setCircleMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, loveCount: m.loveCount + 1 } : m))
    );
    setUser((prev) => ({ ...prev, karmaPoints: prev.karmaPoints + 5 }));
  };

  const broadcastSos = () => {
    setIsSosActive(true);
    soundEngine.playTone(900, 0.5, 'sawtooth');
  };

  const playAmbientSound = (type: SoundType) => {
    if (activeAmbient === type) {
      stopAmbientSound();
    } else {
      setActiveAmbient(type);
      soundEngine.startAmbient(type, ambientVolume);
    }
  };

  const stopAmbientSound = () => {
    setActiveAmbient(null);
    soundEngine.stopAmbient();
  };

  const setAmbientVolume = (vol: number) => {
    setAmbientVol(vol);
    soundEngine.setAmbientVolume(vol);
  };

  const setSleepTimer = (mins: number) => {
    setSleepTimerMins(mins);
    soundEngine.setSleepTimer(mins, () => {
      setActiveAmbient(null);
    });
  };

  // 8 Life Services CRUD Handlers
  const toggleMedicineTaken = (id: string) => {
    soundEngine.playHapticTone();
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              takenToday: !m.takenToday,
              remainingPills: !m.takenToday ? Math.max(0, m.remainingPills - 1) : m.remainingPills + 1,
            }
          : m
      )
    );
  };

  const addMedicine = (item: Omit<MedicineItem, 'id'>) => {
    const newItem: MedicineItem = {
      ...item,
      id: 'med-' + Date.now(),
    };
    setMedicines((prev) => [newItem, ...prev]);
    soundEngine.playTone(600, 0.2);
  };

  const addMoodLog = (log: Omit<MoodLog, 'id' | 'timestamp'>) => {
    const newLog: MoodLog = {
      ...log,
      id: 'mood-' + Date.now(),
      timestamp: 'Just now',
    };
    setMoodLogs((prev) => [newLog, ...prev]);
    setUser((u) => ({ ...u, karmaPoints: u.karmaPoints + 20 }));
    soundEngine.playSingingBowl(528);
  };

  const waterPlant = (id: string) => {
    soundEngine.playTone(528, 0.3);
    setGardenPlants((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              lastWatered: 'Today',
              nextWaterInDays: 3,
              health: 'Thriving',
            }
          : p
      )
    );
  };

  const addGardenPlant = (plant: Omit<GardenPlant, 'id'>) => {
    const newPlant: GardenPlant = {
      ...plant,
      id: 'plant-' + Date.now(),
    };
    setGardenPlants((prev) => [newPlant, ...prev]);
    soundEngine.playTone(528, 0.2);
  };

  const updateVehicleMileage = (id: string, newMiles: number) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, mileage: newMiles } : v))
    );
    soundEngine.playHapticTone();
  };

  const feedPet = (id: string) => {
    soundEngine.playTone(650, 0.2);
    setPets((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, nextMealTime: 'Tomorrow 08:00 AM' } : p
      )
    );
    setUser((u) => ({ ...u, karmaPoints: u.karmaPoints + 10 }));
  };

  const addFinanceEntry = (entry: Omit<FinanceEntry, 'id' | 'date'>) => {
    const newEntry: FinanceEntry = {
      ...entry,
      id: 'fin-' + Date.now(),
      date: 'Today',
    };
    setFinances((prev) => [newEntry, ...prev]);
    soundEngine.playHapticTone();
  };

  const addLifeDate = (date: Omit<LifeDate, 'id'>) => {
    const newDate: LifeDate = {
      ...date,
      id: 'date-' + Date.now(),
    };
    setLifeDates((prev) => [newDate, ...prev]);
    soundEngine.playTone(528, 0.2);
  };

  const addVaultDoc = (doc: Omit<VaultDoc, 'id'>) => {
    const newDoc: VaultDoc = {
      ...doc,
      id: 'doc-' + Date.now(),
    };
    setVaultDocs((prev) => [newDoc, ...prev]);
    soundEngine.playTone(528, 0.2);
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    setStage('home');
    soundEngine.playSingingBowl(528);
  };

  return (
    <AppContext.Provider
      value={{
        stage,
        setStage,
        navTab,
        setNavTab,
        isDarkMode,
        setIsDarkMode,
        isMuted,
        setIsMuted,
        toggleMute,
        currentLang,
        setLanguage,
        t,
        user,
        setUser,
        switchProfile,
        setPinCode,
        verifyPin,
        activeThemeId,
        setActiveThemeId,
        customThemes,
        addCustomTheme,
        activeArtTheme,
        affirmations,
        activeAffirmationIndex,
        setActiveAffirmationIndex,
        toggleFavoriteAffirmation,
        journalEntries,
        saveJournalEntry,
        challengeTracks,
        activeTrackId,
        setActiveTrackId,
        toggleTaskCompletion,
        scratchReward,
        claimScratchReward,
        circleMembers,
        sendLoveToMember,
        broadcastSos,
        isSosActive,
        setIsSosActive,
        activeAmbient,
        ambientVolume,
        playAmbientSound,
        stopAmbientSound,
        setAmbientVolume,
        sleepTimer,
        setSleepTimer,
        medicines,
        toggleMedicineTaken,
        addMedicine,
        moodLogs,
        addMoodLog,
        gardenPlants,
        waterPlant,
        addGardenPlant,
        vehicles,
        updateVehicleMileage,
        pets,
        feedPet,
        finances,
        addFinanceEntry,
        lifeDates,
        addLifeDate,
        vaultDocs,
        addVaultDoc,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
