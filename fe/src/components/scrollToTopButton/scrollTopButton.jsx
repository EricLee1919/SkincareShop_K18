import Button from "@mui/material/Button";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"; // Thêm biểu tượng mũi tên lên

const ScrollToTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Cuộn mượt mà
    });
  };

  return (
    <Button
      variant="contained"
      sx={{
        position: "fixed", // Để nút bấm luôn hiển thị
        bottom: "20px", // Cách đáy trang 20px
        right: "20px", // Cách phải trang 20px
        backgroundColor: "white",
        color: "#B19567",
        fontWeight: "700",
        fontSize: "14px",
        width: "50px", // Đặt chiều rộng
        height: "50px", // Đặt chiều cao
        borderRadius: "50%", // Làm cho nút bấm thành hình tròn
        minWidth: "unset", // Đặt lại giá trị minWidth để không ảnh hưởng đến kích thước
        "&:hover": {
          backgroundColor: "#B19567",
          color: "white",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
      onClick={handleScrollToTop}
    >
      <KeyboardArrowUpIcon />
    </Button>
  );
};

export default ScrollToTopButton;
