export function analyzeInvoices(invoices) {
  const validInvoices = [];
  const invalidInvoices = [];
  const duplicateIds = [];
  const seenIds = new Set([]);

  invoices.forEach((invoice) => {
    const currentId = invoice.id;
    // check if it is in seenIds
    const isAlreadySeen = seenIds.has(currentId);
    if (typeof invoice.id === "string" && isAlreadySeen) {
      // if seen already and is not in duplicateIds add it to duplicate
      if (!duplicateIds.includes(currentId)) {
        duplicateIds.push(currentId);
      }
      return;
    }
    //  case where seen first time.
    if (typeof currentId === "string") {
      seenIds.add(currentId);
    }
    const invoiceStatus = isValidInvoice(invoice);

    if (!invoiceStatus.isValid) {
      invalidInvoices.push({ id: currentId, reasons: invoiceStatus.reasons });
      return;
    }
    // Valid invoices with valid items
    const subtotal = +invoice.items
      .reduce((acc, item) => {
        return (acc += item.quantity * item.unitPrice);
      }, 0)
      .toFixed(2);
    const total = +(subtotal + invoice.tax).toFixed(2);
    validInvoices.push({ ...invoice, subtotal, total });
  });

  // Getting vendor summaries
  // search through all the valid
  //Reduce through the summaries to accumulate the total
  const vendorSummaries = getVendorSummaries(validInvoices);
  const grandTotal = Object.values(vendorSummaries).reduce(
    (acc, validInvoiceSummary) => {
      return (acc += validInvoiceSummary.total);
    },
    0,
  );

  return {
    validInvoices,
    invalidInvoices,
    duplicateIds,
    vendorSummaries,
    grandTotal,
  }; // gets an array of the valid invoices by filtering it
}

// const invoiceSummary = analyzeInvoices(invoices);
// console.log(invoiceSummary);
/*
{
  validInvoices: [],
  invalidInvoices: [],
  duplicateIds: [],
  vendorSummaries: {},
  grandTotal: 0
}
*/

function isValidInvoice(invoice) {
  // prior the else if statement was omitting multiple scenarios. This was due to the else if chaining and just exited the entire edge cases
  let invoiceStatus = { isValid: false, id: invoice?.id, reasons: [] };
  const { id, vendor, date, tax } = invoice;
  if (typeof id !== "string" || id.trim().length === 0) {
    invoiceStatus.reasons.push("Invalid ID");
  }
  if (typeof vendor !== "string" || vendor.trim().length === 0) {
    invoiceStatus.reasons.push("Invalid Vendor");
  }
  if (!isValidDate(date)) {
    invoiceStatus.reasons.push("Invalid Date");
  }
  if (!isValidItemArr(invoice.items)) {
    invoiceStatus.reasons.push("Invalid Items");
  }
  if (!isValidPositiveNumber(tax)) {
    invoiceStatus.reasons.push("Invalid Tax");
  }
  if (invoiceStatus.reasons.length == 0) {
    invoiceStatus.isValid = true;
  }
  return invoiceStatus;
}

function isValidPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidPositiveNumberGreaterThanZero(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

// I found this on Google
function isValidDate(dateString) {
  if (typeof dateString !== "string") return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

function isValidItemArr(items) {
  return !Array.isArray(items) || items.length === 0
    ? false
    : items.every(
        (item) =>
          item !== null &&
          typeof item === "object" &&
          typeof item.name === "string" &&
          item.name.trim().length > 0 &&
          isValidPositiveNumberGreaterThanZero(item.quantity) &&
          isValidPositiveNumber(item.unitPrice),
      );
}

function getVendorSummaries(invoices) {
  return invoices.reduce((summary, invoice) => {
    const vendor = invoice.vendor;
    if (!summary[vendor]) {
      summary[vendor] = {
        invoiceCount: 1,
        subtotal: invoice.subtotal,
        tax: roundMoney(invoice.tax),
        total: invoice.total,
      };
    } else {
      summary[vendor].invoiceCount += 1;
      summary[vendor].subtotal = roundMoney(
        summary[vendor].subtotal + invoice.subtotal,
      );
      summary[vendor].tax = roundMoney(summary[vendor].tax + invoice.tax);
      summary[vendor].total = roundMoney(summary[vendor].total + invoice.total);
    }
    return summary;
  }, {});
}

function roundMoney(value) {
  return Number(value.toFixed(2));
}
