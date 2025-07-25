# Restaurant POS Frontend

This project is a Restaurant Point of Sale (POS) frontend application built with React and TypeScript. It provides
functionalities for managing orders, tracking sales history, and handling menu items.

## Features

- **Order Tracking**: Users can view and manage current orders, add items to the cart, and process payments.
- **Sales History**: Users can view sales metrics and detailed order history over different periods (daily, weekly,
  monthly).
- **Menu Management**: Users can view, add, edit, and delete menu items.

## Project Structure

```
restaurant-pos-fe
├── src
│   ├── components
│   │   ├── menu-items
│   │   │   └── menu-items-table.tsx
│   │   ├── order-tracking
│   │   │   ├── add-menu-item.tsx
│   │   │   ├── menu-item.tsx
│   │   │   ├── order-cart.tsx
│   │   │   └── payment-modal.tsx
│   │   ├── sales-history
│   │   │   ├── sales-history-overview-card.tsx
│   │   │   └── sales-history-table.tsx
│   │   └── spinners
│   │       ├── manu-item-skeleton.tsx
│   │       └── order-cart-skeleton.tsx
│   ├── hooks
│   │   └── useNotifier.ts
│   ├── pages
│   │   ├── login
│   │   │   └── index.tsx
│   │   ├── menu-items
│   │   │   └── index.tsx
│   │   ├── not-found
│   │   │   └── index.tsx
│   │   ├── order-tracking
│   │   │   └── index.tsx
│   │   ├── sales-history
│   │   │   └── index.tsx
│   │   ├── view-sales-history
│   │   │   └── index.tsx
│   │   └── index.ts
│   ├── routes
│   │   └── index.tsx
│   ├── store
│   │   ├── slice
│   │   │   ├── auth-slice.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types
│   │   ├── cart-item-type.ts
│   │   ├── menu-item-type.ts
│   │   └── order-types.ts
│   └── utils
│       ├── get-relative-time.ts
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd restaurant-pos-fe
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

To start the development server, run:

```bash
pnpm start
```

The application will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT Licence.