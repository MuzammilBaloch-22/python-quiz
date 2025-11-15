
import React, { useState, useEffect } from 'react';

interface HomeScreenProps {
  onStartQuiz: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartQuiz }) => {
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    // Load scores from LocalStorage
    const savedLastScore = localStorage.getItem('pythonQuizLastScore');
    const savedBestScore = localStorage.getItem('pythonQuizBestScore');
    if (savedLastScore) setLastScore(JSON.parse(savedLastScore));
    if (savedBestScore) setBestScore(JSON.parse(savedBestScore));
  }, []);

  return (
    <div className="text-center p-6 bg-light-bg-alt dark:bg-dark-bg-alt rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
      <p className="text-light-text-alt dark:text-dark-text-alt mb-6">
        Test your Python knowledge with 50 randomly selected questions.
      </p>
      <div className="flex justify-center space-x-4 mb-8">
        {lastScore !== null && (
          <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-md w-40">
            <div className="text-sm text-light-text-alt dark:text-dark-text-alt">Last Score</div>
            <div className="text-2xl font-bold">{lastScore} / 50</div>
          </div>
        )}
        {bestScore !== null && (
          <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-md w-40">
            <div className="text-sm text-light-text-alt dark:text-dark-text-alt">Best Score</div>
            <div className="text-2xl font-bold text-light-primary dark:text-dark-primary">{bestScore} / 50</div>
          </div>
        )}
      </div>
      <button
        onClick={onStartQuiz}
        className="w-full md:w-auto px-12 py-4 bg-light-primary dark:bg-dark-primary text-white font-bold rounded-lg text-xl hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors duration-300 transform hover:scale-105"
      >
        Start Quiz
      </button>
    </div>
  );
};
