package com.example.demo.service;

import com.example.demo.entity.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class MomoPaymentService {

    @Value("${momo.partner-code}")
    private String partnerCode;

    @Value("${momo.access-key}")
    private String accessKey;

    @Value("${momo.secret-key}")
    private String secretKey;

    @Value("${momo.api-endpoint}")
    private String apiEndpoint;

    @Value("${momo.redirect-url}")
    private String redirectUrl;

    @Value("${momo.ipn-url}")
    private String ipnUrl;

    private final HttpClient httpClient;

    public MomoPaymentService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String createPaymentRequest(Order order, String orderInfo) throws Exception {
        System.out.println("Starting MoMo payment request for order #" + order.getId());
        System.out.println("MoMo Config - Partner Code: " + partnerCode);
        System.out.println("MoMo Config - Access Key: " + accessKey);
        System.out.println("MoMo Config - Redirect URL: " + redirectUrl);
        System.out.println("MoMo Config - IPN URL: " + ipnUrl);
        
        // Create unique order ID and request ID for MoMo
        String orderId = "ORDER_" + order.getId() + "_" + System.currentTimeMillis();
        String requestId = orderId;
        long amount = Math.round(order.getTotal());
        String extraData = "";  // Base64 encoded data if needed
        String requestType = "payWithMethod";
        boolean autoCapture = true;
        String lang = "vi";

        System.out.println("MoMo payment parameters - Order ID: " + orderId);
        System.out.println("MoMo payment parameters - Request ID: " + requestId);
        System.out.println("MoMo payment parameters - Amount: " + amount);
        System.out.println("MoMo payment parameters - Order Info: " + orderInfo);

        // Build raw signature string
        String rawSignature = "accessKey=" + accessKey
                + "&amount=" + amount
                + "&extraData=" + extraData
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + partnerCode
                + "&redirectUrl=" + redirectUrl
                + "&requestId=" + requestId
                + "&requestType=" + requestType;

        // Create HMAC SHA256 signature
        String signature = createSignature(rawSignature, secretKey);

        // Create request body
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("partnerCode", partnerCode);
        requestData.put("partnerName", "SkinCare Shop");
        requestData.put("storeId", "SkinCareShopOnline");
        requestData.put("requestId", requestId);
        requestData.put("amount", amount);
        requestData.put("orderId", orderId);
        requestData.put("orderInfo", orderInfo);
        requestData.put("redirectUrl", redirectUrl);
        requestData.put("ipnUrl", ipnUrl);
        requestData.put("lang", lang);
        requestData.put("requestType", requestType);
        requestData.put("autoCapture", autoCapture);
        requestData.put("extraData", extraData);
        requestData.put("signature", signature);

        // Convert to JSON
        String requestBody = convertToJson(requestData);
        System.out.println("MoMo API request body: " + requestBody);

        // Create HTTP request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiEndpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        // Send request and get response
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("MoMo API response status: " + response.statusCode());
        System.out.println("MoMo API response body: " + response.body());

        // Parse response
        Map<String, Object> responseData = parseJsonResponse(response.body());

        // Check if request was successful
        if (responseData.containsKey("payUrl")) {
            System.out.println("MoMo payment URL generated successfully: " + responseData.get("payUrl"));
            return (String) responseData.get("payUrl");
        } else {
            String errorMessage = "Failed to create MoMo payment: " + (responseData.containsKey("message") ? responseData.get("message") : "Unknown error");
            System.err.println(errorMessage);
            throw new RuntimeException(errorMessage);
        }
    }

    public boolean verifyPaymentResponse(String orderId, String requestId, String amount, String resultCode, String transId, String signature) {
        try {
            // Build raw signature string for verification
            String rawSignature = "accessKey=" + accessKey
                    + "&amount=" + amount
                    + "&extraData="
                    + "&orderId=" + orderId
                    + "&orderInfo=Payment for order"
                    + "&partnerCode=" + partnerCode
                    + "&requestId=" + requestId
                    + "&responseTime="
                    + "&resultCode=" + resultCode
                    + "&transId=" + transId;

            // Verify signature
            String expectedSignature = createSignature(rawSignature, secretKey);
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }

    private String createSignature(String data, String secretKey) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSha256.init(keySpec);
        byte[] hmacBytes = hmacSha256.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder result = new StringBuilder();
        for (byte b : hmacBytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    private String convertToJson(Map<String, Object> data) {
        // Simple JSON conversion for demo - in real app use Jackson or Gson
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            if (!first) {
                json.append(",");
            }
            json.append("\"").append(entry.getKey()).append("\":");
            
            if (entry.getValue() instanceof String) {
                json.append("\"").append(entry.getValue()).append("\"");
            } else if (entry.getValue() instanceof Number || entry.getValue() instanceof Boolean) {
                json.append(entry.getValue());
            } else {
                json.append("\"").append(entry.getValue()).append("\"");
            }
            
            first = false;
        }
        json.append("}");
        return json.toString();
    }

    private Map<String, Object> parseJsonResponse(String jsonString) {
        // Simple JSON parsing for demo - in real app use Jackson or Gson
        Map<String, Object> result = new HashMap<>();
        
        try {
            System.out.println("Parsing JSON response: " + jsonString);
            
            // For demo, extract common fields from JSON
            extractJsonField(jsonString, result, "payUrl");
            extractJsonField(jsonString, result, "message");
            extractJsonField(jsonString, result, "resultCode");
            extractJsonField(jsonString, result, "orderId");
            
            System.out.println("Parsed result: " + result);
            return result;
        } catch (Exception e) {
            System.err.println("Error parsing JSON response: " + e.getMessage());
            return result;
        }
    }
    
    private void extractJsonField(String json, Map<String, Object> result, String fieldName) {
        String fieldPattern = "\"" + fieldName + "\"\\s*:\\s*\"([^\"]*)\"";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(fieldPattern);
        java.util.regex.Matcher matcher = pattern.matcher(json);
        
        if (matcher.find()) {
            result.put(fieldName, matcher.group(1));
            System.out.println("Extracted " + fieldName + ": " + matcher.group(1));
        }
    }
} 