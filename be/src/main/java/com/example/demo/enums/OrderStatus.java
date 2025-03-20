package com.example.demo.enums;

public enum OrderStatus {
    IN_PROCESS,
    PENDING_PAYMENT,  // For bank transfers awaiting verification
    PAID,
    CANCEL
}
