# Git Repository Setup Instructions

## Prerequisites

You need to install Git first. Download from: https://git-scm.com/download/win

## Steps to Create Repository

### 1. Initialize Git Repository
```bash
cd c:\hadad
git init
```

### 2. Configure Git (First Time Setup)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Add All Files
```bash
git add .
```

### 4. Create Initial Commit
```bash
git commit -m "Initial commit: Asrār Everyday - Islamic Numerology App

Features:
- Traditional Abjad calculator with Maghrib rules
- Ḥadad Summary analysis with element breakdown
- Weekly Life Guidance (Al-Būnī tradition)
- Name Destiny & Spiritual Stations
- Compatibility analysis
- Divine Timing with planetary hours
- History & favorites system
- Dark mode support
- Arabic transliteration from Latin text"
```

### 5. Create GitHub Repository

**Option A: Using GitHub CLI (gh)**
```bash
gh repo create asrar-everyday --public --source=. --remote=origin
git push -u origin main
```

**Option B: Using GitHub Website**
1. Go to https://github.com/new
2. Create a new repository named "asrar-everyday"
3. Do NOT initialize with README (we already have one)
4. Copy the repository URL
5. Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/asrar-everyday.git
git branch -M main
git push -u origin main
```

### 6. Verify Repository
```bash
git status
git log --oneline
```

## Common Git Commands

### Check Status
```bash
git status
```

### Add Changes
```bash
git add .                    # Add all files
git add src/path/to/file.ts  # Add specific file
```

### Commit Changes
```bash
git commit -m "Your commit message"
```

### Push to GitHub
```bash
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

### View History
```bash
git log --oneline --graph --all
```

### Create Branch
```bash
git checkout -b feature/new-feature
```

### Switch Branch
```bash
git checkout main
```

### Merge Branch
```bash
git checkout main
git merge feature/new-feature
```

## .gitignore Already Created

The `.gitignore` file is already set up to exclude:
- `/node_modules` - Dependencies
- `/.next` - Next.js build files
- `.env*.local` - Environment variables
- `*.tsbuildinfo` - TypeScript build info

## Suggested Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add planetary timing for best hours"
git commit -m "fix: handle undefined profile in weekly results"
git commit -m "docs: update README with usage guide"
```

## Repository Information

**Project Name**: Asrār Everyday
**Description**: Islamic Numerology & Life Guidance App - ʿIlm al-Ḥurūf (Science of Letters)
**Topics/Tags**: islamic-numerology, abjad, ilm-huruf, nextjs, typescript, tailwindcss

## License

MIT License (already included in README.md)
