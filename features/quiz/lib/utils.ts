export const getScoreInfo = (percentage: number) => {
  if (percentage >= 80) {
    return {
      level: "excellent",
      emoji: "🎉",
      message: "Excellent work!",
      colorClass: "text-success",
    };
  }
  if (percentage >= 60) {
    return {
      level: "good",
      emoji: "😊",
      message: "Good job!",
      colorClass: "text-warning",
    };
  }
  return {
    level: "needsPractice",
    emoji: "📚",
    message: "Keep practicing!",
    colorClass: "text-destructive",
  };
};
