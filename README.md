# Math Magic Studio

CRITICAL INSTRUCTION: You are an expert Senior Frontend Developer and UI/UX Designer. Your task is to generate a 100% complete, fully functional, and production-ready responsive web application. DO NOT ask me any clarifying questions. DO NOT provide partial code. Make standard, logical industry assumptions for any minor missing details and output the final working product ready for deployment.



# Project Overview

A gamified multiplication practice web app (1-10) for a 4th-grade student. Tech Stack: React, Tailwind CSS, Lucide Icons, and Supabase for the database.



# UI/UX & Design System (Strict Adherence Required)

- Aesthetic: Apple-inspired design system. Clean, modern, minimalist, and highly elegant.

- Styling: Implement "Liquid Glass UI" (Glassmorphism) with heavily translucent backgrounds, soft diffused shadows, and strong backdrop-blur effects.

- Animations: Extremely smooth, bouncy, spring-like animations (Framer Motion style) for all buttons, inputs, modals, and page transitions. Absolutely no stiff or rigid CSS transitions.

- Colors: Dynamic, vibrant yet soft pastel colors suitable for children, but maintaining a premium, high-end Apple-like feel.



# Core Features & App Flow



1. Home Dashboard

- A clean, distraction-free interface.

- Two prominent, bouncy buttons: "Mulai Latihan" (Start Practice) and "Riwayat" (History).



2. Setup Phase (Modal/Slide-in)

- Input to select the Multiplier (numbers 1 to 10).

- Selection for Duration: 10 minutes or 15 minutes.

- A "Start Game" button.



3. Gamified Study Session (The Core Loop)

- Trigger browser Full-Screen API automatically upon starting (to minimize distractions).

- Hide all external navigation/headers. Show only: Timer (counting down), Current Score, and the Question card.

- Logic: 

  - Generate a random question based on the chosen multiplier (e.g., if 8 is chosen, random questions from 8x1 to 8x10).

  - Provide a large, elegant number-only input field.

  - When the user types the answer and hits Enter/Submit:

    - IF CORRECT: Trigger a bouncy green success animation on the input, play a "Ding/Success" sound, and immediately generate the next random question.

    - IF WRONG: Trigger a red "shake" (error) animation on the input box, play a "Buzz/Error" sound, and clear the input. Do NOT reveal the correct answer. The user MUST keep trying until they get it right to proceed.

- Audio (CRITICAL): Do NOT ask the user for audio URLs. Synthesize the "Ding" and "Buzz" sound effects entirely from scratch using the native browser `Web Audio API` (oscillator nodes) within a utility function. Provide a toggle button to mute/unmute.



4. Session Summary (Triggered exactly when Timer hits 00:00)

- Lock the gameplay immediately.

- Show a beautiful glassmorphism summary card displaying:

  - Multiplication Table practiced (e.g., "Perkalian 8").

  - Total correct answers completed.

  - Duration spent (10 or 15 mins).

- Save this session data to Supabase immediately upon completion.

- Provide a button to "Kembali ke Home" (Return to Home).



5. History Page (Riwayat)

- Fetch and display data from the Supabase `study_history` table.

- Display a sleek list or grid of past sessions.

- Card details: Date & Time, Multiplication Table, Total Solved, and Duration.



# Database Integration (Supabase)

- Write the complete logic to fetch and insert data using `@supabase/supabase-js`.

- Provide the necessary Supabase setup code so I can simply connect my project via the Lovable UI.

- Assume the table `study_history` exists with columns: `id` (uuid), `created_at` (timestamp), `multiplier` (integer), `duration_minutes` (integer), `total_solved` (integer).



Generate the entire application now. Ensure mobile-first responsiveness and flawless UI execution.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://spark-sums.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c26ee54d-2790-4429-a6d0-57a115a7fa52).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
