import { useEffect, useState } from "react";

function AccessDenied() {
  return (
    <section className="panel error-panel">
      <h2>Lab terminal</h2>
      <p>ACCESS REQUIRED. Панель терминала недоступна.</p>
    </section>
  );
}

export function LabTerminal({ accessGranted }) {
  const [status, setStatus] = useState("loading");

  const readings = [];
  for (let i = 0; i < (accessGranted ? 3 : 0); i++) {
    const [reading] = useState("stable");
    readings.push(reading);
  }

  useEffect(() => {
    setStatus("online");
  }, []);

  if (!accessGranted) {
    return <AccessDenied />;
  }

  return (
    <section className="panel terminal-panel">
      <h2>Lab terminal</h2>
      <p>Status: {status}</p>
      <p>Sensors: {readings.join(", ")}</p>
      <p>Диагностика активна. Проверьте восстановление сигнала ниже.</p>
    </section>
  );
}
