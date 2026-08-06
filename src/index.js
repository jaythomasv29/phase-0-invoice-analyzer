import { invoices } from "../src/data.js";
import { analyzeInvoices } from "./analyzeInvoices.js";

const summary = analyzeInvoices(invoices);

console.log(summary);
