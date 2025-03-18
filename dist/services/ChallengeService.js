import { ChallengeType, DifficultyLevel } from '../models/Challenge.js';
class ChallengeService {
    generateChallenge(difficulty = DifficultyLevel.EASY) {
        // Select a random challenge type
        const challengeTypes = Object.values(ChallengeType);
        const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
        // Generate operands based on difficulty
        const operands = this.generateOperands(type, difficulty);
        // Calculate the answer
        const answer = this.calculateAnswer(type, operands);
        // Create the question text
        const questionText = this.createQuestionText(type, operands);
        // Determine boost multiplier based on difficulty
        const boostMultiplier = this.getBoostMultiplier(difficulty);
        return {
            type,
            difficulty,
            operands,
            answer,
            questionText,
            boostMultiplier,
        };
    }
    generateOperands(type, difficulty) {
        switch (difficulty) {
            case DifficultyLevel.EASY:
                return this.generateEasyOperands(type);
            case DifficultyLevel.MEDIUM:
                return this.generateMediumOperands(type);
            case DifficultyLevel.HARD:
                return this.generateHardOperands(type);
            default:
                return this.generateEasyOperands(type);
        }
    }
    generateEasyOperands(type) {
        switch (type) {
            case ChallengeType.ADDITION:
                return [this.randomInt(1, 10), this.randomInt(1, 10)];
            case ChallengeType.SUBTRACTION:
                const a = this.randomInt(5, 20);
                const b = this.randomInt(1, a - 1); // Ensure positive result
                return [a, b];
            case ChallengeType.MULTIPLICATION:
                return [this.randomInt(1, 5), this.randomInt(1, 5)];
            default:
                return [this.randomInt(1, 10), this.randomInt(1, 10)];
        }
    }
    generateMediumOperands(type) {
        switch (type) {
            case ChallengeType.ADDITION:
                return [this.randomInt(10, 50), this.randomInt(10, 50)];
            case ChallengeType.SUBTRACTION:
                const a = this.randomInt(20, 100);
                const b = this.randomInt(1, a - 1); // Ensure positive result
                return [a, b];
            case ChallengeType.MULTIPLICATION:
                return [this.randomInt(5, 12), this.randomInt(5, 12)];
            default:
                return [this.randomInt(10, 50), this.randomInt(10, 50)];
        }
    }
    generateHardOperands(type) {
        switch (type) {
            case ChallengeType.ADDITION:
                return [
                    this.randomInt(50, 200),
                    this.randomInt(50, 200),
                    this.randomInt(50, 200),
                ];
            case ChallengeType.SUBTRACTION:
                const a = this.randomInt(100, 500);
                const b = this.randomInt(50, a - 50); // Ensure positive result
                return [a, b];
            case ChallengeType.MULTIPLICATION:
                return [this.randomInt(10, 20), this.randomInt(10, 20)];
            default:
                return [this.randomInt(50, 200), this.randomInt(50, 200)];
        }
    }
    calculateAnswer(type, operands) {
        switch (type) {
            case ChallengeType.ADDITION:
                return operands.reduce((sum, num) => sum + num, 0);
            case ChallengeType.SUBTRACTION:
                return operands[0] - operands[1];
            case ChallengeType.MULTIPLICATION:
                return operands.reduce((product, num) => product * num, 1);
            default:
                return 0;
        }
    }
    createQuestionText(type, operands) {
        switch (type) {
            case ChallengeType.ADDITION:
                return operands.join(' + ') + ' = ?';
            case ChallengeType.SUBTRACTION:
                return operands.join(' - ') + ' = ?';
            case ChallengeType.MULTIPLICATION:
                return operands.join(' × ') + ' = ?';
            default:
                return 'Unknown operation';
        }
    }
    getBoostMultiplier(difficulty) {
        switch (difficulty) {
            case DifficultyLevel.EASY:
                return 0.5;
            case DifficultyLevel.MEDIUM:
                return 1.0;
            case DifficultyLevel.HARD:
                return 2.0;
            default:
                return 0.5;
        }
    }
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    validateAnswer(challenge, userAnswer) {
        return challenge.answer === userAnswer;
    }
}
export default new ChallengeService();
