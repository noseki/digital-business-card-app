import { render } from "@/test-utils/render";
import { screen } from "@testing-library/react";
import { BrowserRouter, } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Top } from "@/components/pages/Top";

const mockedNavigate = vi.fn();
vi.mock(import("react-router-dom"), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

const user = userEvent.setup();

describe("Top", () => {
    beforeEach(() => {
        mockedNavigate.mockClear(); // モックの呼び出し履歴をリセット

        render(
            <BrowserRouter>
                <Top />
            </BrowserRouter>
        );
    });

    test("タイトルが表示されていること", async () => {
        const title = await screen.findByText("デジタル名刺アプリ");
        expect(title).toBeInTheDocument();
    });

    test("IDを入力してボタンを押すと/cards/:idに遷移する", async () => {
        const label = await screen.findByLabelText("ID");
        await user.type(label, "test-id");

        const button = await screen.findByRole("button", { name: "名刺を見る" });
        await user.click(button);

        expect(mockedNavigate).toHaveBeenCalledWith("/cards/test-id");
    });

    test("IDを入力しないでボタンを押すとエラーメッセージが表示", async () => {
        const button = await screen.findByRole("button", { name: "名刺を見る" });
        await user.click(button);

        expect(await screen.findByText("IDの入力は必須です")).toBeInTheDocument();
    });

    test("新規登録はこちらを押すと/cards/registerに遷移する", async () => {
        const link = await screen.findByRole("link", { name: "こちら" });
        await user.click(link);

        expect(window.location.pathname).toBe("/cards/register");
    });
});
