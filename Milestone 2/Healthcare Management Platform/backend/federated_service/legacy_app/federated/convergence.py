class ConvergenceChecker:

    def __init__(self, threshold=0.001, patience=3):
        self.threshold = threshold
        self.patience = patience
        self.previous_accuracy = None
        self.stable_rounds = 0

    def check(self, current_accuracy):
        if self.previous_accuracy is None:
            improvement = 0.0
        else:
            improvement = current_accuracy - self.previous_accuracy

        if self.previous_accuracy is not None:
            if abs(improvement) <= self.threshold:
                self.stable_rounds += 1
            else:
                self.stable_rounds = 0

        converged = self.stable_rounds >= self.patience

        self.previous_accuracy = current_accuracy

        return improvement, converged
