package com.example.demo.api;

import com.example.demo.entity.Option;
import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@SecurityRequirement(name = "api")
public class QuestionAPI {

    @Autowired
    QuestionRepository questionRepository;

    @GetMapping
    public List<Question> getAll() {
        return questionRepository.findQuestionsByIsDeletedFalse();
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Question create(@RequestBody Question question) {
        return questionRepository.save(question);
    }

    @PutMapping("/{id}")
    public Question update(@PathVariable Long id, @RequestBody Question updated) {
        return questionRepository.findById(id)
                .map(q -> {
                    q.setName(updated.getName());
                    return questionRepository.save(q);
                }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Question question = questionRepository.findById(id).get();
        question.setDeleted(true);
        questionRepository.save(question);
    }
}
