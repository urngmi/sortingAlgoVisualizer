# Sorting Algorithm Visualizer

A beautiful, interactive web application that visualizes sorting algorithms with real-time animations and sound effects. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Visual Animations**: Watch sorting algorithms work in real-time with color-coded array elements
- 🔊 **Sound Effects**: Hear the sorting process with Web Audio API-generated tones
- ⚡ **Multiple Algorithms**: 
  - Bubble Sort
  - Quick Sort
  - Merge Sort
  - Insertion Sort
  - Selection Sort
  - Heap Sort
  - Cocktail Shaker Sort
- 🎛️ **Customizable**:
  - Adjustable array size (10-100 elements)
  - Variable speed control
  - Toggle sound on/off
- 📊 **Statistics**: Track comparisons and swaps in real-time
- 📱 **Responsive**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sorting-visualizer-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sorting-visualizer-web)

## Build Configuration

The project uses the following build configuration for Vercel:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Project Structure

```
sorting-visualizer-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── SortingVisualizer.tsx  # Main visualizer component
│   └── lib/
│       ├── sortingAlgorithms.ts   # Algorithm implementations
│       └── soundGenerator.ts      # Sound generation utility
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **Web Audio API**: Real-time sound generation

## Color Legend

- 🔵 Blue: Unsorted elements
- 🟡 Yellow: Elements being compared
- 🔴 Red: Elements being swapped
- 🟣 Purple: Pivot element (Quick Sort)
- 🟢 Green: Sorted elements

## License

This project is inspired by [The Sound of Sorting](https://github.com/bingmann/sound-of-sorting) by Timo Bingmann.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Acknowledgments

- Original C++ project: [Sound of Sorting](http://panthema.net/2013/sound-of-sorting/) by Timo Bingmann
- Sorting algorithm implementations adapted for JavaScript/TypeScript
