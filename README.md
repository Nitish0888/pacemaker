# Smart Pacemaker Monitor

A full-stack Next.js 14 application for monitoring and controlling a smart pacemaker system. This application provides real-time monitoring of heart rate, control over pacemaker settings, and secure authentication.

## Features

- Real-time heart rate monitoring with live updates
- Historical heart rate data visualization
- Pacemaker control panel for adjusting BPM settings
- Secure authentication system
- Responsive design for all devices
- Modern UI with Tailwind CSS and shadcn/ui components

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- NextAuth.js
- Recharts for data visualization

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-pacemaker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

For testing purposes, use the following credentials:
- Email: demo@example.com
- Password: demo123

## ESP32 Integration

The application is designed to communicate with an ESP32 device. In a production environment:

1. Update the ESP32 IP address in the API route (`src/app/api/set-bpm/route.ts`)
2. Implement proper error handling for device communication
3. Add WebSocket support for real-time data streaming

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Considerations

- Implement proper authentication in production
- Use HTTPS for all communications
- Add rate limiting for API endpoints
- Implement proper error handling
- Add input validation for all user inputs

## License

MIT
