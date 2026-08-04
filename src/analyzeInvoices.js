const invoicesObj = await import("./data.js");
const invoices = invoicesObj.invoices;

export function analyzeInvoices(invoices) {
  // Checking for valid invoices
  let allValidInvoices = invoices.filter(
    (invoice) => isValidInvoice(invoice)?.isValid,
  );

  const duplicates = [];
  // Detecting duplicates
  // get a count of each and anything already counted and has one already then add to the duplicate array and increment the count, anything 2 or more is just incremented, but not added to the duplicate array
  let count = {};
  for (let i = 0; i < invoices.length; i++) {
    if (!count[invoices[i].id]) {
      count[invoices[i].id] = 1;
    } else if (count[invoices[i].id] == 1) {
      count[invoices[i].id]++;
      duplicates.push(invoices[i]);
    } else {
      count[invoices[i].id]++;
    }
  }
  const duplicateIds = duplicates.map((invoice) => invoice.id);
  // valid invoices now still contains duplicates.
  // Lets just reduce through it and take only one of a kind
  const validInvoices = Object.values(
    allValidInvoices.reduce((acc, invoice) => {
      acc[invoice.id] = invoice;
      return acc;
    }, {}),
  );
  // Invalid Invoices
  // utilize the invoice status. Filter through the invoices to find the invalid invoices and gather a new object of {id, reasons[]}
  const invalidInvoices = invoices.flatMap((invoice) => {
    const invoiceStatus = isValidInvoice(invoice);
    if (!invoiceStatus.isValid) {
      // so I need to destructure the properties if I can returning a new object
      return [{ id: invoiceStatus.id, reasons: invoiceStatus.reasons }];
    } else {
      return [];
    }
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

const invoiceSummary = analyzeInvoices(invoices);

console.log(invoiceSummary);
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
  let invoiceStatus = { isValid: false, id: invoice?.id, reasons: [] };
  const { id, vendor, date, tax } = invoice;

  if (id?.length == 0) {
    invoiceStatus.reasons.push("Invalid ID");
  } else if (vendor?.length == 0) {
    invoiceStatus.reasons.push("Invalid Vendor");
  } else if (!isValidDate(date)) {
    invoiceStatus.reasons.push("Invalid Date");
  } else if (!isValidItemArr(invoice.items)) {
    invoiceStatus.reasons.push("Invalid Items");
  } else if (tax < 0) {
    invoiceStatus.reasons.push("Invalid Tax");
  } else {
    if (invoiceStatus.reasons.length == 0) {
      invoiceStatus.isValid = true;
    }
  }
  return invoiceStatus;
}

// console.log(isValidInvoice(invoices[0]));
// I found this on Google
function isValidDate(dateString) {
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
  return items.length == 0
    ? false
    : items.every((item) => item.quantity > 0 && item.unitPrice >= 0);
}

function getVendorSummaries(invoices) {
  return invoices.reduce((summary, invoice) => {
    const itemTotal = invoice.items.reduce((total, item) => {
      return (total += item.quantity * item.unitPrice);
    }, 0);
    const vendor = invoice.vendor;
    if (!summary[vendor]) {
      summary[vendor] = {
        invoiceCount: 1,
        subtotal: itemTotal,
        tax: +invoice.tax.toFixed(2),
        total: itemTotal,
      };
    } else {
      summary[vendor].invoiceCount += 1;
      summary[vendor].subtotal = summary[vendor].subtotal += itemTotal;
      summary[vendor].tax = +(summary[vendor].tax + invoice.tax).toFixed(2);
      summary[vendor].total = summary[vendor].total +=
        itemTotal + summary[vendor].tax;
    }
    return summary;
  }, {});
}
