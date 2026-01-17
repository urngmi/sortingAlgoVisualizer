#!/bin/bash

# Initialize Git repository and prepare for deployment

echo "📦 Initializing Git repository..."

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "ℹ️  Git repository already exists"
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Sorting Algorithm Visualizer

- Ported from C++ Sound of Sorting to TypeScript/Next.js
- Implemented 7 sorting algorithms with visualizations
- Added Web Audio API sound generation
- Fully responsive design with Tailwind CSS
- Ready for Vercel deployment"

echo "
✅ Git repository ready!

Next steps:
1. Create a repository on GitHub
2. Add remote: git remote add origin https://github.com/YOUR_USERNAME/sorting-visualizer.git
3. Push: git push -u origin main

OR

Deploy directly to Vercel:
1. Run: vercel login
2. Run: vercel --prod
"
