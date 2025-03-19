package com.example.demo.api;

import com.example.demo.entity.response.ChartResponse;
import com.example.demo.service.DashboardService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@SecurityRequirement(name = "api")
public class DashboardAPI {

    @Autowired
    DashboardService dashboardService;

    @GetMapping
    public ResponseEntity get(){
        Map response = dashboardService.getReport();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/chart")
    public ResponseEntity getChart(){
        ChartResponse response = dashboardService.getChart();
        return ResponseEntity.ok(response);
    }
}
