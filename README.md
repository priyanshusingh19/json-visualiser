# JSON Visualizer

A modern, beautiful JSON visualizer built with Next.js 16, React 19, and Tailwind CSS.

## Features

- ✨ **Real-time JSON Parsing**: Instantly visualize JSON as you type
- 🌳 **Tree View**: Expandable/collapsible tree structure for easy navigation
- 🎨 **Syntax Highlighting**: Color-coded values (strings, numbers, booleans, null)
- 📋 **Format Button**: Automatically format and prettify your JSON
- 📋 **Copy Button**: Copy the formatted JSON to clipboard
- 🗑️ **Clear Button**: Quick clear to start fresh
- 🌙 **Dark Theme**: Beautiful dark UI optimized for readability
- 📱 **Responsive Design**: Works great on desktop and mobile

## Getting Started

### Prerequisites
- Node.js 18+ (or 20+ recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Paste or type JSON in the left panel
2. The visualization appears in real-time on the right panel
3. Click on expandable items to collapse/expand them
4. Use the buttons to format, copy, or clear the JSON

## Example JSON

Try pasting this:
```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding", "gaming"],
  "isActive": true
}
```

## Tech Stack

- **Next.js 16**: React framework
- **React 19**: UI library
- **Tailwind CSS 4**: Styling
- **TypeScript**: Type safety
- **Lucide React**: Icons

## Build for Production

```bash
npm run build
npm start
```

## License

MIT
