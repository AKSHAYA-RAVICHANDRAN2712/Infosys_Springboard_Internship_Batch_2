class ConvergenceDetector:
    def __init__(self, threshold: float = 0.001, stable_rounds: int = 2):
        self.threshold = threshold
        self.stable_rounds_required = stable_rounds
        self.stable_round_count = 0

    def update(self, current_accuracy, previous_accuracy):
        if previous_accuracy is None:
            improvement = 0.0
            stable = False
        else:
            improvement = current_accuracy - previous_accuracy
            stable = abs(improvement) <= self.threshold

        if stable:
            self.stable_round_count += 1
        else:
            self.stable_round_count = 0

        return {
            "improvement": improvement,
            "stable": stable,
            "converged": self.stable_round_count >= self.stable_rounds_required,
            "stable_round_count": self.stable_round_count,
        }
