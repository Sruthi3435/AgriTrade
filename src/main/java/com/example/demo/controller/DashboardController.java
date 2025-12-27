package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/farmer")
@CrossOrigin
public class DashboardController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DashboardController(ProductRepository productRepository,
                                     OrderRepository orderRepository,
                                     UserRepository userRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(Principal principal) {

        String email = principal.getName();

        User user = userRepository.findByEmail(email).orElse(null);

        List<Product> products = productRepository.findByFarmerEmail(email);
        List<Order> orders = orderRepository.findByFarmerEmail(email);

        int totalListings = products.size();
        int activeListings = (int) products.stream().filter(p -> !p.isClosed()).count();
        double totalSales = orders.stream().mapToDouble(Order::getFinalPrice).sum();
        int pendingOrders = (int) orders.stream()
                .filter(o -> !"DELIVERED".equalsIgnoreCase(o.getDeliveryStatus()))
                .count();

        // Orders per month (simple count without chart)
        Map<String, Integer> ordersPerMonth = new LinkedHashMap<>();
        for (Order o : orders) {
            String month = o.getCreatedAt().getMonth().toString();
            ordersPerMonth.put(month, ordersPerMonth.getOrDefault(month, 0) + 1);
        }

        // Category-wise purchases
        Map<String, Integer> categoryWise = new HashMap<>();
        for (Order o : orders) {
            Product p = productRepository.findById(o.getProductId()).orElse(null);
            if (p != null) {
                categoryWise.put(p.getCategory(),
                        categoryWise.getOrDefault(p.getCategory(), 0) + 1);
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("userName", user != null ? user.getName() : "Farmer");
        res.put("totalListings", totalListings);
        res.put("activeListings", activeListings);
        res.put("totalSales", totalSales);
        res.put("pendingOrders", pendingOrders);
        res.put("ordersPerMonth", ordersPerMonth);
        res.put("categoryWisePurchases", categoryWise);
        res.put("upcomingTasks", List.of()); // optional

        return res;
    }

}
