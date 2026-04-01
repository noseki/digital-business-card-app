import { fetchSkillOptions, registerUser } from "@/lib/supabaseFunction";
import { Center, Heading, Stack, Card as ChakraCard, Field, Input, Button, Text, Select, Portal, createListCollection, Textarea, type ListCollection, VStack, Spinner } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const CardSchema = z.object({
    user_id: z.string().min(1, { message: "好きな英単語の入力は必須です" }).regex(/^[a-zA-Z]+$/, { message: "半角英語のみで入力してください" }),
    name: z.string().min(1, { message: "お名前の入力は必須です" }),
    description: z.string().min(1, { message: "自己紹介の入力は必須です" }),
    skills: z.array(z.string()).min(1, { message: "好きな技術の入力は必須です" }),
    github_id: z.string().nullable(),
    qiita_id: z.string().nullable(),
    x_id: z.string().nullable(),
});

type CardRegisterFormData = z.infer<typeof CardSchema>;

export const CardRegister = () => {
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CardRegisterFormData>({
        resolver: zodResolver(CardSchema),
        defaultValues: {
            user_id: "",
            name: "",
            description: "",
            skills: [],
            github_id: null,
            qiita_id: null,
            x_id: null,
        },
    });

    const [skillOptions, setSkillOptions] = useState<ListCollection<{ label: string; value: string }> | null>(null);

    useEffect(() => {
        const fetchSkillOption = async () => {
            const SkillOptionData = await fetchSkillOptions();
            const SkillOptions = createListCollection({
                items: SkillOptionData.map((skill) => ({
                    label: skill.name,
                    value: skill.id.toString(),
                })),
            });
        setSkillOptions(SkillOptions);
    };
        fetchSkillOption();
    }, []);

    const onSubmit = async (data: CardRegisterFormData) => {
        try {
            await registerUser(data);
            navigate("/");
        } catch (error) {
            alert("ユーザーの登録に失敗しました: " + error);
        }
    };

    if (!skillOptions) {
        return (
                <VStack colorPalette="teal" mt="20">
                    <Spinner color="colorPalette.600" />
                    <Text color="colorPalette.600">Loading...</Text>
                </VStack>
        );
    }

    return (
        <Center minH="100svh" bg="gray.100">
            <Stack my="8" align="center">
                <Heading fontWeight="bold">新規名刺登録</Heading>

                <ChakraCard.Root
                    w="280px"
                    maxW="375px"
                    boxShadow="xl"
                    borderRadius="2xl"
                    overflow="hidden"
                    bg="white"
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ChakraCard.Body>
                            <Stack gap="4">
                                <Field.Root>
                                    <Field.Label htmlFor="user_id">
                                        好きな英単語
                                        <Text as="span" color="red.500">*</Text>
                                    </Field.Label>
                                    <Input
                                        id="user_id"
                                        {...register("user_id")}
                                        placeholder="sample"
                                    />
                                    {errors.user_id && (
                                        <Text color="red.500" fontSize="sm">
                                            {errors.user_id.message}
                                        </Text>
                                    )}
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label htmlFor="name">
                                        お名前
                                        <Text as="span" color="red.500">*</Text>
                                    </Field.Label>
                                    <Input
                                        id="name"
                                        {...register("name")}
                                        placeholder="山田 太郎"
                                    />
                                    {errors.name && (
                                        <Text color="red.500" fontSize="sm">
                                            {errors.name.message}
                                        </Text>
                                    )}
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label htmlFor="description">
                                        自己紹介
                                        <Text as="span" color="red.500">*</Text>
                                    </Field.Label>
                                    <Textarea
                                        id="description"
                                        {...register("description")}
                                        placeholder="自己紹介を入力してください"
                                        minH="120px"
                                    />
                                    {errors.description && (
                                        <Text color="red.500" fontSize="sm">
                                            {errors.description.message}
                                        </Text>
                                    )}
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label htmlFor="skills">
                                        好きな技術
                                        <Text as="span" color="red.500">*</Text>
                                    </Field.Label>

                                    <Controller
                                        control={control}
                                        name="skills"
                                        render={({ field }) => (
                                            <Select.Root
                                                id="skills"
                                                collection={skillOptions}
                                                multiple
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e.value)}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Control>
                                                    <Select.Trigger>
                                                    <Select.ValueText placeholder="Select Option" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                    <Select.Content>
                                                        {skillOptions.items.map((skill) => (
                                                            <Select.Item item={skill} key={skill.value}>
                                                                {skill.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root>
                                        )}
                                    />
                                    {errors.skills && (
                                        <Text color="red.500" fontSize="sm">
                                            {errors.skills.message}
                                        </Text>
                                    )}
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label htmlFor="github_id">GitHub ID</Field.Label>
                                    <Input
                                        id="github_id"
                                        {...register("github_id")}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label htmlFor="qiita_id">Qiita ID</Field.Label>
                                    <Input
                                        id="qiita_id"
                                        {...register("qiita_id")}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label htmlFor="x_id">X ID</Field.Label>
                                    <Input
                                        id="x_id"
                                        {...register("x_id")}
                                    />
                                </Field.Root>
                            </Stack>
                        </ChakraCard.Body>

                        <ChakraCard.Footer >
                            <Button type="submit" bg="blue.500" flex="fit-content" >登録</Button>
                        </ChakraCard.Footer>
                    </form>
                </ChakraCard.Root>
            </Stack>
        </Center>
    )
}
