package com.example.demo.api;

import com.example.demo.enums.OrderStatus;
import com.example.demo.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.xml.bind.DatatypeConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/api/vn-pay")
@SecurityRequirement(name = "api")
public class VNPayController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/return")
    public ResponseEntity<Void> handleVnPayReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        String vnpTxnRef = params.get("vnp_TxnRef"); // Your orderId
        String vnpResponseCode = params.get("vnp_TransactionStatus"); // "00" = success
        String vnpSecureHash = params.get("vnp_SecureHash");

        // TODO: Verify vnpSecureHash here using your VNPAY secret key

        boolean isValid = verifyVnPayHash(params, vnpSecureHash); // implement this

        boolean isSuccess = "00".equals(vnpResponseCode);
        orderService.updateOrderStatus(Long.parseLong(vnpTxnRef), isSuccess ? OrderStatus.PAID : OrderStatus.CANCEL);

        String redirectUrl = "http://localhost:5173/orders" + "?status=" + (isSuccess ? "success" : "fail");
        response.sendRedirect(redirectUrl);

        return ResponseEntity.ok().build();
    }

    private boolean verifyVnPayHash(Map<String, String> params, String secureHash) {
        // Remove vnp_SecureHash and sort params by key
        Map<String, String> sortedParams = new TreeMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (!entry.getKey().equals("vnp_SecureHash") && !entry.getKey().equals("vnp_SecureHashType")) {
                sortedParams.put(entry.getKey(), entry.getValue());
            }
        }

        // Build hash data
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            if (hashData.length() > 0) hashData.append('&');
            hashData.append(entry.getKey()).append('=').append(entry.getValue());
        }

        String secretKey = "6E93KTQ6EHNWFUIIIGJW3S9URPTN4MOU";
        String calculatedHash = hmacSHA512(secretKey, hashData.toString());
        return calculatedHash.equals(secureHash);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return DatatypeConverter.printHexBinary(bytes).toUpperCase();
        } catch (Exception e) {
            return "";
        }
    }

}
