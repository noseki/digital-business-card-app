import { User } from "@/domain/user";
import { fetchUser } from "@/lib/supabaseFunction";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Card } from "../molecules/Card";

export const Cards = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userData = await fetchUser(id!);
            setIsLoading(false);
            setUser(userData);
        };
        fetchUserInfo();
    }, [id]);

    if (isLoading) {
        return (
            <VStack colorPalette="teal" mt="20">
                <Spinner color="colorPalette.600" />
                <Text color="colorPalette.600">Loading...</Text>
            </VStack>
        )
    }
    return (
        <>
            <Card user={user!} />
        </>
    )
}
