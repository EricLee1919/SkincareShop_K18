package com.example.demo.entity.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingRequest {

    Long orderDetailId;
    int rating;
    String comment;
    String image;

}
