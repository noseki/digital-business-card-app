import { Card } from "@/components/molecules/Card";
import { User } from "@/domain/user";
import { render } from "@/test-utils/render";
import { waitFor, screen } from "@testing-library/react";
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

// モックデータを作成
const mockUser = [
    new User (
        "testid",
        "テストユーザー",
        "<p>初めまして！</p>",
        "gituser",
        "qiitauser",
        "xuser",
        "2026-01-01T00:00:00Z",
        ["React", "TypeScript"],
    )
];

vi.mock("@/lib/supabaseFunction", () => {
    return {
        fetchUser: () => vi.fn().mockResolvedValue(mockUser),
    }
});

describe("Cards", () => {
    beforeEach(() => {
        mockUser.length = 0; // モックデータをリセット
        mockUser.push(
            new User (
                "test-id",
                "テストユーザー",
                "<p>初めまして！</p>",
                "gituser",
                "qiitauser",
                "xuser",
                "2026-01-01T00:00:00Z",
                ["React", "TypeScript"],
            )
        );
        render(
            <BrowserRouter>
                <Card user={mockUser[0]} />
            </BrowserRouter>
        );
    });

    test("名前が表示されていること", async () => {
        await waitFor(() => {
            const nameElement = screen.getByText("テストユーザー");
            expect(nameElement).toBeInTheDocument();
        });
    });

    test("自己紹介が表示されていること", async () => {
        await waitFor(() => {
            const descriptionElement = screen.getByText("初めまして！");
            expect(descriptionElement).toBeInTheDocument();
        });
    });

    test("技術が表示されていること", async () => {
        await waitFor(() => {
            const skillElements = screen.getAllByTestId("skill-badge");
            expect(skillElements).toHaveLength(2);
            expect(skillElements[0]).toHaveTextContent("React");
            expect(skillElements[1]).toHaveTextContent("TypeScript");
        });
    });

    test("Githubアイコンが表示されていること", async () => {
        await waitFor(() => {
            const githubLink = screen.getByTestId("github-icon");
            expect(githubLink).toBeInTheDocument();
        })
    });

    test("Qiitaアイコンが表示されていること", async () => {
        await waitFor(() => {
            const qiitaLink = screen.getByTestId("qiita-icon");
            expect(qiitaLink).toBeInTheDocument();
        })
    });

    test("Xアイコンが表示されていること", async () => {
        await waitFor(() => {
            const xLink = screen.getByTestId("x-icon");
            expect(xLink).toBeInTheDocument();
        })
    });

    test("戻るボタンをクリックすると/に遷移する", async () => {
        const backButton = await screen.findByRole("button", { name: "ホームに戻る" });
        await userEvent.setup().click(backButton);

        expect(window.location.pathname).toBe("/");
    });

});
