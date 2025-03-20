package com.example.demo.service;

import com.example.demo.entity.Account;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Product;
import com.example.demo.entity.request.OrderDetailRequest;
import com.example.demo.entity.request.OrderRequest;
import com.example.demo.enums.OrderStatus;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.utils.AccountUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AccountUtils accountUtils;

    @Autowired
    MomoPaymentService momoPaymentService;

    public String create(OrderRequest orderRequest) throws Exception {
        float total = 0;

        List<OrderDetail> orderDetails = new ArrayList<>();
        Order order = modelMapper.map(orderRequest, Order.class);
        order.setOrderDetails(orderDetails);
        order.setAccount(accountUtils.getCurrentAccount());

        for(OrderDetailRequest orderDetailRequest: orderRequest.getDetails()) {
            OrderDetail orderDetail = new OrderDetail();
            Product product = productRepository.findProductById(orderDetailRequest.getProductId());

            if(product.getQuantity() >= orderDetailRequest.getQuantity()) {
                orderDetail.setProduct(product);
                orderDetail.setQuantity(orderDetailRequest.getQuantity());
                orderDetail.setPrice(product.getPrice() * orderDetailRequest.getQuantity());
                orderDetail.setOrder(order);
                orderDetails.add(orderDetail);

                product.setQuantity(product.getQuantity() - orderDetailRequest.getQuantity());
                productRepository.save(product);

                total += orderDetail.getPrice();
            } else {
                throw new RuntimeException("Quantity is not enough");
            }
        }
        
        order.setTotal(total);
        // Save order first to get ID
        Order newOrder = orderRepository.save(order);
        
        // Generate payment URL based on payment method
        String paymentMethod = orderRequest.getPaymentMethod();
        System.out.println("Creating order with payment method: " + paymentMethod);
        
        try {
            if (paymentMethod != null && paymentMethod.equals("MOMO")) {
                System.out.println("Generating MoMo payment URL for order #" + newOrder.getId());
                String momoPaymentUrl = momoPaymentService.createPaymentRequest(newOrder, "Payment for order #" + newOrder.getId());
                System.out.println("Generated MoMo payment URL: " + momoPaymentUrl);
                return momoPaymentUrl;
            } else if (paymentMethod != null && paymentMethod.equals("VNPAY")) {
                // Using VNPay to process MB Bank transfer
                System.out.println("Processing MB Bank transfer payment for order #" + newOrder.getId());
                return createURLPayment(newOrder);
            } else {
                // Fallback to default payment gateway
                System.out.println("Using default payment method for order #" + newOrder.getId());
        return createURLPayment(newOrder);
    }
        } catch (Exception e) {
            // Log error and update order status
            System.err.println("Error creating payment: " + e.getMessage());
            e.printStackTrace();
            
            // Update order status to indicate payment error
            newOrder.setStatus(OrderStatus.IN_PROCESS);
            orderRepository.save(newOrder);
            
            throw e; // Rethrow to let controller handle it
        }
    }

    public String createURLPayment(Order order) throws Exception {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = String.valueOf(order.getId());
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = "K2035S4C";
        String vnp_Locale = "vn";
        String vnp_CurrCode = "VND";
        String vnp_OrderType = "other";
        String vnp_OrderInfo = "Payment for order #" + order.getId();
        String vnp_SecretKey = "6E93KTQ6EHNWFUIIIGJW3S9URPTN4MOU";
        String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        
        // Force bank transfer/ATM form to be shown directly
        String vnp_CardType = "ATM";
        String vnp_BankCode = "MBBANK"; // Explicitly select MB Bank
        
        long amount = Math.round(order.getTotal() * 100);
        
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_BankCode", vnp_BankCode);
        vnp_Params.put("vnp_CardType", vnp_CardType);
        vnp_Params.put("vnp_Payment_Type", vnp_CardType);
        vnp_Params.put("vnp_CreateDate", getFormattedDateTime());
        vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_ReturnUrl", "http://localhost:5173/payment-result?orderId="+order.getId());
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        
        // Add merchant information for better visibility
        vnp_Params.put("vnp_Merchant", "SkinCare Shop K18");
        
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        
        String queryUrl = query.toString();
        String vnp_SecureHash = hmacSHA512(vnp_SecretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnp_PayUrl + "?" + queryUrl;
        
        System.out.println("Created VNPay bank transfer URL: " + paymentUrl);
        return paymentUrl;
    }
    
    private String hmacSHA512(String key, String data) throws Exception {
        Mac sha512Hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA512");
        sha512Hmac.init(secretKeySpec);
        byte[] hmacData = sha512Hmac.doFinal(data.getBytes());
        return bytesToHex(hmacData);
    }
    
    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    public Order updateStatus(OrderStatus orderStatus, long id){
        Order order = orderRepository.findOrderById(id);
        order.setStatus(orderStatus);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser() {
        Account account = accountUtils.getCurrentAccount();
        return orderRepository.findAllByAccountId(account.getId());
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    private String getFormattedDateTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return LocalDateTime.now().format(formatter);
    }
}
