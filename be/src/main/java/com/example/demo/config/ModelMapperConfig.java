package com.example.demo.config;

import com.example.demo.entity.Product;
import com.example.demo.entity.request.ProductRequest;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.mapper.ProductMapper;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new ProductMapper());
        modelMapper.addMappings(new OrderMapper());
        modelMapper.typeMap(ProductRequest.class, Product.class)
                .addMappings(mapper -> mapper.skip(Product::setId));
        return modelMapper;
    }
}
