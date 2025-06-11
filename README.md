# Macro Prompt Builder

A simple, clean, and delightful mobile-friendly React application that serves as a menu for generating text prompts for a nutrition-tracking LLM.

This application features a prominent button for the system prompt and collapsible sections for different meals (Breakfast, Lunch, Dinner, Snack). When you select any combination of food items, the corresponding text is aggregated into a single, easy-to-copy block, ready to be pasted into an AI model.

The menu items and system prompt are managed in separate data files, making them easy to update.

![App Screenshot](https://placehold.co/600x400/111827/FFFFFF?text=App+Screenshot)

## Features

-   **Dark Mode UI:** Aesthetically pleasing dark theme.
-   **Collapsible Meal Sections:** Organize menu items by meal for a clean interface.
-   **Dynamic Prompt Generation:** Select items to build a custom prompt.
-   **Optimized System Prompt:** Includes a toggleable, detailed system prompt for the LLM.
-   **Click-to-Copy:** Easily copy the generated prompt to your clipboard.
-   **Mobile-Friendly:** Fully responsive design for use on any device.
-   **Easy to Customize:** Menu items are stored in a simple JavaScript object.

## Tech Stack

-   **Vite:** Next-generation front-end tooling for a fast development experience.
-   **React:** A JavaScript library for building user interfaces.
-   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
-   **Lucide React:** Beautiful and consistent icons.

## Project Setup

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd macro-prompt-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the Vite development server, run the following command. The application will be available at `http://localhost:5173`.

```bash
npm run dev