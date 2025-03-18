package com.example.demo.api;


import com.example.demo.service.ReportService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/report")
@SecurityRequirement(name = "api")
public class ReportController {

    @Autowired
    ReportService reportService;





}
