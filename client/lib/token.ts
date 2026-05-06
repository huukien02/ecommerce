// Thư viện nhỏ quản lý Cookie an toàn cho cả môi trường Client và Server (chỉ get/set ở client)

export const setTokens = (accessToken: string, refreshToken: string) => {
    if (typeof document === 'undefined') return;

    // Refresh token hết hạn sau 7 ngày
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    
    document.cookie = `access_token=${accessToken};path=/`;
    document.cookie = `refresh_token=${refreshToken};${expires};path=/`;
};

export const getAccessToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    
    const name = "access_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
};

export const getRefreshToken = (): string | null => {
    if (typeof document === 'undefined') return null;

    const name = "refresh_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
};

export const clearTokens = () => {
    if (typeof document === 'undefined') return;
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
