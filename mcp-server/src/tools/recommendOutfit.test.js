import { recommendOutfit } from "../src/tools/recommendOutfit.js";

describe("recommendOutfit - Tests unitarios de lógica de vestimenta", () => {

  // ── Rangos de temperatura ─────────────────────────────────────────────────

  describe("Temperatura < 10°C", () => {
    test("debe recomendar abrigo grueso a 5°C", () => {
      const result = recommendOutfit(5, "despejado");
      expect(result).toContain("abrigo grueso");
      expect(result).toContain("bufanda");
      expect(result).toContain("pantalón largo");
    });

    test("debe recomendar abrigo grueso a -3°C", () => {
      const result = recommendOutfit(-3, "despejado");
      expect(result).toContain("abrigo grueso");
    });

    test("debe recomendar abrigo grueso a exactamente 9.9°C", () => {
      const result = recommendOutfit(9.9, "despejado");
      expect(result).toContain("abrigo grueso");
    });
  });

  describe("Temperatura 10°C - 17.9°C", () => {
    test("debe recomendar chaqueta a 10°C (límite inferior)", () => {
      const result = recommendOutfit(10, "despejado");
      expect(result).toContain("chaqueta ligera");
    });

    test("debe recomendar chaqueta a 14°C", () => {
      const result = recommendOutfit(14, "nublado");
      expect(result).toContain("chaqueta ligera");
    });

    test("debe recomendar chaqueta a 17.9°C (límite superior)", () => {
      const result = recommendOutfit(17.9, "despejado");
      expect(result).toContain("chaqueta ligera");
    });
  });

  describe("Temperatura 18°C - 25.9°C", () => {
    test("debe recomendar ropa cómoda a 18°C (límite inferior)", () => {
      const result = recommendOutfit(18, "parcialmente nublado");
      expect(result).toContain("ropa cómoda");
    });

    test("debe recomendar ropa cómoda a 22°C", () => {
      const result = recommendOutfit(22, "soleado");
      expect(result).toContain("ropa cómoda");
    });

    test("debe recomendar ropa cómoda a 25.9°C (límite superior)", () => {
      const result = recommendOutfit(25.9, "despejado");
      expect(result).toContain("ropa cómoda");
    });
  });

  describe("Temperatura >= 26°C", () => {
    test("debe recomendar ropa ligera a 26°C (límite inferior)", () => {
      const result = recommendOutfit(26, "soleado");
      expect(result).toContain("ropa ligera");
    });

    test("debe recomendar ropa ligera a 35°C", () => {
      const result = recommendOutfit(35, "soleado");
      expect(result).toContain("ropa ligera");
    });
  });

  // ── Condiciones climáticas especiales ─────────────────────────────────────

  describe("Condición: lluvia", () => {
    test("debe agregar paraguas si la condición contiene 'lluvia'", () => {
      const result = recommendOutfit(14, "lluvia moderada");
      expect(result).toContain("paraguas");
    });

    test("debe agregar paraguas si la condición contiene 'llovizna'", () => {
      const result = recommendOutfit(16, "llovizna");
      expect(result).toContain("paraguas");
    });

    test("debe agregar paraguas si la condición contiene 'rain' (inglés)", () => {
      const result = recommendOutfit(14, "light rain");
      expect(result).toContain("paraguas");
    });

    test("debe agregar paraguas si la condición contiene 'drizzle'", () => {
      const result = recommendOutfit(15, "drizzle");
      expect(result).toContain("paraguas");
    });
  });

  describe("Condición: tormenta", () => {
    test("debe advertir de tormenta si la condición contiene 'tormenta'", () => {
      const result = recommendOutfit(18, "tormenta eléctrica");
      expect(result).toContain("Evita salir");
    });

    test("debe advertir de tormenta si la condición contiene 'thunderstorm'", () => {
      const result = recommendOutfit(20, "thunderstorm");
      expect(result).toContain("Evita salir");
    });
  });

  describe("Condición: nieve", () => {
    test("debe recomendar botas si la condición contiene 'nieve'", () => {
      const result = recommendOutfit(2, "nieve ligera");
      expect(result).toContain("botas impermeables");
    });

    test("debe recomendar botas si la condición contiene 'snow'", () => {
      const result = recommendOutfit(0, "snow");
      expect(result).toContain("botas impermeables");
    });
  });

  describe("Viento fuerte", () => {
    test("debe recomendar cortavientos si wind_speed > 30", () => {
      const result = recommendOutfit(20, "despejado", 35);
      expect(result).toContain("cortavientos");
    });

    test("NO debe mencionar cortavientos si wind_speed <= 30", () => {
      const result = recommendOutfit(20, "despejado", 25);
      expect(result).not.toContain("cortavientos");
    });

    test("NO debe mencionar cortavientos si wind_speed es exactamente 30", () => {
      const result = recommendOutfit(20, "despejado", 30);
      expect(result).not.toContain("cortavientos");
    });
  });

  // ── Combinaciones ─────────────────────────────────────────────────────────

  describe("Combinaciones de condiciones", () => {
    test("frío + lluvia debe combinar abrigo Y paraguas", () => {
      const result = recommendOutfit(8, "lluvia intensa");
      expect(result).toContain("abrigo grueso");
      expect(result).toContain("paraguas");
    });

    test("calor + tormenta debe combinar ropa ligera Y advertencia", () => {
      const result = recommendOutfit(28, "thunderstorm");
      expect(result).toContain("ropa ligera");
      expect(result).toContain("Evita salir");
    });
  });

  // ── Casos borde ───────────────────────────────────────────────────────────

  describe("Casos borde", () => {
    test("condición null no debe lanzar error", () => {
      expect(() => recommendOutfit(20, null)).not.toThrow();
    });

    test("condición undefined no debe lanzar error", () => {
      expect(() => recommendOutfit(20, undefined)).not.toThrow();
    });

    test("condición en mayúsculas debe funcionar igual (case-insensitive)", () => {
      const result = recommendOutfit(14, "LLUVIA INTENSA");
      expect(result).toContain("paraguas");
    });
  });
});