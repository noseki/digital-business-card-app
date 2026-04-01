import { Center, Heading, Stack, Card as ChakraCard, Field, Input, Button, Text, } from "@chakra-ui/react"
import { useState, type ChangeEvent } from "react"
import { Link, useNavigate } from "react-router-dom";

export const Top = () => {
    const [userId, setUserId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // 入力値(ID)の変更を処理する関数
    const onChangeUserId = (e: ChangeEvent<HTMLInputElement>) => setUserId(e.target.value);

    // IDの送信を処理する関数
    const onSubmitUserId = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (userId === "") {
            setError("IDの入力は必須です");
            return;
        }
        navigate(`/cards/${userId}`);
        setError("");
    }

    return (
        <Center minH="100svh" bg="gray.100">
                <Stack my="8" align="center">
                    <Heading fontWeight="bold">デジタル名刺アプリ</Heading>

                    <ChakraCard.Root
                        w="280px"
                        maxW="375px"
                        boxShadow="xl"
                        borderRadius="2xl"
                        overflow="hidden"
                        bg="white"
                    >
                    <form onSubmit={onSubmitUserId}>
                        <ChakraCard.Body>
                                <Field.Root>
                                    <Field.Label htmlFor="user_id">
                                        ID
                                    </Field.Label>
                                    <Input
                                        id="user_id"
                                        value={userId}
                                        onChange={onChangeUserId}
                                        placeholder="IDを入力してください"
                                    />
                                    {error && (
                                        <Text color="red.500" fontSize="sm">
                                            {error}
                                        </Text>
                                    )}
                                </Field.Root>
                        </ChakraCard.Body>
                        <ChakraCard.Footer >
                            <Button type="submit" bg="teal.500" flex="fit-content" >名刺を見る</Button>
                        </ChakraCard.Footer>
                    </form>
                </ChakraCard.Root>
                <Text fontSize="sm">新規登録は
                    <Link to="/cards/register" style={{ color: "blue" }}>
                        こちら
                    </Link>
                </Text>
            </Stack>
        </Center>
    )
}
