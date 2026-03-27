import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";


describe("App", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("タイトルがあること", async () => {
    expect(await screen.findByRole("heading", { name: "Get started" })).toBeInTheDocument();
  });
});
