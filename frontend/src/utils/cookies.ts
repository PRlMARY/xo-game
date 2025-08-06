import Cookies from 'js-cookie';

export interface CookieOptions {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

class CookieService {
    private static readonly TOKEN_COOKIE_NAME = 'auth_token';
    private static readonly USER_COOKIE_NAME = 'user_data';
    private static readonly DEFAULT_OPTIONS: CookieOptions = {
        expires: 1/8,
        path: '/',
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
    };

    static setToken(token: string): void {
        try {
            Cookies.set(this.TOKEN_COOKIE_NAME, token, this.DEFAULT_OPTIONS);
        } catch (error) {
            console.error('CookieService: Failed to save token to cookie:', error);
        }
    }

    static getToken(): string | undefined {
        try {
            const token = Cookies.get(this.TOKEN_COOKIE_NAME);
            if (token) {
                return token;
            }
            return undefined;
        } catch (error) {
            return undefined;
        }
    }

    static removeToken(): void {
        try {
            Cookies.remove(this.TOKEN_COOKIE_NAME, { path: '/' });
        } catch (error) {
            console.error('CookieService: Failed to remove token cookie:', error);
        }
    }

    static setUser(user: any): void {
        try {
            const userDataString = JSON.stringify(user);
            Cookies.set(this.USER_COOKIE_NAME, userDataString, this.DEFAULT_OPTIONS);
        } catch (error) {
            console.error('CookieService: Failed to save user data to cookie:', error);
        }
    }

    static getUser(): any | null {
        try {
            const userDataString = Cookies.get(this.USER_COOKIE_NAME);
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                return userData;
            }
            return null;
        } catch (error) {
            console.error('CookieService: Failed to retrieve/parse user data from cookie:', error);
            return null;
        }
    }

    static removeUser(): void {
        try {
            Cookies.remove(this.USER_COOKIE_NAME, { path: '/' });
        } catch (error) {
            console.error('CookieService: Failed to remove user data cookie:', error);
        }
    }

    static clearAll(): void {
        this.removeToken();
        this.removeUser();
    }

    static isAuthenticated(): boolean {
        const token = this.getToken();
        return Boolean(token);
    }

    static refreshToken(): void {
        const token = this.getToken();
        if (token) {
            this.setToken(token); 
        }
    }
}

export default CookieService;
