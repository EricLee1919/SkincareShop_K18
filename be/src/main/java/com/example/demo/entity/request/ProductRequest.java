package com.example.demo.entity.request;

import com.example.demo.entity.Category;
import com.example.demo.enums.SuitableType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
public class ProductRequest {
    public long id = 0;

    @NotBlank
    public String name;

    @Min(value = 0)
    public float price;

    @Min(value = 0)
    public int quantity;

    @NotBlank
    public String image;

    //PD00001
    @Pattern(regexp = "PD\\d{5}", message = "Code must be PDxxxxx!")
    @Column(unique = true)
    public String code;

    @NotNull
    public long categoryId;

    private List<SuitableType> suitableTypes;
}
