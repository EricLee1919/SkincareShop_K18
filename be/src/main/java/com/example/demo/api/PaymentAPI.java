package com.example.demo.api;

import com.example.demo.entity.Order;
import com.example.demo.enums.OrderStatus;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.MomoPaymentService;
import com.example.demo.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@SecurityRequirement(name = "api")
public class PaymentAPI {

    @Autowired
    private MomoPaymentService momoPaymentService;

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String requestId,
            @RequestParam(required = false) String amount,
            @RequestParam(required = false) String resultCode,
            @RequestParam(required = false) String transId,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String signature) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Extract order ID from MoMo order ID format (ORDER_xx_timestamp)
            String[] parts = orderId.split("_");
            Long originalOrderId = Long.parseLong(parts[1]);
            
            // Get the order using OrderRepository directly
            Order order = orderRepository.findOrderById(originalOrderId);
            
            if (order == null) {
                response.put("success", false);
                response.put("message", "Order not found");
                return ResponseEntity.ok(response);
            }
            
            // Verify payment
            boolean isValid = momoPaymentService.verifyPaymentResponse(
                    orderId, requestId, amount, resultCode, transId, signature);
            
            if (isValid && "0".equals(resultCode)) {
                // Update order status to PAID
                orderService.updateStatus(OrderStatus.PAID, order.getId());
                
                response.put("success", true);
                response.put("message", "Payment verified successfully");
                response.put("order", order);
                response.put("orderInfo", "Payment for order #" + order.getId());
            } else {
                // Update order status to FAILED or IN_PROCESS based on your enum
                orderService.updateStatus(OrderStatus.IN_PROCESS, order.getId());
                
                response.put("success", false);
                response.put("message", message != null ? message : "Payment verification failed");
                response.put("order", order);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error processing payment verification: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    @GetMapping("/vnpay-verify")
    public ResponseEntity<Map<String, Object>> verifyVnPayPayment(
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String vnp_Amount,
            @RequestParam(required = false) String vnp_BankCode,
            @RequestParam(required = false) String vnp_CardType,
            @RequestParam(required = false) String vnp_OrderInfo,
            @RequestParam(required = false) String vnp_PayDate,
            @RequestParam(required = false) String vnp_ResponseCode,
            @RequestParam(required = false) String vnp_TmnCode,
            @RequestParam(required = false) String vnp_TransactionNo,
            @RequestParam(required = false) String vnp_TxnRef,
            @RequestParam(required = false) String vnp_SecureHash) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("VNPay callback received - OrderInfo: " + vnp_OrderInfo);
            System.out.println("VNPay callback - Direct order ID param: " + orderId);
            System.out.println("VNPay response code: " + vnp_ResponseCode);
            
            // Parse out the order ID from the order info if not provided directly
            Long originalOrderId;
            if (orderId != null && !orderId.isEmpty()) {
                originalOrderId = Long.parseLong(orderId);
            } else if (vnp_OrderInfo != null && vnp_OrderInfo.contains("#")) {
                // Extract from VNPay order info - format "Payment for order #xx"
                String[] parts = vnp_OrderInfo.split("#");
                originalOrderId = Long.parseLong(parts[1].trim());
            } else {
                // Fallback to query param
                originalOrderId = 0L;
                response.put("success", false);
                response.put("message", "Order ID not found in parameters");
                return ResponseEntity.ok(response);
            }
            
            // Get the order
            Order order = orderRepository.findOrderById(originalOrderId);
            
            if (order == null) {
                response.put("success", false);
                response.put("message", "Order not found: " + originalOrderId);
                return ResponseEntity.ok(response);
            }
            
            // VNPay Payment Verification Guide:
            // 1. '00' means success in VNPay
            // 2. Check vnp_ResponseCode for payment status
            // 3. For sandbox testing, use the following test cards:
            //    - For success: any valid card number format, CVV: 123, Expiry date: any future date
            //    - For failure: deliberately enter wrong info
            // 4. In MB Bank ATM mode, you should see the bank account form
            //    - For sandbox, you can use any account number format like 9704366xxxxxxxxx
            //    - Use any name, any future expiry date
            //    - For OTP code in sandbox, use any 6 digits (e.g., 123456)
            
            // '00' means success in VNPay
            if ("00".equals(vnp_ResponseCode)) {
                // Update order status to PAID
                orderService.updateStatus(OrderStatus.PAID, order.getId());
                
                response.put("success", true);
                response.put("message", "Payment verified successfully");
                response.put("order", order);
                
                // Add payment details
                Map<String, String> paymentDetails = new HashMap<>();
                paymentDetails.put("bankCode", vnp_BankCode != null ? vnp_BankCode : "MBBANK");
                paymentDetails.put("cardType", vnp_CardType != null ? vnp_CardType : "ATM");
                paymentDetails.put("amount", vnp_Amount != null ? vnp_Amount : String.valueOf(order.getTotal()));
                paymentDetails.put("transactionNo", vnp_TransactionNo != null ? vnp_TransactionNo : "N/A");
                paymentDetails.put("transactionDate", vnp_PayDate != null ? vnp_PayDate : "N/A");
                paymentDetails.put("merchantAccount", "MB Bank - 0838500046");
                
                response.put("paymentDetails", paymentDetails);
                response.put("verificationGuide", "When testing in sandbox, payment verification is simulated. In production, verify real transfers with your actual MB Bank account.");
            } else {
                // Payment failed or pending
                orderService.updateStatus(OrderStatus.IN_PROCESS, order.getId());
                
                response.put("success", false);
                response.put("message", "Payment verification failed. Response code: " + vnp_ResponseCode);
                response.put("order", order);
                
                // Add sandbox testing guide for failed payments
                Map<String, String> testingGuide = new HashMap<>();
                testingGuide.put("retrySteps", "1. Return to checkout and try again, 2. For sandbox, use any valid account format, 3. Enter OTP 123456");
                response.put("testingGuide", testingGuide);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error processing VNPay verification: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * How to Verify VNPay Payments in Sandbox vs Production:
     * 
     * SANDBOX TESTING:
     * 1. In sandbox mode, use the VNPay test interface
     * 2. When selecting MB Bank, you should see an ATM card form, not credit card form
     * 3. Testing credentials for sandbox:
     *    - Bank: MB Bank (MBBANK)
     *    - Card Number: Any valid format like 9704366xxxxxxxxx (19 digits)
     *    - Cardholder Name: Any name
     *    - Issue Date: Any past date (MM/YY)
     *    - OTP: 123456 (always this in sandbox)
     * 4. VNPay will generate a success response if correct test data is provided
     * 
     * PRODUCTION VERIFICATION:
     * 1. The customer makes a real bank transfer to your MB Bank account
     * 2. You will receive a webhook notification from VNPay with transaction details
     * 3. Your bank account (0838500046) will receive the actual funds
     * 4. Manually confirm the receipt of funds against order records
     * 5. The order status will be updated to PAID if the verification is successful
     * 
     * Note: In production, additional security verification steps would be required
     */
} 