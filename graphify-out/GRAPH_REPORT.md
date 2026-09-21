# Graph Report - hasan-electric  (2026-09-21)

## Corpus Check
- 20 files · ~230,640 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 116 nodes · 104 edges · 22 communities (16 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- compilerOptions
- main.py
- package.json
- devDependencies
- include
- catalog.ts
- faq/page.tsx
- Hassan Electric & Traders
- about/page.tsx
- contact/page.tsx
- islamabad/page.tsx
- layout.tsx
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `scripts` - 5 edges
3. `include` - 5 edges
4. `Base` - 4 edges
5. `lib` - 4 edges
6. `Category` - 3 edges
7. `Product` - 3 edges
8. `Hassan Electric & Traders` - 3 edges
9. `CategoryOut` - 2 edges
10. `ProductOut` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (22 total, 6 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "main.py"
Cohesion: 0.21
Nodes (14): Base, Category, CategoryOut, health(), lifespan(), list_categories(), list_products(), Product (+6 more)

### Community 2 - "package.json"
Cohesion: 0.13
Nodes (14): dependencies, next, react, react-dom, name, private, scripts, build (+6 more)

### Community 3 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @types/node, @types/react, @types/react-dom, typescript, @types/node, @types/react, @types/react-dom (+1 more)

### Community 4 - "include"
Cohesion: 0.25
Nodes (7): exclude, include, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx

### Community 5 - "catalog.ts"
Cohesion: 0.29
Nodes (4): business, categories, Product, products

### Community 9 - "Hassan Electric & Traders"
Cohesion: 0.50
Nodes (3): Deployment, Hassan Electric & Traders, Local development

## Knowledge Gaps
- **47 isolated node(s):** `metadata`, `metadata`, `faqs`, `metadata`, `metadata` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `faqs` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._