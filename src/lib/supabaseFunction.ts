import { supabase } from "../utils/supabase";
import { User } from "../domain/user";

// 名刺（ユーザー）情報取得
export const fetchUser = async (id: string): Promise<User> => {
    const { data, error } = await supabase.from('users').select("*, skills(id, name)").eq("user_id", id).single();
    if (error) {
        throw new Error(error.message);
    }

    const userData = new User(
        data.user_id,
        data.name,
        data.description,
        data.github_id,
        data.qiita_id,
        data.x_id,
        data.created_at,
        data.skills.map((skill: { id: string; name: string }) => skill.name)
    );

    return userData;
}

// スキル情報取得
export const fetchSkillOptions = async (): Promise<{ id: string; name: string }[]> => {
    const { data, error } = await supabase.from('skills').select("*");
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

type RegisterFormData = {
    user_id: string;
    name: string;
    description: string;
    skills: string[];
    github_id?: string | null;
    qiita_id?: string | null;
    x_id?: string | null;
}

// 名刺（ユーザー）登録
export const registerUser = async (formData: RegisterFormData): Promise<void> => {
    // usersテーブルにユーザーデータを挿入
    const { error: usersError } = await supabase.from('users').insert({
        user_id: formData.user_id,
        name: formData.name,
        description: formData.description,
        github_id: formData.github_id,
        qiita_id: formData.qiita_id,
        x_id: formData.x_id,
    });

    if (usersError) {
        throw new Error(usersError.message);
    }

    // user_skillテーブルにユーザーのスキルデータを挿入
    const { error: userSkillError } = await supabase.from('user_skill').insert(
        formData.skills?.map(skill => ({
            user_id: formData.user_id,
            skill_id: skill,
        }))
    );

    if(userSkillError) {
        throw new Error(userSkillError.message);
    }
}

// 前日（日本時間00:00〜23:59:59）のusersとuser_skillデータを削除する
export const deletePreviousUsersAndUserSkill = async () => {
    const now = new Date();
    const JST_OFFSET = 9 * 60 * 60 * 1000; // 日本時間 (UTC+9) のオフセット

    // JSTでの現在日付を取得
    const nowJST = new Date(now.getTime() + JST_OFFSET);

    // JSTで昨日の日付を取得
    const yesterdayJST = new Date(nowJST);
    yesterdayJST.setUTCDate(nowJST.getUTCDate() - 1);

    // JST 00:00:00 → UTC に変換 (9時間引く)
    const startOfYesterday = new Date(
        Date.UTC(yesterdayJST.getUTCFullYear(), yesterdayJST.getUTCMonth(), yesterdayJST.getUTCDate(), 0, 0, 0)
        - JST_OFFSET
    ).toISOString();

    // JST 23:59:59 → UTC に変換 (9時間引く)
    const endOfYesterday = new Date(
        Date.UTC(yesterdayJST.getUTCFullYear(), yesterdayJST.getUTCMonth(), yesterdayJST.getUTCDate(), 23, 59, 59)
            - JST_OFFSET
    ).toISOString();

    // user_skill テーブルから削除
    const { error: userSkillError } = await supabase
        .from("user_skill")
        .delete()
        .gte("created_at", startOfYesterday)
        .lte("created_at", endOfYesterday);

    if (userSkillError) {
        throw new Error(userSkillError.message);
    }

    // users テーブルから削除
    const { error: usersError } = await supabase
        .from("users")
        .delete()
        .gte("created_at", startOfYesterday)
        .lte("created_at", endOfYesterday);

    if (usersError) {
        throw new Error(usersError.message);
    }
};

