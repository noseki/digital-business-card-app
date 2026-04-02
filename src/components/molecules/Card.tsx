import type React from "react";
import { User } from '../../domain/user';
import {
    Stack,
    Card as ChakraCard,
    Text,
    HStack,
    Center,
    Badge,
    Separator,
    Box,
    Button,
} from '@chakra-ui/react';
import { memo } from "react";
import { FaGithub } from "react-icons/fa";
import { SiQiita } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface CardProps {
    user: User;
}

export const Card: React.FC<CardProps> = memo(({ user }) => {
    return (
        <Center minH="100svh" px="4" bg="gray.100">
            <Stack
                w="full"
                maxW="375px"
            >
                {/* iPhone SE: 375px を基準。PCでは中央に収まる */}
                <ChakraCard.Root

                    boxShadow="xl"
                    borderRadius="2xl"
                    overflow="hidden"
                    bg="white"
                >

                    <ChakraCard.Body gap="5" pt="0" px="5" pb="5">
                        {/* 名前 */}
                        <Stack align="center" gap="2" mt="8">
                            <Text fontSize="lg" fontWeight="bold" color="gray.800" letterSpacing="tight">
                                {user.name}
                            </Text>
                        </Stack>

                        <Separator borderColor="gray.200" />

                        {/* 自己紹介 */}
                        <Stack gap="1.5">
                            <Text
                                fontSize="10px"
                                fontWeight="bold"
                                color="teal.600"
                                textTransform="uppercase"
                                letterSpacing="widest"
                            >
                                About
                            </Text>
                            <Text
                                fontSize="sm"
                                color="gray.700"
                                lineHeight="tall"
                                dangerouslySetInnerHTML={{ __html: user.description }}
                            />
                        </Stack>

                        {/* 好きな技術 */}
                        <Stack gap="2">
                            <Text
                                fontSize="10px"
                                fontWeight="bold"
                                color="teal.600"
                                textTransform="uppercase"
                                letterSpacing="widest"
                            >
                                Skills
                            </Text>
                            <HStack wrap="wrap" gap="1.5">
                                {user.skills.map((skill) => (
                                    <Badge
                                        key={skill}
                                        colorPalette="teal"
                                        variant="subtle"
                                        borderRadius="full"
                                        px="2.5"
                                        py="0.5"
                                        fontSize="xs"
                                        data-testid="skill-badge"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </HStack>
                        </Stack>
                    </ChakraCard.Body>

                    <Separator borderColor="gray.200" />

                    {/* SNS リンク */}
                    <ChakraCard.Footer justifyContent="center" py="4">
                        <HStack gap="8">
                            {user.github_url && (
                                <a href={user.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                    <Box color="gray.600" _hover={{ color: "gray.900" }} transition="color 0.15s">
                                        <FaGithub size={22} data-testid="github-icon" />
                                    </Box>
                                </a>
                            )}
                            {user.qiita_url && (
                                <a href={user.qiita_url} target="_blank" rel="noopener noreferrer" aria-label="Qiita">
                                    <Box color="green.500" _hover={{ color: "green.700" }} transition="color 0.15s">
                                        <SiQiita size={22} data-testid="qiita-icon" />
                                    </Box>
                                </a>
                            )}
                            {user.x_url && (
                                <a href={user.x_url} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                                    <Box color="gray.700" _hover={{ color: "black" }} transition="color 0.15s">
                                        <FaXTwitter size={22} data-testid="x-icon" />
                                    </Box>
                                </a>
                            )}
                        </HStack>
                    </ChakraCard.Footer>
                </ChakraCard.Root>
                <Button mt="8" bg="teal.500">
                    <Link to="/">ホームに戻る</Link>
                </Button>
            </Stack>
        </Center>
    );
})
