package com.example.demo.config;

import com.example.demo.entity.Account;
import com.example.demo.exception.exceptions.AuthorizeException;
import com.example.demo.service.TokenService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.security.SignatureException;
import java.util.List;


@Component
public class Filter extends OncePerRequestFilter {

    @Autowired
    @Qualifier("handlerExceptionResolver")
    HandlerExceptionResolver resolver;

    @Autowired
    TokenService tokenService;

    List<String> PUBLIC_API = List.of(
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/api/login",
            "/api/register",
            "/api/login-google",
            "/api/forgot-password"
    );

    boolean isPermitted(HttpServletRequest request){
        AntPathMatcher patchMatch = new AntPathMatcher();
        String uri = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("Filter checking URI: " + uri + ", Method: " + method);

        if(method.equals("GET") && patchMatch.match("/api/product/**", uri)){
            System.out.println("Allowing GET product request");
            return true; // public api
        }

        // Temporarily allow all orders API requests for debugging
        if(method.equals("GET") && patchMatch.match("/api/orders/**", uri)){
            System.out.println("Allowing GET orders request for debugging");
            return true;
        }

        boolean isPublic = PUBLIC_API.stream().anyMatch(item -> patchMatch.match(item, uri));
        System.out.println("Is public API: " + isPublic);
        return isPublic;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // filterChain.doFilter(request,response); // cho phép truy cập vào controller

        // check trước khi cho truy cập

        String uri = request.getRequestURI();
        System.out.println("Processing request: " + uri);
        if(isPermitted(request)){
            // public API
            System.out.println("Request is permitted, allowing access");
            filterChain.doFilter(request,response);
        }else{
            // không phải là public API => check role
            String token = getToken(request);

            if(token == null){
                // chưa đăng nhập => quăng lỗi
                System.out.println("Token is missing, denying access");
                resolver.resolveException(request, response, null, new AuthorizeException("Authentication token is missing!"));
            }

            Account account = null;
            try{
                account = tokenService.getAccountByToken(token);
            }catch (MalformedJwtException malformedJwtException){
                resolver.resolveException(request, response, null, new AuthorizeException("Authentication token is invalid!"));
            }catch (ExpiredJwtException expiredJwtException){
                resolver.resolveException(request, response, null, new AuthorizeException("Authentication token is expired!"));
            }catch (Exception exception){
                resolver.resolveException(request, response, null, new AuthorizeException("Authentication token is invalid!"));
            }

            // => token chuẩn
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(account, token, account.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            filterChain.doFilter(request,response);
        }
    }

    String getToken(HttpServletRequest request){
        String token = request.getHeader("Authorization");
        if(token == null) return null;
        return token.substring(7);
    }

    // Bearer ajsdalksjdk;asjdl;adsasjldak;




}
