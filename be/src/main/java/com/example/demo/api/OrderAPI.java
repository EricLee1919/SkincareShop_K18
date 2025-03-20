package com.example.demo.api;

import com.example.demo.entity.Order;
import com.example.demo.entity.request.OrderRequest;
import com.example.demo.entity.response.PaymentResponse;
import com.example.demo.enums.OrderStatus;
import com.example.demo.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@SecurityRequirement(name = "api")
public class OrderAPI {

    @Autowired
    OrderService orderService;

    @PostMapping(path = "/create")
    public ResponseEntity<PaymentResponse> create(@RequestBody OrderRequest orderRequest) throws Exception {
        // Create order and get the payment response
        PaymentResponse response = orderService.create(orderRequest);
        
        // Ensure the payment response has a valid order ID
        if (response.getOrderId() == null || response.getOrderId().isEmpty()) {
            // Get the latest order for this user to get its ID
            List<Order> userOrders = orderService.getOrdersByUser();
            if (!userOrders.isEmpty()) {
                Order latestOrder = userOrders.get(userOrders.size() - 1);
                response.setOrderId(String.valueOf(latestOrder.getId()));
            } else {
                throw new RuntimeException("Failed to create order");
            }
        }
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("{id}")
    public ResponseEntity updateStatus(@RequestParam OrderStatus status, @PathVariable long id) {
        Order order = orderService.updateStatus(status, id);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity getAll() {
        System.out.println("OrderAPI: getAll method called");
        List<Order> orders = orderService.getAll();
        System.out.println("OrderAPI: Found " + orders.size() + " orders");
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getOrdersByUser() {
        List<Order> orders = orderService.getOrdersByUser();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable long id) {
        Order order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }
}
