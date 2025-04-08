package com.example.demo.entity;

import com.example.demo.enums.SuitableType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id = 0;
    String name;

    @OneToMany(mappedBy = "question")
    List<Option> options = new ArrayList<>();
    boolean isDeleted = false;
}
