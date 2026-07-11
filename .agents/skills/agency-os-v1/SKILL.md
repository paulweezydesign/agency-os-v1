```markdown
# agency-os-v1 Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides guidance on contributing to the `agency-os-v1` codebase, a Next.js project written in TypeScript. It covers established coding conventions, file organization, and testing patterns to ensure consistency and maintainability. Use this guide to align your contributions with the project's standards.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `dashboardPage.tsx`

### Import Style
- Use **alias-based imports** instead of relative paths where possible.
  - Example:
    ```typescript
    import { getUser } from '@services/userService';
    ```

### Export Style
- Mixed usage of **named** and **default exports**.
  - Named export example:
    ```typescript
    export function fetchData() { ... }
    ```
  - Default export example:
    ```typescript
    export default function Dashboard() { ... }
    ```

### Commit Patterns
- Commit messages are **freeform** with no strict prefixing.
- Average commit message length: ~29 characters.
  - Example: `fix user auth bug on login`

## Workflows

_No explicit workflows detected in this repository._

## Testing Patterns

- **Test Files:** Use the pattern `*.test.*` for test files.
  - Example: `userService.test.ts`
- **Testing Framework:** Not explicitly specified; check project dependencies for details.
- **Test Example:**
  ```typescript
  // userService.test.ts
  import { getUser } from '@services/userService';

  test('should fetch user by ID', () => {
    const user = getUser(1);
    expect(user.id).toBe(1);
  });
  ```

## Commands
| Command | Purpose |
|---------|---------|
| /contribute | General guidelines for contributing to the codebase |
| /test | Run all test files matching `*.test.*` |
| /lint | Lint code according to project standards |
```