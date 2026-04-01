export class User {
    user_id: string;
    name: string;
    description: string;
    github_url: string | null;
    qiita_url: string | null;
    x_url: string | null;
    created_at: string;
    skills: string[];

    constructor(
        user_id: string,
        name: string,
        description: string,
        github_id: string | null,
        qiita_id: string | null,
        x_id: string | null,
        created_at: string,
        skills: string[]
    ) {
        this.user_id = user_id;
        this.name = name;
        this.description = description;
        this.github_url = convertUrl(github_id, "github.com");
        this.qiita_url = convertUrl(qiita_id, "qiita.com");
        this.x_url = convertUrl(x_id, "x.com");
        this.created_at = created_at;
        this.skills = skills;
    }
}

function convertUrl(id: string | null, host: string) {
    if (!id) return null;
    return `https://${host}/${id}`;
}
