# VocabPrep

## Description
A vocabulario trainer built by Middlesex School Students

## Engineering
VocabPrep is a web app built with NextJs, React, a Rust backend that uses PostgreSQL.

The website is designed for teachers' access to student learning and for students to effectively master new vocabulary. 

The intended purpose is for students to learn new 10 words a week until they reach mastery online so that students can be given a 20-word quiz biweekly.

The site will use time-based and browser-locking methods to prevent cheating which ultimately would lead to poor results on in-person quizzes.

This site will use gamify techniques to improve vocabulary understanding and memorization.

Lastly, this site will incorporate vocab from old lists to maintain past vocab knowledge.

## Data Collected
- Time spent by a student
- Level of mastery per mastery and per list
- Consistency
- Question type-specific data: definition, context, spelling, etc

Got it! Here's the README section formatted as a numbered list:

## Running the Program

To run the program, follow these steps:

1. **Start PostgreSQL Database**: Make sure you have PostgreSQL installed and running. You can start it using Docker or any other method you prefer. For example:

   ```bash
   docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres:latest
   ```

2. **Make the Script Executable**: Set the execute permission for the run script.

   ```bash
   chmod +x run.sh
   ```

3. **Run the Program**: Execute the run script to start the Rust backend and Next.js frontend.

   ```bash
   ./run.sh
   ```

4. **Check the Website at localhost**: Open your web browser and visit `http://localhost:3000` to access the frontend.

## Additional Notes

- Make sure to adjust configurations and settings as needed for your specific environment.
- You may need to modify the script for starting the PostgreSQL database depending on your setup.
- For production deployment, ensure to properly configure and secure your application.

This format provides clear, step-by-step instructions for running the program and accessing the website locally.
