import test from "node:test";
import assert from "node:assert/strict";
import { analyzeInvoices } from "../src/analyzeInvoices.js";
import { invoices } from "../src/data.js";

test("keeps the first invalid invoice and skips a later duplicate", () => {
  const invoices = [
    {
      id: "INV-1",
      vendor: "",
      date: "2026-01-01",
      items: [{ name: "Rice", quantity: 1, unitPrice: 5 }],
      tax: 0,
    },
    {
      id: "INV-1",
      vendor: "Valid Vendor",
      date: "2026-01-01",
      items: [{ name: "Rice", quantity: 1, unitPrice: 5 }],
      tax: 0,
    },
  ];

  const result = analyzeInvoices(invoices);

  assert.equal(result.invalidInvoices.length, 1);
  assert.equal(result.validInvoices.length, 0);
  assert.deepEqual(result.duplicateIds, ["INV-1"]);
});

test("does not work with invoice of invalid date, negative item quantity, and negative tax", () => {
  const invoices = [
    {
      id: "INV-1",
      vendor: "valid vendor2",
      date: "2026-02-31",
      items: [{ name: "Rice", quantity: -11, unitPrice: 5 }],
      tax: -13,
    },
  ];

  const result = analyzeInvoices(invoices);

  assert.deepEqual(result.invalidInvoices[0].reasons, [
    "Invalid Date",
    "Invalid Items",
    "Invalid Tax",
  ]);
  //   assert.equal(result.invalidInvoices.length, 3);
  //   assert.equal(result.validInvoices.length, 0);
  //   assert.equal(result.duplicateIds.length, 0);
});

test("reject a string quantity in item object", () => {
  const invoices = [
    {
      id: "INV-1",
      vendor: "Valid Vendor",
      date: "2026-03-25",
      items: [{ name: "Rice", quantity: "5", unitPrice: 5 }],
      tax: 13,
    },
  ];
  const result = analyzeInvoices(invoices);

  assert.equal(result.invalidInvoices.length, 1);
  assert.equal(result.validInvoices.length, 0);
  assert.deepEqual(result.invalidInvoices[0].reasons, ["Invalid Items"]);
});

test("reject Infinity as a quantity in items object", () => {
  const invoices = [
    {
      id: "INV-1",
      vendor: "Valid Vendor",
      date: "2026-03-25",
      items: [{ name: "Rice", quantity: Infinity, unitPrice: 5 }],
      tax: 13,
    },
  ];

  const result = analyzeInvoices(invoices);
  assert.equal(result.invalidInvoices.length, 1);
  assert.equal(result.validInvoices.length, 0);
  assert.equal(result.duplicateIds.length, 0);
  assert.deepEqual(result.invalidInvoices[0].reasons, ["Invalid Items"]);
});

test("Missing fields should not crash", () => {
  const invoices = [
    {
      id: "INV-1",
    },
  ];
  const result = analyzeInvoices(invoices);
  assert.equal(result.invalidInvoices.length, 1);
  assert.equal(result.validInvoices.length, 0);
  assert.equal(result.duplicateIds.length, 0);
  assert.deepEqual(result.invalidInvoices[0].reasons, [
    "Invalid Vendor",
    "Invalid Date",
    "Invalid Items",
    "Invalid Tax",
  ]);
});

test("Should show first valid occurence followed by a different duplicate", () => {
  const invoices = [
    {
      id: "INV-1",
      vendor: "Valid Vendor",
      date: "2026-03-25",
      items: [{ name: "Rice", quantity: 5, unitPrice: 5 }],
      tax: 13,
    },
    {
      id: "INV-1",
      vendor: "Valid Vendor2",
      date: "2026-03-25",
      items: [{ name: "Rice", quantity: 9, unitPrice: 50 }],
      tax: 23,
    },
  ];
  const result = analyzeInvoices(invoices);
  assert.equal(result.invalidInvoices.length, 0);
  assert.equal(result.validInvoices.length, 1);
  assert.equal(result.duplicateIds.length, 1);
  assert.equal(result.validInvoices[0].subtotal, 25);
  assert.equal(result.validInvoices[0].total, 38);
  assert.deepEqual(result.duplicateIds, ["INV-1"]);
  assert.deepEqual(result.vendorSummaries, {
    "Valid Vendor": {
      invoiceCount: 1,
      subtotal: 25,
      tax: 13,
      total: 38,
    },
  });
  assert.equal(result.grandTotal, 38);
});

test("One vendor with three valid invoices", () => {
  const invoices = [
    {
      id: "INV-1",
      vendor: "Beyond Meats",
      date: "2026-03-25",
      items: [{ name: "Rice", quantity: 4, unitPrice: 5 }],
      tax: 2,
    },
    {
      id: "INV-2",
      vendor: "Beyond Meats",
      date: "2026-03-26",
      items: [{ name: "Beans", quantity: 9, unitPrice: 2 }],
      tax: 2,
    },
    {
      id: "INV-4",
      vendor: "Beyond Meats",
      date: "2026-03-27",
      items: [{ name: "Cheese", quantity: 10, unitPrice: 1 }],
      tax: 2,
    },
  ];

  const result = analyzeInvoices(invoices);

  assert.equal(result.invalidInvoices.length, 0);
  assert.equal(result.validInvoices.length, 3);
  assert.equal(result.duplicateIds.length, 0);
  assert.equal(result.validInvoices[0].subtotal, 20);
  assert.equal(result.validInvoices[0].total, 22);
  assert.equal(result.validInvoices[1].subtotal, 18);
  assert.equal(result.validInvoices[1].total, 20);
  assert.equal(result.validInvoices[2].subtotal, 10);
  assert.equal(result.validInvoices[2].total, 12);

  assert.deepEqual(result.vendorSummaries, {
    "Beyond Meats": {
      invoiceCount: 3,
      subtotal: 48,
      tax: 6,
      total: 54,
    },
  });
  assert.equal(result.grandTotal, 54);
});

test("does not alter the original invoice data passed into it", () => {
  const invoices = [
    {
      id: "INV-1",
      vendor: "Beyond Meats",
      date: "2026-03-25",
      items: [{ name: "Rice", quantity: 4, unitPrice: 5 }],
      tax: 2,
    },
    {
      id: "INV-2",
      vendor: "Beyond Meats",
      date: "2026-03-26",
      items: [{ name: "Beans", quantity: 9, unitPrice: 2 }],
      tax: 2,
    },
  ];
  const original = structuredClone(invoices);

  analyzeInvoices(invoices);

  assert.deepEqual(invoices, original);
});

test("returns an empty analysis result for an empty invoice array", () => {
  const result = analyzeInvoices([]);

  assert.deepEqual(result, {
    validInvoices: [],
    invalidInvoices: [],
    duplicateIds: [],
    vendorSummaries: {},
    grandTotal: 0,
  });
});

test("the supplied dataset produces the exact expected result", () => {
  const result = analyzeInvoices(invoices);

  assert.equal(result.validInvoices.length, 3);
  assert.equal(result.invalidInvoices.length, 2);
  //   assert.equal(result.duplicateIds.length, 1);
  //   assert.equal(result.duplicateIds[0], "INV-1002");
  assert.deepEqual(result.duplicateIds, ["INV-1002"]);
  assert.deepEqual(result.vendorSummaries["Golden Produce"], {
    invoiceCount: 2,
    subtotal: 44,
    tax: 3.15,
    total: 47.15,
  });
  assert.deepEqual(result.vendorSummaries["Pacific Seafood"], {
    invoiceCount: 1,
    subtotal: 142,
    tax: 12.78,
    total: 154.78,
  });

  assert.equal(result.grandTotal, 201.93);
});
