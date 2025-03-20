package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.request.ProductRequest;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    // GET all products (excluding deleted)
    public List<Product> getAllProducts() {
        return productRepository.findProductsByIsDeletedFalse();
    }

    // GET product by ID
    public ResponseEntity<Product> getById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST create a new product
    public Product create(ProductRequest productRequest) {
        Product product = modelMapper.map(productRequest, Product.class);
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        return productRepository.save(product);
    }

    // PUT update an existing product
    public ResponseEntity<Product> update(Long id, ProductRequest productRequest) {
        Optional<Product> existingProduct = productRepository.findById(id);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            modelMapper.map(productRequest, product);

            Category category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
            productRepository.save(product);
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE (soft-delete) a product
    public ResponseEntity<Void> delete(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product p = product.get();
            p.setDeleted(true); // Assuming you have a `setDeleted()` method in your entity
            productRepository.save(p);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
