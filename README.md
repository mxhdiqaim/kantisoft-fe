# Kantisoft Frontend

A modern Point of Sale (POS) frontend for stores and restaurants, built with React and TypeScript.

## About Kantisoft

**Kanti** is a name rooted in Hausa, one of Nigeria's major languages. It means **"Store"**, **Mart**, **Supermarket**
or **"Shop"**.

- **Pronunciation:** "Kahn-tee" (with 'a' as in "car", and 't' as in "to").

## Features

- **Order Management:** Track, create, and manage store or restaurant orders.
- **Sales History:** View and export sales data by day, week, month, or all time.
- **Menu Management/Products:** Add, edit, and remove menu items.
- **User Management:** Manage staff and guest accounts with role-based permissions.
- **Activity Log:** Audit user actions (manager/admin only).
- **Store Management:** Manage multiple restaurant locations.
- **Authentication:** Secure login and password management.

## Project Structure

```
src/
  components/      # Reusable UI and feature components
  hooks/           # Custom React hooks
  pages/           # Page-level components (routes)
  routes/          # App routing
  store/           # Redux store and slices (RTK Query)
  types/           # TypeScript types and enums
  utils/           # Utility functions
```

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2. **Start the development server with Docker:**

    ```bash
    docker compose up
    ```
*Ensure you have Docker installed and running.*

Or install it without Docker (pnpm) highly discouraged

3. **Install dependencies:**

    ```bash
    pnpm install
    ```

4. **Start the development server:**

    ```bash
    pnpm start
    ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

<!-- ## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License -->
