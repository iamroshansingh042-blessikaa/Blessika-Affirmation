import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Car,
  Check,
  CheckCircle2,
  DollarSign,
  Droplet,
  FileLock,
  HeartPulse,
  Lock,
  PawPrint,
  Pill,
  Plus,
  Smile,
  Sparkles,
  Sprout,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../services/audioSynthesizer';

export const ServiceDirectoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
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
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Form states
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTime, setNewMedTime] = useState('09:00 AM');

  const [newMood, setNewMood] = useState<'Joyful' | 'Peaceful' | 'Grounded' | 'Anxious' | 'Fatigued'>('Peaceful');
  const [newMoodEnergy, setNewMoodEnergy] = useState<number>(8);
  const [newMoodCbt, setNewMoodCbt] = useState('');
  const [newMoodGratitude, setNewMoodGratitude] = useState('');

  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantVariety, setNewPlantVariety] = useState('');

  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateVal, setNewDateVal] = useState('');
  const [newDateGift, setNewDateGift] = useState('');

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'Identity' | 'Medical' | 'Insurance' | 'Property'>('Medical');

  const SERVICES = [
    {
      id: 'medicine',
      title: 'Medicine & Health Tracker',
      subtitle: `${medicines.filter((m) => m.takenToday).length}/${medicines.length} doses logged today`,
      icon: Pill,
      color: '#A84457',
      category: 'Health',
    },
    {
      id: 'mental',
      title: 'Mental Health & Mood Journal',
      subtitle: `${moodLogs.length} reflection entries recorded`,
      icon: Smile,
      color: '#8A6223',
      category: 'Health',
    },
    {
      id: 'garden',
      title: 'Garden & Farm Tracker',
      subtitle: `${gardenPlants.length} sacred crops and herbs growing`,
      icon: Sprout,
      color: '#476655',
      category: 'Living',
    },
    {
      id: 'vehicle',
      title: 'Vehicle Care & Maintenance',
      subtitle: `${vehicles[0]?.fuelLevel || 78}% fuel • Clean maintenance status`,
      icon: Car,
      color: '#A8483B',
      category: 'Living',
    },
    {
      id: 'pet',
      title: 'Pet Care Hub',
      subtitle: `${pets[0]?.petName || 'Luna'} • Feeding & Vaccine record`,
      icon: PawPrint,
      color: '#8A6223',
      category: 'Family',
    },
    {
      id: 'finance',
      title: 'Finance & Credit Ledger',
      subtitle: `$${finances.reduce((acc, curr) => (curr.type === 'expense' ? acc + curr.amount : acc), 0).toFixed(0)} spent this month`,
      icon: DollarSign,
      color: '#476655',
      category: 'Finance',
    },
    {
      id: 'dates',
      title: 'Life Dates & Anniversaries',
      subtitle: `${lifeDates[0]?.title || 'Next milestone in 43 days'}`,
      icon: Calendar,
      color: '#A84457',
      category: 'Family',
    },
    {
      id: 'vault',
      title: 'Paperless Document Vault',
      subtitle: `${vaultDocs.length} encrypted credentials locked`,
      icon: FileLock,
      color: '#6D5999',
      category: 'Security',
    },
  ];

  const handleAddMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    addMedicine({
      name: newMedName,
      dosage: newMedDosage || '1 capsule',
      time: newMedTime,
      remainingPills: 30,
      takenToday: false,
    });
    setNewMedName('');
    setNewMedDosage('');
  };

  const handleAddMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodLog({
      mood: newMood,
      energyLevel: newMoodEnergy,
      cbtThought: newMoodCbt || 'Practicing calm presence.',
      gratitudeNote: newMoodGratitude || 'Thankful for health and life.',
    });
    setNewMoodCbt('');
    setNewMoodGratitude('');
  };

  const handleAddPlantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlantName) return;
    addGardenPlant({
      name: newPlantName,
      variety: newPlantVariety || 'Organic Herb',
      lastWatered: 'Today',
      nextWaterInDays: 2,
      daysToHarvest: 30,
      health: 'Thriving',
    });
    setNewPlantName('');
    setNewPlantVariety('');
  };

  const handleAddFinanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseTitle || !newExpenseAmount) return;
    addFinanceEntry({
      title: newExpenseTitle,
      amount: parseFloat(newExpenseAmount),
      category: 'Sanctuary',
      type: 'expense',
    });
    setNewExpenseTitle('');
    setNewExpenseAmount('');
  };

  const handleAddDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateTitle) return;
    addLifeDate({
      title: newDateTitle,
      date: newDateVal || '2026-11-15',
      type: 'Milestone',
      giftIdea: newDateGift || 'Artisanal incense set',
      daysRemaining: 45,
    });
    setNewDateTitle('');
    setNewDateGift('');
  };

  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;
    addVaultDoc({
      title: newDocTitle,
      category: newDocCategory,
      expiryDate: '2027',
      isEncrypted: true,
      size: '1.2 MB',
    });
    setNewDocTitle('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md h-[88vh] sm:h-[82vh] rounded-t-3xl sm:rounded-3xl bg-[#FAF7F2] dark:bg-[#141112] text-[#1F1617] dark:text-[#FAF7F5] flex flex-col justify-between overflow-hidden shadow-2xl border border-[#EFE9DF] dark:border-[#362D30]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#EFE9DF] dark:border-[#362D30] flex items-center justify-between bg-white dark:bg-[#1E191A]">
          <div className="flex items-center space-x-2">
            {selectedService ? (
              <button
                onClick={() => {
                  soundEngine.playHapticTone();
                  setSelectedService(null);
                }}
                className="text-xs font-semibold text-[#8A6223] hover:underline mr-1"
              >
                ← Back
              </button>
            ) : null}
            <h3 className="text-base font-playfair font-semibold">
              {selectedService
                ? SERVICES.find((s) => s.id === selectedService)?.title
                : 'Universal Life Directory'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF7F2] dark:hover:bg-[#262022] text-[#7C706D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Directory Grid View or Specialized Service Sub-view */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto no-scrollbar space-y-4">
          {!selectedService ? (
            /* 8 Cards Directory Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((srv) => {
                const IconComp = srv.icon;
                return (
                  <motion.div
                    key={srv.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      soundEngine.playTone(528, 0.2);
                      setSelectedService(srv.id);
                    }}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] shadow-xs hover:border-[#8A6223]/50 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: srv.color }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#262022] text-[#7C706D]">
                        {srv.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#1F1617] dark:text-[#FAF7F5]">
                        {srv.title}
                      </h4>
                      <p className="mt-1 text-xs text-[#7C706D] dark:text-[#A89F9E]">
                        {srv.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Service Specialized Sub-Views */
            <div className="space-y-4">
              {/* 1. Medicine & Health Tracker */}
              {selectedService === 'medicine' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#A84457]">
                      Today’s Schedule & Pill Dispenser
                    </h4>
                    <div className="space-y-2">
                      {medicines.map((med) => (
                        <div
                          key={med.id}
                          onClick={() => toggleMedicineTaken(med.id)}
                          className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF] dark:border-[#362D30] flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-semibold">{med.name}</div>
                            <div className="text-[11px] text-[#7C706D]">
                              {med.dosage} • {med.time} • {med.remainingPills} pills left
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              med.takenToday
                                ? 'bg-[#476655] text-white'
                                : 'border-2 border-[#8A6223] text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Pill Form */}
                  <form
                    onSubmit={handleAddMedSubmit}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] space-y-2"
                  >
                    <h5 className="text-xs font-bold text-[#8A6223]">Add Supplement or Rx</h5>
                    <input
                      type="text"
                      placeholder="Medication name (e.g. Zinc, B12)"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF] dark:border-[#362D30]"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 50mg)"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        className="flex-1 p-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF] dark:border-[#362D30]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#A84457] text-white text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 2. Mental Health & Mood Journal */}
              {selectedService === 'mental' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A6223]">
                      Mood Log & CBT Reflection
                    </h4>
                    <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-1">
                      {(['Joyful', 'Peaceful', 'Grounded', 'Anxious', 'Fatigued'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setNewMood(m)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            newMood === m ? 'bg-[#8A6223] text-white' : 'bg-[#FAF7F2] dark:bg-[#262022] text-[#7C706D]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-[#7C706D]">Energy Level: {newMoodEnergy}/10</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newMoodEnergy}
                        onChange={(e) => setNewMoodEnergy(parseInt(e.target.value))}
                        className="w-full accent-[#8A6223]"
                      />
                    </div>

                    <textarea
                      placeholder="CBT Thought Reframing: What thought did you replace with peace?"
                      value={newMoodCbt}
                      onChange={(e) => setNewMoodCbt(e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF] dark:border-[#362D30]"
                    />

                    <button
                      type="button"
                      onClick={handleAddMoodSubmit}
                      className="w-full py-2 rounded-xl bg-[#8A6223] text-white text-xs font-semibold"
                    >
                      Save Mood Entry (+20 Karma)
                    </button>
                  </div>

                  {/* Mood History */}
                  <div className="space-y-2">
                    {moodLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-[#8A6223]">{log.mood} (Energy {log.energyLevel}/10)</span>
                          <span className="text-[#7C706D] font-normal">{log.timestamp}</span>
                        </div>
                        <p className="text-[#7C706D]">{log.cbtThought}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Garden & Farm Tracker */}
              {selectedService === 'garden' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {gardenPlants.map((plant) => (
                      <div
                        key={plant.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold">{plant.name}</div>
                          <div className="text-[11px] text-[#7C706D]">
                            {plant.variety} • Last watered: {plant.lastWatered} • {plant.daysToHarvest}d to harvest
                          </div>
                          <span className="text-[10px] font-semibold text-[#476655]">{plant.health}</span>
                        </div>
                        <button
                          onClick={() => waterPlant(plant.id)}
                          className="px-3 py-1.5 rounded-full bg-[#476655] text-white text-xs flex items-center space-x-1"
                        >
                          <Droplet className="w-3 h-3" />
                          <span>Water</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Plant */}
                  <form
                    onSubmit={handleAddPlantSubmit}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] space-y-2"
                  >
                    <h5 className="text-xs font-bold text-[#476655]">Add Plant or Crop</h5>
                    <input
                      type="text"
                      placeholder="Plant name (e.g. Lavender, Sage)"
                      value={newPlantName}
                      onChange={(e) => setNewPlantName(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-[#476655] text-white text-xs font-semibold"
                    >
                      Plant in Sanctuary Garden
                    </button>
                  </form>
                </div>
              )}

              {/* 4. Vehicle Care */}
              {selectedService === 'vehicle' && (
                <div className="space-y-4">
                  {vehicles.map((veh) => (
                    <div
                      key={veh.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{veh.vehicleName || 'Sanctuary Hybrid Wagon'}</span>
                        <span className="text-xs font-mono text-[#7C706D]">{veh.plate}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-[#7C706D]">
                        <div>Fuel / Battery: <strong className="text-[#476655]">{veh.fuelLevel}%</strong></div>
                        <div>Odometer: <strong className="text-[#1F1617] dark:text-[#FAF7F5]">{veh.mileage} mi</strong></div>
                        <div>Next Oil Change: <strong>{veh.nextOilChangeMiles} mi</strong></div>
                        <div>Insurance Expiry: <strong>{veh.insuranceExpiry}</strong></div>
                      </div>
                      <button
                        onClick={() => updateVehicleMileage(veh.id, veh.mileage + 50)}
                        className="w-full py-2 rounded-xl bg-[#A8483B] text-white text-xs font-semibold"
                      >
                        Log +50 Miles Drive
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Pet Care Hub */}
              {selectedService === 'pet' && (
                <div className="space-y-4">
                  {pets.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#8A6223]">{p.petName} ({p.species})</span>
                        <span className="text-xs text-[#7C706D]">{p.weightKg} kg</span>
                      </div>
                      <div className="text-xs text-[#7C706D] space-y-1">
                        <div>Next Feeding: <strong>{p.nextMealTime}</strong></div>
                        <div>Next Vaccine: <strong>{p.nextVaccineDate}</strong></div>
                        <div>Vet Contact: <strong>{p.vetContact}</strong></div>
                      </div>
                      <button
                        onClick={() => feedPet(p.id)}
                        className="w-full py-2 rounded-xl bg-[#8A6223] text-white text-xs font-semibold flex items-center justify-center space-x-1"
                      >
                        <PawPrint className="w-3.5 h-3.5" />
                        <span>Feed {p.petName} (+10 Karma)</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Finance & Credit Ledger */}
              {selectedService === 'finance' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {finances.map((fin) => (
                      <div
                        key={fin.id}
                        className="p-3 rounded-xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold">{fin.title}</div>
                          <div className="text-[#7C706D]">{fin.category} • {fin.date}</div>
                        </div>
                        <span className={`font-bold font-mono ${fin.type === 'income' ? 'text-[#476655]' : 'text-[#A8483B]'}`}>
                          {fin.type === 'income' ? '+' : '-'}${fin.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleAddFinanceSubmit}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] space-y-2"
                  >
                    <h5 className="text-xs font-bold text-[#476655]">Log New Sanctuary Expense</h5>
                    <input
                      type="text"
                      placeholder="Expense title"
                      value={newExpenseTitle}
                      onChange={(e) => setNewExpenseTitle(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF]"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Amount ($)"
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                        className="flex-1 p-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#476655] text-white text-xs font-semibold"
                      >
                        Log
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 7. Life Dates & Anniversaries */}
              {selectedService === 'dates' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {lifeDates.map((date) => (
                      <div
                        key={date.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#A84457]">{date.title}</span>
                          <span className="font-mono text-[#8A6223]">{date.daysRemaining} days left</span>
                        </div>
                        <div className="text-[11px] text-[#7C706D]">Date: {date.date}</div>
                        <div className="text-[11px] text-[#7C706D]">Gift Idea: {date.giftIdea}</div>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleAddDateSubmit}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] space-y-2"
                  >
                    <h5 className="text-xs font-bold text-[#A84457]">Add Milestone Date</h5>
                    <input
                      type="text"
                      placeholder="Title (e.g. Maya's Graduation)"
                      value={newDateTitle}
                      onChange={(e) => setNewDateTitle(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-[#A84457] text-white text-xs font-semibold"
                    >
                      Save Anniversary
                    </button>
                  </form>
                </div>
              )}

              {/* 8. Paperless Document Vault */}
              {selectedService === 'vault' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {vaultDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] dark:border-[#362D30] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4 text-[#6D5999]" />
                          <div>
                            <div className="font-semibold">{doc.title}</div>
                            <div className="text-[10px] text-[#7C706D]">{doc.category} • {doc.size} • Encrypted</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6D5999]/10 text-[#6D5999] font-bold">
                          AES-256
                        </span>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleAddDocSubmit}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E191A] border border-[#EFE9DF] space-y-2"
                  >
                    <h5 className="text-xs font-bold text-[#6D5999]">Secure New Document</h5>
                    <input
                      type="text"
                      placeholder="Doc name (e.g. Passport scan)"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#262022] border border-[#EFE9DF]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-[#6D5999] text-white text-xs font-semibold"
                    >
                      Encrypt & Upload to Vault
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
