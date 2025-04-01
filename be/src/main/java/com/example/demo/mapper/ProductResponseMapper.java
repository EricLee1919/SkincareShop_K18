package com.example.demo.mapper;

import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Product;
import com.example.demo.entity.request.ProductRequest;
import com.example.demo.entity.request.RatingRequest;
import com.example.demo.entity.response.ProductResponse;
import org.modelmapper.PropertyMap;

import java.util.ArrayList;
import java.util.List;

public class ProductResponseMapper extends PropertyMap<Product, ProductResponse> {

    @Override
    protected void configure() {
        List<RatingRequest> feedbacks = new ArrayList<>();
        for(OrderDetail orderDetail: source.getOrderDetails()){
            RatingRequest ratingRequest = new RatingRequest();
            if(orderDetail.getRating() != 0 && orderDetail.getFeedback() != null){
                ratingRequest.setRate(orderDetail.getRating());
                ratingRequest.setFeedback(orderDetail.getFeedback());
            }
            feedbacks.add(ratingRequest);
        }
        map().setFeedback(feedbacks);
    }
}
