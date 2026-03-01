import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import DemoProgressBar from './components/DemoProgressBar';
import IntroScene from './scenes/IntroScene';
import GuestScene from './scenes/GuestScene';
import TeamScene from './scenes/TeamScene';
import PlansScene from './scenes/PlansScene';
import OutroScene from './scenes/OutroScene';

const SCENE_TIMINGS = [10, 15, 15, 10, 10]; // seconds per scene
const TOTAL_DURATION = SCENE_TIMINGS.reduce((a, b) => a + b, 0);

const scenes = [IntroScene, GuestScene, TeamScene, PlansScene, OutroScene];
const sceneLabels = ['Intro', 'Guest', 'Team', 'Plans', 'Outro'];

const DemoVideo: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getSceneStart = (sceneIndex: number) =>
    SCENE_TIMINGS.slice(0, sceneIndex).reduce((a, b) => a + b, 0);

  const progress = (elapsed / TOTAL_DURATION) * 100;

  // Timer
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 0.1;
        if (next >= TOTAL_DURATION) {
          setIsPaused(true);
          return TOTAL_DURATION;
        }
        return next;
      });
    }, 100);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused]);

  // Determine current scene from elapsed
  useEffect(() => {
    let acc = 0;
    for (let i = 0; i < SCENE_TIMINGS.length; i++) {
      acc += SCENE_TIMINGS[i];
      if (elapsed < acc) {
        setCurrentScene(i);
        return;
      }
    }
    setCurrentScene(SCENE_TIMINGS.length - 1);
  }, [elapsed]);

  const jumpToScene = useCallback((index: number) => {
    setElapsed(getSceneStart(index));
    setCurrentScene(index);
    setIsPaused(false);
  }, []);

  const replay = useCallback(() => {
    setElapsed(0);
    setCurrentScene(0);
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    if (elapsed >= TOTAL_DURATION) {
      replay();
    } else {
      setIsPaused(p => !p);
    }
  }, [elapsed, replay]);

  const CurrentScene = scenes[currentScene];

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] overflow-hidden select-none">
      <DemoProgressBar progress={progress} isPaused={isPaused} />

      {/* Scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CurrentScene />
        </motion.div>
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        {/* Play/Pause */}
        <button
          onClick={togglePause}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Scene dots */}
        <div className="flex gap-2">
          {sceneLabels.map((label, i) => (
            <button
              key={label}
              onClick={() => jumpToScene(i)}
              className="group flex flex-col items-center gap-1"
              title={label}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentScene
                    ? 'bg-primary scale-125'
                    : i < currentScene
                    ? 'bg-primary/40'
                    : 'bg-white/20'
                }`}
              />
              <span className="text-[9px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Replay */}
        <button
          onClick={replay}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DemoVideo;
