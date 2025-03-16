package com.example.demo.api;

import com.example.demo.entity.Category;
import com.example.demo.entity.request.CategoryRequest;
import com.example.demo.service.CategoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@SecurityRequirement(name = "api")
public class CategoryAPI {

    @Autowired
    private CategoryService categoryService;

    // GET all categories
    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    // GET category by ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    // POST create a new category
    @PostMapping
    public ResponseEntity<Category> create(@RequestBody CategoryRequest categoryRequest) {
        return ResponseEntity.ok(categoryService.create(categoryRequest));
    }

    // PUT update an existing category
    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody CategoryRequest categoryRequest) {
        return categoryService.update(id, categoryRequest);
    }

    // DELETE a category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return categoryService.delete(id);
    }
}
