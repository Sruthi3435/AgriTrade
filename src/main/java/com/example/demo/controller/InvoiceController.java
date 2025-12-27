package com.example.demo.controller;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;
import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;

import static java.awt.SystemColor.text;

@RestController
@RequestMapping("/api/orders")
public class InvoiceController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public InvoiceController(OrderRepository orderRepository,
                             ProductRepository productRepository,
                             UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("download/invoice/{orderId}")
    public void downloadInvoice(@PathVariable Long orderId, HttpServletResponse response) throws Exception {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Product product = productRepository.findById(order.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User retailer = userRepository.findByEmail(order.getRetailerEmail())
                .orElseThrow(() -> new RuntimeException("Retailer not found"));

        User farmer = userRepository.findByEmail(order.getFarmerEmail())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        response.setContentType("application/pdf");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=invoice_" + orderId + ".pdf");

        com.lowagie.text.Document document = new com.lowagie.text.Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Font headingFont = new Font(Font.HELVETICA, 12, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 11);
        Font boldFont = new Font(Font.HELVETICA, 11, Font.BOLD);

        document.open();

        /* ---------- HEADER ---------- */
        Paragraph title = new Paragraph("AGRILINK - INVOICE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Invoice #: " + orderId, boldFont));
        document.add(new Paragraph("Order Date: " + order.getCreatedAt(), normalFont));
        document.add(new Paragraph(" "));

        /* ---------- BILLING INFO ---------- */
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setSpacingBefore(10);
        infoTable.setSpacingAfter(10);
        infoTable.setWidths(new float[]{1, 1});

        PdfPCell left = new PdfPCell();
        left.setBorder(Rectangle.NO_BORDER);
        left.addElement(new Paragraph("Bill To:", headingFont));
        left.addElement(new Paragraph(retailer.getName(), boldFont));
        left.addElement(new Paragraph("Email: " + retailer.getEmail(), normalFont));
        left.addElement(new Paragraph("Phone: " + retailer.getPhone(), normalFont));

        PdfPCell right = new PdfPCell();
        right.setBorder(Rectangle.NO_BORDER);
        right.addElement(new Paragraph("Sold By:", headingFont));
        right.addElement(new Paragraph(farmer.getName(), boldFont));
        right.addElement(new Paragraph("Location: " + product.getLocation(), normalFont));

        infoTable.addCell(left);
        infoTable.addCell(right);
        document.add(infoTable);

        /* ---------- PRODUCT TABLE ---------- */
        PdfPTable productTable = new PdfPTable(4);
        productTable.setWidthPercentage(100);
        productTable.setSpacingBefore(10);
        productTable.setWidths(new float[]{4, 2, 2, 2});

        addTableHeader(productTable, "Product");
        addTableHeader(productTable, "Unit Price");
        addTableHeader(productTable, "Quantity");
        addTableHeader(productTable, "Amount");

        productTable.addCell(new PdfPCell(new Paragraph(product.getName(), normalFont)));
        productTable.addCell(new PdfPCell(new Paragraph("₹" + product.getPrice(), normalFont)));
        productTable.addCell(new PdfPCell(new Paragraph(
                product.getQuantity() + " " + product.getUnit(), normalFont)));
        productTable.addCell(new PdfPCell(new Paragraph("₹" + order.getFinalPrice(), normalFont)));

        document.add(productTable);

        /* ---------- TOTAL ---------- */
        document.add(new Paragraph(" "));
        Paragraph total = new Paragraph("Total Amount: ₹" + order.getFinalPrice(), headingFont);
        total.setAlignment(Element.ALIGN_RIGHT);
        document.add(total);

        /* ---------- STATUS ---------- */
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Payment Status: " + order.getDeliveryStatus(), boldFont));

        /* ---------- FOOTER ---------- */
        document.add(new Paragraph(" "));
        Paragraph footer = new Paragraph(
                "Thank you for choosing AgriLink.\n.",
                normalFont
        );
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();


    }

    private void addTableHeader(PdfPTable table, String text) {
        Font headFont = new Font(Font.HELVETICA, 11, Font.BOLD);
        PdfPCell header = new PdfPCell(new Paragraph(text, headFont));
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        header.setBackgroundColor(new Color(230, 230, 230));
        header.setPadding(8);
        table.addCell(header);
    }
}