import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../lib/hooks";
import { authenticate } from "../../../lib/reducers/sessionReducer";
import { AuthenticationRequest } from "../../../lib/types";
import '../Account.css';

export default function AuthenticationContainer() {

	const dispatch = useAppDispatch();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit = useCallback(
		() => {
			const request: AuthenticationRequest = {
				credentials: {
					email, 
					password
				},
				device: {
					type: "WEB",
					name: "default",
					uuid: "0000-0000-0000-0000"
				}
			}
			dispatch(authenticate(request));
		}, 
		[email, password, dispatch]
	);

    return (
        <div className="account-form">
            <label className="form-label">
                <span>Email</span>
                <input
                    className="form-input"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <label className="form-label">
                <span>Password</span>
                <input 
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <div
                className="form-input form-button"
                tabIndex={0}
                onClick={onSubmit}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        onSubmit();
                    }
                }}
            >
                SIGN IN
            </div>
            <Link className="centered-button button" to='/registration/'>
                CREATE ACCOUNT
            </Link>
        </div>
    );
}
