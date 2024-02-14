import { Stack, Typography } from "@mui/material";

export const Quote = (props: {
  isQuoteVisible: boolean;
  hideQuote: () => void;
}) => {
  const { isQuoteVisible, hideQuote } = props;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={`quote ${isQuoteVisible ? "visible" : "hidden"}`}
      px={{
        xs: "15px",
        sm: "25px",
        md: "35px",
      }}
    >
      <Typography
        className="quote-text"
        sx={{
          color: "white",
          fontSize: "18px",
          fontStyle: "italic",
        }}
        display={`${isQuoteVisible ? "block" : "none"}`}
      >
        "Anything that can go wrong, will go wrong!"
      </Typography>
      <img
        className="remove-quote"
        src="../../../public/images/Home/RemoveQuote.svg"
        style={{
          cursor: "pointer",
          display: `${isQuoteVisible ? "block" : "none"}`,
        }}
        onClick={hideQuote}
      />
    </Stack>
  );
};
