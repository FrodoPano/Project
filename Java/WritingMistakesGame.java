
import java.util.Scanner; //Allows us to red the user input form the keyboard
import java.util.ArrayList; //Creates a dynamic list that can grow or shrink
import java.util.List; //This is the interface for the ArrayList

public class WritingMistakesGame {
    // ============================================================
    // INNER CLASS: Defines the structure of a single question
    // ============================================================
    // This is like a blueprint for each question in our game.
    // Each Question object will store two strings:
    //   1. The WRONG sentence (what we show the player)
    //   2. The CORRECT sentence (what we compare the answer to)
    // ============================================================
    static class Question {
        String wrongText; // The incorrect sentence (e.g., "I like pass time...")
        String correctText; // The fixed version (e.g., "I like spending time...")

        // CONSTRUCTOR: This special method runs when we create a new Question
        // 'this' refers to the current object we're creating
        Question(String wrong, String correct) {
            this.wrongText = wrong; // Store the wrong sentence in this object
            this.correctText = correct; // Store the correct sentence in this object
        }
    }

    // ============================================================
    // MAIN METHOD: The program starts running here
    // ============================================================
    public static void main(String[] args) {
        // Create a Scanner object to read what the user types
        // 'System.in' means "standard input" (your keyboard)
        Scanner scanner = new Scanner(System.in);
        // Create an ArrayList to hold all our Question objects
        // List<Question> means "a list that can only store Question objects"
        List<Question> questions = new ArrayList<>();

        // ============================================================
        // ADD ALL QUESTIONS (Wrong sentence -> Correct sentence)
        // ============================================================
        // Each 'questions.add()' creates a new Question object and adds it to the list
        // The list will automatically grow as we add more items
        // These are all from the Baamboozle game you shared
        // ============================================================
        questions.add(new Question("I like pass time with my family.", "I like spending time with my family."));
        questions.add(new Question("Is an amazing place.", "It is an amazing place."));
        questions.add(new Question("I'm exciting to meet you.", "I'm excited to meet you."));
        questions.add(new Question("A small town of Valencia.", "A small town near Valencia."));
        questions.add(new Question("I love play basketball.", "I love playing basketball."));
        questions.add(new Question("I specially enjoy listen to music.", "I specially enjoy listening to music."));
        questions.add(new Question("I'm currently on 4th of ESO.", "I'm currently in 4th of ESO."));
        questions.add(new Question("Im 16 years old.", "I'm 16 years old."));
        questions.add(new Question("I love watching TV, read, and play video games.", "I love watching TV, reading, and playing video games."));
        questions.add(new Question("They are hilarius.", "They are hilarious."));
        questions.add(new Question("I am studing at high school.", "I am studying at high school."));
        questions.add(new Question("I speak spanish, valencian, and english.", "I speak Spanish, Valencian, and English."));
        questions.add(new Question("She can stay as long she wants.", "She can stay as long as she wants."));
        questions.add(new Question("The center of the town is crowded.", "The town centre is crowded."));
        questions.add(new Question("Its a small town near Valencia.", "It's a small town near Valencia."));
        questions.add(new Question("You are beutiful today.", "You are beautiful today."));

        // SCORE TRACKING VARIABLES
        int score = 0; // Starts at 0, increases by 1 for each correct answer
        int total = questions.size(); // .size() returns how many questions we added (16)

        // ============================================================
        // DISPLAY GAME TITLE (using .repeat() to make lines)
        // ============================================================
        // .repeat(50) creates a string of 50 equal signs: "=================================================="
        System.out.println("=" .repeat(50));
        System.out.println("      ✏️  WRITING MISTAKES GAME  ✏️");
        System.out.println("=" .repeat(50));
        System.out.println("Correct each sentence by typing the fix.\n");

        // ============================================================
        // MAIN GAME LOOP: Goes through each question one by one
        // ============================================================
        // 'for' loop syntax: for(initialization; condition; increment)
        // We start with i=0, continue while i < total, then i++ (add 1 to i)
        // i represents the current index in our questions list (0, 1, 2, ...)
        // ============================================================
        for (int i = 0; i < total; i++) {
            // Get the current question from the list using .get(i)
            Question q = questions.get(i);

            // Display the wrong sentence to the player
            System.out.println("❌ WRONG: " + q.wrongText);
            System.out.print("✅ CORRECT: ");

            // Read the user's entire line of input (until they press Enter)
            // .nextLine() waits for the user to type and press Enter
            String userAnswer = scanner.nextLine();

            // ============================================================
            // CHECK IF ANSWER IS CORRECT
            // ============================================================
            // .trim() removes any extra spaces at the beginning or end
            // .equalsIgnoreCase() compares strings but ignores upper/lowercase differences
            // Example: "hello" equalsIgnoreCase "HELLO" returns true
            // ============================================================
            if (userAnswer.trim().equalsIgnoreCase(q.correctText.trim())) {
                System.out.println("✔️  Correct! +1 point\n");
                score++; // Increase score by 1 (same as: score = score + 1)
            } else {
                System.out.println("❌ Incorrect!");
                System.out.println("The correct answer is: " + q.correctText + "\n");
            }
        }

        // ============================================================
        // FINAL SCORE DISPLAY WITH FEEDBACK
        // ============================================================
        System.out.println("=" .repeat(50));
        System.out.println("          GAME OVER");
        System.out.println("=" .repeat(50));
        System.out.println("Your final score: " + score + " out of " + total);

        // IF-ELSE IF chain to give different feedback based on score
        // Checks conditions from top to bottom, stops at first true condition
        if (score == total) {
            System.out.println("🎉 Perfect! Excellent grammar skills! 🎉");
        } else if (score >= total - 3) {
            System.out.println("👍 Great job! You're almost perfect!");
        } else if (score >= total / 2) {
            System.out.println("📚 Good effort! Keep practicing!");
        } else {
            System.out.println("💪 Good start! Review the mistakes and try again.");
        }

        // ============================================================
        // CLOSE THE SCANNER 
        // ============================================================
        scanner.close(); // Prevents potential memory leaks
    }
}