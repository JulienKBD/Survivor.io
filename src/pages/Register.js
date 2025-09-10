import * as React from 'react';
import Navbar from "../components/Navbar";
import RegisterForm from "../components/Auth/RegisterForm";

export default function Register() {
    return (
        <main>
            <Navbar />
            <RegisterForm />
        </main>
    );
}
