import { useState, useEffect } from 'react';

// Breathing pattern types
type BreathingPattern = {
  id: string;
  name: string;
  description: string;
  phases: {
    name: BreathingPhase;
    duration: number;
  }[];
};

// Breathing phase types
type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest' | 'idle';

// Predefined breathing patterns
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'basic',
    name: '4-4-4-2 Basic',
    description: 'Balanced breathing for general relaxation',
    phases: [
      { name: 'inhale', duration: 4 },
      { name: 'hold', duration: 4 },
      { name: 'exhale', duration: 4 },
      { name: 'rest', duration: 2 }
    ]
  },
  {
    id: 'calm',
    name: '4-7-8 Calm',
    description: 'Deep relaxation and stress reduction',
    phases: [
      { name: 'inhale', duration: 4 },
      { name: 'hold', duration: 7 },
      { name: 'exhale', duration: 8 },
      { name: 'rest', duration: 2 }
    ]
  },
  {
    id: 'energize',
    name: '3-3-3-1 Energize',
    description: 'Quick breathing to boost alertness',
    phases: [
      { name: 'inhale', duration: 3 },
      { name: 'hold', duration: 3 },
      { name: 'exhale', duration: 3 },
      { name: 'rest', duration: 1 }
    ]
  }
];

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);

  // Configuration
  const totalCycles = 3;
  const maxCycles = 5;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Transition to next phase
      const currentPhaseIndex = selectedPattern.phases.findIndex(p => p.name === phase);
      const nextPhaseIndex = (currentPhaseIndex + 1) % selectedPattern.phases.length;
      const nextPhase = selectedPattern.phases[nextPhaseIndex].name;
      const nextDuration = selectedPattern.phases[nextPhaseIndex].duration;

      setPhase(nextPhase);
      setTimeLeft(nextDuration);

      if (nextPhase === 'rest') {
        if (cycles + 1 < totalCycles) {
          setCycles(c => c + 1);
        } else {
          setIsActive(false);
          setPhase('idle');
          setCycles(0);
        }
      }
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, phase, cycles, selectedPattern]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(selectedPattern.phases[0].duration);
    setCycles(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('idle');
    setTimeLeft(0);
    setCycles(0);
  };

  const getProgressPercentage = () => {
    if (phase === 'idle') return 0;
    const currentPhase = selectedPattern.phases.find(p => p.name === phase);
    return currentPhase ? ((currentPhase.duration - timeLeft) / currentPhase.duration) * 100 : 0;
  };

  const phaseColors = {
    inhale: 'text-green-500',
    hold: 'text-blue-500',
    exhale: 'text-red-500',
    rest: 'text-purple-500',
    idle: 'text-neutral-500'
  };

  const phaseDescriptions = {
    inhale: 'Breathe in slowly and deeply',
    hold: 'Hold your breath gently',
    exhale: 'Slowly release the breath',
    rest: 'Pause and relax',
    idle: 'Ready to begin'
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
          Breathing Exercise
        </h3>
        
        {/* Pattern Selector */}
        <div className="relative">
          <select 
            value={selectedPattern.id}
            onChange={(e) => {
              const pattern = BREATHING_PATTERNS.find(p => p.id === e.target.value);
              if (pattern) setSelectedPattern(pattern);
            }}
            disabled={isActive}
            className="bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg px-3 py-1 text-sm"
          >
            {BREATHING_PATTERNS.map(pattern => (
              <option key={pattern.id} value={pattern.id}>
                {pattern.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pattern Description */}
      <div className="text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {selectedPattern.description}
        </p>
      </div>

      {/* Timer and Visualization */}
      <div className="flex flex-col items-center space-y-4">
        {/* Circular Progress */}
        <div className="relative w-56 h-56">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-neutral-200 dark:text-neutral-700"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray="628"
              strokeDashoffset={628 - (628 * getProgressPercentage()) / 100}
              className={`${phaseColors[phase]} transition-all duration-300`}
            />
          </svg>
          
          {/* Central Information */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">
              {timeLeft}
            </div>
            <div className={`text-sm font-medium ${phaseColors[phase]}`}>
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </div>
          </div>
        </div>

        {/* Phase Description */}
        <p className="text-neutral-600 dark:text-neutral-300 text-center max-w-xs">
          {phaseDescriptions[phase]}
        </p>

        {/* Cycle Indicator */}
        {isActive && (
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Cycle {cycles + 1} of {totalCycles}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!isActive ? (
          <button
            onClick={startExercise}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopExercise}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
