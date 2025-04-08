package com.example.demo.entity;

import com.example.demo.enums.SuitableType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "options")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id = 0;
    String label;
    SuitableType suitableType;

    boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonIgnore
    Question question;
}
