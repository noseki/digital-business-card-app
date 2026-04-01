import { supabase } from "../utills/supabase";
import { User } from "../domain/user";

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

