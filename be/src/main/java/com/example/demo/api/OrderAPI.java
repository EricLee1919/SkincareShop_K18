package com.example.demo.api;

import com.example.demo.entity.Order;
import com.example.demo.entity.request.OrderRequest;
import com.example.demo.enums.OrderStatus;
import com.example.demo.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@SecurityRequirement(name = "api")
public class OrderAPI {

    @Autowired
    OrderService orderService;

    @PostMapping
    public ResponseEntity create(@RequestBody OrderRequest orderRequest) throws Exception{
        String urlPayment = orderService.create(orderRequest);
        return ResponseEntity.ok(urlPayment);
    }

    @PatchMapping("{id}")
    public ResponseEntity updateStatus(@RequestParam OrderStatus status, @PathVariable long id) {
        Order order = orderService.updateStatus(status, id);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity getAll(){
        List<Order> orders = orderService.getAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user")
    public ResponseEntity getOrdersByUser(){
        List<Order> orders = orderService.getOrdersByUser();
        return ResponseEntity.ok(orders);
    }
}
