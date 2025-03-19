package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.entity.response.ChartResponse;
import com.example.demo.repository.AuthenticationRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;

    public Map<String, Long> getReport(){
        Map<String, Long> response = new HashMap<>();

        double totalRevenue = orderRepository.findAll()
                .stream()
                .mapToDouble(Order::getTotal) // Assuming getTotal() returns a long
                .sum();
        response.put("totalAccount", authenticationRepository.count());
        response.put("totalOrder", orderRepository.count());
        response.put("totalRevenue", (long) totalRevenue);
        response.put("totalProduct", productRepository.count());

        return response;
    }

    public ChartResponse getChart() {
        ChartResponse chartResponse = new ChartResponse();
        List<String> labels = new ArrayList<>();
        Map<String, Long> data = new LinkedHashMap<>();

        // Get the last 6 months including the current month
        for (int i = 5; i >= 0; i--) {
            YearMonth yearMonth = YearMonth.now().minusMonths(i);
            String label = yearMonth.toString(); // Example: "2024-03"
            labels.add(label);
            data.put(label, 0L); // Initialize with zero
        }

        // Fetch revenue per month from the database
        List<Object[]> result = orderRepository.getRevenueLastSixMonths();

        // Populate revenue data into the map
        for (Object[] row : result) {
            String month = row[0].toString(); // Example: "2024-03"
            long revenue = ((Number) row[1]).longValue();
            data.put(month, revenue);
        }

        chartResponse.setLabels(labels);
        chartResponse.setData(data);
        return chartResponse;
    }
}
