package com.example.demo.entity.response;

import lombok.Data;

@Data
public class PaymentResponse {
    private String paymentUrl;
    private String orderId;
}
