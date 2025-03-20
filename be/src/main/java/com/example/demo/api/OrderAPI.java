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
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@SecurityRequirement(name = "api")
public class OrderAPI {

    @Autowired
    OrderService orderService;

    @PostMapping(path = "/create")
    public ResponseEntity<PaymentResponse> create(@RequestBody OrderRequest orderRequest) throws Exception {

        PaymentResponse response = new PaymentResponse();
        UUID orderId = UUID.randomUUID();
        String urlPayment = orderService.create(orderRequest);

        response.setPaymentUrl(urlPayment);
        response.setOrderId(orderId.toString());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("{id}")
    public ResponseEntity updateStatus(@RequestParam OrderStatus status, @PathVariable long id) {
        Order order = orderService.updateStatus(status, id);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity getAll() {
        List<Order> orders = orderService.getAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getOrdersByUser() {
        List<Order> orders = orderService.getOrdersByUser();
        return ResponseEntity.ok(orders);
    }
}
