package com.example.demo.service;

import com.example.demo.entity.Account;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Product;
import com.example.demo.entity.request.OrderDetailRequest;
import com.example.demo.entity.request.OrderRequest;
import com.example.demo.entity.request.RatingRequest;
import com.example.demo.enums.OrderStatus;
import com.example.demo.repository.AuthenticationRepository;
import com.example.demo.repository.OrderDetailRepository;
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
    OrderDetailRepository orderDetailRepository;

    @Autowired
    AuthenticationRepository authenticationRepository;

    public String create(OrderRequest orderRequest) throws Exception{
        float total = 0;

        List<OrderDetail> orderDetails = new ArrayList<>();
        Order order = modelMapper.map(orderRequest, Order.class);
        order.setOrderDetails(orderDetails);
        order.setAccount(accountUtils.getCurrentAccount());
        order.setCreateAt(new Date());
        order.setApplyPoint(orderRequest.getPoint());

        for(OrderDetailRequest orderDetailRequest: orderRequest.getDetails()){

            OrderDetail orderDetail = new OrderDetail();
            Product product = productRepository.findProductById(orderDetailRequest.getProductId());

            if(product.getQuantity() >= orderDetailRequest.getQuantity()){

                orderDetail.setProduct(product);
                orderDetail.setQuantity(orderDetailRequest.getQuantity());
                orderDetail.setPrice(product.getPrice() * orderDetailRequest.getQuantity());
                orderDetail.setOrder(order);
                orderDetails.add(orderDetail);


                product.setQuantity(product.getQuantity() - orderDetailRequest.getQuantity());
                productRepository.save(product);

                total += orderDetail.getPrice();
            }else {
                throw new RuntimeException("Quantity of "+product.getName()+" is not enough");
            }
        }
        order.setTotal(total - orderRequest.getPoint() * 1000);
        Order newOrder =  orderRepository.save(order);
        return createURLPayment(newOrder);
    }

    public String createURLPayment(Order order) throws Exception{
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime createDate = LocalDateTime.now();
        String formattedCreateDate = createDate.format(formatter);
        String orderId = UUID.randomUUID().toString().substring(0, 6);

        String tmnCode = "K2035S4C";
        String secretKey = "6E93KTQ6EHNWFUIIIGJW3S9URPTN4MOU";
        String vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        String returnURL = "http://localhost:8080/api/vn-pay/return";

        String currCode = "VND";
        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", tmnCode);
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_CurrCode", currCode);
        vnpParams.put("vnp_TxnRef", order.getId()+"");
        vnpParams.put("vnp_OrderInfo", "Thanh toan cho ma GD: " + order.getId()+"");
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Amount", (int) order.getTotal() + "00");
        vnpParams.put("vnp_ReturnUrl", returnURL);
        vnpParams.put("vnp_CreateDate", formattedCreateDate);
        vnpParams.put("vnp_IpAddr", "167.99.74.201");

        StringBuilder signDataBuilder = new StringBuilder();
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            signDataBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            signDataBuilder.append("=");
            signDataBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            signDataBuilder.append("&");
        }
        signDataBuilder.deleteCharAt(signDataBuilder.length() - 1); // Remove last '&'

        String signData = signDataBuilder.toString();
        String signed = generateHMAC(secretKey, signData);

        vnpParams.put("vnp_SecureHash", signed);

        StringBuilder urlBuilder = new StringBuilder(vnpUrl);
        urlBuilder.append("?");
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            urlBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("=");
            urlBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("&");
        }
        urlBuilder.deleteCharAt(urlBuilder.length() - 1); // Remove last '&'
        return urlBuilder.toString();
    }



    private String generateHMAC(String secretKey, String signData) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmacSha512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmacSha512.init(keySpec);
        byte[] hmacBytes = hmacSha512.doFinal(signData.getBytes(StandardCharsets.UTF_8));

        StringBuilder result = new StringBuilder();
        for (byte b : hmacBytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    public void updateOrderStatus(long orderId, OrderStatus status) {
        Order order = orderRepository.findOrderById(orderId);
        order.setStatus(status);
        if(status == OrderStatus.PAID){
            int pointRate = 10000; // 1 point for every 10,000đ
            int totalPoint = (int)  Math.floor(order.total / pointRate);

            order.getAccount().setPoint(order.getAccount().getPoint() + totalPoint - order.getApplyPoint());
            order.setPoint(totalPoint);
            authenticationRepository.save(order.getAccount());
        }
        orderRepository.save(order);
    }

    public Order updateStatus(OrderStatus orderStatus, long id){
        Order order = orderRepository.findOrderById(id);
        order.setStatus(orderStatus);

        if(orderStatus == OrderStatus.PAID){
            int pointRate = 10000; // 1 point for every 10,000đ
            int totalPoint = (int)  Math.floor(order.total / pointRate);
            order.getAccount().setPoint(order.getAccount().getPoint() + totalPoint);
            order.setPoint(totalPoint);
            authenticationRepository.save(order.getAccount());
        }
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser() {
        Account account = accountUtils.getCurrentAccount();
        return orderRepository.findAllByAccountId(account.getId());
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public Order getById(long orderId) {
        return orderRepository.findOrderById(orderId);
    }

    public OrderDetail rating(long id, RatingRequest ratingRequest){
        OrderDetail orderDetail = orderDetailRepository.findOrderDetailById(id);
        orderDetail.setRating(ratingRequest.getRate());
        orderDetail.setFeedback(ratingRequest.getFeedback());
        return orderDetailRepository.save(orderDetail);
    }
}
