package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.entity.request.CategoryRequest;
import com.example.demo.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    // GET all categories
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    // GET category by ID
    public ResponseEntity<Category> getById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST create a new category
    public Category create(CategoryRequest categoryRequest) {
        Category category = modelMapper.map(categoryRequest, Category.class);
        return categoryRepository.save(category);
    }

    // PUT update an existing category
    public ResponseEntity<Category> update(Long id, CategoryRequest categoryRequest) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            Category category = existingCategory.get();
            modelMapper.map(categoryRequest, category);
            categoryRepository.save(category);
            return ResponseEntity.ok(category);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE a category by ID
    public ResponseEntity<Void> delete(Long id) {
        if (categoryRepository.existsById(id)) {
            Category category = categoryRepository.findCategoryById(id);
            category.setDeleted(true);
            categoryRepository.save(category);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}