import React, { useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from "@mui/material";
import Products from "../Products";
import ProductGrid from "../../components/product/ProductGrid";
import ProductCard from "../../components/product/ProductCard";

const questions = [
  {
    id: "q1",
    question: "How does your skin feel a few hours after washing?",
    options: [
      { label: "Shiny and greasy", value: "OILY" },
      { label: "Tight and flaky", value: "DRY" },
      { label: "Oily in T-zone, dry elsewhere", value: "COMBINATION" },
      { label: "Itchy or reactive", value: "SENSITIVE" },
      { label: "Feels fine", value: "NORMAL" },
    ],
  },
  {
    id: "q2",
    question: "What describes your pores?",
    options: [
      { label: "Large and visible", value: "OILY" },
      { label: "Small and tight", value: "DRY" },
      {
        label: "Large on nose/forehead, small on cheeks",
        value: "COMBINATION",
      },
      { label: "Red or irritated areas", value: "SENSITIVE" },
      { label: "Not very noticeable", value: "NORMAL" },
    ],
  },
  {
    id: "q3",
    question: "How often does your skin feel irritated or red?",
    options: [
      { label: "Rarely", value: "NORMAL" },
      { label: "Very often", value: "SENSITIVE" },
      { label: "Sometimes", value: "COMBINATION" },
      { label: "When it’s dry", value: "DRY" },
      { label: "When it’s oily", value: "OILY" },
    ],
  },
  {
    id: "q4",
    question: "How does your skin feel when you wake up in the morning?",
    options: [
      { label: "Oily or shiny", value: "OILY" },
      { label: "Dry or rough", value: "DRY" },
      { label: "Oily in some spots, dry in others", value: "COMBINATION" },
      { label: "Tingling or uncomfortable", value: "SENSITIVE" },
      { label: "Comfortable and balanced", value: "NORMAL" },
    ],
  },
  {
    id: "q5",
    question: "How does your skin react to new skincare products?",
    options: [
      { label: "Breaks out or becomes red easily", value: "SENSITIVE" },
      { label: "No issues usually", value: "NORMAL" },
      { label: "Gets oily quickly", value: "OILY" },
      { label: "Feels dry or tight", value: "DRY" },
      { label: "Depends on the area", value: "COMBINATION" },
    ],
  },
  {
    id: "q6",
    question: "What is your main skin concern?",
    options: [
      { label: "Excess oil / acne", value: "OILY" },
      { label: "Dry patches / flakiness", value: "DRY" },
      { label: "Sensitivity or redness", value: "SENSITIVE" },
      { label: "T-zone oiliness, cheek dryness", value: "COMBINATION" },
      { label: "Just want to maintain healthy skin", value: "NORMAL" },
    ],
  },
];

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
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
  const [products, setProducts] = useState([]);

  const handleChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) return;

    const skinType = getSkinTypeFromScores(answers);
    setResult(skinType);

    try {
      const response = await fetch(
        `http://localhost:8080/api/product?suitableType=${skinType}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        What's Your Skin Type?
      </Typography>

      {questions.map((q) => (
        <Card key={q.id} sx={{ mb: 2 }}>
          <CardContent sx={{ py: 1.5 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                {q.question}
              </FormLabel>
              <RadioGroup
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                {q.options.map((opt, i) => (
                  <FormControlLabel
                    key={i}
                    value={opt.value}
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

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < questions.length}
        sx={{ mt: 2 }}
      >
        Show My Skin Type
      </Button>

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
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
