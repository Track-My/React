import { HOST } from '../config';
import { post } from '../lib/communication';
import { AuthenticationRequest, AuthenticationResponse, RefreshRequest, RefreshResponse, RegistrationRequest } from '../lib/types';

const authenticate = (body: AuthenticationRequest) => 
    post<AuthenticationResponse>(`${HOST}users/authenticate`, body);

const register = (body: RegistrationRequest) => 
    post<{}>(`${HOST}users/register`, body);

const refresh = (body: RefreshRequest) => 
    post<RefreshResponse>(`${HOST}users/refresh`, body);

const usersService = {
    authenticate,
    register,
    refresh,
};

export default usersService;
