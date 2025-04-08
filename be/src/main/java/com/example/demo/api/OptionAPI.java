package com.example.demo.api;

import com.example.demo.entity.Option;
import com.example.demo.entity.Question;
import com.example.demo.repository.OptionRepository;
import com.example.demo.repository.QuestionRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/options")
@SecurityRequirement(name = "api")
public class OptionAPI {

    @Autowired
    OptionRepository optionRepository;

    @Autowired
    QuestionRepository questionRepository;

    @GetMapping
    public List<Option> getAll() {
        return optionRepository.findOptionsByIsDeletedFalse();
    }

    @GetMapping("/{id}")
    public Option getById(@PathVariable Long id) {
        return optionRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Option create(@RequestBody Option option, @RequestParam long questionId) {
        Question question = questionRepository.findById(questionId).orElse(null);
        option.setQuestion(question);
        return optionRepository.save(option);
    }

    @PutMapping("/{id}")
    public Option update(@PathVariable Long id, @RequestBody Option updated) {
        return optionRepository.findById(id)
                .map(o -> {
                    o.setLabel(updated.getLabel());
                    o.setSuitableType(updated.getSuitableType());
                    if (updated.getQuestion() != null) {
                        Question question = questionRepository.findById(updated.getQuestion().getId()).orElse(null);
                        o.setQuestion(question);
                    }
                    return optionRepository.save(o);
                }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Option option = optionRepository.findById(id).get();
        option.setDeleted(true);
        optionRepository.save(option);
    }
}
