export const invoices = [
  {
    id: "INV-1001",
    vendor: "Golden Produce",
    date: "2026-07-01",
    items: [
      { name: "Thai basil", quantity: 4, unitPrice: 3.5 },
      { name: "Limes", quantity: 10, unitPrice: 0.75 },
    ],
    tax: 1.29,
  },
  {
    id: "INV-1002",
    vendor: "Pacific Seafood",
    date: "2026-07-03",
    items: [
      { name: "Shrimp", quantity: 8, unitPrice: 12.5 },
      { name: "Salmon", quantity: 3, unitPrice: 14 },
    ],
    tax: 12.78,
  },
  {
    id: "INV-1003",
    vendor: "Golden Produce",
    date: "2026-07-06",
    items: [
      { name: "Thai basil", quantity: 2, unitPrice: 3.75 },
      { name: "Mango", quantity: 12, unitPrice: 1.25 },
    ],
    tax: 1.86,
  },
  {
    id: "INV-1002",
    vendor: "Pacific Seafood",
    date: "2026-07-03",
    items: [
      { name: "Shrimp", quantity: 8, unitPrice: 12.5 },
      { name: "Salmon", quantity: 3, unitPrice: 14 },
    ],
    tax: 12.78,
  },
  {
    id: "INV-1004",
    vendor: "Metro Restaurant Supply",
    date: "invalid-date",
    items: [
      { name: "Takeout containers", quantity: 5, unitPrice: 18 },
      { name: "Napkins", quantity: -2, unitPrice: 9 },
    ],
    tax: 7.2,
  },
  {
    id: "INV-1005",
    vendor: "Golden Produce",
    date: "2026-07-10",
    items: [],
    tax: 0,
  },
];
