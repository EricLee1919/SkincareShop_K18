package com.example.demo.repository;

import com.example.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByAccountId(Long accountId);
    Order findOrderById(long id);
    @Query(value = "SELECT CONCAT(YEAR(o.create_at), '-', LPAD(MONTH(o.create_at), 2, '0')) AS month_year, " +
            "COALESCE(SUM(o.total), 0) AS revenue " +
            "FROM orders o " +
            "WHERE o.create_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) " +
            "GROUP BY month_year " +
            "ORDER BY month_year",
            nativeQuery = true)
    List<Object[]> getRevenueLastSixMonths();
}
