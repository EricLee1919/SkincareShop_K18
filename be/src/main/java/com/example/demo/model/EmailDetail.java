package com.example.demo.model;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailDetail {
 String recipient;
 String subject;
 String msgBody;
 String fullName;
 String attachment;
 String buttonValue;
 String link;
}
