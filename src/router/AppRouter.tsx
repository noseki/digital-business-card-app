import { Top } from "../components/pages/Top"
import { CardRegister } from "../components/pages/CardRegister"
import { Cards } from "../components/pages/Cards"
import { Route, Routes } from "react-router-dom"
import { Page404 } from "../components/pages/Page404"

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Top />} />
            <Route path="/cards/:id" element={<Cards />} />
            <Route path="/cards/register" element={<CardRegister />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}
