package com.example.demo.repository;

import com.example.demo.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findOptionsByIsDeletedFalse();
}
