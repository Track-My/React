import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../lib/hooks";
import { register } from "../../../lib/reducers/sessionReducer";
import { RegistrationRequest } from "../../../lib/types";
import '../Account.css';

export default function RegistrationContainer() {

	const dispatch = useAppDispatch();

	
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit = useCallback(
		() => {
			const request: RegistrationRequest = {
				email,
				password
			}
			dispatch(register(request));
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
                CREATE ACCOUNT
            </div>
            <Link className="centered-button button" to='/authentication/'>
                SING IN
            </Link>
        </div>
    );
}
