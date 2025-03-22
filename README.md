# LeetCode Notes

A simple application to help you keep track of LeetCode problems and the patterns used to solve them.

## Overview

LeetCode Notes allows you to:

- Save the title of a LeetCode problem you've worked on
- Add a short note describing the pattern or approach to solve it
- Quickly search and reference your notes when you need a refresher

This tool is designed for programmers who want to build a personal knowledge base of problem-solving patterns to reinforce their learning and prepare for technical interviews.

## Features

- **Simple Note Creation**: Quickly enter a LeetCode problem title and your solution notes
- **Search Functionality**: Easily find your notes on specific problems or patterns
- **Persistent Storage**: Your notes are securely saved in a Turso database
- **Minimal Design**: Clean interface that focuses on your content

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- A Turso account for the database

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Configure your environment variables:
   ```
   DATABASE_URL="your-turso-db-url"
   TURSO_AUTH_TOKEN="your-auth-token"
   ```
4. Run the database migrations:
   ```
   pnpm run db:push
   ```
5. Start the development server:
   ```
   pnpm run dev
   ```

## How It Works

1. Enter the title of a LeetCode problem you've solved
2. Write a brief note about how you solved it, including:
   - The pattern you recognized
   - Key tricks or insights
   - Time/space complexity
   - Edge cases to consider
3. Save the note for future reference

## Use Cases

- **Interview Prep**: Quickly review problems you've previously solved
- **Pattern Recognition**: Build a catalog of solution patterns to recognize in new problems
- **Memory Reinforcement**: Cement your understanding by writing concise explanations

## Technology

This app is built with:
- [Next.js](https://nextjs.org) - React framework
- [Drizzle ORM](https://orm.drizzle.team) - Database ORM
- [Turso](https://turso.tech) - SQLite-compatible database
- [Tailwind CSS](https://tailwindcss.com) - Styling

## Contributing

Feel free to submit issues or pull requests if you have ideas for improvements!
