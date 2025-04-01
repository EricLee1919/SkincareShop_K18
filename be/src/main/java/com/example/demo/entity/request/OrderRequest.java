package com.example.demo.entity.request;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    List<OrderDetailRequest> details;
    public String shippingAddress;
    public String shippingPhone;
    public String shippingReceiverFullName;
    int point;
}
