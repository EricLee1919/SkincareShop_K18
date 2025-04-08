import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import ProductCard from "../../components/product/ProductCard";
import axios from "axios";

function getSkinTypeFromScores(scores) {
  const count = {};
  Object.values(scores).forEach((val) => {
    count[val] = (count[val] || 0) + 1;
  });
  let topType = "NORMAL";
  let max = 0;
  for (const type in count) {
    if (count[type] > max) {
      topType = type;
      max = count[type];
    }
  }
  return topType;
}

export default function QuizTest() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios("http://localhost:8080/api/questions");
        const data = await res.data;
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) return;

    const skinType = getSkinTypeFromScores(answers);
    setResult(skinType);

    try {
      const response = await axios(
        `http://localhost:8080/api/product?suitableType=${skinType}`
      );
      const data = await response.data;
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult("");
    setProducts([]);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        What's Your Skin Type?
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!result &&
            questions.map((q) => (
              <Card key={q.id} sx={{ mb: 2 }}>
                <CardContent sx={{ py: 1.5 }}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1 }}>
                      {q.name}
                    </FormLabel>
                    <RadioGroup
                      value={answers[q.id] || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    >
                      {q.options.map((opt, i) => (
                        <FormControlLabel
                          key={i}
                          value={opt.suitableType}
                          control={<Radio size="small" />}
                          label={opt.label}
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            ))}

          {!result && (
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              sx={{ mt: 2 }}
            >
              Show My Skin Type
            </Button>
          )}

          {result && (
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h6">Your Skin Type:</Typography>
                <Typography sx={{ mt: 1, mb: 2 }}>
                  {result.charAt(0) + result.slice(1).toLowerCase()} Skin
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Recommended Products:
                </Typography>
                <Grid container spacing={2}>
                  {products.map((product) => (
                    <Grid item key={product.id} xs={6}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
                <Button fullWidth onClick={handleReset} sx={{ mt: 3 }}>
                  Retake Quiz
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
