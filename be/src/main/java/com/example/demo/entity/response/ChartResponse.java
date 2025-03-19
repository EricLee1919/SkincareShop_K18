package com.example.demo.entity.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ChartResponse {
    List<String> labels;
    Map data;
}
