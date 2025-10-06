import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Bước 1: Import các component thật
import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";

export default function AuthLayout() {
    return (
    <main>
        <section className="relative w-full h-full py-40 min-h-screen">
        <div
            className="absolute top-0 w-full h-full bg-white bg-no-repeat bg-full"
            style={{
            backgroundImage:
                "url(" + require("assets/img/register_bg_2.png").default + ")",
            }}
        ></div>
        <Switch>
            {/* Bước 2: Sử dụng component thật thay vì render chữ */}
            <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/register" exact component={Register} />
            <Redirect from="/auth" to="/auth/login" />
        </Switch>
        </section>
    </main>
    );
}