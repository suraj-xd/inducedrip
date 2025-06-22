# Inducedrip | A Swagstore for Induced AI

[![Inducedrip Swag Store Demo](/public/og-image.png)](https://your-deployment-link.com)

Welcome to Inducedrip, the official swag store for Induced AI. Explore our products with a clean interface, 3D previews, and unique customization options.

> **ℹ️ Note:** This is a demo store. All products, payments, and features are for testing and demonstration purposes only.

## ✨ Features

- **✨ Minimal UI:** A clean, intuitive, and modern shopping interface.
- **🧊 3D Product Previews:** Interact with high-fidelity 3D models of our products.
- **🤖 AI Virtual Try-On:** See how our swag looks on you with AI-powered virtual try-on.
- **🎨 Product Customization:** Personalize items like caps and jackets with unique patches.
- **💻 Sticker Try-On:** Preview stickers directly on a MacBook model.
- **💳 Crypto Payments:** Pay with crypto via the NMKR SDK on the Cardano blockchain.
- **📱 Fully Responsive:** A great experience on any device, desktop or mobile.
- **💌 Waitlist System:** Get notified about new product drops and restocks via email.

## 🚀 Tech Stack

- **Framework:** ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
- **Language:** ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
- **UI:** ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) & ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- **3D:** ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white) & ![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-000000?style=for-the-badge&logo=react&logoColor=white)
- **AI:** ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) ![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B6?style=for-the-badge&logo=google-gemini&logoColor=white) ![AWS Bedrock](https://img.shields.io/badge/AWS_Bedrock-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
- **Payments:** NMKR SDK & ![Cardano](https://img.shields.io/badge/Cardano-0033AD?style=for-the-badge&logo=cardano&logoColor=white)
- **State Management:** ![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)
- **UI Components:** ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcn-ui&logoColor=white)
- **Animations:** ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
- **Database/Cache:** ![Upstash Redis](https://img.shields.io/badge/Upstash-FF0000?style=for-the-badge&logo=upstash&logoColor=white)
- **Deployment:** ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
- **Emails:** ![React Email](https://img.shields.io/badge/React_Email-000000?style=for-the-badge&logo=react&logoColor=white) & ![Nodemailer](https://img.shields.io/badge/Nodemailer-2A7A7E?style=for-the-badge&logo=nodemailer&logoColor=white)

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- pnpm (or npm/yarn)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```
2.  Install dependencies:
    ```sh
    pnpm install
    ```
3.  Set up your environment variables. Create a `.env.local` file in the root of the project and add the necessary API keys and configurations (e.g., for Upstash, Google Gemini, etc.).
    ```env
    # Example .env.local
    UPSTASH_REDIS_REST_URL=...
    UPSTASH_REDIS_REST_TOKEN=...
    GOOGLE_API_KEY=...
    ```
4.  Run the development server:
    ```sh
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

The project follows a feature-based structure, making it easy to navigate and maintain.

```
/
├── app/                  # Main application pages and API routes
│   ├── (product-pages)/  # Dynamic routes for each product type
│   ├── api/              # API endpoints (e.g., AI Try-on, email)
│   └── ...
├── components/           # Reusable components
│   ├── ui/               # Base UI components (from shadcn/ui)
│   ├── command-drip/     # Custom components for the store
│   └── ...
├── lib/                  # Utilities, libraries, and stores
├── public/               # Static assets (images, 3D models)
├── ...
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information. 