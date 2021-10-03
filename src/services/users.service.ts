import { HOST } from '../config';
import { post } from '../lib/communication';
import { AuthenticationRequest, AuthenticationResponse, RegistrationRequest } from '../lib/types';

const authenticate = (body: AuthenticationRequest) => 
    post<AuthenticationResponse>(`${HOST}users/authenticate`, body);

const register = (body: RegistrationRequest) => 
    post<{}>(`${HOST}users/register`, body);

const usersService = {
    authenticate,
    register,
};

export default usersService;
