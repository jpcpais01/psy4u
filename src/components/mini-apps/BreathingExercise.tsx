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
  // Removed maxCycles as it was unused

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
    <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-2xl space-y-6 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-6">
        {/* Pattern Selector */}
        <div className="relative w-full max-w-xs">
          <select 
            value={selectedPattern.id}
            onChange={(e) => {
              const pattern = BREATHING_PATTERNS.find(p => p.id === e.target.value);
              if (pattern) setSelectedPattern(pattern);
            }}
            disabled={isActive}
            className="w-full appearance-none bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-full px-4 py-2 text-sm font-medium cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            {BREATHING_PATTERNS.map(pattern => (
              <option key={pattern.id} value={pattern.id}>
                {pattern.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Pattern Description */}
        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-300 italic">
            {selectedPattern.description}
          </p>
        </div>

        {/* Timer and Visualization */}
        <div className="flex flex-col items-center space-y-6">
          {/* Circular Progress */}
          <div className="relative w-52 h-52 md:w-64 md:h-64">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-neutral-200 dark:text-neutral-700 opacity-50"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}%`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}%`
                }}
                className={`${phaseColors[phase]} transition-all duration-300 ease-in-out`}
              />
            </svg>
            
            {/* Central Information */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-5xl font-extrabold text-neutral-800 dark:text-neutral-100">
                {timeLeft}
              </div>
              <div className={`text-sm font-semibold uppercase tracking-wider ${phaseColors[phase]}`}>
                {phase}
              </div>
            </div>
          </div>

          {/* Phase Description */}
          <p className="text-neutral-600 dark:text-neutral-300 text-center max-w-xs text-sm">
            {phaseDescriptions[phase]}
          </p>

          {/* Cycle Indicator */}
          {isActive && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 tracking-wider">
              CYCLE {cycles + 1} OF {totalCycles}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <button
              onClick={startExercise}
              className="px-8 py-3 bg-primary text-white rounded-full text-base font-semibold hover:bg-primary/90 transition-colors duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stopExercise}
              className="px-8 py-3 bg-red-500 text-white rounded-full text-base font-semibold hover:bg-red-600 transition-colors duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
