import * as React from "react";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

function Pin() {
  return (
    <AddLocationAltIcon
      sx={{ color: "red", cursor: "pointer", fontSize: 50 }}
    />
  );
}

export default React.memo(Pin);
