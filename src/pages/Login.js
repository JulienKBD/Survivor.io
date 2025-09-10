import * as React from 'react';
import Navbar from "../components/Navbar";
import LoginForm from "../components/Auth/LoginForm";

export default function Login() {
    return (
        <main>
            <Navbar />
            <LoginForm />
        </main>
    );
}
