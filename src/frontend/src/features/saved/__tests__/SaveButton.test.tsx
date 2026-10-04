import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SaveButton } from "../SaveButton";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SaveButton", () => {
  it("renders save button initially", () => {
    render(<SaveButton userId="user-123" productId="prod-001" isSaved={false} />);
    expect(screen.getByTestId("save-button-prod-001")).toBeInTheDocument();
    expect(screen.getByText("Save for Later")).toBeInTheDocument();
  });

  it("toggles state optimistically", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 201,
    } as Response);

    render(<SaveButton userId="user-123" productId="prod-001" isSaved={false} />);
    await user.click(screen.getByTestId("save-button-prod-001"));
    expect(screen.getByText("Unsave")).toBeInTheDocument();
  });

  it("shows cap message on 409", async () => {
    const user = userEvent.setup();
    const onCapHit = vi.fn();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 409,
    } as Response);

    render(<SaveButton userId="user-123" productId="prod-001" isSaved={false} onCapHit={onCapHit} />);
    await user.click(screen.getByTestId("save-button-prod-001"));
    expect(onCapHit).toHaveBeenCalled();
  });
});
