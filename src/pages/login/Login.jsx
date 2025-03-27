import React, { useState } from "react";
import{ useAuth } from "../../hooks/useAuth"
import { User, Key } from "lucide-react";

import "./Login.scss";

const Login = () => {
    const { login, isLoading, error } = useAuth();
    const [email, setEmail] = useState("email@email.com"); 
    const [password, setPassword] = useState("123456"); 

    const submitForm = async () => {
        await login(email, password);
    }

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="company-name">log in to <span>truck</span></div>
                <div className="form-group">
                    <div className="input-group">
                        <div className="icon"><User /></div>
                        <div className="input">
                            <input 
                                type="text" 
                                placeholder="login"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="icon"><Key /></div>
                        <div className="input">
                            <input 
                                type="password" 
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="action">
                    <div className="submit-form" onClick={submitForm}>
                        log in 
                        <div className={isLoading ? "spin-login" : "hidden"}>
                            <div className="spin-loader"></div>
                        </div>
                    </div>
                    <div className="forgot-password">forgot password</div>
                </div>
            </div>
        </div>
    );
};

export default Login;