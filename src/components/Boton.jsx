import { useState } from "react";

export function elBoton() {
  const [Boton, setBoton] = useState(false);
  return (
    <>
      <div>
        <button onClick={setBoton(!Boton)}>{Boton ? "login" : "cerrar"}</button>
      </div>
      {Boton && <elBoton />};
    </>
  );
}
