
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  topic: string;
}

export interface Answer {
  question: string;
  selectedAnswer: string | null; // null if timed out
  correctAnswer: string;
  isCorrect: boolean;
}
