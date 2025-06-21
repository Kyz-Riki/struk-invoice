let invoiceCounter = 1;

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const counter = String(invoiceCounter).padStart(3, "0");
  return `INV-${year}${month}${day}-${counter}`;
}

function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("id-ID");
  const time = now.toLocaleTimeString("id-ID");

  document.getElementById("invoiceDate").textContent = date;
  document.getElementById("invoiceTime").textContent = time;
}

function generateInvoice() {
  const merchantName = document.getElementById("merchantName").value;
  const merchantAddress = document.getElementById("merchantAddress").value;
  const customerName = document.getElementById("customerName").value;
  const itemName = document.getElementById("itemName").value;
  const amount = parseInt(document.getElementById("amount").value);
  const notes = document.getElementById("notes").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  // Calculate tax (11% PPN)
  const tax = Math.round(amount * 0.11);
  const total = amount + tax;

  // Update invoice
  document.getElementById("invoiceMerchantName").textContent = merchantName;
  document.getElementById("invoiceMerchantAddress").innerHTML =
    merchantAddress.replace(/\n/g, "<br>");
  document.getElementById("invoiceNumber").textContent =
    generateInvoiceNumber();
  document.getElementById("invoiceCustomer").textContent = customerName;
  document.getElementById("invoiceItemName").textContent = itemName;
  document.getElementById("invoiceItemPrice").textContent =
    formatRupiah(amount);
  document.getElementById("invoiceSubtotal").textContent = formatRupiah(amount);
  document.getElementById("invoiceTax").textContent = formatRupiah(tax);
  document.getElementById("invoiceTotal").textContent = formatRupiah(total);
  document.getElementById("invoicePaymentMethod").textContent = paymentMethod;
  document.getElementById("invoiceNotes").textContent = notes;

  updateDateTime();
  invoiceCounter++;
}

function printInvoice() {
  window.print();
}

function downloadAsImage(format) {
  const invoice = document.getElementById("invoice");

  // Temporarily hide watermark for cleaner image
  const watermark = document.querySelector(".watermark");
  const originalDisplay = watermark.style.display;
  watermark.style.display = "none";

  // Configure html2canvas options
  const options = {
    backgroundColor: "#ffffff",
    scale: 2, // Higher resolution
    useCORS: true,
    allowTaint: true,
    width: invoice.offsetWidth,
    height: invoice.offsetHeight,
    scrollX: 0,
    scrollY: 0,
  };

  html2canvas(invoice, options)
    .then(function (canvas) {
      // Restore watermark
      watermark.style.display = originalDisplay;

      // Create download link
      const link = document.createElement("a");
      const invoiceNumber =
        document.getElementById("invoiceNumber").textContent;
      const filename = `Invoice_${invoiceNumber.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}.${format}`;

      // Convert canvas to blob and download
      canvas.toBlob(
        function (blob) {
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);
        },
        `image/${format}`,
        format === "jpeg" ? 0.95 : 1.0
      );
    })
    .catch(function (error) {
      // Restore watermark in case of error
      watermark.style.display = originalDisplay;
      console.error("Error generating image:", error);
      alert("Terjadi kesalahan saat membuat gambar. Silahkan coba lagi.");
    });
}

document.getElementById("invoiceForm").addEventListener("submit", function (e) {
  e.preventDefault();
  generateInvoice();
});

// Initialize with current date/time
updateDateTime();

// Auto-generate on page load
generateInvoice();
