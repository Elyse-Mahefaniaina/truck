import React from "react";
import { User, Key } from "lucide-react";

import "./Login.scss";

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-content">
                <div className="company-name">Log in to <span>truck</span></div>
                <div className="form-group">
                    <div className="input-group">
                        <div className="icon"><User /></div>
                        <div className="input">
                            <input type="text" placeholder="login"/>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="icon"><Key /></div>
                        <div className="input">
                            <input type="password" placeholder="password"/>
                        </div>
                    </div>
                </div>
                <div className="action">
                    <div className="submit-form">log in</div>
                    <div className="forgot-password">forgot password</div>
                </div>
            </div>
        </div>
    );
};

export default Login;