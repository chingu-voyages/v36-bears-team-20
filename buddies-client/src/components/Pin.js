import * as React from "react";

function Pin() {
  return (
    <i
      className="fas fa-map-marker-alt"
      style={{ fontSize: 50, color: "red", cursor: "pointer" }}
    ></i>
  );
}

export default React.memo(Pin);
