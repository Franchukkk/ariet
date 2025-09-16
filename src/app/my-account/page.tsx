import { Orders } from "@/components/MyAccount/Orders";
import { TitleMyAccount } from "@/components/MyAccount/TitleMyAccount";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute requiredRole="user">
            <TitleMyAccount />
            <Orders />
        </ProtectedRoute>
    );
}