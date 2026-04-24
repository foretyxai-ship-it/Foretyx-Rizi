# Foretyx Control Plane

![Foretyx Logo](https://img.shields.io/badge/Foretyx-AI_Security-primary)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)

The **Foretyx Control Plane** is a modern, responsive web application that acts as the administrative dashboard for the Foretyx Secure AI Gateway. It provides full visibility and control over enterprise AI usage, ensuring robust governance without sacrificing productivity.

## 🚀 Features

*   **Policy Management**: Dynamically configure allowed models, specify context-sensitive blocked keywords, and adjust token limit thresholds globally.
*   **Real-time Security Analytics**: Interactive visualizations detailing intercepted PII events, prompt injection attempts, and organizational AI volume.
*   **Application & User Monitoring**: Track application deployments protected by the mesh proxy, review user sessions, and manage connected clients.
*   **Secure Admin Chat Interface**: A multi-model sandbox for administrators to directly interact with underlying AI infrastructures.
*   **Fully Autonomous Demo Mode**: Features integrated mock data, allowing the Control Plane to be demoed, iterated, and tested smoothly even when the Python data‑plane is offline.

## 🛠 Tech Stack

*   **Framework**: [React 18](https://react.dev/) built with [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn (Radix UI)](https://ui.shadcn.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Charting**: [Recharts](https://recharts.org/)

## 🏎 Quick Start

### 1. Requirements
*   Node.js (v18 or higher)
*   npm or bun

### 2. Installation
Clone the repository, then navigate into the application root:
```bash
npm install
```

### 3. Usage
To spin up a local development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the next available port, e.g., `8082`).

> **Note on Authentication**: By default, the application runs via a mock strategy if the backend server (`http://127.0.0.1:8000`) is offline. You can log in using any email containing the word `admin` to access the Dashboard directly.

## 🤝 Contributing
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 🛡 Security
At Foretyx, security is our top priority. The control plane relies on encrypted HTTP transmission and stateless JWT tokens for zero-trust compliance inside the administration ecosystem.

---
*Your AI. Your Data. Your Control.*
