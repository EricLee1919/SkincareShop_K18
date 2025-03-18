package com.example.demo.api;


import com.example.demo.entity.Product;
import com.example.demo.entity.Rating;
import com.example.demo.entity.request.ProductRequest;
import com.example.demo.entity.request.RatingRequest;
import com.example.demo.service.RatingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/rating")
@SecurityRequirement(name = "api")
public class RatingController {

    @Autowired
    RatingService ratingService;

    @PostMapping
    public ResponseEntity createRating( @RequestBody RatingRequest ratingRequest){
        Rating rating = ratingService.createRating(ratingRequest);
        return ResponseEntity.ok(rating);
    }


}
