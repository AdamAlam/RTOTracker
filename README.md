# Office Attendance Compliance Tracker

A modern web application for tracking and planning office attendance to ensure compliance with company policies.

## Features

### 📊 Smart Compliance Tracking

- **Rolling 12-week window** - Automatically tracks your last 12 weeks of attendance
- **Best 8 weeks calculation** - Only counts your highest attendance weeks (24 days required)
- **Real-time compliance status** - Instant feedback on whether you're compliant

### 📅 Interactive Calendar

- **Monthly view** - Clean calendar interface showing multiple months
- **Click to track** - Left-click to mark attendance (past) or plan attendance (future)
- **Right-click to block** - Block future days when planning time off
- **Visual indicators** - Different colors for attended, planned, and blocked days

### 🔮 Planning Tools

- **Adjustable check date** - See compliance status for any future date
- **Days dropping off** - Shows how many days you'll lose when the window rolls forward
- **Required days calculator** - Tells you exactly how many days you need next week
- **Week highlighting** - Orange border shows which week drops off next Monday

### 💾 Data Persistence

- **Local storage** - All your data is saved automatically in your browser
- **No server required** - Works entirely offline after initial load

## How It Works

The compliance system uses a **rolling 12-week window** that updates every Monday:

1. **Looks at last 12 weeks** from your chosen check date
2. **Ranks all weeks** by attendance days (Monday-Friday only)
3. **Takes the best 8 weeks** and adds up their attendance
4. **Requires 24+ days** across those 8 weeks for compliance

This means you can strategically plan your attendance - some weeks with high attendance, others with time off.

## Usage

### Basic Tracking

- **Left-click** weekdays to mark attendance (green = attended, blue = planned)
- **Right-click** future weekdays to block them (red = blocked/unavailable)
- **Adjust check date** to see compliance status for different time periods

### Strategy Planning

Perfect for the **"3 days or nothing"** approach:

- Plan full 3-day weeks when you'll be in office
- Block entire weeks when taking time off
- Use the "Required days next week" to know when you must attend

### Visual Indicators

- 🟢 **Green solid** - Past attendance (confirmed)
- 🔵 **Blue dashed** - Future planned attendance
- 🔴 **Red solid** - Blocked days (unavailable)
- 🟠 **Orange border** - Week dropping off next Monday
- ⚠️ **Warning icon** - Days in dropping-off week
- 🚫 **Blocked icon** - Blocked days

## Development

### Tech Stack

- **React** - Frontend framework
- **Vite** - Build tool and dev server
- **CSS** - Modern styling with gradients and glassmorphism
- **JavaScript** - ES6+ with hooks and utilities

### Project Structure

```
src/
├── components/          # React components
│   ├── ComplianceStatus.jsx
│   ├── DatePicker.jsx
│   ├── StatsPanel.jsx
│   ├── CalendarMonth.jsx
│   └── CalendarDay.jsx
├── hooks/              # Custom React hooks
│   └── useAttendanceData.js
├── utils/              # Utility functions
│   ├── calendarUtils.js
│   └── complianceUtils.js
└── App.jsx             # Main application
```

### Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd EGCompliance/attendance-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Deployment

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on pushes to the main branch.

## License

MIT License - feel free to use this for your own attendance tracking needs!

## Contributing

This project was built for personal use but contributions are welcome. Feel free to submit issues or pull requests.
