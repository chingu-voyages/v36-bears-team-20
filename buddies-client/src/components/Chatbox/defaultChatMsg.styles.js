const styles = ({ palette, spacing }) => {
  const radius = "8px"
  const rightBgColor = "#09f"
  // if you want the same as facebook messenger, use this color '#09f'
  return {
    leftRow: {
      textAlign: "left",
      paddingBottom: 4,
    },
    rightRow: {
      textAlign: "right",
      paddingBottom: 4,
    },
    msg: {
      padding: 10,
      borderRadius: 8,
      marginBottom: 4,
      display: "inline-block",
      wordBreak: "break-word",
      fontFamily:
        // eslint-disable-next-line max-len
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontSize: "14px",
    },
    left: {
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      backgroundColor: "#f5f5f5",
    },
    right: {
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: rightBgColor,
      color: "#fff",
    },
  }
}
export default styles
