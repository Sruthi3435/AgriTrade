package com.example.demo.service;

import com.example.demo.dto.InvoiceDTO;
import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;


    @Service
    public class InvoiceService {

        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;

        public InvoiceService(OrderRepository orderRepository,
                              ProductRepository productRepository,
                              UserRepository userRepository) {
            this.orderRepository = orderRepository;
            this.productRepository = productRepository;
            this.userRepository = userRepository;
        }

        // ✅ THIS METHOD IS MISSING IN YOUR PROJECT
        public InvoiceDTO buildInvoicePreview(Long orderId) {

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            Product product = productRepository.findById(order.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            User retailer = userRepository.findByEmail(order.getRetailerEmail())
                    .orElseThrow(() -> new RuntimeException("Retailer not found"));

            User farmer = userRepository.findByEmail(order.getFarmerEmail())
                    .orElseThrow(() -> new RuntimeException("Farmer not found"));

            InvoiceDTO dto = new InvoiceDTO();
            dto.setOrderId(order.getId());
            dto.setProductName(product.getName());
            dto.setQuantity(product.getQuantity());

            dto.setFinalPrice(order.getFinalPrice());
            dto.setCreatedAt(order.getCreatedAt());

            dto.setRetailerName(retailer.getName());
            dto.setRetailerEmail(retailer.getEmail());
            dto.setRetailerPhone(retailer.getPhone());

            dto.setFarmerName(farmer.getName());
            dto.setFarmerEmail(farmer.getEmail());
            dto.setFarmerPhone(farmer.getPhone());

            dto.setLocation(product.getLocation());

            return dto;
        }
    }


