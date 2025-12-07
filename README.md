# Flow Forge

**Craft workflows that flow seamlessly and forge your automation future.**

Flow Forge is a modern workflow builder that enables you to create, visualize, and manage complex automation workflows with an intuitive drag-and-drop interface.

## Features

- 🎨 **Elegant UI** - Beautiful pastel-themed interface with responsive design
- 🔧 **Node-Based Workflow Builder** - Drag and drop nodes to create workflows
- ⚡ **Multiple Node Types** - Triggers, Controllers, and Activities
- 🎯 **Visual Canvas** - Interactive canvas with smooth connections
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Customizable Nodes** - Configure node parameters with ease

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 16** - React framework
- **React Flow** - Workflow visualization
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── NodeSidebar.tsx
│   ├── WorkflowCanvas.tsx
│   └── NodeConfigModal.tsx
├── services/         # API services
├── types/            # TypeScript types
└── utils/            # Utility functions
    └── nodeUtils.ts  # Node-related utilities
```
