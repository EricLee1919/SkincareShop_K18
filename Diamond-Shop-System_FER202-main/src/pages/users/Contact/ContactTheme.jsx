import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B19567", // màu viền mặc định
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#535140", // màu viền khi hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B19567", // màu viền khi focus
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#B19567",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bo góc cho button
          padding: "10px 20px", // Padding cho button
        },
        containedPrimary: {
          backgroundColor: "#B19567",
          "&:hover": {
            backgroundColor: "#CBD2DD",
            color: "#B19567",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "black", // Màu cho đường link
          textDecoration: "underline", // Gạch chân cho đường link
          "&:hover": {
            textDecoration: "none", // Loại bỏ gạch chân khi hover
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fill: "#000000", // Màu sắc cho icon
        },
      },
    },
  },
});