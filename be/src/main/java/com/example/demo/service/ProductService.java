package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Product;
import com.example.demo.entity.request.ProductRequest;
import com.example.demo.entity.request.RatingRequest;
import com.example.demo.entity.response.ProductResponse;
import com.example.demo.enums.SuitableType;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public List<ProductResponse> getAllProducts(SuitableType suitableType) {
        List<ProductResponse> productResponses = new ArrayList<>();
        List<Product> products;
        if(suitableType == null){
            products = productRepository.findProductsByIsDeletedFalse();
        }else{
            products = productRepository.findProductsByIsDeletedFalseAndSuitableTypesContaining(suitableType);
        }

        for(Product product: products){
            ProductResponse productResponse = modelMapper.map(product, ProductResponse.class);
            List<RatingRequest> feedbacks = new ArrayList<>();
            for(OrderDetail orderDetail: product.getOrderDetails()){
                RatingRequest ratingRequest = new RatingRequest();
                if(orderDetail.getRating() != 0 && orderDetail.getFeedback() != null){
                    ratingRequest.setRate(orderDetail.getRating());
                    ratingRequest.setFeedback(orderDetail.getFeedback());
                    feedbacks.add(ratingRequest);
                }
            }
            productResponse.setFeedback(feedbacks);
            productResponses.add(productResponse);
        }

        return productResponses;
    }

    // GET product by ID
    public ResponseEntity<ProductResponse> getById(Long id) {
        Product product = productRepository.findProductById(id);
        List<RatingRequest> feedbacks = new ArrayList<>();
        ProductResponse productResponse =  modelMapper.map(product, ProductResponse.class);
        for(OrderDetail orderDetail: product.getOrderDetails()){
            RatingRequest ratingRequest = new RatingRequest();
            if(orderDetail.getRating() != 0 && orderDetail.getFeedback() != null){
                ratingRequest.setRate(orderDetail.getRating());
                ratingRequest.setFeedback(orderDetail.getFeedback());
                feedbacks.add(ratingRequest);
            }
        }
        productResponse.setFeedback(feedbacks);
        return ResponseEntity.ok(productResponse);
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
            product.setSuitableTypes(productRequest.getSuitableTypes());
            product.setCategory(category);
            product.setId(id);
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
