package com.example.demo.entity;

import com.example.demo.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.firebase.database.core.Repo;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id = 0;

    public Date createAt;
    public float total;
    public OrderStatus status = OrderStatus.IN_PROCESS;

    @ManyToOne
    @JoinColumn(name = "account_id")
    public Account account;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    List<OrderDetail> orderDetails = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Report> reports = new ArrayList<>();
}
