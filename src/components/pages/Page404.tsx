import { Center, Text } from "@chakra-ui/react";

export const Page404 = () => {
    return (
        <Center minH="100svh" bg="gray.100">
            <Text maxW="375px">
                <p>404 Not Found</p>
                <p>お探しのページは見つかりませんでした。</p>
            </Text>
        </Center>
    )
};
