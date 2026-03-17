# Contributing to TetraScience Design Patterns

Thank you for your interest in contributing to this project! This guide will walk you through the process of making contributions via pull requests.

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/54321jenn-ts/ts-design-patterns.git
cd ts-design-patterns
yarn install
```

## Development Workflow

Start the development server to see your changes in real-time:

```bash
yarn dev
```

The app will be available at `http://localhost:3000`

## Making Changes

1. **Create a new branch** for your feature or fix:

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** in the appropriate files. The project structure is:

```
ts-design-patterns/
├── packages/
│   ├── client/          # React frontend
│   │   └── src/
│   │       ├── pages/   # Page components
│   │       └── components/  # Reusable components
│   └── server/          # Express backend
└── manifest.json        # App metadata
```

3. **Test your changes** to ensure everything works:

```bash
yarn test
```

## Adding a New Page

To add a new page to the app, follow these steps:

1. Create a new page component in `packages/client/src/pages/`:

```tsx
import { Card } from '@tetrascience-npm/tetrascience-react-ui';

function MyNewPage() {
  return (
    <div className="app-container">
      <Card>
        <h3>My New Feature</h3>
        <p>Description of the feature...</p>
      </Card>
    </div>
  );
}

export default MyNewPage;
```

2. Add the route in `App.tsx`:

```tsx
import MyNewPage from './pages/MyNewPage';

// In the Routes component:
<Route path="my-new-page" element={<MyNewPage />} />
```

3. Add a navigation item in `Layout.tsx`:

```typescript
const sidebarItems = [
  // ... existing items
  {
    icon: 'cube',
    label: 'My New Page',
    path: '/my-new-page',
  },
];
```

## Submitting a Pull Request

1. **Commit your changes** with a descriptive message:

```bash
git add .
git commit -m "Add new feature: description of changes"
```

2. **Push to your fork**:

```bash
git push origin feature/your-feature-name
```

3. **Create a Pull Request** on GitHub with:
   - A clear title describing the change
   - A description of what was changed and why
   - Screenshots if applicable

## Code Style Guidelines

Please follow these guidelines when contributing:

- Use TypeScript for all new components
- Follow the existing code formatting (we use Prettier)
- Use the TetraScience React UI components when possible
- Add comments for complex logic
- Keep components focused and reusable

## Need Help?

If you have questions or need assistance, please open an issue on GitHub or reach out to the maintainers.

