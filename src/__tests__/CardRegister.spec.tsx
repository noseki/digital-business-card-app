import { CardRegister } from "@/components/pages/CardRegister";
import { render } from "@/test-utils/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

const { mockFetchSkillOptions, mockRegisterUser } = vi.hoisted(() => {
    return {
        mockFetchSkillOptions: vi.fn(),
        mockRegisterUser: vi.fn(),
    };
});

vi.mock("@/lib/supabaseFunction", () => {
    return {
        fetchSkillOptions: mockFetchSkillOptions,
        registerUser: mockRegisterUser,
    }
});

const user = userEvent.setup();

describe("CardRegister", () => {
    beforeEach(() => {
        mockFetchSkillOptions.mockResolvedValue([
            { id: "1", name: "React" },
            { id: "2", name: "TypeScript" }
        ]);
        mockRegisterUser.mockResolvedValue(Promise.resolve());
        render(
            <BrowserRouter>
                <CardRegister />
            </BrowserRouter>
        );
    });

    test("タイトルが表示されていること", async () => {
        const title = await screen.findByText("新規名刺登録");
        expect(title).toBeInTheDocument();
    });

    test("全項目入力して登録ボタンを押すと/に遷移する", async () => {
        const userIdInput = await screen.findByLabelText(/好きな英単語/);
        const nameInput = await screen.findByLabelText(/お名前/);
        const descriptionInput = await screen.findByLabelText(/自己紹介/);
        const skillsOption = await screen.findByRole("combobox");
        const githubInput = await screen.findByLabelText("GitHub ID");
        const qiitaInput = await screen.findByLabelText("Qiita ID");
        const xInput = await screen.findByLabelText("X ID");

        await user.type(userIdInput, "testid");
        await user.type(nameInput, "テストユーザー");
        await user.type(descriptionInput, "初めまして！");

        await user.click(skillsOption);
        await waitFor(() => {
            expect(skillsOption).toHaveAttribute("aria-expanded", "true");
        });

        const reactOption = await screen.findByRole("option", { name: "React" });
        await user.click(reactOption);

        await user.type(githubInput, "gituser");
        await user.type(qiitaInput, "qiitauser");
        await user.type(xInput, "xuser");

        const registerButton = await screen.findByRole("button", { name: "登録" });
        await user.click(registerButton);

        await waitFor(() => {
            expect(mockRegisterUser).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith("/")
        })
    });

    test("必須項目(ID/名前/自己紹介/好きな技術)を入力しないとエラーがでる", async () => {
        const registerButton = await screen.findByRole("button", { name: "登録" });
        await user.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText("好きな英単語の入力は必須です")).toBeInTheDocument();
            expect(screen.getByText("お名前の入力は必須です")).toBeInTheDocument();
            expect(screen.getByText("自己紹介の入力は必須です")).toBeInTheDocument();
            expect(screen.getByText("好きな技術の入力は必須です")).toBeInTheDocument();
        })
    });

    test("オプションを入力しなくても登録ができる", async () => {
        const userIdInput = await screen.findByLabelText(/好きな英単語/);
        const nameInput = await screen.findByLabelText(/お名前/);
        const descriptionInput = await screen.findByLabelText(/自己紹介/);
        const skillsOption = await screen.findByRole("combobox");

        await user.type(userIdInput, "testid");
        await user.type(nameInput, "テストユーザー");
        await user.type(descriptionInput, "初めまして！");

        await user.click(skillsOption);
        await waitFor(() => {
            expect(skillsOption).toHaveAttribute("aria-expanded", "true");
        });

        const reactOption = await screen.findByRole("option", { name: "React" });
        await user.click(reactOption);

        const registerButton = await screen.findByRole("button", { name: "登録" });
        await user.click(registerButton);

        await waitFor(() => {
            expect(mockRegisterUser).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith("/")
        })
    });

});



