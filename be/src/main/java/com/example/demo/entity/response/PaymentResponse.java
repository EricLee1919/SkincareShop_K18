package com.example.demo.entity.response;

import lombok.Data;

@Data
public class PaymentResponse {
    String paymentUrl;
    String orderId;
}
