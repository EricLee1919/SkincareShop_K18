package com.example.demo.repository;

import com.example.demo.entity.Product;
import com.example.demo.enums.SuitableType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Product findProductById(long id);
    List<Product> findProductsByIsDeletedFalse();
    List<Product> findProductsByIsDeletedFalseAndSuitableTypesContaining(SuitableType suitableType);
}
