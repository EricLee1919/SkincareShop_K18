package com.example.demo.service;

import com.example.demo.entity.Account;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Rating;
import com.example.demo.entity.request.RatingRequest;
import com.example.demo.enums.OrderStatus;
import com.example.demo.exception.exceptions.NotFoundException;
import com.example.demo.repository.OrderDetailRepository;
import com.example.demo.repository.RatingRepository;
import com.example.demo.utils.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

    @Autowired
    RatingRepository ratingRepository;

    @Autowired
    AccountUtils accountUtils;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    public Rating createRating(RatingRequest ratingRequest) {
        OrderDetail orderDetail = orderDetailRepository.findById(ratingRequest.getOrderDetailId())
                .orElseThrow(() -> new NotFoundException("OrderDetail not found"));

        // check xem order nay da duoc thanh toan chua
        // neu thanh toan roi thi moi dc rating
        // chua thi bao loi
        if(!OrderStatus.PAID.equals(orderDetail.getOrder().getStatus())){
            throw new NotFoundException("Order chua dc thanh toan ma rating cai gi ????");
        }
        Account account = accountUtils.getCurrentAccount();

        // check xem user da rating product nay chua
        // neu roi thi bao loi
        // chua thi tao moi rating
        orderDetail.getProduct().getRatings().stream().forEach(rating -> {
            if (rating.getAccount().getId() == account.getId()){
                throw new NotFoundException("may rating roi ma ???");
            }
        });

        Rating rating = new Rating();
        rating.setAccount(account);
        rating.setRating(ratingRequest.getRating());
        rating.setComment(ratingRequest.getComment());
        rating.setImage(ratingRequest.getImage());
        rating.setProduct(orderDetail.getProduct());

        return ratingRepository.save(rating);
    }
}
