package com.example.demo.entity.response;

import com.example.demo.entity.Category;
import com.example.demo.entity.request.RatingRequest;
import com.example.demo.enums.SuitableType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class ProductResponse {
    public long id;
    public String name;
    public float price;
    public int quantity;
    public String image;
    public String code;
    public boolean isDeleted = false;
    Category category;
    List<RatingRequest> feedback;
    private List<SuitableType> suitableTypes;
}
